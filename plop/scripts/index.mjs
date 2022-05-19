/*
 * @Author: vyron
 * @Date: 2022-05-19 16:41:35
 * @LastEditTime: 2022-05-19 18:32:53
 * @LastEditors: vyron
 * @Description: 聚合导出生成器
 * @FilePath: /utils/plop/scripts/index.mjs
 */
// import { NodePlopAPI } from 'plop'
import { packageGenerator } from './package.mjs'

// export type PlopGenerator = {
//   name: Parameters<NodePlopAPI['setGenerator']>[0]
//   config: Parameters<NodePlopAPI['setGenerator']>[1]
// }

const plopGenerators = [packageGenerator]

export default plopGenerators
