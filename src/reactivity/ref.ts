import { hasChanged } from '../shared/index'
import type { ReactiveEffect } from './effect'
import { isTracking, trackEffects, triggerEffects } from './effect'

class RefImpl {
  private _value: any
  public dep: Set<ReactiveEffect>
  constructor(value: any) {
    this._value = value
    this.dep = new Set()
  }

  get value() {
    trackRefValue(this)
    return this._value
  }

  set value(newValue: any) {
    // 先修改value 再进行通知
    if (hasChanged(this._value, newValue)) {
      this._value = newValue
      triggerEffects(this.dep)
    }
  }
}

function trackRefValue(ref: RefImpl) {
  // 通过isTracking判断是否有activeEffect
  if (isTracking())
    trackEffects(ref.dep)
}

export function ref(value: any) {
  return new RefImpl(value)
}
