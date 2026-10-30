import fs from 'node:fs'
import path from 'node:path'
import { siteConfig } from './site.config.js'
import { clip, HOME_DESC, jsonLd, OG_IMAGE, pageSeo, PAGES, SITE_NAME, SITE_URL } from './src/data/seo.js'

/*
  Runs after "npm run build". Search engines and link previews (WhatsApp, Facebook, X, LinkedIn)
  read a page's HTML before any JavaScript runs, so every public page gets its own HTML file with
  its own title, description, canonical link, share tags and structured data.

  Projects come from the live database (public read access, no keys needed), so each project gets
  its own page and sitemap entry. Projects added later appear in search after the next deploy.
  If the database cannot be reached, the build carries on without project pages.

  Also writes sitemap.xml and robots.txt, and marks /admin and the 404 page "noindex".
*/

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

async function fetchProjects() {
  const { projectId, apiKey } = siteConfig.firebase
  if (!projectId) return []
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/projects?pageSize=300&key=${apiKey}`
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    const str = (f, k) => f?.[k]?.stringValue ?? (f?.[k]?.integerValue !== undefined ? String(f[k].integerValue) : '')
    return (data.documents || [])
      .map((d) => ({ id: d.name.split('/').pop(), title: str(d.fields, 'title'), description: str(d.fields, 'description'), county: str(d.fields, 'county'), status: str(d.fields, 'status'), updated: d.updateTime }))
      .filter((p) => p.title && p.status !== 'draft')
  } catch (err) {
    console.warn(`[seo] Could not load projects for SEO pages (${err.message}). Building without them.`)
    return []
  }
}

function head(template, { title, description, url, noindex, type = 'website' }) {
  const image = SITE_URL ? SITE_URL + OG_IMAGE : ''
  const tags = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    `<meta name="robots" content="${noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'}" />`,
    url && !noindex && `<link rel="canonical" href="${url}" />`,
    `<meta property="og:site_name" content="${esc(SITE_NAME)}" />`,
    `<meta property="og:locale" content="en_KE" />`,
    `<meta property="og:type" content="${type}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    url && `<meta property="og:url" content="${url}" />`,
    image && `<meta property="og:image" content="${image}" />`,
    image && `<meta property="og:image:width" content="1200" />`,
    image && `<meta property="og:image:height" content="630" />`,
    image && `<meta property="og:image:alt" content="Anne Wang'ombe, Principal Secretary for Gender and Affirmative Action" />`,
    `<meta name="twitter:card" content="${image ? 'summary_large_image' : 'summary'}" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    image && `<meta name="twitter:image" content="${image}" />`,
    !noindex && `<script type="application/ld+json">${JSON.stringify(jsonLd()).replace(/</g, '\\u003c')}</script>`,
  ].filter(Boolean)
  // Drop the placeholder tags from index.html, then add this page's set.
  const cleaned = template
    .replace(/<title>[\s\S]*?<\/title>\s*/, '')
    .replace(/<meta (name="description"|property="og:[^"]+"|name="twitter:[^"]+"|name="robots")[^>]*>\s*/g, '')
    .replace(/<link rel="canonical"[^>]*>\s*/g, '')
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/g, '')
  return cleaned.replace('</head>', `    ${tags.join('\n    ')}\n  </head>`)
}

export default function seoPlugin() {
  let outDir = 'dist'
  return {
    name: 'anne-seo',
    apply: 'build',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
    },
    async closeBundle() {
      const template = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8')
      const projects = await fetchProjects()
      const today = new Date().toISOString().slice(0, 10)
      // "/about" -> about.html: Cloudflare serves it at /about with no redirect to /about/.
      const write = (route, html) => {
        const file = route === '/' ? path.join(outDir, 'index.html') : path.join(outDir, `${route.slice(1)}.html`)
        fs.mkdirSync(path.dirname(file), { recursive: true })
        fs.writeFileSync(file, html)
      }
      const urlOf = (route) => (SITE_URL ? SITE_URL + (route === '/' ? '/' : route) : '')

      const pages = [
        ...Object.keys(PAGES).map((route) => ({ route, ...pageSeo(route), lastmod: today })),
        ...projects.map((p) => ({ route: `/projects/${p.id}`, ...pageSeo(`/projects/${p.id}`, p), type: 'article', lastmod: (p.updated || today).slice(0, 10) })),
      ]
      for (const p of pages) write(p.route, head(template, { ...p, description: clip(p.description), url: urlOf(p.route) }))

      const hidden = { title: SITE_NAME, description: HOME_DESC, noindex: true }
      fs.writeFileSync(path.join(outDir, '404.html'), head(template, { ...hidden, title: `Page not found | ${SITE_NAME}` }))
      write('/admin', head(template, { ...hidden, title: `Dashboard | ${SITE_NAME}` }))

      const priority = (r) => (r === '/' ? '1.0' : r === '/about' ? '0.9' : r.startsWith('/projects/') ? '0.6' : '0.7')
      if (SITE_URL) {
        fs.writeFileSync(
          path.join(outDir, 'sitemap.xml'),
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
            .map((p) => `  <url><loc>${urlOf(p.route)}</loc><lastmod>${p.lastmod}</lastmod><priority>${priority(p.route)}</priority></url>`)
            .join('\n')}\n</urlset>\n`,
        )
      }
      fs.writeFileSync(path.join(outDir, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n${SITE_URL ? `\nSitemap: ${SITE_URL}/sitemap.xml\n` : ''}`)
      console.log(`[seo] Wrote ${pages.length} pages (${projects.length} projects)${SITE_URL ? ', sitemap.xml' : ' (no siteUrl set: no sitemap or canonical links)'} and robots.txt`)
    },
  }
}
