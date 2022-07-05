import { isArray } from '../shared'
import { ShapeFlags } from '../shared/ShapeFlags'

export function initSlots(instance, children) {
  // slots
  const { vNode } = instance
  if (vNode.shapeFlag & ShapeFlags.SLOT_CHILDREN)
    normalizeObjectSlots(children, instance.slots)
}

function normalizeObjectSlots(children, slots) {
  for (const [key, val] of Object.entries(children ?? {}))
    slots[key] = props => normalizeSlotValue(val(props))
}

function normalizeSlotValue(val) {
  return isArray(val) ? val : [val]
}
