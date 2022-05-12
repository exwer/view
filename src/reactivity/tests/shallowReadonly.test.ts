import { describe, expect, it, test, vi } from 'vitest'
import { isReadonly, readonly, shallowReadonly } from '../reactive'

describe('shallowReadonly', () => {
  test('should not make nested properties reative', () => {
    const props = shallowReadonly({ n: { foo: 1 } })
    expect(isReadonly(props)).toBe(true)
    expect(isReadonly(props.n)).toBe(false)
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
