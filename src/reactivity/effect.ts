import { extend } from '../shared'

type Target = Record<any, any>
type DepsMap = Map<any, Set<ReactiveEffect>>
interface Runner {
  (): any
  effect?: ReactiveEffect
}
interface EffectOptions {
  scheduler?: () => void
  onStop?: () => void
}

let activeEffect: ReactiveEffect
let shouldTrack = true
const targetMap = new Map<Target, DepsMap>()
export class ReactiveEffect {
  private _fn: any
  public scheduler
  private active = true
  public deps: Set<any>[] = []
  public onStop?: () => void
  constructor(fn: Function, scheduler?: EffectOptions['scheduler']) {
    this._fn = fn
    this.scheduler = scheduler
  }

  run() {
    // 是否收集依赖
    if (!this.active)
      return this._fn()

    shouldTrack = true
    activeEffect = this

    const result = this._fn()
    // reset
    shouldTrack = false

    return result
  }

  stop() {
    if (this.active) {
      cleanupEffect(this)
      if (this.onStop)
        this.onStop()
      this.active = false
    }
  }
}

function cleanupEffect(effect: ReactiveEffect) {
  effect.deps.forEach((dep) => {
    dep.delete(effect)
  })
  effect.deps.length = 0
}

export function effect(fn: Function, options: EffectOptions = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler)
  extend(_effect, options)
  _effect.run()

  const runner: Runner = _effect.run.bind(_effect)
  runner.effect = _effect
  return runner
}

export function isTracking() {
  if (!activeEffect || !shouldTrack)
    return false
  else
    return true
}
export function track(target: Target, key: any) {
  // target:key -> dep
  if (!isTracking())
    return
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

  trackEffects(dep)
}

export function trackEffects(dep: Set<ReactiveEffect>) {
  if (dep.has(activeEffect))
    return
  dep.add(activeEffect)
  // 反向收集
  activeEffect.deps.push(dep)
}

export function trigger(target: Target, key: any) {
  const depsMap = targetMap.get(target)

  if (depsMap) {
    const dep = depsMap.get(key)
    if (dep)
      triggerEffects(dep)
  }
}

export function triggerEffects(dep: Set<ReactiveEffect>) {
  for (const effect of dep.values()) {
    if (effect.scheduler)
      effect.scheduler()
    else
      effect.run()
  }
}

export function stop(runner: Runner) {
  if (runner.effect)
    runner.effect.stop()
}
