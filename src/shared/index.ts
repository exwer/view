export const extend = Object.assign
export const isObject = (val: unknown) => val !== null && typeof val === 'object'
export const isArray = (val: unknown) => Array.isArray(val)
export const isString = (val: unknown) => typeof val === 'string'
export const isFunc = (val: unknown) => typeof val === 'function'

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
