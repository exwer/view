import { render } from './renderer'
import { createVNode } from './vNode'

export function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      // 先转换成vNode
      const vNode = createVNode(rootComponent)

      render(vNode, rootContainer)
    },
  }
}

