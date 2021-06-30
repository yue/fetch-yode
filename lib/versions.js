const fetch = require('node-fetch')

module.exports = {getYodeVersionFromNode}

const versionsMap = {
  8:  '0.3',
  10: '0.4',
  12: '0.5',
  14: '0.6',
  15: '0.7',
  16: '0.8',
}

async function getYodeVersionFromNode(nodeVersion) {
  // Check supported node.
  const nodeMajor = parseInt(nodeVersion.split('.')[0])
  if (nodeMajor < 8)
    throw new Error('Node.js >= 8 is required')
  if (!versionsMap[nodeMajor])
    throw new Error(`There is no matching Yode build for Node.js v${nodeVersion}`)

  return await getYodeVersionFromPrefix(versionsMap[nodeMajor])
}

async function getYodeVersionFromPrefix(prefix) {
  const res = await fetch('https://api.github.com/repos/yue/yode/releases')
  const releases = await res.json()
  for (const r of releases) {
    if (r.tag_name.startsWith(`v${prefix}.`))
      return r.tag_name
  }
  throw new Error(`Can not find Yode v${prefix} from GitHub releases`)
}
