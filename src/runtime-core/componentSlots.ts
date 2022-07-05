export function initSlots(instance, children) {
  // children -> object

  const slots = {}
  for (const [key, val] of Object.entries(children ?? {}))
    slots[key] = Array.isArray(val) ? val : [val]

  instance.slots = slots
}
