import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useScroll } from '../lib/hooks.js'

const links = [
  ['/', 'Home'],
  ['/about', 'About'],
  ['/mandate', 'Mandate'],
  ['/projects', 'Projects'],
  ['/awards', 'Awards'],
  ['/news', 'News and events'],
  ['/gallery', 'Gallery'],
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useScroll((y) => setScrolled(y > 30))
  const close = () => setOpen(false)

  return (
    <header className={`bar ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <div className="bar-in">
        <Link to="/" className="brand" onClick={close} aria-label="PS Anne Wang'ombe, home">
          <span className="seal">AW</span>
          <span className="brand-name">Anne Wang&apos;ombe</span>
        </Link>
        <nav className="nav" id="main-nav" aria-label="Main">
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/'} onClick={close}>
              {label}
            </NavLink>
          ))}
          <NavLink to="/contact" className="nav-contact" onClick={close}>Contact</NavLink>
        </nav>
        <button type="button" className="burger" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="main-nav" onClick={() => setOpen((o) => !o)}>
          <span /><span /><span />
        </button>
      </div>
    </header>
  )
}
