import { describe, expect, it } from 'vitest'
import { computed } from '../computed'
import { reactive } from '../reactive'

describe('computed', () => {
  it('happy path', () => {
    const user = reactive({
      age: 1,
    })

    const age = computed(() => user.age)
    expect(age.value).toBe(1)
  })
})
