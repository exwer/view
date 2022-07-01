import { render } from './renderer'
import type { Component, Container } from './types'
import { createVNode } from './vNode'

export function createApp(rootComponent: Component) {
  return {
    mount(rootContainer: Container) {
      // 先转换成vNode
      const vNode = createVNode(rootComponent)

      render(vNode, rootContainer)
    },
  }
}
