import { mutableHandlers, readonlyHandlers } from './baseHandler'

export function reactive<T>(raw: Record<any, T>) {
  return new Proxy<Record<any, T>>(raw, mutableHandlers)
}

export function readonly<T>(raw: Record<any, T>) {
  return new Proxy<Record<any, T>>(raw, readonlyHandlers)
}

