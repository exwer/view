import { camelize, toHandlerKey } from '../shared'

export function emit(instance, event, ...args) {
  // 查找props里是否有该事件,有的话则执行
  const { props } = instance

  // add -> onAdd
  // add-foo -> onAddFoo
  const handlerName = toHandlerKey(camelize(event))
  const handler = props[handlerName]

  handler && handler(...args)
}
