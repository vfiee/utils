/*
 * @Author: vyron
 * @Date: 2022-05-19 17:57:31
 * @LastEditTime: 2022-06-27 23:59:54
 * @LastEditors: vyron
 * @Description: 融合汇聚工具类导出
 * @FilePath: /utils/packages/storage/src/index.ts
 */

import { isString, isNil, isNumber, isDate } from '@vyron/utils'
import AES from 'crypto-js/aes'
import encBase64 from 'crypto-js/enc-base64'
import encHex from 'crypto-js/enc-hex'
import encUtf8 from 'crypto-js/enc-utf8'
import modCfb from 'crypto-js/mode-cfb'
import padPkcs7 from 'crypto-js/pad-pkcs7'

export interface StorageSecretConfig {
  encrypt: (v: string) => string
  decrypt: <T>(v: string) => T
}

export interface StorageConfig {
  enableSecret?: boolean
  secret?: StorageSecretConfig
  expire?: string | number | Date
  prefix?: string
}

export interface StorageData<T = any> {
  expire: number
  origin: T
}

const defaultStorageConfig: StorageConfig = {
  enableSecret: false,
  secret: {
    encrypt,
    decrypt
  }
}

const encryptKey = encUtf8.parse('vyron_storage_encrypt_key')
const encryptIv = encUtf8.parse('vyron_storage_encrypt_iv')

function encrypt(value: string): string {
  if (!value) return value
  const data = AES.encrypt(encUtf8.parse(value), encryptKey, {
    iv: encryptIv,
    mode: modCfb,
    padding: padPkcs7
  })
  return data.ciphertext.toString()
}

function decrypt(value: string): any {
  return AES.decrypt(encBase64.stringify(encHex.parse(value)), encryptKey, {
    iv: encryptIv,
    mode: modCfb,
    padding: padPkcs7
  }).toString(encUtf8)
}

function getDataSize(data: string): number {
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

function getTimestampByExpire(expire?: StorageConfig['expire']): number {
  if (isNil(expire)) return 0
  if (isString(expire)) {
    try {
      return new Date(expire).getTime()
    } catch (error) {
      warn(error)
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

function warn(message: any): void {
  console.warn('[Storage Warn]:', message)
}

class StorageCore {
  #config: StorageConfig
  #storage: Storage
  constructor(storage: Storage, config?: StorageConfig) {
    this.#storage = storage
    this.#config = Object.assign({}, defaultStorageConfig, config)
  }
  get(key: string): any | null {
    if (!key) return null
    try {
      // 判断storage是否存在
      const string = this.#storage.getItem(this.#prefixKey(key))
      if (string === null) return string
      // 如果加密,则解密
      const decrypt = this.#config.enableSecret && this.#config.secret?.decrypt
      const { origin, expire } = JSON.parse(
        decrypt ? decrypt(string) : string
      ) as StorageData
      if (expire) {
        const now = +new Date()
        if (now >= expire) {
          this.remove(key)
          return null
        }
      }
      return origin
    } catch (error) {
      warn(error)
    }
    return null
  }
  set(key: string, value: any, expire?: StorageConfig['expire']): boolean {
    let success = false
    try {
      let data = JSON.stringify({
        origin: value,
        expire: getTimestampByExpire(expire)
      })
      const { enableSecret, secret } = this.#config
      if (enableSecret && secret) {
        data = secret.encrypt(data)
      }
      this.#storage.setItem(this.#prefixKey(key), data)
      success = true
    } catch (error) {
      warn(error)
      success = false
    }
    return success
  }
  remove(key: string | string[]): void {
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
    if (!excludes || excludes.length <= 0) {
      this.#storage.clear()
      return
    }
    const keys: string[] = isString(excludes) ? [excludes] : excludes
    this.remove(this.keys().filter(key => !keys.includes(key)))
  }
  get length(): number {
    return this.#storage.length
  }
  get size(): number {
    const values = this.values()
    return getDataSize(values.toString())
  }
  key(index: number): string | null {
    if (!this.length) return null
    const key = this.#storage.key(index)
    if (key === null || !this.#config.prefix) return key
    return key.slice(this.#config.prefix.length)
  }
  keys(): string[] {
    return Object.keys(this.#storage)
  }
  values(): string[] {
    if (this.length <= 0) return []
    const values = Object.values(this.#storage)
    if (!this.#config.enableSecret) return this.#transformValue(values)
    const { decrypt } = this.#config.secret || {}
    return this.#transformValue(values, decrypt)
  }
  #transformValue(
    values: string[],
    decrypt?: StorageSecretConfig['decrypt']
  ): any[] {
    return values
      .map((value, index) => {
        try {
          const { origin, expire } =
            JSON.parse(decrypt ? decrypt(value) : value) || {}
          if (Date.now() >= expire) {
            const key = this.key(index) as string
            this.remove(key.slice(this.#config.prefix?.length ?? 0))
            return null
          }
          return origin
        } catch (error) {
          warn(error)
          return null
        }
      })
      .filter(v => !isNil(v))
  }
  #prefixKey(key: string): string {
    return `${this.#config.prefix || ''}${key}`
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
