#!/usr/bin/env node

const path = require('path')

if (process.env.yackage == 'true')
  process.exit(0)

if (!process.env.npm_package_engines_yode) {
  console.error('Must specifiy {engines: {yode: "VERSION"}} in package.json')
  process.exit(1)
}

const downloadYode = require('./index')
downloadYode('v' + process.env.npm_package_engines_yode, process.platform, process.arch, path.resolve('yode'))
.catch((e) => {
  console.error(e)
  process.exit(2)
})
