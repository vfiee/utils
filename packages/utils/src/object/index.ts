/*
 * @Author: vyron
 * @Date: 2022-05-20 14:56:24
 * @LastEditTime: 2022-06-02 14:31:57
 * @LastEditors: vyron
 * @Description: common utils
 * @FilePath: /utils/packages/utils/src/object/index.ts
 */
import { isArray, isLength, isNil, isNumber, isObject, isSymbol } from "../is"
export { getGlobalThis } from "./global"

type PropertyName = string | number | symbol
type ObjectTarget = {
	[key: PropertyName]: any
}
type Many<T> = T | ReadonlyArray<T>
type Target<T> = T | Array<T> | null | undefined
type PropertyPath<T = PropertyName> = Many<T>
type DefaultValue<T = any> = T | undefined

/**
 * Gets the value from target based on path, and returns defaultValue if the value is undefined
 *
 * @param {object|string|array} target The target to search
 * @param {string | Array<string | number | symbol>} path The path of the property to the value
 * @param {any} defaultValue  The default value to return if the value is undefined
 * @returns {any} The value of the property
 */
export function get<T extends ObjectTarget, P extends PropertyName, D>(
	target: Target<T>,
	path: PropertyPath<P>,
	defaultValue?: DefaultValue<D>
): DefaultValue | any {
	if (isNil(target)) return defaultValue
	const paths = convertPath(path)
	let index = 0
	let result = target
	while (result && index < paths.length) {
		result = (result as any)[paths[index++]]
	}
	return result === undefined ? defaultValue : result
}

const convertReg =
	/[^.[\]]+|\[(?:([^"'][^[]*)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g
function convertPath(path: PropertyPath): PropertyName[] {
	if (isArray(path)) return path
	if (isNumber(path) || isSymbol(path)) return [path]
	const result: PropertyName[] = []
	;(path as string).replace(
		convertReg,
		(
			match: string,
			expression?: string,
			quote?: string,
			subString?: string
		): string => {
			let key = match
			if (quote) {
				key = (subString as string).replace(/\((.*)\)/, "$1")
			} else if (expression) {
				key = expression.trim()
			}
			result.push(key)
			return key
		}
	)
	return result
}

/**
 * Set the value from target based on path
 *
 * @param {object|string|array} target The target to update
 * @param {string | Array<string | number | symbol>} path The path of the property to the value
 * @param {any} value  The value to update on target from the path
 * @returns {boolean} return whether the value is set successfully
 */
export function set<T extends ObjectTarget, P extends PropertyName>(
	target: Target<T>,
	path: PropertyPath<P>,
	value: any
): boolean {
	if (isNil(target)) return false
	try {
		let index = 0
		let result = target
		const paths = convertPath(path)
		while (result && index < paths.length - 1) {
			const key = paths[index++]
			const nextKey = paths[index]
			let value = (result as any)[key]
			if (isNil(value)) {
				;(result as any)[key] = value =
					!isSymbol(nextKey) && isLength(+nextKey) ? [] : {}
			}
			result = value
		}
		;(result as any)[paths[index]] = value
	} catch {
		return false
	}
	return true
}

/**
 * Unset(delete) the value from target based on path
 *
 * @param {object|string|array} target The target to delete
 * @param {string | Array<string | number | symbol>} path The path of the property to the value
 * @returns {boolean} return whether the value is delete successfully
 */
export function unset<T extends ObjectTarget, P extends PropertyName>(
	target: Target<T>,
	path: PropertyPath<P>
): boolean {
	if (isNil(target)) return false
	try {
		let index = -1
		let result = target
		const paths = convertPath(path)
		while (++index < paths.length) {
			if (index === paths.length - 1) {
				if (isArray(result)) {
					;(result as any)[paths[index]] = undefined
					return true
				}
				return delete (result as any)[paths[index]]
			}
			result = (result as any)[paths[index]]
			if (!(isArray(result) || isObject(result))) return false
		}
	} catch {
		return false
	}
	return true
}
