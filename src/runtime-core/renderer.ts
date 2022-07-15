import { ShapeFlags } from '../shared/ShapeFlags'
import { effect } from '../reactivity/effect'
import type { ComponentInstance, Container } from './types'
import { createComponentInstance, setupComponent } from './component'
import { Fragment, Text } from './vNode'
import { createAppAPI } from './createApp'

export function createRenderer(options) {
  const { createElement: hostCreateElement, patchProp: hostPatchProp, insert: hostInsert } = options

  function render(vNode, container: Container) {
    // patch
    patch(null, vNode, container, null)
  }

  function patch(n1, n2, container: Container, parentComponent) {
    // 判断是更新还是初始化
    // 判断vNode类型
    const { shapeFlag, type } = n2

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
    mountChildren(n2, container, parentComponent)
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
      patchElement(n1, n2, container)
  }

  function patchElement(n1, n2, container) {
    console.log('n1', n1)
    console.log('n2', n2)
  }

  function mountElement(vNode, container: Container, parentComponent) {
  // 创建节点
    const el = (vNode.el = hostCreateElement(vNode.type))

    const { children, props, shapeFlag } = vNode

    // 挂载属性
    if (props) {
      for (const key in props) {
        const val = props[key]
        hostPatchProp(el, key, val)
      }
    }

    // 渲染子节点
    // 可能是嵌套结构
    if (children) {
      if (shapeFlag & ShapeFlags.TEXT_CHILDREN)
        el.textContent = vNode.children
      else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN)
        mountChildren(vNode, el, parentComponent)
    }

    // 渲染节点
    hostInsert(el, container)
  }
  function mountChildren(vNode, container, parentComponent) {
    for (const child of vNode.children)
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
        const subTree = (instance.subTree = instance.render.call(proxy))
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
