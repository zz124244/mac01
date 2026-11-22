import {readdir, readFile} from 'node:fs/promises'
import {join, extname} from 'node:path'
import {pathToFileURL} from 'node:url'
import {releaseApiOrigin} from './check-release-env.mjs'

async function javascriptFiles(root) {
  const output = []
  async function walk(dir) {
    for (const entry of await readdir(dir, {withFileTypes: true})) {
      const path = join(dir, entry.name)
      if (entry.isDirectory()) await walk(path)
      else if (extname(entry.name) === '.js') output.push(path)
    }
  }
  await walk(root)
  return output
}

export async function verifyApiEmbedded(root = 'dist', origin = process.env.VITE_API_ORIGIN) {
  const expected = releaseApiOrigin(origin)
  const files = await javascriptFiles(root)
  const found = []
  for (const file of files) {
    const text = await readFile(file, 'utf8')
    if (text.includes(expected)) found.push(file)
  }
  if (!found.length) throw new Error(`Production API origin was not embedded in ${root}`)
  return {origin: expected, files: found}
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = await verifyApiEmbedded(process.argv[2] || 'dist')
  console.log(`API origin embedded: ${result.origin}`)
}
