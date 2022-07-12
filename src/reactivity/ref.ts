import { hasChanged, isObject } from '../shared/index'
import type { ReactiveEffect } from './effect'
import { isTracking, trackEffects, triggerEffects } from './effect'
import { reactive } from './reactive'

export interface Ref<T = any> {
  value: T
}

class RefImpl<T> {
  private _value: any
  private _rawValue: any
  public dep: Set<ReactiveEffect>

  constructor(value: T) {
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

function trackRefValue(ref: RefImpl<any>) {
  // 通过isTracking判断是否有activeEffect
  if (isTracking())
    trackEffects(ref.dep)
}

function createRef(rawValue: unknown) {
  if (isRef(rawValue))
    return rawValue

  return new RefImpl(rawValue)
}

export function ref(value: unknown) {
  return createRef(value)
}

export function isRef<T>(r: Ref<T> | unknown): r is Ref<T>
export function isRef(value: any): value is Ref {
  return value instanceof RefImpl
}

export function unRef<T>(ref: T | Ref<T>): T {
  return isRef(ref) ? (ref.value as any) : ref
}

export function proxyRefs<T extends object>(target: T) {
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
