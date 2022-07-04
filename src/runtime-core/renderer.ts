import type { ComponentInstance, Container } from './types'
import { isObject } from './../shared/index'
import { createComponentInstance, setupComponent } from './component'

export function render(vNode, container: Container) {
  // patch
  patch(vNode, container)
}

function patch(vNode, container: Container) {
  // 判断vNode是element还是component

  if ('props' in vNode)
    processElement(vNode, container)
  else
  if (isObject(vNode.type))
    processComponent(vNode, container)
}

function processElement(vNode, container: Container) {
  // TODO:判断是更新还是初始化
  mountElement(vNode, container)
}

function mountElement(vNode, container: Container) {
  // 创建节点
  const el = document.createElement(vNode.type)

  // 挂载属性
  if (vNode.props) {
    for (const [key, val] of Object.entries(vNode.props))
      el.setAttribute(key, val)
  }

  // 渲染子节点
  // 可能是嵌套结构
  if (vNode.children) {
    if (typeof vNode.children === 'string') { el.textContent = vNode.children }
    else {
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

function mountComponent(vNode, container: Container) {
  const instance = createComponentInstance(vNode)
  setupComponent(instance)
  setupRenderEffect(instance, container)
}

function setupRenderEffect(instance: ComponentInstance, container: Container) {
  const subTree = instance.render.call(instance.setupState)
  // vNode -> patch
  // vNode -> element -> mountElement
  patch(subTree, container)
}

