/*
 * @Author: vyron
 * @Date: 2022-01-10 17:38:09
 * @LastEditTime: 2022-04-01 14:44:04
 * @LastEditors: vyron
 * @Description: 判断数据类型
 * @FilePath: /v-utils/packages/type/src/index.ts
 */

// return value like "[object String]"
export const toTypeString = (value: unknown): string =>
  Object.prototype.toString.call(value)

// return value like String | Boolean | Number | Array | Object | Function | RegExp | Date
export const toRawType = (value: unknown): string =>
  toTypeString(value).slice(8, -1)

// 是否为String
export const isString = (value: unknown): value is string =>
  typeof value === 'string'

// 是否为Boolean
export const isBoolean = (value: unknown): value is boolean =>
  typeof value === 'boolean'

// 是否为Number
export const isNumber = (value: unknown): value is number =>
  typeof value === 'number'

// 是否为Symbol
export const isSymbol = (value: unknown): value is symbol =>
  typeof value === 'symbol'

// 是否为Null
export const isNull = (value: unknown): value is null => value === null

// 是否为Null
export const isUndefined = (value: unknown): value is null =>
  value === undefined

// 是否为 Array
export const isArray = Array.isArray

// 是否为 Object
export const isObject = (value: unknown): value is object =>
  typeof value === 'object' && value !== null

// 是否为Function
export const isFunction = (value: unknown): boolean =>
  typeof value === 'function'

// 是否为RegExp
export const isRegExp = (value: unknown): value is RegExp =>
  toRawType(value) === 'RegExp'

// 是否为Date
export const isDate = (value: unknown): value is Date =>
  toRawType(value) === 'Date'

// 是否为 Arguments
export const isArguments = (value: unknown): boolean =>
  toRawType(value) === 'Arguments'

// 是否为 Map
export const isMap = (value: unknown): value is Map<any, any> =>
  toRawType(value) === 'Map'

// 是否为 WeakMap
export const isWeakMap = (value: unknown): value is WeakMap<object, any> =>
  toRawType(value) === 'WeakMap'

// 是否为 Set
export const isSet = (value: unknown): value is Set<any> =>
  toRawType(value) === 'Set'

// 是否为 WeakSet
export const isWeakSet = (value: unknown): value is WeakSet<object> =>
  toRawType(value) === 'WeakSet'

// 是否为NaN
export const isNaN = (value: unknown): boolean => value !== value

// 是否为null或undefined
export const isNil = (value: unknown): boolean =>
  value === null || value === undefined

// 判断是否为有效的数组长度
const MAX_SAFE_INTEGER = 9007199254740991
export const isLength = (value: unknown): boolean =>
  isNumber(value) && value >= 0 && value <= MAX_SAFE_INTEGER

// 判断是否为类数组
export const isArrayLike = (value: unknown): boolean =>
  value != null && !isFunction(value) && isLength((value as Array<any>).length)

// 是否为原型
export const isPrototype = (value: unknown): boolean => {
  const Constructor = value && (value as any).constructor
  const proto =
    (typeof Constructor === 'function' && Constructor.prototype) ||
    Object.prototype
  return value === proto
}

/**
 * 判断 value 是否为空对象,数组,map 或 set
 * @param value
 */
export const isEmpty = (value: unknown): boolean => {
  if (value == null) return true
  const rawType = toRawType(value)
  if (rawType === 'Set' || rawType === 'Map') {
    return !(value as Set<any> | Map<any, any>).size
  } else if (
    isArrayLike(value) &&
    (isArray(value) || isArguments(value) || typeof value === 'string')
  ) {
    return !(value as string | Array<unknown>).length
  } else if (isPrototype(value)) {
    return !Object.keys(value as object).length
  }
  for (const key in value as object) {
    if (!Object.prototype.hasOwnProperty.call(value, key)) {
      return false
    }
  }
  return true
}
