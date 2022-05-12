import { describe, expect, it, test } from 'vitest'
import { isProxy, isReactive, reactive } from '../reactive'

describe('reactive', () => {
  it('happy path', () => {
    const original = { foo: 1 }
    const observed = reactive(original)
    expect(observed).not.toBe(original)
    expect(observed.foo).toBe(1)

    expect(isReactive(observed)).toBe(true)
    expect(isReactive(original)).toBe(false)
    const evil = {
      __v_isReactive: true,
      __v_isReadonly: true,
    }
    expect(isReactive(evil)).toBe(false)

    expect(isProxy(observed)).toBe(true)
  })
  test('nested reactive', () => {
    const original: any = {
      nested: {
        foo: 1,
      },
      array: [{ bar: 2 }],
    }
    const observed = reactive(original)
    expect(isReactive(observed.nested)).toBe(true)
    expect(isReactive(observed.array)).toBe(true)
    // @ts-expect-error:unknown property
    expect(isReactive(observed.array[0])).toBe(true)
  })
})
