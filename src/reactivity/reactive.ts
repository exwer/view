import type { ProxyHandlers } from './baseHandler'
import { mutableHandlers, readonlyHandlers } from './baseHandler'

export function reactive<T>(raw: Record<any, T>) {
  return createActiveObject(raw, mutableHandlers)
}

export function readonly<T>(raw: Record<any, T>) {
  return createActiveObject(raw, readonlyHandlers)
}

function createActiveObject<T>(raw: Record<any, T>, baseHandlers: ProxyHandlers) {
  return new Proxy(raw, baseHandlers)
}
