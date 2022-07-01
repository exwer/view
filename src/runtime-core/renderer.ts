import { createComponentInstance, setupComponent } from './component'

export function render(vNode, container) {
  // patch
  patch(vNode, container)
}

function patch(vNode, container) {
  // 判断vNode是element还是component

  if (typeof vNode === 'object')
    processComponent(vNode, container)
}

function processComponent(vNode, container) {
  mountComponent(vNode, container)
}

function mountComponent(vNode, container) {
  const instance = createComponentInstance(vNode)
  setupComponent(instance)
  setupRenderEffect(instance, container)
}

function setupRenderEffect(instance, container) {
  const subTree = instance.render()

  // vNode -> patch
  // vNode -> element -> mountElement
  patch(subTree, container)
}

