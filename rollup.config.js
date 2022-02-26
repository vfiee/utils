import path from 'path'
import ts from 'rollup-plugin-typescript2'

const target = process.env.TARGET
const packagesDir = path.resolve(__dirname, 'packages')
const packageDir = path.resolve(packagesDir, target)
const resolve = p => path.resolve(packageDir, p)
const isProd = process.env.NODE_ENV === 'production'

const outputConfigs = ['es', 'cjs', 'iife'].reduce((config, format) => {
  config[format] = {
    format,
    file: resolve(`dist/${target}.${transformFormat(format)}.js`)
  }
  return config
}, {})

const defaultFormats = ['es', 'cjs', 'iife']
const envFormats = process.env.FORMATS && process.env.FORMATS.split('.')
const packageFormats = envFormats || defaultFormats
const packageConfigs = packageFormats.map(format =>
  createConfig(format, outputConfigs[format])
)
if (isProd) {
  packageFormats.forEach(format => {
    if (format === 'cjs') {
      packageConfigs.push(createProdConfig(format))
    } else if (format === 'iife') {
      packageConfigs.push(createMinifiedConfig(format))
    }
  })
}

// 创建 rollup 配置
function createConfig(format, output, plugins = []) {
  if (!output) {
    console.log(require('chalk').yellow(`invalid format: "${format}"`))
    process.exit(1)
  }
  output.sourcemap = process.env.SOURCE_MAP === 'true'
  const shouldEmitTypes = process.env.TYPES === 'true'
  const tsPlugin = ts({
    check: isProd,
    tsconfig: path.resolve(__dirname, 'tsconfig.json'),
    tsconfigOverride: {
      compilerOptions: {
        sourceMap: output.sourcemap,
        declaration: shouldEmitTypes,
        declarationMap: shouldEmitTypes
      },
      exclude: ['**/__tests__']
    }
  })
  return {
    output,
    input: resolve('src/index.ts'),
    plugins: [tsPlugin, ...plugins],
    onwarn: (msg, warn) => {
      if (!/Circular/.test(msg)) {
        warn(msg)
      }
    },
    treeshake: {
      moduleSideEffects: false
    }
  }
}

function transformFormat(format) {
  const formats = {
    es: 'esm',
    cjs: 'cjs',
    iife: 'global'
  }
  return formats[format] || format
}
function createProdConfig(format) {
  return createConfig(format, {
    format: outputConfigs[format].format,
    file: outputConfigs[format].file.replace(/\.js$/, '.prod.js')
  })
}

function createMinifiedConfig(format) {
  const { terser } = require('rollup-plugin-terser')
  return createConfig(
    format,
    {
      format: outputConfigs[format].format,
      file: outputConfigs[format].file.replace(/\.js$/, '.prod.js')
    },
    [
      terser({
        module: format === 'es',
        compress: {
          ecma: 2015,
          pure_getters: true
        }
      })
    ]
  )
}

export default packageConfigs
