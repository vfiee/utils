import fs from 'node:fs'
import path from 'node:path'
import {
  isString,
  toTypeString,
  isBoolean,
  isNumber,
  isBigInt,
  isSymbol,
  isNull,
  isUndefined,
  isObject,
  isFunction,
  isRegExp,
  isArray,
  isArrayLike,
  isDate,
  isMap,
  isWeakMap,
  isSet,
  isWeakSet,
  isNil,
  isFalsy,
  isTruthy,
  isLength,
  isEmpty,
  isNaN,
  isArguments,
  isArrayBufferView,
  isBlob,
  isFile,
  isFormData,
  isStream,
  isUrlSearchParams,
  isPrimitive
} from '../../src'

describe('is', () => {
  test('toTypeString', () => {
    expect(toTypeString(true)).toBe('[object Boolean]')
    expect(toTypeString(1)).toBe('[object Number]')
    expect(toTypeString(Symbol('foo'))).toBe('[object Symbol]')
    expect(toTypeString(null)).toBe('[object Null]')
    expect(toTypeString(undefined)).toBe('[object Undefined]')
    expect(toTypeString('')).toBe('[object String]')
    expect(toTypeString([])).toBe('[object Array]')
    expect(toTypeString({})).toBe('[object Object]')
    expect(toTypeString(() => {})).toBe('[object Function]')
    expect(toTypeString(/foo/)).toBe('[object RegExp]')
    expect(toTypeString(new Date())).toBe('[object Date]')
    expect(toTypeString(new Map())).toBe('[object Map]')
    expect(toTypeString(new Set())).toBe('[object Set]')
    expect(toTypeString(new WeakMap())).toBe('[object WeakMap]')
    expect(toTypeString(new WeakSet())).toBe('[object WeakSet]')
    expect(toTypeString(new Error())).toBe('[object Error]')
    expect(toTypeString(new Promise(() => {}))).toBe('[object Promise]')
    expect(toTypeString(new Proxy({}, {}))).toBe('[object Object]')
    function fn() {
      expect(toTypeString(arguments)).toBe('[object Arguments]')
    }
    fn()
  })

  test('isString', () => {
    const str = 'string'
    const str2 = new String('string')
    const str3 = `I'm a string`
    expect(isString(str)).toBe(true)
    expect(isString(str2)).toBe(false)
    expect(isString(str3)).toBe(true)
  })

  test('isBoolean', () => {
    const bool = true
    const bool2 = new Boolean(true)
    const bool3 = !bool
    expect(isBoolean(bool)).toBe(true)
    expect(isBoolean(bool2)).toBe(false)
    expect(isBoolean(bool3)).toBe(true)
  })

  test('isNumber', () => {
    const num = 100
    const nan = NaN
    const num2 = new Number(100)
    const num3 = Infinity
    const num4 = BigInt(9007199254740991)
    expect(isNumber(num)).toBe(true)
    expect(isNumber(nan)).toBe(true)
    expect(isNumber(num2)).toBe(false)
    expect(isNumber(num3)).toBe(true)
    expect(isNumber(num4)).toBe(false)
  })

  test('isBigInt', () => {
    const num = 100n
    const num1 = BigInt(9007199254740991)
    expect(isBigInt(num)).toBe(true)
    expect(isBigInt(num1)).toBe(true)
  })

  test('isSymbol', () => {
    expect(isSymbol(Symbol('foo'))).toBe(true)
    expect(isSymbol(Symbol.toPrimitive)).toBe(true)
  })

  test('isNull', () => {
    expect(isNull(null)).toBe(true)
    expect(isNull(undefined)).toBe(false)
  })

  test('isUndefined', () => {
    expect(isUndefined(undefined)).toBe(true)
    expect(isUndefined(null)).toBe(false)
  })
  test('isObject', () => {
    expect(isObject(null)).toBe(false)
    expect(isObject(undefined)).toBe(false)
    expect(isObject(Symbol('foo'))).toBe(false)
    expect(isObject(() => {})).toBe(false)
    expect(isObject(new Date())).toBe(true)
    expect(isObject(new Map())).toBe(true)
    expect(isObject(new Set())).toBe(true)
    expect(isObject(new WeakMap())).toBe(true)
    expect(isObject(new WeakSet())).toBe(true)
    expect(isObject(new Error())).toBe(true)
    expect(isObject(new Promise(() => {}))).toBe(true)
    expect(isObject(new Proxy({}, {}))).toBe(true)
  })

  test('isFunction', () => {
    const fn = jest.fn()
    const fn2 = () => {}
    const fn3 = new Function('return this')
    const fn4 = async function () {}
    expect(isFunction(fn)).toBe(true)
    expect(isFunction(fn2)).toBe(true)
    expect(isFunction(fn3)).toBe(true)
    expect(isFunction(fn4)).toBe(true)
  })

  test('isRegExp', () => {
    expect(isRegExp(/foo/)).toBe(true)
    expect(isRegExp(new RegExp('^hello\\sworld$'))).toBe(true)
  })

  test('isArray', () => {
    expect(isArray([])).toBe(true)
    expect(isArray(new Array(2))).toBe(true)
    function fn() {
      expect(isArray(arguments)).toBe(false)
      expect(isArray([...arguments])).toBe(true)
    }
    fn()
  })

  test('isArrayLike', () => {
    const arrayLikeObj = { length: 1 }
    expect(isArrayLike([])).toBe(true)
    expect(isArrayLike(arrayLikeObj)).toBe(true)
    function fn() {
      expect(isArrayLike(arguments)).toBe(true)
    }
    fn()
  })

  test('isDate', () => {
    expect(isDate(new Date())).toBe(true)
    expect(isDate(Date())).toBe(false)
  })
  test('isMap', () => {
    expect(isMap(new Map())).toBe(true)
    expect(isMap(new WeakMap())).toBe(false)
    expect(isMap(new WeakMap(), true)).toBe(true)
  })

  test('isWeakMap', () => {
    expect(isWeakMap(new WeakMap())).toBe(true)
    expect(isWeakMap(new Map())).toBe(false)
  })

  test('isSet', () => {
    expect(isSet(new Set())).toBe(true)
    expect(isSet(new WeakSet())).toBe(false)
  })

  test('isWeakSet', () => {
    expect(isWeakSet(new WeakSet())).toBe(true)
    expect(isWeakSet(new Set())).toBe(false)
  })

  test('isNaN', () => {
    expect(isNaN(NaN)).toBe(true)
    expect(isNaN(Number('NaN'))).toBe(true)
  })

  test('isNil', () => {
    expect(isNil(null)).toBe(true)
    expect(isNil(undefined)).toBe(true)
    expect(isNil(0)).toBe(false)
    expect(isNil('')).toBe(false)
  })

  test('isFalsy', () => {
    expect(isFalsy(false)).toBe(true)
    expect(isFalsy(0)).toBe(true)
    expect(isFalsy(-0)).toBe(true)
    expect(isFalsy(0n)).toBe(true)
    expect(isFalsy('')).toBe(true)
    expect(isFalsy(null)).toBe(true)
    expect(isFalsy(undefined)).toBe(true)
    expect(isFalsy(NaN)).toBe(true)
  })

  test('isTruthy', () => {
    expect(isTruthy(null)).toBe(false)
    expect(isTruthy(undefined)).toBe(false)
    expect(isTruthy(0)).toBe(false)
    expect(isTruthy('')).toBe(false)
    expect(isTruthy(false)).toBe(false)
    expect(isTruthy(NaN)).toBe(false)
    expect(isTruthy([])).toBe(true)
    expect(isTruthy({})).toBe(true)
    expect(isTruthy(1)).toBe(true)
    expect(isTruthy(-1)).toBe(true)
    expect(isTruthy(/foo/)).toBe(true)
    expect(isTruthy(new Date())).toBe(true)
    expect(isTruthy(jest.fn())).toBe(true)
  })

  test('isLength', () => {
    expect(isLength(1)).toBe(true)
    expect(isLength(0)).toBe(true)
    expect(isLength(-1)).toBe(false)
    expect(isLength(Number.MAX_SAFE_INTEGER)).toBe(true)
    expect(isLength(Infinity)).toBe(false)
    expect(isLength(NaN)).toBe(false)
  })

  test('isPrimitive', () => {
    expect(isPrimitive(1)).toBe(true)
    expect(isPrimitive('')).toBe(true)
    expect(isPrimitive(false)).toBe(true)
    expect(isPrimitive(null)).toBe(true)
    expect(isPrimitive(undefined)).toBe(true)
    expect(isPrimitive(NaN)).toBe(true)
    expect(isPrimitive(Symbol('foo'))).toBe(true)
    expect(isPrimitive(() => {})).toBe(false)
    expect(isPrimitive(new Date())).toBe(false)
    expect(isPrimitive(new Map())).toBe(false)
    expect(isPrimitive(new Set())).toBe(false)
    expect(isPrimitive(new WeakMap())).toBe(false)
    expect(isPrimitive(new WeakSet())).toBe(false)
    expect(isPrimitive(new Error())).toBe(false)
    expect(isPrimitive(new Promise(() => {}))).toBe(false)
    expect(isPrimitive(new Proxy({}, {}))).toBe(false)
  })

  test('isEmpty', () => {
    expect(isEmpty(null)).toBe(true)
    expect(isEmpty(undefined)).toBe(true)
    expect(isEmpty(0)).toBe(true)
    expect(isEmpty('')).toBe(true)
    expect(isEmpty(false)).toBe(true)
    const arr: any[] = []
    const obj: {
      [key: string]: any
    } = {}
    const map = new Map()
    const set = new Set()
    expect(isEmpty(arr)).toBe(true)
    expect(isEmpty(obj)).toBe(true)
    expect(isEmpty(map)).toBe(true)
    expect(isEmpty(set)).toBe(true)
    arr.push(1)
    obj['test'] = true
    map.set(arr, obj)
    set.add(arr)
    expect(isEmpty(arr)).toBe(false)
    expect(isEmpty(obj)).toBe(false)
    expect(isEmpty(map)).toBe(false)
    expect(isEmpty(set)).toBe(false)
    // There are no attributes to enumerate
    expect(isEmpty(Object.prototype)).toBe(true)
  })
  test('isArguments', () => {
    function fn() {
      return arguments
    }
    expect(isArguments(fn())).toBe(true)
    expect(isArguments([...fn()])).toBe(false)
  })
  test('isFormData', () => {
    const formData = new FormData()
    expect(isFormData({})).toBe(false)
    expect(isFormData(formData)).toBe(true)
  })
  test('isUrlSearchParams', () => {
    const urlParams = new URLSearchParams('id=50011030&type=2')
    expect(isUrlSearchParams({})).toBe(false)
    expect(isUrlSearchParams(urlParams)).toBe(true)
  })
  test('isBlob', () => {
    const blob = new Blob(
      [JSON.stringify({ label: 'Hello world!' }, null, 2)],
      {
        type: 'application/json'
      }
    )
    expect(isBlob(blob)).toBe(true)
  })
  test('isFile', () => {
    const filePath = path.join(__dirname, '../../package.json')
    const file = new File(
      [fs.readFileSync(filePath).toString()],
      'package.json',
      {
        type: 'application/json'
      }
    )
    expect(isFile(file)).toBe(true)
  })
  test('isArrayBufferView', () => {
    const bufferView = new Int32Array()
    const buffer = new ArrayBuffer(10)
    const dataView = new DataView(buffer)
    expect(isArrayBufferView(bufferView)).toBe(true)
    expect(isArrayBufferView(dataView)).toBe(true)
  })
  test('isStream', () => {
    const readStream = fs.createReadStream('../../package.json')
    const writeStream = fs.createWriteStream('../../package.json')
    expect(isStream(readStream)).toBe(true)
    expect(isStream(writeStream)).toBe(true)
  })
})
