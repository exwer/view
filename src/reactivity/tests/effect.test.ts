import { describe, expect, it, vi } from 'vitest'
import { reactive } from '../reactive'
import { effect, stop } from '../effect'

describe('effect', () => {
  it('happy path', () => {
    const user = reactive({
      age: 10,
    })

    let nextAge
    effect(() => {
      nextAge = user.age + 1
    })

    expect(nextAge).toBe(11)

    // update
    user.age++
    expect(nextAge).toBe(12)
  })

  it('runner', () => {
    let foo = 10
    const runner = effect(() => {
      foo++
      return 'foo'
    })
    expect(foo).toBe(11)
    const r = runner()
    expect(foo).toBe(12)
    expect(r).toBe('foo')
  })

  it('scheduler', () => {
    let dummy
    let run: any
    const scheduler = vi.fn(() => {
      /* eslint-disable @typescript-eslint/no-use-before-define */
      run = runner
    })
    const obj = reactive({ foo: 1 })
    const runner = effect(() => {
      dummy = obj.foo
    }, { scheduler })
    expect(scheduler).not.toHaveBeenCalled()
    expect(dummy).toBe(1)

    // should be called on first trigger
    obj.foo++
    expect(scheduler).toHaveBeenCalledTimes(1)

    // should not run yet
    expect(dummy).toBe(1)

    run()
    // should have run
    expect(dummy).toBe(2)
  })

  it('stop', () => {
    let dummy
    const obj = reactive({ prop: 1 })
    const runner = effect(() => {
      dummy = obj.prop
    })
    obj.prop = 2
    expect(dummy).toBe(2)

    stop(runner)
    // won't trigger effect
    obj.prop++
    expect(dummy).toBe(2)

    // stopped effect should still be manually callable
    runner()
    expect(dummy).toBe(3)
  })

  it('onStop', () => {
    const obj = reactive({ foo: 1 })
    const onStop = vi.fn()
    const runner = effect(() => {
      obj.foo
    }, { onStop })
    stop(runner)
    expect(onStop).toBeCalledTimes(1)
  })
})
