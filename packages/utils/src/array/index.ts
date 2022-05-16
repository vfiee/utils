/*
 * @Author: vyron
 * @Date: 2022-03-24 14:48:36
 * @LastEditTime: 2022-05-16 14:52:45
 * @LastEditors: vyron
 * @Description: 数组常用方法
 * @FilePath: /utils/packages/utils/src/array/index.ts
 */
import { isArray } from '../is'

// 返回数组的第一个元素,如果没有则返回 undefined
export const head = (array: any[]) => (isArray(array) ? array[0] : undefined)

export const first = head

// 返回数组的最后一个元素,如果没有则返回 undefined
export const last = (array: any[]) =>
  isArray(array) ? array[array.length - 1] : undefined

export const tail = last

// 过滤并返回数组中所有的 truthy 值元素
export const compact = (array: any[]) => array.filter(Boolean)

// 将数组拆分成多个长度为 size 的块,并将多个块组成一个新数组并返回;
// 如果 array 无法被分割成全部等长的块,剩余的元素将组成一个块
export const chunk = (array: any[], size = 1) => {
  const result: any[] = []
  let index = 0
  while (index < array.length) {
    result.push(array.slice(index, index + size))
    index += size
  }
  return result
}

// 根据 depth 递归减少 array 的嵌套层级
export const flattenDepth = (array: any[], depth = 1): any[] => {
  if (!isArray(array) || depth < 1) return array
  return array.reduce((acc: any[], val: any) => {
    if (isArray(val)) {
      return acc.concat(flattenDepth(val, depth - 1))
    }
    return acc.concat(val)
  }, [])
}

// 将数组递归为一维数组
export const flattenDeep = (array: any[]) => flattenDepth(array, array.length)

// 减少一级数组的嵌套
export const flatten = (array: any[]) => flattenDepth(array)
