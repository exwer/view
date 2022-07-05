import { ShapeFlags } from '../shared/ShapeFlags'
import type { ComponentInstance, Container } from './types'
import { isObject } from './../shared/index'
import { createComponentInstance, setupComponent } from './component'

export function render(vNode, container: Container) {
  // patch
  patch(vNode, container)
}

function patch(vNode, container: Container) {
  // 判断vNode是element还是component
  const { shapeFlag } = vNode

  if (shapeFlag & ShapeFlags.ELEMENT)
    processElement(vNode, container)
  else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT)
    processComponent(vNode, container)
}

function processElement(vNode, container: Container) {
  // TODO:判断是更新还是初始化
  mountElement(vNode, container)
}

function mountElement(vNode, container: Container) {
  // 创建节点
  const el = (vNode.el = document.createElement(vNode.type))

  const { children, props, shapeFlag } = vNode

  // 挂载属性
  if (props) {
    for (const [key, val] of Object.entries(vNode.props)) {
      // 处理事件
      if (/^on[A-Z]/.test(key)) {
        const eventName = key.slice(2).toLocaleLowerCase()
        el.addEventListener(eventName, val)
      }
      else {
        el.setAttribute(key, val)
      }
    }
  }

  // 渲染子节点
  // 可能是嵌套结构
  if (children) {
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = vNode.children
    }
    else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      for (const child of vNode.children)
        patch(child, el)
    }
  }

  // 渲染节点
  container.append(el)
}

function processComponent(vNode, container: Container) {
  mountComponent(vNode, container)
}

function mountComponent(initialVNode, container: Container) {
  const instance = createComponentInstance(initialVNode)
  setupComponent(instance)
  setupRenderEffect(instance, initialVNode, container)
}

function setupRenderEffect(instance: ComponentInstance, initialVNode, container: Container) {
  const { proxy } = instance
  const subTree = instance.render.call(proxy)

  // vNode -> patch -> element -> mountElement
  patch(subTree, container)

  // 需要把节点保存下来
  initialVNode.el = subTree.el
}

