import { hasChanged, isObject } from '../shared/index'
import type { ReactiveEffect } from './effect'
import { isTracking, trackEffects, triggerEffects } from './effect'
import { reactive } from './reactive'

class RefImpl {
  private _value: any
  public dep: Set<ReactiveEffect>
  private _rawValue: any
  constructor(value: any) {
    this._rawValue = value
    this._value = convertObjectToReactive(value)
    this.dep = new Set()
  }

  get value() {
    trackRefValue(this)
    return this._value
  }

  set value(newValue: any) {
    // 先修改value 再进行通知
    // this._value可能是reactive对象或者普通值
    // 因此需要对比rawValue
    if (hasChanged(this._rawValue, newValue)) {
      this._rawValue = newValue
      this._value = isObject(newValue) ? reactive(newValue) : newValue
      triggerEffects(this.dep)
    }
  }
}

function convertObjectToReactive(value: any) {
  if (isObject(value))
    return reactive(value)

  return value
}

function trackRefValue(ref: RefImpl) {
  // 通过isTracking判断是否有activeEffect
  if (isTracking())
    trackEffects(ref.dep)
}

export function ref(value: any) {
  return new RefImpl(value)
}

export function isRef(value: any) {
  return value instanceof RefImpl
}

export type UnRef<T> = T extends RefImpl ? T['value'] : T
export function unRef(value: any) {
  return isRef(value) ? value.value : value
}

export type ProxyRef<T extends Record<any, any>> = {
  [K in keyof T]: T[K] extends RefImpl ? T[K]['value'] : T[K]
}
export function proxyRefs<T extends Record<any, any>>(target: T): ProxyRef<T> {
  return new Proxy(target, {
    get(target, key) {
      return unRef(Reflect.get(target, key))
    },
    set(target, key: string, value) {
      if (isRef(target[key]) && !isRef(value))
        return (target[key].value = value)
      else
        return Reflect.set(target, key, value)
    },
  })
}
