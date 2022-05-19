import get from 'lodash.get'
import fs from 'node:fs'
import path from 'node:path'

export const getPkg = (filePath, key) => {
  const pkg = JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), filePath), 'utf-8')
  )
  return key ? get(pkg, key) : pkg
}
