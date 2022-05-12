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
    if (isTracking())
      trackEffects(this.dep)
    return this._value
  }

  set value(newValue: any) {
    // 先修改value 再进行通知
    this._value = newValue
    triggerEffects(this.dep)
  }
}

export function ref(value: any) {
  return new RefImpl(value)
}
