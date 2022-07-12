/*
 * @Author: vyron
 * @Date: 2022-02-27 17:12:24
 * @LastEditTime: 2022-06-26 23:21:02
 * @LastEditors: vyron
 * @Description: watch file and output files for dev
 * @FilePath: /utils/scripts/dev.js
 */
const fs = require("fs")
const path = require("path")
const chalk = require("chalk")
const minimist = require("minimist")
const rm = require("rimraf")
const { build: esbuild } = require("esbuild")
const nodePolyfills = require("@esbuild-plugins/node-modules-polyfill")

const args = minimist(process.argv.slice(2))
const packageName = args._[0]
const formats = args.formats || args.f || "iife" // cjs || esm || iife
const packagesDir = path.resolve(__dirname, "../packages")
const packages = fs.readdirSync(packagesDir)

function run() {
	const buildPackages = packageName && packages.includes(packageName)
	if (!buildPackages) {
		console.log(chalk.red(`No package found ===> ${packageName}`))
		process.exit(1)
	}
	deleteTargetDist()
	build(packageName)
}

function deleteTargetDist() {
	const target = path.resolve(__dirname, `../packages/${packageName}/dist`)
	rm(target, err => {
		if (err) {
			console.log(chalk.red(err))
		}
	})
}

function transformFormat(format) {
	const formats = {
		esm: "esm",
		cjs: "cjs",
		iife: "global"
	}
	return formats[format] || format
}

async function build(target) {
	const isNodeModule = formats === "cjs"
	const entryPoints = [
		path.resolve(__dirname, `../packages/${target}/src/index.ts`)
	]
	const outfile = path.resolve(
		__dirname,
		`../packages/${target}/dist/${target}.${transformFormat(formats)}.js`
	)
	const relativeOutfile = path.relative(process.cwd(), outfile)
	await esbuild({
		outfile,
		entryPoints,
		bundle: true,
		sourcemap: true,
		format: formats,
		platform: isNodeModule ? "node" : "browser",
		plugins: isNodeModule ? [nodePolyfills.default()] : undefined,
		watch: {
			onRebuild(error) {
				!error && console.log(`rebuilt: ${relativeOutfile}`)
			}
		}
	})
	console.log(`watching: ${relativeOutfile}`)
}

run()
