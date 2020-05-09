#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const downloadYue = require('download-yue')
const {getYodeVersionFromNode} = require('./versions')

const sourceDir = path.resolve(__dirname, '..')

main().catch((error) => {
  console.error('Failed to install Yode', error)
  process.exit(1)
})

async function main() {
  const yodeVersion = await getYodeVersionFromNode(process.versions.node)
  const platform = process.env.npm_config_platform ? process.env.npm_config_platform
                                                   : process.platform
  const arch = process.env.npm_config_arch ? process.env.npm_config_arch
                                           : process.arch
  const outDir = path.join(sourceDir, 'bin')
  await downloadYode(yodeVersion, platform, arch, outDir)
}

async function downloadYode(version, platform, arch, outDir) {
  const filename = `yode-${version}-${platform}-${arch}.zip`
  const yodePath = path.join(outDir, platform == 'win32' ? 'yode.exe' : 'yode')
  const relPath = path.relative(sourceDir, yodePath)
  const infoPath = path.join(outDir, '.info')
  const info = JSON.stringify({version, platform, arch, path: relPath})
  if (fs.existsSync(infoPath) && fs.readFileSync(infoPath) == info)
    return
  await downloadYue('yode', version, filename, outDir)
  fs.chmodSync(yodePath, 0o755)
  fs.writeFileSync(infoPath, info)
}
