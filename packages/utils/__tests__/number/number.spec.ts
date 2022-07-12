import { random } from "../../src"

describe("number", () => {
	test("should return random number between min and max", () => {
		const min = 1
		const max = 10
		for (let i = 0; i < max; i++) {
			const result = random(min, max)
			expect(result).toBeGreaterThanOrEqual(min)
			expect(result).toBeLessThanOrEqual(max)
		}
	})
})
