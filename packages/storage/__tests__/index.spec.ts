import { LocalStorage } from '../src'

describe('localStorage', () => {
  const localStorage = new LocalStorage()

  // const cryptoLocalStorage = new LocalStorage({ enableSecret: true })

  it('should return null if localStorage has not the key', () => {
    expect(localStorage.get('demo')).toBeNull()
  })
  it('should return true if set localStorage success', () => {
    const key = 'testKey'
    const value = { isTest: true }
    expect(localStorage.set(key, value)).toBe(true)
    expect(localStorage.length).toBe(1)
    expect(localStorage.key(0)).toBe(key)
  })
  it('should get localStorage', () => {
    expect(localStorage.get('demo')).toBeNull()
    expect(localStorage.get('testKey')).toEqual({ isTest: true })
  })
  it('should remove localStorage', () => {
    localStorage.remove('testKey')
    expect(localStorage.key(0)).toBeNull()
    expect(localStorage.length).toBe(0)
    expect(localStorage.get('testKey')).toBeNull()
  })
  it('should clear all localStorage', () => {
    const length = 10
    const list = Array.from(Array(length)).map((_, index) => ({
      key: index.toString(),
      value: { value: index }
    }))
    for (let i = 0; i < list.length; i++) {
      const { key, value } = list[i]
      localStorage.set(key, value)
    }
    expect(localStorage.length).toBe(length)
    expect(localStorage.get(list[0].key)).toEqual(list[0].value)
    expect(localStorage.get(list[length - 1].key)).toEqual(
      list[length - 1].value
    )
    localStorage.clear()
    expect(localStorage.length).toBe(0)
    expect(localStorage.get(list[0].key)).toBeNull()
    expect(localStorage.get(list[length - 1].key)).toBeNull()
  })
})
