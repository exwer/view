import { describe, expect, it } from 'vitest'
import { isReactive, isReadonly, reactive, readonly } from '../reactive'

describe('reactive', () => {
  it('happy path', () => {
    const original = { foo: 1 }
    const observed = reactive(original)
    const constant = readonly(original)
    expect(observed).not.toBe(original)
    expect(observed.foo).toBe(1)

    expect(isReactive(observed)).toBe(true)
    expect(isReactive(original)).toBe(false)
    expect(isReadonly(constant)).toBe(true)
    expect(isReadonly(original)).toBe(false)
    const evil = {
      __v_isReactive: true,
      __v_isReadonly: true,
    }
    expect(isReactive(evil)).toBe(false)
    expect(isReadonly(evil)).toBe(false)
  })
})
