/*
 * @Author: vyron
 * @Date: 2022-03-24 14:48:36
 * @LastEditTime: 2022-05-18 18:46:04
 * @LastEditors: vyron
 * @Description: 数组常用方法
 * @FilePath: /utils/packages/utils/src/array/index.ts
 */
import { isArray } from "../is"

/**
 * Get the first element of an array.
 * @param {any[]} array
 * @returns {any} Returns the first element of `array`.
 */
export function head<T = any>(array: T[]): T {
	return array?.[0]
}

export const first = head

/**
 * Get the last element of an array.
 * @param {any[]} array
 * @returns {any} Returns the last element of `array`.
 */
export function last<T = any>(array: T[]): T {
	return array?.[array.length - 1]
}

export const tail = last

/**
 * Filter out all falsy values in the array
 * @param {any[]} array The array to filter
 * @returns {any[]} Returns the new array without falsy values
 */
export function compact<T = any>(array: T[]): T[] {
	return array.filter(Boolean)
}

/**
 * Splits the array into the specified size and returns the new array.
 * If the array is not long enough to be divided into size blocks,
 * the rest is treated as a separate block
 * @param {any[]} array The array to chunk
 * @param {number} [size=1] The chunk size
 * @returns {any[][]} Returns the new array chunked
 * @example
 * chunk([1, 2, 3, 4, 5, 6, 7, 8], 3) // [[1, 2, 3], [4, 5, 6], [7, 8]]
 * chunk([1, 2, 3, 4, 5, 6, 7, 8], 4) // [[1, 2, 3, 4], [5, 6, 7, 8]]
 */
export function chunk<T = any>(array: T[], size: number = 1): T[][] {
	const result: T[][] = []
	let index = 0
	while (index < array.length) {
		result.push(array.slice(index, index + size))
		index += size
	}
	return result
}

type FlatArray<Arr, Depth extends number> = {
	done: Arr
	recur: Arr extends ReadonlyArray<infer InnerArr>
		? FlatArray<
				InnerArr,
				[
					-1,
					0,
					1,
					2,
					3,
					4,
					5,
					6,
					7,
					8,
					9,
					10,
					11,
					12,
					13,
					14,
					15,
					16,
					17,
					18,
					19,
					20
				][Depth]
		  >
		: Arr
}[Depth extends -1 ? "done" : "recur"]

/**
 * Flattens the array to the specified depth, return the flattened array
 * @param {any[]} array The array to flatten
 * @param {number} [depth=1] The depth of flattening
 * @returns {any[]} Returns the new array flattened
 * @example
 * flattenDepth([1, [2, [3, [4, [5]]]]]) // [1, 2, [3, [4, [5]]]]
 */
export function flattenDepth<A, D extends number = 1>(
	array: A,
	depth: number = 1
): FlatArray<A, D>[] {
	if (!isArray(array) || depth < 1) return array as unknown as FlatArray<A, D>[]
	return array.reduce((acc: FlatArray<A, D>[], val: any) => {
		return acc.concat(isArray(val) ? flattenDepth(val, depth - 1) : val)
	}, [])
}

/**
 * Flattens the array depth, return the new one-dimensional array
 * @param {any[]} array The array to flatten
 * @returns {any[]} Returns the new array flattened
 * @example
 * flattenDeep([1, [2, [3, [4, [5]]]]]) // [1, 2, 3, 4, 5]
 */
export function flattenDeep<A>(array: A): FlatArray<A, number>[] {
	return flattenDepth<A, number>(array, (array as unknown as Array<any>).length)
}

/**
 * Returns a new array with 1 depth flattened
 * @param {any[]} array The array to flatten
 * @returns {any[]} Returns the new array flattened
 * @example
 * flatten([1, [2, [3, [4, [5]]]]]) // [1, 2, [3, [4, [5]]]]
 */
export function flatten<A>(array: A): FlatArray<A, number>[] {
	return flattenDepth<A>(array)
}
