type Target = Record<any, any>
type DepsMap = Map<any, Set<ReactiveEffect>>

let activeEffect: ReactiveEffect
const targetMap = new Map<Target, DepsMap >()
class ReactiveEffect {
  private _fn: any
  constructor(fn: Function) {
    this._fn = fn
  }

  run() {
    activeEffect = this
    return this._fn()
  }
}

export function effect(fn: Function) {
  const _effect = new ReactiveEffect(fn)

  _effect.run()

  return _effect.run.bind(_effect)
}

export function track(target: Target, key: any) {
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

export function trigger(target: Target, key: any) {
  const depsMap = targetMap.get(target)

  if (depsMap) {
    const dep = depsMap.get(key)
    if (dep) {
      for (const effect of dep.values())
        effect.run()
    }
  }
}
