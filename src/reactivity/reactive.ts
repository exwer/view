import type { ProxyHandlers } from './baseHandler'
import { ReactiveFlags, mutableHandlers, readonlyHandlers, shallowReadonlyHandlers } from './baseHandler'

export function reactive<T>(raw: Record<any, T>) {
  return createActiveObject(raw, mutableHandlers)
}

export function isReactive(target: any) {
  // trigger getter to get result
  // if target is not Proxy, won't trigger getter
  // so just use !! to transform value to boolean
  return !!target[ReactiveFlags.IS_REACTIVE]
}

export function readonly<T>(raw: Record<any, T>) {
  return createActiveObject(raw, readonlyHandlers)
}

export function shallowReadonly<T>(raw: Record<any, T>) {
  return createActiveObject(raw, shallowReadonlyHandlers)
}

export function isReadonly(target: any) {
  return !!target[ReactiveFlags.IS_READONLY]
}

function createActiveObject<T>(raw: Record<any, T>, baseHandlers: ProxyHandlers) {
  return new Proxy<Record<any, T>>(raw, baseHandlers)
}

export function isProxy(value: any) {
  return isReactive(value) || isReadonly(value)
}
