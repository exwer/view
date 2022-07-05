export function initSlots(instance, children) {
  // 需要支持单个或多个slots
  instance.slots = Array.isArray(children) ? children : [children]
}
