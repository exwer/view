import { describe, expect, it } from 'vitest'
import { isReactive, reactive } from '../reactive'

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
  })
})
