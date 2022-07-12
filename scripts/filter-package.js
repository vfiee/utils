/*
 * @Author: vyron
 * @Date: 2022-05-24 10:52:43
 * @LastEditTime: 2022-05-24 13:40:53
 * @LastEditors: vyron
 * @Description: 根据包名进行筛选
 * @FilePath: /utils/scripts/jest-filter-package.js
 */
const { readdirSync } = require("fs")
const { resolve } = require("path")
const chalk = require("chalk")

const cwd = process.cwd()
const packageDir = resolve(cwd, "packages")
const packages = readdirSync(packageDir).filter(name => !name.includes("."))

const package = process.argv[process.argv.length - 1]

const filterFn = list =>
	list
		.filter(item => item.includes(`packages/${package}`))
		.map(test => ({ test }))

const noFilter = list => list.map(test => ({ test }))

module.exports = list => {
	const isValidPackage = packages.includes(package)
	if (!isValidPackage) {
		console.log()
		console.log(chalk.red(`[Jest Error] Invalid package name: ${package}`))
	}
	return {
		filtered: isValidPackage ? filterFn(list) : noFilter(list)
	}
}
