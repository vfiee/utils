import {
	head,
	last,
	compact,
	chunk,
	flatten,
	flattenDepth,
	flattenDeep
} from "../../src"

describe("array", () => {
	it("should return first element", () => {
		const arr = [1, 2, 3]
		expect(head(arr)).toBe(1)
		arr.length = 0
		expect(head(arr)).toBe(undefined)
	})

	it("should return last element", () => {
		const arr = [1, 2, 3]
		expect(last(arr)).toBe(3)
		arr.length = 0
		expect(last(arr)).toBe(undefined)
	})

	it("should filter falsy values", () => {
		const date = new Date()
		const arr = [
			1,
			-1,
			0,
			"",
			false,
			null,
			undefined,
			[],
			{},
			date,
			"/reg/",
			NaN
		]
		expect(compact(arr)).toEqual([1, -1, [], {}, date, "/reg/"])
	})

	it("should split array into chunks", () => {
		const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
		expect(chunk(arr, 2)).toHaveLength(5)
		expect(chunk(arr, 3)).toHaveLength(4)
		expect(chunk(arr, 4)).toHaveLength(3)
	})

	it("should flatten by depth", () => {
		const arr = [1, [2], [[3]], [[[4]]], [[[[5]]]]]
		expect(flattenDeep(arr)).toEqual([1, 2, 3, 4, 5])
		expect(flattenDepth(arr, 2)).toEqual([1, 2, 3, [4], [[5]]])
		expect(flatten(arr)).toEqual([1, 2, [3], [[4]], [[[5]]]])
	})
})
