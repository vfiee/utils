import { isString } from '@v-utils/type'

describe('type', () => {
  test('isString', () => {
    const str = 'string'
    const str2 = new String('string')
    expect(isString(str)).toBe(true)
    expect(isString(str2)).toBe(false)
  })
})
