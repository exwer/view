let activeEffect: ReactiveEffect
class ReactiveEffect {
  private _fn: any
  constructor(fn: Function) {
    this._fn = fn
  }

  run() {
    activeEffect = this
    this._fn()
  }
}

export function effect(fn: Function) {
  const _effect = new ReactiveEffect(fn)

  _effect.run()
}

const targetMap = new Map()
export function track(target: Record<any, any>, key: any) {
  // target:key -> dep
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }

  dep.add(activeEffect)
}
