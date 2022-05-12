export const extend = Object.assign
export const isObject = (val: any) => val !== null && typeof val === 'object'

export const hasChanged = (val: any, newValue: any) => !Object.is(val, newValue)
