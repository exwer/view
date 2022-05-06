type Target = Record<any, any>
type DepsMap = Map<any, Set<ReactiveEffect>>
type Scheduler = () => any
interface Runner {
  (): any
  effect?: ReactiveEffect
}
interface EffectOptions {
  scheduler?: Scheduler
}

let activeEffect: ReactiveEffect
const targetMap = new Map<Target, DepsMap>()
class ReactiveEffect {
  private _fn: any
  public scheduler
  public deps: Set<any>[] = []

  constructor(fn: Function, scheduler?: Scheduler) {
    this._fn = fn
    this.scheduler = scheduler
  }

  run() {
    activeEffect = this
    return this._fn()
  }

  stop() {
    cleanupEffect(this)
  }
}

function cleanupEffect(effect: ReactiveEffect) {
  effect.deps.forEach((dep) => {
    dep.delete(effect)
  })
}

export function effect(fn: Function, options: EffectOptions = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler)
  _effect.run()

  const runner: Runner = _effect.run.bind(_effect)
  runner.effect = _effect
  return runner
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
  // 反向收集
  activeEffect.deps.push(dep)
}

export function trigger(target: Target, key: any) {
  const depsMap = targetMap.get(target)

  if (depsMap) {
    const dep = depsMap.get(key)
    if (dep) {
      for (const effect of dep.values()) {
        if (effect.scheduler)
          effect.scheduler()
        else
          effect.run()
      }
    }
  }
}

export function stop(runner: Runner) {
  if (runner.effect)
    runner.effect.stop()
}
