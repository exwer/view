import { ShapeFlags } from '../shared/ShapeFlags'
import { effect } from '../reactivity/effect'
import type { ComponentInstance, Container } from './types'
import { createComponentInstance, setupComponent } from './component'
import { Fragment, Text } from './vNode'
import { createAppAPI } from './createApp'

export function createRenderer(options) {
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert,
    remove: hostRemove,
    setElementText: hostSetElementText
  } = options

  function render(vNode, container: Container) {
    // patch
    patch(null, vNode, container, null)
  }

  function patch(n1, n2, container: Container, parentComponent) {
    // 判断vNode类型
    const { shapeFlag, type } = n2

    // 以下函数处理中，如果n1存在，则是更新，否则是初始化
    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent)
        break
      case Text:
        processText(n1, n2, container)
        break
      default:
        if (shapeFlag & ShapeFlags.ELEMENT)
          processElement(n1, n2, container, parentComponent)
        else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT)
          processComponent(n1, n2, container, parentComponent)
    }
  }

  function processFragment(n1, n2, container, parentComponent) {
    // slot节点
    mountChildren(n2.children, container, parentComponent)
  }

  function processText(n1, n2, container) {
    const { children } = n2
    const textNode = document.createTextNode(children)
    n2.el = textNode
    container.append(textNode)
  }

  function processElement(n1, n2, container: Container, parentComponent) {
    // 判断是更新还是初始化
    if (!n1)
      mountElement(n2, container, parentComponent)
    else
      patchElement(n1, n2, container, parentComponent)
  }

  function patchElement(n1, n2, container, parentComponent) {
    const oldProps = n1.props || {}
    const newProps = n2.props || {}

    //把新的el
    const el = (n2.el = n1.el)

    patchChildren(n1, n2, el, parentComponent)
    patchProps(el, oldProps, newProps)
  }

  function patchChildren(n1, n2, container, parentComponent) {
    const prevShapeFlag = n1.shapeFlag
    const newShapeFlag = n2.shapeFlag

    const c1 = n1.children
    const c2 = n2.children

    if (newShapeFlag & ShapeFlags.TEXT_CHILDREN) {
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 1. 清空老的children
        unmountChildren(n1.children)
      }
      if (c1 !== c2) {
        // 2. 设置新的text
        console.log(c2)
        hostSetElementText(container, c2)
      }
    } else {
      if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
        console.log(2)
        //先清空再mount
        hostSetElementText(container, '')
        mountChildren(c2, container, parentComponent)
      }
    }
  }
  function unmountChildren(children) {
    for (let i = 0; i < children.length; i++) {
      const el = children[i].el
      hostRemove(el)
    }
  }

  function patchProps(el, oldProps, newProps) {
    if (oldProps !== newProps) {
      // 旧值和新值不同
      for (const key in newProps) {
        const prevProp = oldProps[key]
        const nextProp = newProps[key]

        if (prevProp !== nextProp)
          hostPatchProp(el, key, prevProp, nextProp)
      }

      // 新值key直接没了
      for (const key in oldProps) {
        if (!(key in newProps))
          hostPatchProp(el, key, oldProps[key], null)
      }
    }
  }

  function mountElement(vNode, container: Container, parentComponent) {
    // 创建节点
    const el = (vNode.el = hostCreateElement(vNode.type))

    const { children, props, shapeFlag } = vNode

    // 挂载属性
    if (props) {
      for (const key in props) {
        const val = props[key]
        hostPatchProp(el, key, null, val)
      }
    }

    // 渲染子节点
    // 可能是嵌套结构
    if (children) {
      if (shapeFlag & ShapeFlags.TEXT_CHILDREN)
        el.textContent = vNode.children
      else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN)
        mountChildren(vNode.children, el, parentComponent)
    }

    // 渲染节点
    hostInsert(el, container)
  }
  function mountChildren(children, container, parentComponent) {
    for (const child of children)
      patch(null, child, container, parentComponent)
  }

  function processComponent(n1, n2, container: Container, parentComponent) {
    mountComponent(n2, container, parentComponent)
  }

  function mountComponent(initialVNode, container: Container, parentComponent) {
    const instance = createComponentInstance(initialVNode, parentComponent)
    setupComponent(instance)
    setupRenderEffect(instance, initialVNode, container)
  }

  function setupRenderEffect(instance: ComponentInstance, initialVNode, container: Container) {
    effect(() => {
      if (!instance.isMounted) {
        // 初始化
        const { proxy } = instance
        instance.subTree = instance.render.call(proxy)
        const subTree = instance.subTree
        // vNode -> patch -> element -> mountElement
        patch(null, subTree, container, instance)

        instance.isMounted = true
        // 需要把节点保存下来
        initialVNode.el = subTree.el
      }
      else {
        // 更新
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

