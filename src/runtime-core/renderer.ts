import { ShapeFlags } from '../shared/ShapeFlags'
import { effect } from '../reactivity/effect'
import type { ComponentInstance, Container } from './types'
import { createComponentInstance, setupComponent } from './component'
import { Fragment, Text } from './vNode'
import { createAppAPI } from './createApp'

/**
 * 创建渲染器
 * @param options 平台特定的 DOM 操作方法
 * @returns 返回创建应用的方法
 */
export function createRenderer(options) {
  // 解构平台特定的 DOM 操作方法
  const {
    createElement: hostCreateElement,    // 创建元素
    patchProp: hostPatchProp,           // 处理属性
    insert: hostInsert,                 // 插入元素
    remove: hostRemove,                 // 移除元素
    setElementText: hostSetElementText  // 设置元素文本
  } = options

  /**
   * 渲染虚拟节点到容器
   * @param vNode 虚拟节点
   * @param container 容器元素
   */
  function render(vNode, container: Container) {
    patch(null, vNode, container, null)
  }

  /**
   * 处理虚拟节点的更新和挂载
   * @param n1 旧的虚拟节点，null 表示首次挂载
   * @param n2 新的虚拟节点
   * @param container 容器元素
   * @param parentComponent 父组件实例
   */
  function patch(n1, n2, container: Container, parentComponent) {
    const { shapeFlag, type } = n2

    // 根据节点类型分发到不同的处理函数
    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent)
        break
      case Text:
        processText(n1, n2, container)
        break
      default:
        // 处理普通元素和组件
        if (shapeFlag & ShapeFlags.ELEMENT)
          processElement(n1, n2, container, parentComponent)
        else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT)
          processComponent(n1, n2, container, parentComponent)
    }
  }

  /**
   * 处理 Fragment 节点（主要用于 slots）
   */
  function processFragment(n1, n2, container, parentComponent) {
    mountChildren(n2.children, container, parentComponent)
  }

  /**
   * 处理文本节点
   */
  function processText(n1, n2, container) {
    const { children } = n2
    const textNode = document.createTextNode(children)
    n2.el = textNode
    container.append(textNode)
  }

  /**
   * 处理普通元素节点
   * 根据是否存在旧节点判断是更新还是挂载
   */
  function processElement(n1, n2, container: Container, parentComponent) {
    if (!n1)
      mountElement(n2, container, parentComponent)
    else
      patchElement(n1, n2, container, parentComponent)
  }

  /**
   * 更新元素节点
   * 包括更新 props 和 children
   */
  function patchElement(n1, n2, container, parentComponent) {
    const oldProps = n1.props || {}
    const newProps = n2.props || {}

    // 复用 DOM 节点
    const el = (n2.el = n1.el)

    // 更新子节点和属性
    patchChildren(n1, n2, el, parentComponent)
    patchProps(el, oldProps, newProps)
  }

  /**
   * 更新子节点
   * 处理 text children 和 array children 之间的转换
   */
  function patchChildren(n1, n2, container, parentComponent) {
    const prevShapeFlag = n1.shapeFlag
    const newShapeFlag = n2.shapeFlag
    const c1 = n1.children
    const c2 = n2.children

    // 新节点是文本
    if (newShapeFlag & ShapeFlags.TEXT_CHILDREN) {
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        unmountChildren(n1.children)  // 清空旧的数组子节点
      }
      if (c1 !== c2) {
        hostSetElementText(container, c2)  // 设置新的文本
      }
    }
    // 新节点是数组
    else {
      if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
        hostSetElementText(container, '')  // 清空旧的文本
        mountChildren(c2, container, parentComponent)  // 挂载新的数组子节点
      }
      // TODO: 数组 -> 数组 的 diff 算法
    }
  }

  /**
   * 卸载子节点
   */
  function unmountChildren(children) {
    for (let i = 0; i < children.length; i++) {
      const el = children[i].el
      hostRemove(el)
    }
  }

  /**
   * 更新元素属性
   * 处理属性的添加、更新和删除
   */
  function patchProps(el, oldProps, newProps) {
    if (oldProps !== newProps) {
      // 更新或添加新属性
      for (const key in newProps) {
        const prevProp = oldProps[key]
        const nextProp = newProps[key]
        if (prevProp !== nextProp)
          hostPatchProp(el, key, prevProp, nextProp)
      }

      // 删除不再存在的旧属性
      for (const key in oldProps) {
        if (!(key in newProps))
          hostPatchProp(el, key, oldProps[key], null)
      }
    }
  }

  /**
   * 挂载元素节点
   * 创建元素、设置属性、处理子节点
   */
  function mountElement(vNode, container: Container, parentComponent) {
    // 创建 DOM 元素
    const el = (vNode.el = hostCreateElement(vNode.type))

    const { children, props, shapeFlag } = vNode

    // 处理 props
    if (props) {
      for (const key in props) {
        const val = props[key]
        hostPatchProp(el, key, null, val)
      }
    }

    // 处理 children
    if (children) {
      if (shapeFlag & ShapeFlags.TEXT_CHILDREN)
        el.textContent = vNode.children
      else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN)
        mountChildren(vNode.children, el, parentComponent)
    }

    // 插入到容器
    hostInsert(el, container)
  }

  /**
   * 挂载子节点数组
   */
  function mountChildren(children, container, parentComponent) {
    for (const child of children)
      patch(null, child, container, parentComponent)
  }

  /**
   * 处理组件
   * TODO: 添加组件更新逻辑
   */
  function processComponent(n1, n2, container: Container, parentComponent) {
    mountComponent(n2, container, parentComponent)
  }

  /**
   * 挂载组件
   * 创建组件实例、设置组件状态、设置渲染效果
   */
  function mountComponent(initialVNode, container: Container, parentComponent) {
    const instance = createComponentInstance(initialVNode, parentComponent)
    setupComponent(instance)
    setupRenderEffect(instance, initialVNode, container)
  }

  /**
   * 设置组件的渲染效果
   * 使用 effect 包裹渲染逻辑，实现响应式更新
   */
  function setupRenderEffect(instance: ComponentInstance, initialVNode, container: Container) {
    effect(() => {
      if (!instance.isMounted) {
        // 首次挂载
        const { proxy } = instance
        instance.subTree = instance.render.call(proxy)
        const subTree = instance.subTree
        patch(null, subTree, container, instance)

        instance.isMounted = true
        initialVNode.el = subTree.el
      }
      else {
        // 组件更新
        const { proxy } = instance
        const subTree = instance.render.call(proxy)
        const prevSubTree = instance.subTree
        instance.subTree = subTree
        patch(prevSubTree, subTree, container, instance)
      }
    })
  }

  return {
    createApp: createAppAPI(render),
  }
}

