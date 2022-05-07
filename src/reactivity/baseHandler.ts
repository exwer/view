import { track, trigger } from './effect'

export const ReactiveFlags = {
  IS_REACTIVE: Symbol('__v_isReactive'),
  IS_READONLY: Symbol('__v_isReadonly'),
} as const

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)
const readonlySet = (target: any, key: string|symbol) => {
  console.warn(`cannot set ${String(key)} in readonly object ${target}`)
  return true
}

function createGetter(isReadonly = false) {
  return function get(target: object, key: string|symbol) {
    // for isReactive
    if (key === ReactiveFlags.IS_REACTIVE)
      return !isReadonly

    // for isReadonly
    if (key === ReactiveFlags.IS_READONLY)
      return isReadonly

    const res = Reflect.get(target, key)
    !isReadonly && track(target, key)
    return res
  }
}

function createSetter() {
  return function (target: object, key: string|symbol, value: unknown) {
    const res = Reflect.set(target, key, value)
    trigger(target, key)
    return res
  }
}

export const mutableHandlers = {
  get,
  set,
}

export const readonlyHandlers = {
  get: readonlyGet,
  set: readonlySet,
}
export type ProxyHandlers = typeof mutableHandlers | typeof readonlyHandlers
