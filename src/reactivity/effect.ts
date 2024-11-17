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

let activeEffect: ReactiveEffect | undefined
let shouldTrack = true
const targetMap = new Map<Target, DepsMap>()
export class ReactiveEffect {
  private _fn: any
  private active = true
  public deps: Set<any>[] = []
  parent: ReactiveEffect | undefined = undefined
  public onStop?: () => void
  public scheduler
  constructor(fn: Function, scheduler?: EffectOptions['scheduler']) {
    this._fn = fn
    this.scheduler = scheduler
  }

  run() {
    // 是否收集依赖

    // 如果effect已经stop，则直接执行fn
    if (!this.active)
      return this._fn()



    //这里解决了循环依赖的问题:
    //effect(()=>{num = num + 1})
    //这种情况会导致无限循环，所以需要使用parent来处理
    let parent: ReactiveEffect | undefined = activeEffect
    while (parent) {
      if (parent === this)
        return
      parent = parent.parent
    }

    //使用parent来处理嵌套effect
    //每处理完一个effect，parent都会更新为上一个effect，恢复上一个effect的执行环境,避免反向收集时收集到了内部错误的effect
    try {
      this.parent = activeEffect
      activeEffect = this
      return this._fn()
    }
    finally {
      activeEffect = this.parent
      // this.parent = undefined
    }
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

  //返回runner的话，run方法中的this会乱，这里需要先绑定
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
  if (!activeEffect)
    return
  if (dep.has(activeEffect))
    return
  dep.add(activeEffect)
  // 反向收集
  activeEffect.deps.push(dep)
}

export function trigger(target: Target, key: any) {
  const depsMap = targetMap.get(target)
  if (!depsMap)
    return
  const dep = depsMap.get(key)
  if (dep)
    triggerEffects(dep)
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
