import { createVNode } from '../vNode'

export function renderSlots(slots) {
  return createVNode('div', {}, slots)
}
