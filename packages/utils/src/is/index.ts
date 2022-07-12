/*
 * @Author: vyron
 * @Date: 2022-01-10 17:38:09
 * @LastEditTime: 2022-06-02 14:30:44
 * @LastEditors: vyron
 * @Description: 判断数据类型
 * @FilePath: /utils/packages/utils/src/is/index.ts
 */

/**
 * Returns a fixed format string that can be used to determine the data type
 * @param {unknown} value The value that needs to be converted to a type string
 * @returns {string} The type string, like "[object String]"
 */
export function toTypeString(value: unknown): string {
	return Object.prototype.toString.call(value)
}

/**
 * Returns a string representing type value
 * @param {unknown} value The data which want to know the type
 * @returns {string} The value type, like String | Boolean | Number | Array | Object | Function | RegExp | Date
 */
export function toRawType(value: unknown): string {
	return toTypeString(value).slice(8, -1)
}

/**
 * Returns whether the value is an string
 * @param {unknown} value Any legal JavaScript value
 * @returns {boolean} Returns true if value is a string, otherwise false
 */
export function isString(value: unknown): value is string {
	return typeof value === "string"
}

/**
 * Returns whether the value is an boolean
 * @param {unknown} value Any legal JavaScript value
 * @returns {boolean} Returns true if value is a boolean, otherwise false
 */
export function isBoolean(value: unknown): value is boolean {
	return typeof value === "boolean"
}

/**
 * Returns whether the value is an number
 * @param {unknown} value Any legal JavaScript value
 * @returns {boolean} Returns true if value is a number, otherwise false
 */
export function isNumber(value: unknown): value is number {
	return typeof value === "number"
}

/**
 * Returns whether the value is an bigint
 * @param {unknown} value Any legal JavaScript value
 * @returns {boolean} Returns true if value is a bigint, otherwise false
 */
export function isBigInt(value: unknown): value is bigint {
	return typeof value === "bigint"
}

/**
 * Returns whether the value is an symbol
 * @param {unknown} value Any legal JavaScript value
 * @returns {boolean} Returns true if value is a symbol, otherwise false
 */
export function isSymbol(value: unknown): value is symbol {
	return typeof value === "symbol"
}

/**
 * Returns whether the value is an null
 * @param {unknown} value Any legal JavaScript value
 * @returns {boolean} Returns true if value is a null, otherwise false
 */
export function isNull(value: unknown): value is null {
	return value === null
}

/**
 * Returns whether the value is an undefined
 * @param {unknown} value Any legal JavaScript value
 * @returns {boolean} Returns true if value is a undefined, otherwise false
 */
export function isUndefined(value: unknown): value is null {
	return value === undefined
}

/**
 * Returns whether the value is an array
 * @param {unknown} value Any legal JavaScript value
 * @returns {boolean} Returns true if value is a array, otherwise false
 */
export const isArray = Array.isArray

/**
 * Returns whether the value is an object
 * @param {unknown} value Any legal JavaScript value
 * @returns {boolean} Returns true if value is a object, otherwise false
 * @example
 * isObject({}) // return true
 * isObject(new Date()) // return true
 * isObject(/^hello\sworld!$/) // return true
 *
 */
export function isObject(value: unknown): value is object {
	return typeof value === "object" && value !== null
}

/**
 * Returns whether the value is an function
 * @param {unknown} value Any legal JavaScript value
 * @returns {boolean} Returns true if value is a function, otherwise false
 * @example
 * isFunction(() => {}) // return true
 * isFunction(new Function('return this')) // return true
 * isFunction(async function(){}) // return true
 *
 */
export function isFunction(value: unknown): boolean {
	return typeof value === "function"
}

/**
 * Returns whether the value is an RegExp
 * @param {unknown} value Any legal JavaScript value
 * @returns {boolean} Returns true if value is a RegExp, otherwise false
 */
export function isRegExp(value: unknown): value is RegExp {
	return toRawType(value) === "RegExp"
}

/**
 * Returns whether the value is an Date
 * @param {unknown} value Any legal JavaScript value
 * @returns {boolean} Returns true if value is a Date, otherwise false
 */
export function isDate(value: unknown): value is Date {
	return toRawType(value) === "Date"
}

/**
 * Returns whether the value is Arguments
 * @param {unknown} value Any legal JavaScript value
 * @returns {boolean} Returns true if value is Arguments, otherwise false
 */
export function isArguments(value: unknown): boolean {
	return toRawType(value) === "Arguments"
}

/**
 * Returns whether the value is an Map
 * @param {unknown} value Any legal JavaScript value
 * @param {boolean} [allowWeakMap=false] Is weakMap to be map, default is false
 * @returns {boolean} Returns true if value is a Map, otherwise false
 */
export function isMap(
	value: unknown,
	allowWeakMap: boolean = false
): value is Map<any, any> {
	const rawType = toRawType(value)
	return allowWeakMap
		? rawType === "WeakMap" || rawType === "Map"
		: rawType === "Map"
}

/**
 * Returns whether the value is an WeakMap
 * @param {unknown} value Any legal JavaScript value
 * @returns {boolean} Returns true if value is a WeakMap, otherwise false
 */
export function isWeakMap(value: unknown): value is WeakMap<object, any> {
	return toRawType(value) === "WeakMap"
}

/**
 * Returns whether the value is an Set
 * @param {unknown} value Any legal JavaScript value
 * @returns {boolean} Returns true if value is a Set, otherwise false
 */
export function isSet(value: unknown): value is Set<any> {
	return toRawType(value) === "Set"
}

/**
 * Returns whether the value is an WeakSet
 * @param {unknown} value Any legal JavaScript value
 * @returns {boolean} Returns true if value is a WeakSet, otherwise false
 */
export function isWeakSet(value: unknown): value is WeakSet<object> {
	return toRawType(value) === "WeakSet"
}

/**
 * Returns whether the value is NaN
 * @param {unknown} value Any legal JavaScript value
 * @returns {boolean} Returns true if value is NaN, otherwise false
 */
export function isNaN(value: unknown): boolean {
	return value !== value
}

/**
 * Returns whether the value is null or undefined
 * @param {unknown} value Any legal JavaScript value
 * @returns {boolean} Returns true if value is null or undefined, otherwise false
 */
export function isNil(value: unknown): boolean {
	return value === null || value === undefined
}

/**
 * Returns whether the value is falsy
 * @param {unknown} value Any legal JavaScript value
 * @returns {boolean} Returns true if value is falsy, otherwise false
 * @description In javascript, false, 0, -0, 0n, '', null, undefined, NaN are falsy
 * @link https://developer.mozilla.org/en-US/docs/Glossary/Falsy
 */
export function isFalsy(value: unknown): boolean {
	return !!value === false
}

/**
 * Returns whether the value is truthy
 * @param {unknown} value Any legal JavaScript value
 * @returns {boolean} Returns true if value is truthy, otherwise false
 * @description In javascript, truthy value are not falsy
 * @link https://developer.mozilla.org/en-US/docs/Glossary/Truthy
 */
export function isTruthy(value: unknown): boolean {
	return !isFalsy(value)
}

/**
 * Returns whether the value is valid array length
 * @param {unknown} value Any legal JavaScript value
 * @returns {boolean} Returns true if value is valid array length, otherwise false
 */
const MAX_SAFE_INTEGER = 9007199254740991
export function isLength(value: unknown): boolean {
	return isNumber(value) && value >= 0 && value <= MAX_SAFE_INTEGER
}

/**
 * Returns whether the value is JavaScript primitive value
 * @param {unknown} value Any legal JavaScript value
 * @returns {boolean} Returns true if value is JavaScript primitive value, otherwise false
 * @description JavaScript primitive value is number, string, boolean, symbol, undefined, and bigint.
 * typeof null === "object", but we consider it as primitive value because it is not a truthy object
 */
export function isPrimitive(value: unknown): boolean {
	return (
		isNil(value) ||
		["string", "number", "boolean", "symbol", "bigint"].includes(typeof value)
	)
}

/**
 * Returns whether the value is array like
 * @param {unknown} value Any legal JavaScript value
 * @returns {boolean} Returns true if value is array like, otherwise false
 */
export function isArrayLike(value: unknown): boolean {
	return (
		value != null &&
		!isFunction(value) &&
		isLength((value as Array<any>)?.length)
	)
}

function isPrototype(value: unknown): boolean {
	const Constructor = value && (value as any).constructor
	const proto =
		(typeof Constructor === "function" && Constructor.prototype) ||
		Object.prototype
	return value === proto
}

/**
 * Return whether the value is empty
 * @param {unknown} value Any legal JavaScript value
 * @returns {boolean} Returns true if value is empty, otherwise false
 * @description
 * If the value is falsy, return true
 * If the value is an object, return true if the value is empty
 * If the value is an array or array like or string, return true if the value length le 0
 * If the value is a map or set, return true if the value size le(less or equal) 0
 * Otherwise, return false
 * @example
 * isEmpty() // return true
 * isEmpty({}) // return true
 * isEmpty([]) // return true
 * isEmpty(new Map()) // return true
 * isEmpty(new Set()) // return true
 * isEmpty(Object.prototype) // return true
 */
export function isEmpty(value: unknown): boolean {
	if (value == null) return true
	const rawType = toRawType(value)
	if (rawType === "Set" || rawType === "Map") {
		return !(value as Set<any> | Map<any, any>).size
	} else if (
		isArrayLike(value) &&
		(isArray(value) || isArguments(value) || typeof value === "string")
	) {
		return !(value as string | Array<unknown>).length
	} else if (isPrototype(value)) {
		return !Object.keys(value as object).length
	}
	for (const key in value as object) {
		if (Object.prototype.hasOwnProperty.call(value, key)) {
			return false
		}
	}
	return true
}

/**
 * Returns whether the value is an instance of URLSearchParams
 * @param {unknown} value Any legal JavaScript value
 * @returns {boolean} Returns true if the value is an instance of URLSearchParams, otherwise false
 */
export function isUrlSearchParams(value: unknown): value is URLSearchParams {
	return (
		!!value &&
		typeof URLSearchParams === "function" &&
		value instanceof URLSearchParams
	)
}

/**
 * Returns whether the value is an instance of FormData
 * @param {unknown} value Any legal JavaScript value
 * @returns {boolean} Returns true if the value is an instance of FormData, otherwise false
 */
export function isFormData(value: unknown): value is FormData {
	return !!value && typeof FormData === "function" && value instanceof FormData
}

/**
 * Returns whether the value is a File
 * @param {unknown} value Any legal JavaScript value
 * @returns {boolean} Returns true if value is a File, otherwise false
 */
export function isFile(value: unknown): value is File {
	return toRawType(value) === "File"
}

/**
 * Returns whether the value is a Blob
 * @param {unknown} value Any legal JavaScript value
 * @returns {boolean} Returns true if value is a Blob, otherwise false
 */
export function isBlob(value: unknown): value is Blob {
	return toRawType(value) === "Blob"
}

/**
 * Returns whether the value is Stream
 * @param {unknown} value Any legal JavaScript value
 * @returns {boolean} Returns true if value is Stream, otherwise false
 */
export function isStream(value: unknown): boolean {
	return isObject(value) && isFunction((value as any)?.pipe)
}

/**
 * Returns whether the value is ArrayBufferView
 * @param {unknown} value Any legal JavaScript value
 * @returns {boolean} Returns true if value is ArrayBufferView, otherwise false
 */
export function isArrayBufferView(value: unknown): value is ArrayBufferView {
	if (!value) return false
	if (isFunction(ArrayBuffer) && ArrayBuffer.isView)
		return ArrayBuffer.isView(value)
	const buffer = (value as any)?.buffer
	return buffer && buffer instanceof ArrayBuffer
}

/**
 * Returns whether the value is isArrayBuffer
 * @param {unknown} value Any legal JavaScript value
 * @returns {boolean} Returns true if value is isArrayBuffer, otherwise false
 */
export function isArrayBuffer(value: unknown): value is ArrayBuffer {
	return toRawType(value) === "ArrayBuffer"
}
