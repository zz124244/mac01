import {pathToFileURL} from 'node:url'

export function releaseApiOrigin(value) {
  let url
  try {
    url = new URL(value || '')
  } catch {
    throw new Error('VITE_API_ORIGIN must be set to the production HTTPS API origin')
  }
  if (url.protocol !== 'https:' || !url.hostname || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('VITE_API_ORIGIN must be a clean production HTTPS origin')
  }
  return url.origin
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  releaseApiOrigin(process.env.VITE_API_ORIGIN)
}
