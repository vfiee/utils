/*
 * @Author: vyron
 * @Date: 2022-06-01 16:26:31
 * @LastEditTime: 2022-06-01 17:08:12
 * @LastEditors: vyron
 * @Description: number utils
 * @FilePath: /utils/packages/utils/src/number/index.ts
 */

/**
 * Returns a random number between the minimum and maximum values.
 * Configure floating to true to specify decimals and false by default
 * @param {number} [min=0] - The minimum value
 * @param {number} [max=1] - The maximum value
 * @param {boolean} [floating=false] - If true, the number will be a float
 * @returns {number} - The random number between the minimum and maximum values.
 */
export function random(
  min: number = 0,
  max: number = 1,
  floating: boolean = false
): number {
  const number = Math.random() * (max - min + 1) + min
  return floating ? number : Math.floor(number)
}
