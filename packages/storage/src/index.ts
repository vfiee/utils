/*
 * @Author: vyron
 * @Date: 2022-05-19 17:57:31
 * @LastEditTime: 2022-07-12 18:02:59
 * @LastEditors: vyron
 * @Description: 融合汇聚工具类导出
 * @FilePath: /utils/packages/storage/src/index.ts
 */

import { isString, isNil, isNumber, isDate } from "@vyron/utils"
import AES from "crypto-js/aes"
import encBase64 from "crypto-js/enc-base64"
import encHex from "crypto-js/enc-hex"
import encUtf8 from "crypto-js/enc-utf8"
import modCfb from "crypto-js/mode-cfb"
import padPkcs7 from "crypto-js/pad-pkcs7"

export interface StorageCryptoConfig {
	encrypt: (v: string) => string
	decrypt: <T>(v: string) => T
}

export interface StorageConfig {
	prefix?: string
	enableCrypto?: boolean
	crypto?: StorageCryptoConfig
}

export interface StorageData<T = any> {
	expire?: number
	origin: T
}
const $cryptoKey = encUtf8.parse("storage_encrypt_key")
const $cryptoIv = encUtf8.parse("storage_encrypt_iv")

const $defaultStorageConfig: StorageConfig = {
	enableCrypto: false,
	crypto: {
		encrypt: function encrypt(value: string): string {
			if (!value) return value
			const data = AES.encrypt(encUtf8.parse(value), $cryptoKey, {
				iv: $cryptoIv,
				mode: modCfb,
				padding: padPkcs7
			})
			return data.ciphertext.toString()
		},
		decrypt: function decrypt(value: string): any {
			return AES.decrypt(encBase64.stringify(encHex.parse(value)), $cryptoKey, {
				iv: $cryptoIv,
				mode: modCfb,
				padding: padPkcs7
			}).toString(encUtf8)
		}
	}
}

function $warn(message: any): void {
	console.warn("[Storage Warn]:", message)
}

class StorageCore {
	#config: StorageConfig
	#storage: Storage
	constructor(storage: Storage, config?: StorageConfig) {
		this.#storage = storage
		this.#config = Object.assign({}, $defaultStorageConfig, config)
	}
	get(key: string): any | null {
		if (!key || this.length <= 0) return null
		// 判断storage是否存在
		const data = this.#storage.getItem(this.#prefixKey(key))
		if (data === null) return data
		try {
			// 如果加密,则解密
			const decrypt = this.#config.enableCrypto && this.#config.crypto?.decrypt
			const { origin, expire } = (JSON.parse(decrypt ? decrypt(data) : data) ||
				{}) as StorageData
			if (expire) {
				const now = +new Date()
				if (now >= expire) {
					this.remove(key)
					return null
				}
			}
			if (origin) {
				return origin
			}
		} catch (error) {
			$warn(error)
		}
		return data
	}
	set(key: string, value: any, expire?: string | number | Date): boolean {
		let success = false
		try {
			const storageData: StorageData = { origin: value }
			if (expire) {
				storageData["expire"] = this.#getTimestampByExpire(expire)
			}
			let data = JSON.stringify(storageData)
			const { enableCrypto, crypto } = this.#config
			if (enableCrypto && crypto) {
				data = crypto.encrypt(data)
			}
			this.#storage.setItem(this.#prefixKey(key), data)
			success = true
		} catch (error) {
			$warn(error)
			success = false
		}
		return success
	}
	remove(key: string | string[]): void {
		if (!key || this.isEmpty) return
		if (isString(key)) {
			return this.#storage.removeItem(this.#prefixKey(key))
		}
		let index = -1
		const length = key.length
		while (++index < length) {
			this.#storage.removeItem(this.#prefixKey(key[index]))
		}
	}
	clear(excludes?: string | string[]): void {
		if (this.length <= 0) return
		if (excludes === undefined || excludes.length <= 0) {
			this.#storage.clear()
			return
		}
		const keys: string[] = isString(excludes) ? [excludes] : excludes
		this.remove(this.keys().filter(key => !keys.includes(key)))
	}
	get length(): number {
		return this.#storage.length
	}
	get isEmpty(): boolean {
		return this.length <= 0
	}
	get size(): number {
		if (this.isEmpty) return 0
		const data = this.values().toString()
		if (!(data && data.length)) return 0
		let total = 0
		let index = -1
		const length = data.length
		if (length <= 0) return total
		while (++index < length) {
			total += data.charCodeAt(index) <= 0xffff ? 2 : 4
		}
		return total
	}
	key(index: number): string | null {
		if (this.isEmpty) return null
		const key = this.#storage.key(index)
		return key ? this.#unPrefixKey(key) : key
	}
	keys(): string[] {
		return Object.keys(this.#storage).map(key => this.#unPrefixKey(key))
	}
	values(): any[] {
		if (this.length <= 0) return []
		return this.keys().map(key => this.get(key))
	}
	#prefixKey(key: string): string {
		return `${this.#config.prefix || ""}${key}`
	}
	#unPrefixKey(key: string): string {
		return this.#config.prefix ? key.slice(this.#config.prefix.length) : key
	}
	#getTimestampByExpire(expire?: string | number | Date): number {
		if (isNil(expire)) return 0
		if (isString(expire) && expire.length > 0) {
			try {
				return new Date(expire).getTime()
			} catch (error) {
				$warn(error)
				return 0
			}
		}
		if (isDate(expire)) {
			return expire.getTime()
		}
		if (isNumber(expire)) {
			const now = +new Date()
			return now + expire * 1000
		}
		return 0
	}
}

export class LocalStorage extends StorageCore {
	constructor(config?: StorageConfig) {
		super(localStorage, config)
	}
}

export class SessionStorage extends StorageCore {
	constructor(config: StorageConfig) {
		super(sessionStorage, config)
	}
}

