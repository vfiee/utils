/*
 * @Author: vyron
 * @Date: 2022-01-10 17:38:09
 * @LastEditTime: 2022-02-15 13:54:15
 * @LastEditors: vyron
 * @Description: 判断数据类型
 * @FilePath: /v-utils/packages/type/src/index.ts
 */

// return value like "[object String]"
export const toTypeString = (value: unknown): string =>
  Object.prototype.toString.call(value)

// return value line String | Boolean | Number | Array | Object | Function | RegExp | Date
export const toRawType = (value: unknown): string =>
  toTypeString(value).slice(8, -1)

// 是否为 Array
export const isArray = Array.isArray

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

// 是否为 Object
export const isObject = (value: unknown): value is object =>
  typeof value === 'object' && value !== null
