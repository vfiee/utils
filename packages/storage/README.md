# @vyron/storage

Powerful Browser Storage

## Install

With npm

```zsh
# npm
npm install @vyron/storage

# yarn
yarn add @vyron/storage

# pnpm
pnpm install @vyron/storage

```

## Storage Config

```ts
interface StorageCryptoConfig {
	// storage encrypt Implementation
	encrypt: (v: string) => string
	// storage decrypt Implementation
	decrypt: <T>(v: string) => T
}

interface StorageConfig {
	// enable storage crypto
	enableCrypto?: boolean
	// crypto config
	crypto?: StorageCryptoConfig
	// storage key prefix
	prefix?: string
}
```

## Api

| property               | 解释              |
| ---------------------- | ----------------- |
| get(key)               | 获取 storage      |
| set(key,value,expire?) | 设置 storage      |
| remove                 | 移除 storage      |
| clear                  | 清空 storage      |
| key                    | 获取指定 key      |
| keys                   | 获取所有 key      |
| values                 | 获取所有值        |
| length                 | 获取 storage 长度 |
| isEmpty                | storage 是否为空  |

### get

return storage data

```js
import { LocalStorage } from "@vyron/storage"

const storage = new LocalStorage()

storage.get("text") // null

storage.set("test", "text") // true

storage.get("test") // text
```

### set

```js
import { LocalStorage } from "@vyron/storage"

const storage = new LocalStorage()

// storage will expired after 10 seconds
storage.set("test", "text", 10) // true

storage.get("test") // text

setTimeout(() => {
	// storage was expired & will be remove
	storage.get("test") // null
}, 11 * 1000)
```

### remove

```js
import { LocalStorage } from "@vyron/storage"

const storage = new LocalStorage()

storage.set("test", "text") // true

storage.set("test2", "text2") // true

storage.set("test3", "text3") // true

storage.remove("test")

storage.remove(["test2", "test3"])

console.log(storage.isEmpty) // true
```

### clear

```js
import { LocalStorage } from "@vyron/storage"

const storage = new LocalStorage()

storage.set("test", "text") // true

storage.set("test2", "text2") // true

storage.set("test3", "text3") // true

// storage will remove all but test3
storage.clear("test3")

console.log(storage.length) // 1

storage.get("test3") // text3
```

### key

```js
import { LocalStorage } from "@vyron/storage"

const storage = new LocalStorage()

storage.set("test", "text") // true

storage.set("test2", "text2") // true

storage.set("test3", "text3") // true

storage.key(0) // test

storage.key(1) // test2

storage.key(2) // test3

storage.key(100) // null
```

### keys

```js
import { LocalStorage } from "@vyron/storage"

const storage = new LocalStorage()

storage.set("test", "text") // true

storage.set("test2", "text2") // true

storage.set("test3", "text3") // true

storage.keys() // ['test','test2','test3']
```

### values

```js
import { LocalStorage } from "@vyron/storage"

const storage = new LocalStorage()

storage.set("test", "text") // true

storage.set("test2", "text2") // true

storage.set("test3", "text3") // true

storage.values() // ['text','text2','text3']
```

### length

```js
import { LocalStorage } from "@vyron/storage"

const storage = new LocalStorage()

storage.set("test", "text") // true

storage.set("test2", "text2") // true

storage.length // 2
```

### isEmpty

```js
import { LocalStorage } from "@vyron/storage"

const storage = new LocalStorage()

storage.isEmpty // true

storage.set("test", "text") // true

storage.isEmpty // false
```

## License

[MIT](./LICENSE)

