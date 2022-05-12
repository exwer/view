class RefImpl {
  private _value: any
  constructor(value: any) {
    this._value = value
  }

  get value() {
    return this._value
  }
}

export function ref(value: any) {
  return new RefImpl(value)
}
