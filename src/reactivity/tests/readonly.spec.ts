import { describe, expect, it, vi } from 'vitest'
import { readonly, isReadonly } from '../reactive';

describe('readonly', () => {
  it('happy path', () => {
    // could not be set
    const original = { foo: 1, bar: { baz: 2 } }
    const wrapped = readonly(original)
    expect(wrapped).not.toBe(original)
    expect(wrapped.foo).toBe(1)
  })

  it('should make nested values readonly',()=>{
    const original = { foo: 1, bar: { baz: 2 } }
    const wrapped = readonly(original)
    expect(wrapped).not.toBe(original)
    expect(isReadonly(wrapped)).toBe(true)
    expect(isReadonly(original)).toBe(false)
    expect(wrapped.foo).toBe(1)
    const evil = {
      __v_isReadonly:true
    }
    expect(isReadonly(evil)).toBe(false)
  })

  it('should warn when set', () => {
    console.warn = vi.fn()

    const user = readonly({
      age: 10,
    })
    user.age = 11

    expect(console.warn).toBeCalled()
  })
})
