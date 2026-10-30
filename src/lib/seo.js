// Keeps the tab title, description, canonical link and share tags right as visitors move between pages.
// The build step (seo-plugin.js) writes the same tags into each page's HTML for search engines.
import { OG_IMAGE, SITE_URL } from '../data/seo.js'

function tag(selector, make) {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = make()
    document.head.appendChild(el)
  }
  return el
}
function setMeta(attr, name, content) {
  const el = tag(`meta[${attr}="${name}"]`, () => {
    const m = document.createElement('meta')
    m.setAttribute(attr, name)
    return m
  })
  el.setAttribute('content', content)
}

export function applySeo({ title, description, path, noindex = false }) {
  document.title = title
  setMeta('name', 'description', description)
  setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow')
  setMeta('property', 'og:title', title)
  setMeta('property', 'og:description', description)
  setMeta('name', 'twitter:title', title)
  setMeta('name', 'twitter:description', description)
  if (SITE_URL) {
    const url = SITE_URL + (path === '/' ? '/' : path)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:image', SITE_URL + OG_IMAGE)
    tag('link[rel="canonical"]', () => Object.assign(document.createElement('link'), { rel: 'canonical' })).href = url
  }
}
