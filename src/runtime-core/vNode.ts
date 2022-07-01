import type { VNode } from './types'

export function createVNode(
  type: VNode['type'],
  props?: VNode['props'],
  children?: VNode['children'],
): VNode {
  const vNode = {
    type,
    props,
    children,
  }
  return vNode
}
