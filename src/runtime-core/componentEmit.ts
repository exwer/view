export function emit(instance, event, ...args) {
  // 查找props里是否有该事件,有的话则执行
  const { props } = instance

  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  const toHandlerKey = (str: string) => {
    return str ? `on${capitalize(event)}` : ''
  }

  const handlerName = toHandlerKey(event)
  const handler = props[handlerName]

  handler && handler(...args)
}
