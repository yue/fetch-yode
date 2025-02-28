module.exports = {getYodeVersionFromNode}

const versionsMap = {
  8:  '0.3',
  10: '0.4',
  12: '0.5',
  14: '0.6',
  15: '0.7',
  16: '0.8',
  17: '0.9',
  18: '0.10',
  20: '0.11',
  22: '0.12',
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
  let releases
  let tries = 0
  while (!Array.isArray(releases) && tries++ < 3) {
    const headers = {}
    if (process.env.GITHUB_TOKEN)
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
    const res = await fetch('https://api.github.com/repos/yue/yode/releases', {headers})
    if (!res.ok) {
      if (res.text)
        throw new Error(`Failed to fetch releases info: ${await res.text()}`)
      else
        throw new Error(`Fetch failed with status code: ${res.status}`)
    }
    releases = await res.json()
  }
  if (!Array.isArray(releases))
    throw new Error(`Invalid releases info: ${releases}`)
  for (const r of releases) {
    if (r.tag_name.startsWith(`v${prefix}.`))
      return r.tag_name
  }
  throw new Error(`Can not find Yode v${prefix} from GitHub releases`)
}
