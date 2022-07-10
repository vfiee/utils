import { LocalStorage } from "../src"

jest.useFakeTimers()
describe("localStorage", () => {
	const storage = new LocalStorage()
	const prefixStorage = new LocalStorage({ prefix: "__test__" })
	const cryptoStorage = new LocalStorage({ enableCrypto: true })

	const key = "test"
	const value = { data: "I'm test data" }

	it("get: should return null if storage has not the key", () => {
		expect(storage.set(key, value)).toBe(true)
		expect(storage.get("demo")).toBeNull()
		expect(storage.length).toBe(1)
		storage.clear()
	})

	it("get: should return null if storage is empty", () => {
		expect(storage.length).toBe(0)
		expect(storage.get(key)).toBeNull()
	})

	it("get: should return data if storage has the key", () => {
		expect(storage.set(key, value)).toBe(true)
		expect(storage.length).toBe(1)
		expect(storage.get(key)).toEqual(value)
		storage.clear()
	})

	it("get: should return data if set storage by storage origin method", () => {
		const data = JSON.stringify(value)
		expect(localStorage.setItem(key, data)).toBeUndefined()
		expect(localStorage.length).toBe(1)
		expect(storage.length).toBe(1)
		expect(localStorage.getItem(key)).toEqual(data)
		expect(storage.get(key)).toEqual(data)
		storage.clear()
	})

	it("get: should decrypt if storage encrypted", () => {
		expect(cryptoStorage.set(key, value)).toBe(true)
		expect(cryptoStorage.length).toBe(1)
		expect(cryptoStorage.get(key)).toEqual(value)
		storage.clear()
	})

	it("set: should return true if set storage success", () => {
		expect(storage.set(key, value)).toBe(true)
		expect(storage.length).toBe(1)
		expect(storage.key(0)).toBe(key)
		storage.clear()
	})

	it("get: should return null if storage is expired", () => {
		// expect storage will expired after 10 seconds
		expect(storage.set(key, value, 10)).toBe(true)
		expect(storage.length).toBe(1)
		expect(storage.get(key)).toEqual(value)
		setTimeout(() => {
			expect(storage.get(key)).toBe(null)
			expect(storage.length).toBe(0)
			storage.clear()
		}, 11000)
		jest.runAllTimers()
	})

	it("remove: should return void if storage is empty", () => {
		expect(storage.remove(key)).toBeUndefined()
		expect(storage.length).toBe(0)
	})

	it("remove: should return void if remove key is empty", () => {
		expect(storage.remove("")).toBeUndefined()
		expect(storage.length).toBe(0)
	})

	it("remove: should remove the key of the storage", () => {
		expect(storage.set(key, value)).toBe(true)
		expect(storage.length).toBe(1)
		expect(storage.get(key)).toEqual(value)
		expect(storage.remove(key)).toBeUndefined()
		expect(storage.length).toBe(0)
		expect(storage.get(key)).toBeNull()
	})

	it("remove: should remove the keys of the storage", () => {
		const key2 = "key2"
		const value2 = { value: "value2" }
		expect(storage.set(key, value)).toBe(true)
		expect(storage.set(key2, value2)).toBe(true)
		expect(storage.length).toBe(2)
		expect(storage.get(key)).toEqual(value)
		expect(storage.get(key2)).toEqual(value2)
		expect(storage.remove([key, key2])).toBeUndefined()
		expect(storage.length).toBe(0)
		expect(storage.get(key)).toBeNull()
		expect(storage.get(key2)).toBeNull()
	})

	it("clear: should clear all storage", () => {
		const length = 10
		const list = Array.from(Array(length)).map((_, index) => ({
			key: index.toString(),
			value: { value: index }
		}))
		const first = list[0]
		const last = list[length - 1]
		for (let i = 0; i < list.length; i++) {
			const { key, value } = list[i]
			storage.set(key, value)
		}
		expect(storage.length).toBe(length)
		expect(storage.get(first.key)).toEqual(first.value)
		expect(storage.get(last.key)).toEqual(last.value)
		storage.clear()
		expect(storage.length).toBe(0)
		expect(storage.get(first.key)).toBeNull()
		expect(storage.get(last.key)).toBeNull()
	})

	it("clear: should clear all storage except excludes", () => {
		const length = 10
		const list = Array.from(Array(length)).map((_, index) => ({
			key: index.toString(),
			value: { value: index }
		}))
		const first = list[0]
		const last = list[length - 1]
		for (let i = 0; i < list.length; i++) {
			const { key, value } = list[i]
			storage.set(key, value)
		}
		expect(storage.length).toBe(length)
		expect(storage.get(first.key)).toEqual(first.value)
		expect(storage.get(last.key)).toEqual(last.value)
		storage.clear([first.key, last.key])
		expect(storage.length).toBe(2)
		expect(storage.get(first.key)).toEqual({ value: 0 })
		expect(storage.get(last.key)).toEqual({ value: 9 })
		storage.clear()
	})

	it("length: should return 0 if storage is empty", () => {
		expect(storage.length).toBe(0)
		expect(storage.isEmpty).toBe(true)
	})

	it("length: should return storage length if storage is't empty", () => {
		storage.set(key, value)
		expect(storage.length).toBe(1)
		storage.clear()
	})

	it("key: should return null if storage has't the key", () => {
		expect(storage.key(100)).toBeNull()
	})

	it("key: should return the key if storage has the key", () => {
		storage.set(key, value)
		expect(storage.key(0)).toBe(key)
		storage.clear()
	})

	it("key: should return unPrefix KEY if storage config the prefix", () => {
		prefixStorage.set(key, value)
		expect(prefixStorage.key(0)).toBe(key)
		expect(prefixStorage.get(key)).toEqual(value)
		storage.clear()
	})

	it("keys: should return empty array if storage is empty", () => {
		expect(storage.keys()).toEqual([])
	})

	it("keys: should return key list if storage is not empty", () => {
		storage.set(key, value)
		storage.set("key2", { value: "key2" })
		expect(storage.keys()).toEqual([key, "key2"])
		storage.clear()
	})

	it("keys: should return unPrefix key list if storage config the prefix", () => {
		prefixStorage.set(key, value)
		prefixStorage.set("key2", { value: "key2" })
		expect(prefixStorage.keys()).toEqual([key, "key2"])
		storage.clear()
	})

	it("values: should return empty list if storage is empty", () => {
		expect(storage.length).toBe(0)
		expect(storage.values()).toEqual([])
	})

	it("values: should return values if storage is not empty", () => {
		const length = 10
		const list = Array.from(Array(length)).map((_, index) => ({
			key: index.toString(),
			value: { value: index }
		}))
		for (let i = 0; i < list.length; i++) {
			const { key, value } = list[i]
			storage.set(key, value)
		}
		const values = storage.values()
		expect(values.length).toBe(length)
		expect(values).toEqual(list.map(item => item.value))
		storage.clear()
	})

	it("values: should be null if storage item was expired", () => {
		const length = 5
		const list = Array.from(Array(length)).map((_, index) => ({
			key: index.toString(),
			value: { value: index }
		}))
		for (let i = 0; i < list.length; i++) {
			const { key, value } = list[i]
			storage.set(key, value)
		}
		// storage will expired after 5 seconds
		storage.set(key, value, 5)
		const values = storage.values()
		expect(values.length).toBe(6)
		expect(values).toEqual([...list.map(item => item.value), value])
		setTimeout(() => {
			const values = storage.values()
			expect(values.length).toBe(6)
			expect(values).toEqual([...list.map(item => item.value), null])
			storage.clear()
		}, 6000)
		jest.runAllTimers()
	})
})
