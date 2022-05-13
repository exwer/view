class ComputedRefImpl {
  private _getter: any
  constructor(getter: any) {
    this._getter = getter
  }

  get value() {
    return this._getter()
  }
}

export function computed(getter: any) {
  return new ComputedRefImpl(getter)
}
