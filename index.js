#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const downloadYue = require('download-yue')

module.exports = async function downloadYode(version, platform, arch, cacheDir) {
  const name = `yode-${version}-${platform}-${arch}`
  const filename = `${name}.zip`
  const targetDir = path.join(cacheDir, name)
  const yodePath = path.join(targetDir, platform == 'win32' ? 'yode.exe' : 'yode')
  if (fs.existsSync(yodePath))
    return
  await downloadYue('yode', version, filename, targetDir)
  fs.chmodSync(yodePath, 0o755)
}
