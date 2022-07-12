import { upperFirst } from "../../src"

describe("string", () => {
	test("should upperCase first letter", () => {
		expect(upperFirst("hello world")).toBe("Hello world")
		expect(upperFirst("HELLO WORLD")).toBe("HELLO WORLD")
		expect(upperFirst(String({}))).toBe("[object Object]")
	})
})
