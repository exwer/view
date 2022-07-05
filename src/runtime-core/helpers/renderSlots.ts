import { createVNode } from '../vNode'

export function renderSlots(slots, name) {
  const slot = slots[name]
  if (slot)
    return createVNode('div', {}, slot)
}
