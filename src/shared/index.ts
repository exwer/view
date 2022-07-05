export const extend = Object.assign
export const isObject = (val: any) => val !== null && typeof val === 'object'

export const hasChanged = (val: any, newValue: any) => !Object.is(val, newValue)
export const hasOwn = (val: object, key: string | number) => Object.prototype.hasOwnProperty.call(val, key)

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
export const toHandlerKey = (str: string) => {
  return str ? `on${capitalize(str)}` : ''
}
export const camelize = (str: string) => {
  return str.replace(/-(\w)/g, (_, c: string) => {
    return c ? c.toUpperCase() : ''
  })
}
