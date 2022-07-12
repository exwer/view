import { ShapeFlags } from '../shared/ShapeFlags'
import type { ComponentInstance, Container } from './types'
import { createComponentInstance, setupComponent } from './component'
import { Fragment, Text } from './vNode'
import { createAppAPI } from './createApp'

export function createRenderer(options) {
  const { createElement, patchProp, insert } = options

  function render(vNode, container: Container) {
    // patch
    patch(vNode, container, null)
  }

  function patch(vNode, container: Container, parentComponent) {
  // 判断vNode类型
    const { shapeFlag, type } = vNode

    switch (type) {
      case Fragment:
        processFragment(vNode, container, parentComponent)
        break
      case Text:
        processText(vNode, container)
        break
      default:
        if (shapeFlag & ShapeFlags.ELEMENT)
          processElement(vNode, container, parentComponent)
        else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT)
          processComponent(vNode, container, parentComponent)
    }
  }

  function processFragment(vNode, container, parentComponent) {
  // slot节点
    mountChildren(vNode, container, parentComponent)
  }

  function processText(vNode, container) {
    const { children } = vNode
    const textNode = document.createTextNode(children)
    vNode.el = textNode
    container.append(textNode)
  }

  function processElement(vNode, container: Container, parentComponent) {
  // TODO:判断是更新还是初始化
    mountElement(vNode, container, parentComponent)
  }

  function mountElement(vNode, container: Container, parentComponent) {
  // 创建节点
    const el = (vNode.el = createElement(vNode.type))

    const { children, props, shapeFlag } = vNode

    // 挂载属性
    if (props) {
      for (const key in props) {
        const val = props[key]
        patchProp(el, key, val)
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
    insert(el, container)
  }
  function mountChildren(vNode, container, parentComponent) {
    for (const child of vNode.children)
      patch(child, container, parentComponent)
  }

  function processComponent(vNode, container: Container, parentComponent) {
    mountComponent(vNode, container, parentComponent)
  }

  function mountComponent(initialVNode, container: Container, parentComponent) {
    const instance = createComponentInstance(initialVNode, parentComponent)
    setupComponent(instance)
    setupRenderEffect(instance, initialVNode, container)
  }

  function setupRenderEffect(instance: ComponentInstance, initialVNode, container: Container) {
    const { proxy } = instance
    const subTree = instance.render.call(proxy)

    // vNode -> patch -> element -> mountElement
    patch(subTree, container, instance)

    // 需要把节点保存下来
    initialVNode.el = subTree.el
  }

  return {
    createApp: createAppAPI(render),
  }
}
