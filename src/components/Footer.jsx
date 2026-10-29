import { Link } from 'react-router-dom'
import { useContent } from '../lib/useContent.js'
import SocialIcons from './SocialIcons.jsx'

export default function Footer() {
  const { contact } = useContent()
  return (
    <footer className="foot">
      <svg className="foot-wave" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 40 C 240 100 480 -20 720 30 C 960 80 1200 -10 1440 40 V80 H0 Z" />
      </svg>
      <div className="wrap foot-top">
        <div>
          <div className="brand brand-light"><span className="seal">AW</span><span className="brand-name">Anne Wang&apos;ombe</span></div>
          <p className="foot-blurb">Principal Secretary, {contact.department}.</p>
          {contact.helpline && <p className="foot-help">GBV helpline <b>{contact.helpline}</b></p>}
          <SocialIcons links={contact.social} tone="dark" className="foot-social" />
        </div>
        <nav className="foot-links" aria-label="Footer">
          <Link to="/about">About</Link>
          <Link to="/mandate">Mandate</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/awards">Awards</Link>
          <Link to="/news">News and events</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/contact">Contact</Link>
        </nav>
        <div className="foot-contact">
          {contact.office && <span>{contact.office}</span>}
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>{contact.phone}</span>}
          {contact.links?.map((l) => <a key={l.url} href={l.url} target="_blank" rel="noreferrer">{l.label} ↗</a>)}
        </div>
      </div>
      <div className="foot-bar">
        <div className="wrap foot-bar-in">
          <span>© PS Anne Wang&apos;ombe, State Department for Gender and Affirmative Action</span>
          <span>Built by SpenceTec and Logistics Limited</span>
        </div>
      </div>
    </footer>
  )
}
