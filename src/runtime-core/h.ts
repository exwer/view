import type { VNode } from './types'
import { createVNode } from './vNode'

export function h(
  type: VNode['type'],
  props?: VNode['props'],
  children?: VNode['children'],
) {
  return createVNode(type, props, children)
}
