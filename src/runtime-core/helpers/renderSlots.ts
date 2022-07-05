import { isFunc } from '../../shared'
import { createVNode } from '../vNode'

export function renderSlots(slots, name, props) {
  const slot = slots[name]
  if (slot) {
    if (isFunc(slot))
      return createVNode('div', {}, slot(props))
  }
}
