import { useRef } from 'react'
import { useScroll } from '../lib/hooks.js'
import { useContent } from '../lib/useContent.js'

// Drop portrait.jpg (or .png / .webp) into src/assets/images and it is used automatically.
const files = import.meta.glob('../assets/images/portrait.*', { eager: true, query: '?url', import: 'default' })
const bundled = Object.values(files)[0] || ''

export default function Portrait({ className = '', parallax = true, eager = false, badge = false }) {
  const { profile } = useContent()
  const ref = useRef(null)
  const src = profile.photo || bundled

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
