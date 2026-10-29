import { useRef } from 'react'
import { useScroll } from '../lib/hooks.js'
import { useContent } from '../lib/useContent.js'

// Drop portrait.jpg (top of the home page), home-about.jpg (About section of the home page) and about.jpg (About page)
// into src/assets/images and they are used automatically.
// Each also accepts .png / .webp. Photos uploaded from the dashboard take priority.
const first = (files) => Object.values(files)[0] || ''
const bundled = {
  home: first(import.meta.glob('../assets/images/portrait.*', { eager: true, query: '?url', import: 'default' })),
  homeAbout: first(import.meta.glob('../assets/images/home-about.*', { eager: true, query: '?url', import: 'default' })),
  about: first(import.meta.glob('../assets/images/about.*', { eager: true, query: '?url', import: 'default' })),
}

export default function Portrait({ className = '', parallax = true, eager = false, badge = false, variant = 'home' }) {
  const { profile } = useContent()
  const ref = useRef(null)
  // Each photo falls back to the next one, so nothing goes blank: home-about -> about -> portrait.
  const home = profile.photo || bundled.home
  const about = profile.aboutPhoto || bundled.about || home
  const src = { home, about, homeAbout: profile.homeAboutPhoto || bundled.homeAbout || about }[variant] || home

  useScroll((y) => {
    if (!parallax || !ref.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    ref.current.style.setProperty('--py', `${Math.min(y, 900) * -0.07}px`)
  })

  return (
    <div className={`portrait ${className}`} ref={ref}>
      <div className="arch-back" aria-hidden="true" />
      <div className="arch">
        {src ? (
          <img src={src} alt={`Portrait of ${profile.name}`} loading={eager ? 'eager' : 'lazy'} />
        ) : (
          <div className="arch-mono" role="img" aria-label={`Monogram of ${profile.name}`}>
            <span>AW</span>
          </div>
        )}
      </div>
      {badge && (
        <svg className="spin-badge" viewBox="0 0 200 200" aria-hidden="true">
          <defs><path id="circ" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" /></defs>
          <circle cx="100" cy="100" r="98" fill="#f4b23e" />
          <text><textPath href="#circ" startOffset="0">Gender equality · Affirmative action · Women&apos;s empowerment · </textPath></text>
          <text x="100" y="116" textAnchor="middle" className="spin-mid">PS</text>
        </svg>
      )}
    </div>
  )
}
