import { ShapeFlags } from '../shared/ShapeFlags'

export function createVNode(type, props?, children?) {
  const vNode = {
    type,
    props,
    children,
    shapeFlag: getShapeFlag(type),
    el: null,
  }
  if (typeof children === 'string')
    vNode.shapeFlag |= ShapeFlags.TEXT_CHILDREN
  if (Array.isArray(children))
    vNode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN

  return vNode
}

function getShapeFlag(type) {
  return typeof type === 'string' ? ShapeFlags.ELEMENT : ShapeFlags.STATEFUL_COMPONENT
}
