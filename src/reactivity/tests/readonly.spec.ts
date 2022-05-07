import { describe, expect, it, vi } from 'vitest'
import { readonly } from '../reactive'

describe('readonly', () => {
  it('happy path', () => {
    // could not be set
    const original = { foo: 1, bar: { baz: 2 } }
    const wrapped = readonly(original)
    expect(wrapped).not.toBe(original)
    expect(wrapped.foo).toBe(1)
  })

  it('warn when set', () => {
    console.warn = vi.fn()

    const user = readonly({
      age: 10,
    })
    user.age = 11

    expect(console.warn).toBeCalled()
  })
})
