export function initSlots(instance, children) {
  normalizeObjectSlots(children, instance.slots)
}

function normalizeObjectSlots(children, slots) {
  for (const [key, val] of Object.entries(children ?? {}))
    slots[key] = normalizeSlotValue(val)
}

function normalizeSlotValue(val) {
  return Array.isArray(val) ? val : [val]
}
