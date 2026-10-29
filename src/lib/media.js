/** Resize an image file to a compact JPEG data URL (stored in Firestore, so no paid Storage is needed). */
export function resizeImage(file, maxSide = 1200, quality = 0.74) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) return reject(new Error('Please choose an image file.'))
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, maxSide / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', quality))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('That image could not be read.'))
    }
    img.src = url
  })
}

/** Work out how to show a video link: thumbnail and an embeddable address when one exists. */
export function videoInfo(link = '') {
  const url = link.trim()
  let m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/))([\w-]{11})/)
  if (m) return { kind: 'youtube', thumb: `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg`, embed: `https://www.youtube-nocookie.com/embed/${m[1]}?rel=0` }
  m = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/)
  if (m) return { kind: 'drive', thumb: '', embed: `https://drive.google.com/file/d/${m[1]}/preview` }
  if (/facebook\.com|fb\.watch/.test(url)) return { kind: 'facebook', thumb: '', embed: '' }
  if (/tiktok\.com/.test(url)) return { kind: 'tiktok', thumb: '', embed: '' }
  if (/^\/media\//.test(url) || /\.(mp4|m4v|mov|webm|ogv)(\?|$)/i.test(url)) return { kind: 'file', thumb: '', embed: '', file: url }
  return { kind: 'link', thumb: '', embed: '' }
}

export const formatDate = (d) => {
  if (!d) return ''
  const dt = new Date(d)
  return Number.isNaN(dt.getTime()) ? d : dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export const money = (n) => (n ? `KES ${Number(n).toLocaleString('en-KE')}` : '')

/* ---------- Uploaded videos (stored in Cloudflare R2 by worker/index.js) ---------- */

export const VIDEO_MAX_MB = 95
const isVideoFile = (f) => /^video\//.test(f.type) || /\.(mp4|m4v|mov|webm|ogv)$/i.test(f.name)
export { isVideoFile }

/** Uploads a video file with progress. Resolves to the playable address, e.g. "/media/videos/abc.mp4". */
export async function uploadVideo(file, onProgress = () => {}) {
  if (!isVideoFile(file)) throw new Error('Please choose an MP4, MOV or WebM video.')
  if (file.size > VIDEO_MAX_MB * 1024 * 1024) throw new Error(`"${file.name}" is over ${VIDEO_MAX_MB} MB. Shorten or compress it, or put it on YouTube and add the link instead.`)
  const { getAuthKit } = await import('./firebase.js')
  const kit = await getAuthKit()
  const token = await kit?.auth.currentUser?.getIdToken()
  if (!token) throw new Error('Please sign in again, then retry the upload.')
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `/api/upload?name=${encodeURIComponent(file.name)}`)
    xhr.setRequestHeader('authorization', `Bearer ${token}`)
    xhr.setRequestHeader('content-type', file.type || 'application/octet-stream')
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100))
    xhr.onload = () => {
      let body = {}
      try {
        body = JSON.parse(xhr.responseText)
      } catch {
        /* not JSON */
      }
      if (xhr.status >= 200 && xhr.status < 300 && body.url) resolve(body.url)
      else if (xhr.status === 404 || xhr.status === 405 || !body.error)
        reject(new Error('Video upload is only available on the deployed site (it needs the Cloudflare Worker), not on npm run dev.'))
      else reject(new Error(body.error))
    }
    xhr.onerror = () => reject(new Error('The upload failed. Check the connection and try again.'))
    xhr.send(file)
  })
}

/** Grabs a frame about a second in as a small JPEG, used as the video's cover picture. Resolves '' if it cannot. */
export function videoThumb(file, maxSide = 900) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const v = document.createElement('video')
    const done = (out) => {
      URL.revokeObjectURL(url)
      resolve(out)
    }
    v.muted = true
    v.playsInline = true
    v.preload = 'metadata'
    v.onloadedmetadata = () => {
      v.currentTime = Math.min(1, (v.duration || 2) / 2)
    }
    v.onseeked = () => {
      try {
        const scale = Math.min(1, maxSide / Math.max(v.videoWidth, v.videoHeight))
        const c = document.createElement('canvas')
        c.width = Math.round(v.videoWidth * scale)
        c.height = Math.round(v.videoHeight * scale)
        c.getContext('2d').drawImage(v, 0, 0, c.width, c.height)
        done(c.toDataURL('image/jpeg', 0.72))
      } catch {
        done('')
      }
    }
    v.onerror = () => done('')
    setTimeout(() => done(''), 15000)
    v.src = url
  })
}
