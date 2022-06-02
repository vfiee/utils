import {
  get,
  isEmpty,
  set,
  unset,
  getGlobalThis,
  isObject,
  isFunction
} from '../../src'

describe('object', () => {
  test('get object', () => {
    const obj: object = { a: 1, b: [1, 2, 3], c: { a: 1, b: 2, c: 3 } }
    expect(get(obj, 'a')).toBe(1)
    expect(get(obj, ['a'])).toBe(1)
    expect(get(obj, 'b[0]')).toBe(1)
    expect(get(obj, ['b', 0])).toBe(1)
    expect(get(obj, 'c.a')).toBe(1)
    expect(get(obj, ['c', 'a'])).toBe(1)
    expect(get(obj, 'c.b.a', true)).toBe(true)
    expect(get(obj, ['c', 'b', 'a'], true)).toBe(true)
  })
  test('get array', () => {
    const arr: any[] = [1, [2, 3], { a: 1, b: 2, c: 3 }, true]
    expect(get(arr, 0)).toBe(1)
    expect(get(arr, [0])).toBe(1)
    expect(get(arr, '2.a')).toEqual(1)
    expect(get(arr, [2, 'a'])).toEqual(1)
    expect(get(arr, '2.c.d', true)).toBe(true)
    expect(get(arr, [2, 'c', 'd'], true)).toBe(true)
  })
  test('set object', () => {
    const obj: {
      [key: string]: any
    } = {}
    expect(set(obj, 'l.2.a.b.d.c', 100)).toBe(true)
    expect(set(obj, ['l', '2', 'a', 'b', 'd', 'c'], 100)).toBe(true)
    expect(obj.l[2].a.b.d.c).toBe(100)
    expect(set(obj, 'o.k.m.v', false)).toBe(true)
    expect(set(obj, ['o', 'k', 'm', 'v'], false)).toBe(true)
    expect(obj.o.k.m.v).toBe(false)
  })
  test('set array', () => {
    const arr: any[] = []
    expect(set(arr, '0.a.b.v', 100)).toBe(true)
    expect(set(arr, ['0', 'a', 'b', 'v'], 100)).toBe(true)
    expect(arr[0].a.b.v).toBe(100)
    expect(set(arr, '0.0.0.0.k', 'key')).toBe(true)
    expect(set(arr, ['0', '0', '0', '0', 'k'], 'key')).toBe(true)
    expect(arr[0][0][0][0].k).toBe('key')
  })
  test('unset object', () => {
    const obj: {
      [key: string]: any
    } = {}
    expect(set(obj, 'l.2.a.b.d.c', 100)).toBe(true)
    expect(obj.l[2].a.b.d.c).toBe(100)
    expect(unset(obj, 'l.2.a.b.d.c')).toBe(true)
    expect(obj.l[2].a.b.d.c).toBeUndefined()
    expect(unset(obj, 'l')).toBe(true)
    expect(isEmpty(obj)).toBe(true)
  })
  test('unset array', () => {
    const arr: any[] = []
    expect(set(arr, '0.a.b.v', 100)).toBe(true)
    expect(arr[0].a.b.v).toBe(100)
    expect(unset(arr, '0.a.b.v')).toBe(true)
    expect(arr[0].a.b.v).toBeUndefined()
    expect(unset(arr, '0')).toBe(true)
    expect(isEmpty(arr)).toBe(false)
    expect(arr[0]).toBeUndefined()
  })
  test('should return global context', () => {
    const global = getGlobalThis()
    expect(isObject(global)).toBe(true)
    expect(isFunction(global.setTimeout)).toBe(true)
    expect(isFunction(global.Object)).toBe(true)
  })
})
