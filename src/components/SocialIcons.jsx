// Social links shown as round icons. The platform is worked out from the link, so the dashboard needs no extra setting.

const ICONS = {
  facebook: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  instagram: (
    <>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5h.01" />
    </>
  ),
  x: (
    <>
      <path d="M4 4h4.5L20 20h-4.5z" />
      <path d="M4 20l6.6-6.6M13.4 10.6 20 4" />
    </>
  ),
  youtube: (
    <>
      <path d="M2.5 17a24 24 0 0 1 0-10 2 2 0 0 1 1.4-1.4 50 50 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24 24 0 0 1 0 10 2 2 0 0 1-1.4 1.4 50 50 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </>
  ),
  tiktok: <path d="M9 12a4 4 0 1 0 4 4V2c.6 2.6 2.4 4.4 5 5" />,
  linkedin: (
    <>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <path d="M2 9h4v12H2z" />
      <circle cx="4" cy="4" r="2" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M3 21l1.7-4.4a9 9 0 1 1 3.6 3z" />
      <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8a4 4 0 0 1-1.8-1.8l.8-1-1-2z" />
    </>
  ),
  web: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z" />
    </>
  ),
}

function platformOf(url = '') {
  const u = url.toLowerCase()
  if (/facebook\.com|fb\.com|fb\.watch/.test(u)) return 'facebook'
  if (/instagram\.com/.test(u)) return 'instagram'
  if (/(^|\/\/|\.)(x|twitter)\.com/.test(u)) return 'x'
  if (/youtube\.com|youtu\.be/.test(u)) return 'youtube'
  if (/tiktok\.com/.test(u)) return 'tiktok'
  if (/linkedin\.com/.test(u)) return 'linkedin'
  if (/wa\.me|whatsapp\.com/.test(u)) return 'whatsapp'
  return 'web'
}

const NAMES = { facebook: 'Facebook', instagram: 'Instagram', x: 'X', youtube: 'YouTube', tiktok: 'TikTok', linkedin: 'LinkedIn', whatsapp: 'WhatsApp', web: 'Website' }

function SocialIcon({ name, size = 20 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name] || ICONS.web}
    </svg>
  )
}

/** A row of round icon links. `tone="dark"` for use on the plum footer. */
export default function SocialIcons({ links = [], tone = 'light', className = '' }) {
  const items = links.filter((l) => l && l.url)
  if (!items.length) return null
  return (
    <ul className={`social social-${tone} ${className}`}>
      {items.map((l) => {
        const p = platformOf(l.url)
        const label = l.label || NAMES[p]
        return (
          <li key={l.url}>
            <a href={l.url} target="_blank" rel="noreferrer" aria-label={label} title={label}>
              <SocialIcon name={p} />
            </a>
          </li>
        )
      })}
    </ul>
  )
}
