import { extend, isObject } from '../shared'
import { track, trigger } from './effect'
import { reactive, readonly } from './reactive'

export const ReactiveFlags = {
  IS_REACTIVE: Symbol('__v_isReactive'),
  IS_READONLY: Symbol('__v_isReadonly'),
} as const

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)
const readonlySet = (target: any, key: string|symbol) => {
  console.warn(`cannot set ${String(key)} in readonly object ${target}`)
  return true
}

function createGetter(isReadonly = false, shallow = false) {
  return function get(target: object, key: string|symbol) {
    // for isReactive
    if (key === ReactiveFlags.IS_REACTIVE)
      return !isReadonly

    // for isReadonly
    if (key === ReactiveFlags.IS_READONLY)
      return isReadonly

    const res = Reflect.get(target, key)
    if (shallow)
      return res

    !isReadonly && track(target, key)
    // if res is object, return reactive object
    if (isObject(res))
      return isReadonly ? readonly(res) : reactive(res)
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

export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
  get: shallowReadonlyGet,
})
export type ProxyHandlers = typeof mutableHandlers | typeof readonlyHandlers
