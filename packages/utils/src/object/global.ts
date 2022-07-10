/*
 * @Author: vyron
 * @Date: 2022-06-02 14:13:16
 * @LastEditTime: 2022-06-02 14:17:35
 * @LastEditors: vyron
 * @Description: 获取全局对象
 * @FilePath: /utils/packages/utils/src/object/global.ts
 */

const _globalThis =
	typeof globalThis === "object" &&
	globalThis !== null &&
	globalThis.Object === Object &&
	globalThis

const _self =
	typeof self === "object" && self !== null && self.Object === Object && self

const _global =
	typeof global === "object" &&
	global !== null &&
	global.Object === Object &&
	global

export function getGlobalThis(): typeof globalThis {
	return _globalThis || _global || _self || Function("return this")()
}
