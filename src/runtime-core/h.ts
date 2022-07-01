import { createVNode } from './vNode'

export function h(
  type,
  props?,
  children?,
) {
  return createVNode(type, props, children)
}
