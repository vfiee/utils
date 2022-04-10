import { head } from '@v-utils/array'

describe('array', () => {
  test('head', () => {
    const arr = [1, 2, 3]
    expect(head(arr)).toBe(1)
  })
})
