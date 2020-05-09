const fetch = require('node-fetch')

module.exports = {getYodeVersionFromNode}

async function getYodeVersionFromNode(nodeVersion) {
  // Check supported node.
  const nodeMajor = parseInt(nodeVersion.split('.')[0])
  if (nodeMajor < 8)
    throw new Error('Node.js >= 8 is required')
  if (nodeMajor % 2 == 1)
    throw new Error('Only stable versions of Node.js are supported')

  // Node v10 => Yode v0.4.
  return await getYodeVersionFromMajor(nodeMajor / 2 - 1)
}

async function getYodeVersionFromMajor(major) {
  const res = await fetch('https://api.github.com/repos/yue/yode/releases')
  const releases = await res.json()
  for (const r of releases) {
    if (r.tag_name.startsWith(`v0.${major}.`))
      return r.tag_name
  }
  throw new Error(`There is no Yode v${major}`)
}
