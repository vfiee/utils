const args = require('minimist')(process.argv.slice(2))
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const semver = require('semver')
const currentVersion = require('../package.json').version
const { prompt } = require('enquirer')
const ora = require('ora')
const execa = require('execa')
const get = require('lodash.get')
const set = require('lodash.set')
const pkgDir = path.resolve(__dirname, '../packages')

/**
 * 软件版本周期
 *
 * Pre-alpha  预发行的Alpha版本,功能不完整版本
 * Alpha 内部测试版本,功能不完善,会有Bug,一般仅供测试人员使用(白盒测试,黑盒测试,灰盒测试)
 * Beta  最早对外发行的版本,由公众参与测试,会有一些已知问题和轻微的程序错误,需要调试
 * Release Candidate(RC)   最终产品的候选版本
 * Stable 稳定版
 *
 */
const releaseTypes = [
  'major', // 主版本
  'minor', // 次版本
  'patch', // 补丁版本
  'premajor', // 预发主版本
  'preminor', // 预发次版本
  'prepatch', // 预发补丁版本
  'prerelease' // 预发行版本
]
// pkg根路径
const pkgPath = path.resolve(__dirname, '../package.json')

// 版本
const preId =
  (semver.prerelease(currentVersion) && semver.prerelease(currentVersion)[0]) ||
  'alpha'

// 执行命令
const run = (bin, args, opts = {}) =>
  execa(bin, args, { stdio: 'inherit', ...opts })

// 打印进度
const progress = (message = '') => ora(message)

// 递增版本
const incVersion = t => semver.inc(currentVersion, t, preId)

// 获取 package.json
const getPkg = (key, path = pkgPath) => {
  const pkg = JSON.parse(fs.readFileSync(path, 'utf-8'))
  return key ? get(pkg, key) : pkg
}

// 更新 package.json
const updatePkg = (values = {}, path = pkgPath) => {
  const pkg = getPkg(null, path)
  for (const [key, value] of Object.entries(values)) {
    set(pkg, key, value)
  }
  fs.writeFileSync(path, JSON.stringify(pkg, null, 2) + '\n')
}

// 1. 检测当前分支
const checkCurrentBranch = async () => {
  const spinner = progress('Checking git branch')
  spinner.start()
  const { stdout: branch } = await run('git', ['branch', '--show-current'], {
    stdio: 'pipe'
  })
  if (branch !== 'main') {
    const notMainBranchMsg = `The current git branch is not main, switch to the main branch and try again!`
    spinner.fail(notMainBranchMsg)
    throw new Error(notMainBranchMsg)
  }
  spinner.succeed(`Current branch is ${branch}!`)
}

// 2. 单元测试
const runTest = () => run('pnpm', ['test'])

// 3. 运行 eslint & format 格式化代码
const runFormatAndEslint = async () => {
  await run('pnpm', ['lint'])
  await run('pnpm', ['format'])
}

// 4. 选择版本
const chooseVersion = async () => {
  let targetVersion = args._[0]
  if (!targetVersion) {
    const { type } = await prompt({
      name: 'type',
      type: 'select',
      message: 'select release type please!',
      choices: releaseTypes
        .map(type => `${type} (${incVersion(type)})`)
        .concat(['custom'])
    })
    if (type === 'custom') {
      targetVersion = (
        await prompt({
          type: 'input',
          name: 'version',
          message: 'input custom version please!',
          initial: currentVersion
        })
      ).version
    } else {
      targetVersion = type.match(/\((.*)\)/)[1]
    }
  }
  if (!semver.valid(targetVersion)) {
    throw new Error(`Version: ${targetVersion} is invalid!`)
  }

  const { isRelease } = await prompt({
    type: 'confirm',
    name: 'isRelease',
    message: `Are you sure to release version ${targetVersion}`
  })
  if (!isRelease) {
    throw new Error(`Release version ${targetVersion} is canceled!`)
  }
  return targetVersion
}

// 5. 更新版本号
const updateVersion = async version => {
  const spinner = progress('Updating version').start()
  updatePkg({ version })
  updatePackagesPkg(version)
  await run('pnpm', ['install', '--prefer-offline'])
  spinner.succeed(`Update successful, current version: ${version}`)
}

const updatePackagesPkg = version => {
  const packages = fs.readdirSync(pkgDir)
  const updatedDependencies = dependencies => {
    Object.keys(dependencies).reduce((acc, dependency) => {
      if (dependency.startsWith('@v-utils/')) {
        acc[dependency] = version
      }
      return acc
    }, dependencies)
  }
  packages.forEach(package => {
    const pkgPath = path.resolve(pkgDir, `${package}/package.json`)
    const { dependencies } = require(pkgPath)
    const pkg = { version }
    if (dependencies) {
      pkg[dependencies] = updatedDependencies(dependencies)
    }
    updatePkg(pkg, pkgPath)
  })
}

// 8. 提交修改文件
const commitChanges = async () => {
  const spinner = progress(`Committing files`).start()
  const { stdout } = await run('git', ['diff', '--ignore-submodules'], {
    stdio: 'pipe'
  })
  const version = getPkg('version')
  if (!stdout) {
    spinner.succeed(`No changes to commit`)
    return
  }
  try {
    await run('git', ['add', '-A'])
    await run('git', ['commit', '-m', `release: v${version}`])
    spinner.succeed(`All changes have been committed`)
  } catch (error) {
    spinner.fail(`Failed to commit, error:${error}`)
    throw error
  }
}

// 6. 打包应用
const buildPackage = async () => {
  const spinner = progress(`Building packages`).start()
  try {
    await run('pnpm', ['build'], { stdio: 'ignore' })
    spinner.succeed('Build successfully')
  } catch (error) {
    spinner.fail('Build failed')
    throw error
  }
}

// 7.生成changelog
const generateChangeLog = async () => {
  const spinner = progress(`Generating changelog`).start()
  try {
    await run('pnpm', ['run', 'changelog'])
    spinner.succeed('Generated successfully')
  } catch (error) {
    spinner.fail('Generate failed')
    throw error
  }
}

// 9.发布到npm
const publishPackages = async () => {
  const packages = fs.readdirSync(pkgDir)
  for (const package of packages) {
    await publishPackage(package)
  }
}

// 6. 发布到 npm
const publishPackage = async package => {
  const { name, version } = getPkg(
    null,
    path.resolve(pkgDir, `${package}/package.json`)
  )
  const releaseTag = getReleaseTag(version)
  const spinner = progress('Publishing to npm').start()
  try {
    await run(
      'yarn',
      [
        'publish',
        '--new-version',
        version,
        ...(releaseTag ? ['--tag', releaseTag] : []),
        '--access',
        'public'
      ],
      {
        stdio: 'pipe',
        cwd: path.resolve(pkgDir, package)
      }
    )
    spinner.succeed(`Successfully publish ${name}@${version}`)
  } catch (e) {
    spinner.fail(`Publish failed, error: ${e}`)
    throw e
  }
}

// 10.推送到 github
const publishToGithub = async () => {
  const spinner = progress(`Publishing to github`).start()
  const { stdout: remote } = await run('git', ['remote'], {
    stdio: 'pipe'
  })
  if (!remote) {
    const msg = `Publishing failed because of no remote branch`
    spinner.fail(msg)
    throw new Error(msg)
  }

  const version = getPkg('version')
  try {
    await run('git', ['tag', `v${version}`])
    await run('git', ['push', 'origin', `refs/tags/v${version}`])
    await run('git', ['push'])
    spinner.succeed(`🎉🎉🎉Push to github succeeded!`)
  } catch (error) {
    spinner.fail(`💥💥💥Push to github failed, error:${error}`)
    throw error
  }
}

const getReleaseTag = version => {
  let releaseTag = null
  if (args.tag) {
    releaseTag = args.tag
  } else if (version.includes('alpha')) {
    releaseTag = 'alpha'
  } else if (version.includes('beta')) {
    releaseTag = 'beta'
  } else if (version.includes('rc')) {
    releaseTag = 'rc'
  }
  return releaseTag
}

const release = () =>
  checkCurrentBranch()
    .then(runTest)
    .then(runFormatAndEslint)
    .then(chooseVersion)
    .then(updateVersion)
    .then(buildPackage)
    .then(generateChangeLog)
    .then(commitChanges)
    .then(publishPackages)
    .then(publishToGithub)

release().catch(err => console.log('\n' + chalk.red(err)))
