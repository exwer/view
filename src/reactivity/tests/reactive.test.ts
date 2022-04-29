import { describe, expect } from 'vitest'
import { reactive } from '../index'

describe('reactive', () => {
  const original = { foo: 1 }
  const observed = reactive(original)
  expect(observed).not.toBe(original)
  expect(observed.foo).toBe(1)
})
