import { track, trigger } from './effect'

function createGetter(isReadonly = false) {
  return function get(target: object, key: string|symbol) {
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
  get: createGetter(),
  set: createSetter(),
}

export const readonlyHandlers = {
  get: createGetter(true),
  set: () => true,
}
