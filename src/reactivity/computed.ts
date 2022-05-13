class ComputedRefImpl {
  private _getter: any
  private _dirty = true
  private _value: any
  constructor(getter: any) {
    this._getter = getter
  }

  get value() {
    if (this._dirty) {
      this._dirty = false
      this._value = this._getter()
    }
    return this._value
  }
}

export function computed(getter: any) {
  return new ComputedRefImpl(getter)
}
