#!/usr/bin/env node

const path = require('path')
const fs = require('fs')

const sourceDir = path.resolve(__dirname, '..')
const infoPath = path.resolve(sourceDir, 'bin', '.info')

const info = JSON.parse(fs.readFileSync(infoPath).toString())
info.path = path.join(sourceDir, info.path)
module.exports = info
