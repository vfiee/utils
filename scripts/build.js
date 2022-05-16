/*
 * @Author: vyron
 * @Date: 2022-02-14 14:25:44
 * @LastEditTime: 2022-04-11 18:18:52
 * @LastEditors: vyron
 * @Description: build and output files
 * @FilePath: /v-utils/scripts/build.js
 */

const fs = require('fs')
const rm = require('rimraf')
const path = require('path')
const execa = require('execa')
const chalk = require('chalk')
const minimist = require('minimist')
const { gzipSync } = require('zlib')
const { compress } = require('brotli')

const args = minimist(process.argv.slice(2))
const isProd = process.env.NODE_ENV === 'production'
const package = args.package || args.p // package name in packages
const isWatch = args.watch || args.w // watching file change
const formats = args.formats || args.f // iief cjs es
const sourceMap = args.sourcemap || args.s // sourcemap or not
const buildTypes = args.types || args.t // generate [package].d.ts or not
const packagesDir = path.resolve(__dirname, '../packages')
const packages = fs.readdirSync(packagesDir)
const commit = execa.sync('git', ['rev-parse', 'HEAD']).stdout.slice(0, 7)

async function run() {
  const targetPackages = package && package.split(',')
  const buildPackages = targetPackages
    ? packages.filter(package => targetPackages.includes(package))
    : packages
  await buildAll(buildPackages)
  isProd && checkAllSize(buildPackages)
}

function buildAll(packages) {
  const tasks = packages.map(package => build(package))
  return Promise.all(tasks)
}

function checkAllSize(packages) {
  const tasks = packages.map(package => checkSize(package))
  return Promise.all(tasks)
}

// rollup 打包
async function build(package) {
  deleteTargetDist(package)
  await await execa(
    'rollup',
    [
      '-c',
      isWatch ? '-w' : '',
      '--environment',
      [
        `COMMIT:${commit}`,
        `TARGET:${package}`,
        `NODE_ENV:${isProd ? 'production' : 'development'}`,
        formats ? `FORMATS:${formats.replace(/\,/g, '.')}` : ``,
        buildTypes ? `TYPES:true` : ``,
        sourceMap ? `SOURCE_MAP:true` : ``
      ]
        .filter(Boolean)
        .join(',')
    ].filter(Boolean),
    { stdio: 'inherit' }
  )
  buildTypes && extractorTypes(package)
}

// 删除旧的产物
function deleteTargetDist(packageName) {
  const target = path.resolve(__dirname, `../packages/${packageName}/dist`)
  rm(target, err => {
    if (err) {
      console.log(chalk.red(err))
    } else {
      console.log(chalk.green(`${target} deleted`))
    }
  })
}

// 生成 ts 类型文件
async function extractorTypes(package) {
  const { Extractor, ExtractorConfig } = require('@microsoft/api-extractor')
  const pkgDir = path.resolve(__dirname, `../packages/${package}`)
  const extractorConfigPath = path.resolve(pkgDir, 'api-extractor.json')
  const extractorConfig =
    ExtractorConfig.loadFileAndPrepare(extractorConfigPath)
  const extractorResult = Extractor.invoke(extractorConfig, {
    localBuild: true,
    showVerboseMessages: true
  })
  if (!extractorResult.succeeded) {
    console.error(
      `API Extractor completed with ${extractorResult.errorCount} errors` +
        ` and ${extractorResult.warningCount} warnings`
    )
    process.exitCode = 1
  } else {
    console.log(
      chalk.bold(chalk.green(`API Extractor completed successfully.`))
    )
  }
  fs.rmSync(`${pkgDir}/dist/packages`, { recursive: true, force: true })
}

// 检测包大小
function checkSize(target) {
  const pkgDir = path.resolve(packagesDir, target)
  checkFileSize(`${pkgDir}/dist/${target}.global.prod.js`)
}

// 检测文件大小
function checkFileSize(filePath) {
  if (!fs.existsSync(filePath)) return
  const file = fs.readFileSync(filePath)
  const minSize = (file.length / 1024).toFixed(2) + 'kb'
  const gzipped = gzipSync(file)
  const gzippedSize = (gzipped.length / 1024).toFixed(2) + 'kb'
  const compressed = compress(file)
  const compressedSize = (compressed.length / 1024).toFixed(2) + 'kb'
  console.log(
    `${chalk.green(
      chalk.bold(path.basename(filePath))
    )} min:${minSize} / gzip:${gzippedSize} / brotli:${compressedSize}`
  )
}

run()
