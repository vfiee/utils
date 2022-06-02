/*
 * @Author: vyron
 * @Date: 2022-06-01 16:03:12
 * @LastEditTime: 2022-06-01 17:09:47
 * @LastEditors: vyron
 * @Description: string utils
 * @FilePath: /utils/packages/utils/src/string/index.ts
 */

/**
 * Converts the first character of a string to uppercase and returns the string
 * @param {string} str - The string to convert
 * @returns {string} - The converted string
 */
export function upperFirst(str: string): string {
  if (!str) return str
  return str.charAt(0).toUpperCase() + str.slice(1)
}
