import { isArray, isObject, isString } from '../shared'
import { ShapeFlags } from '../shared/ShapeFlags'

export const Fragment = Symbol('Fragment')
export const Text = Symbol('Text')

export function createVNode(type, props?, children?) {
  const vNode = {
    type,
    props,
    children,
    shapeFlag: getShapeFlag(type),
    el: null,
  }
  // text vNode
  if (isString(children))
    vNode.shapeFlag |= ShapeFlags.TEXT_CHILDREN

  // vNodes
  if (isArray(children))
    vNode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN

  // slots
  if (vNode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    if (isObject(children))
      vNode.shapeFlag |= ShapeFlags.SLOT_CHILDREN
  }

  return vNode
}

export function createTextVNode(text: string) {
  return createVNode(Text, {}, text)
}

function getShapeFlag(type) {
  return isString(type) ? ShapeFlags.ELEMENT : ShapeFlags.STATEFUL_COMPONENT
}
