// Cloudflare Worker: serves the built site and stores uploaded videos in R2.
//   POST /api/upload?name=clip.mp4  -> saves the request body, returns { url: '/media/<key>' }
//   GET  /media/<key>               -> streams the video (with range support, so it can be scrubbed)
// Everything else falls through to the static site in dist/.
//
// Uploads are only accepted from signed-in dashboard administrators. The Worker passes the person's
// Firebase sign-in token to Firestore and asks for their admins/<uid> document; Firestore checks the
// token and the security rules, so a forged or non-admin token is refused without any keys stored here.

const MAX_BYTES = 95 * 1024 * 1024 // Cloudflare's free plan caps request bodies at 100 MB
const TYPES = { mp4: 'video/mp4', m4v: 'video/mp4', mov: 'video/quicktime', webm: 'video/webm', ogv: 'video/ogg' }

const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })

function uidFromToken(token) {
  try {
    const part = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(part)).user_id || ''
  } catch {
    return ''
  }
}

async function isAdmin(request, env) {
  const token = (request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '')
  const uid = token && uidFromToken(token)
  if (!uid || !/^[\w-]{1,128}$/.test(uid)) return false
  const url = `https://firestore.googleapis.com/v1/projects/${env.FIREBASE_PROJECT_ID}/databases/(default)/documents/admins/${uid}`
  let res
  try {
    res = await fetch(url, { headers: { authorization: `Bearer ${token}` } })
  } catch {
    return false
  }
  if (!res.ok) return false
  const doc = await res.json()
  return doc?.fields?.ok?.booleanValue === true
}

async function upload(request, env) {
  if (!env.MEDIA) return json({ error: 'Video storage is not connected (R2 bucket missing).' }, 500)
  if (!(await isAdmin(request, env))) return json({ error: 'Only signed-in administrators can upload.' }, 401)
  const size = Number(request.headers.get('content-length') || 0)
  if (!size) return json({ error: 'Empty file.' }, 400)
  if (size > MAX_BYTES) return json({ error: 'That video is larger than 95 MB. Shorten or compress it, or upload it to YouTube and add the link.' }, 413)
  const name = new URL(request.url).searchParams.get('name') || 'video.mp4'
  const ext = (name.split('.').pop() || '').toLowerCase()
  const type = TYPES[ext]
  if (!type) return json({ error: 'Please upload an MP4, MOV or WebM video.' }, 415)
  const key = `videos/${Date.now().toString(36)}-${crypto.randomUUID().slice(0, 8)}.${ext}`
  await env.MEDIA.put(key, request.body, { httpMetadata: { contentType: type, cacheControl: 'public, max-age=31536000, immutable' } })
  return json({ url: `/media/${key}` })
}

async function serve(request, env, key) {
  if (!env.MEDIA) return new Response('Not found', { status: 404 })
  const range = request.headers.get('range')
  const obj = await env.MEDIA.get(key, range ? { range: request.headers } : {})
  if (!obj) return new Response('Not found', { status: 404 })
  const headers = new Headers()
  obj.writeHttpMetadata(headers)
  headers.set('etag', obj.httpEtag)
  headers.set('accept-ranges', 'bytes')
  if (range && obj.range) {
    const { offset = 0, length = obj.size - offset } = obj.range
    headers.set('content-range', `bytes ${offset}-${offset + length - 1}/${obj.size}`)
    headers.set('content-length', String(length))
    return new Response(obj.body, { status: 206, headers })
  }
  headers.set('content-length', String(obj.size))
  return new Response(obj.body, { headers })
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    if (url.pathname === '/api/upload') {
      if (request.method !== 'POST') return json({ error: 'Use POST.' }, 405)
      return upload(request, env)
    }
    if (url.pathname.startsWith('/media/') && (request.method === 'GET' || request.method === 'HEAD')) {
      return serve(request, env, decodeURIComponent(url.pathname.slice('/media/'.length)))
    }
    return env.ASSETS.fetch(request)
  },
}
