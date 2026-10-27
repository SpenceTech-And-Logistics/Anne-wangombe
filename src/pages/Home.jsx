import { Link } from 'react-router-dom'
import { CountUp, Reveal } from '../components/Reveal.jsx'
import Marquee from '../components/Marquee.jsx'
import Portrait from '../components/Portrait.jsx'
import { formatDate } from '../lib/media.js'
import { useContent } from '../lib/useContent.js'

export default function Home() {
  const { profile, mandate, contact, press, projects, awards } = useContent()
  const top = awards[0]

  return (
    <>
      <section className="hero">
        <div className="blob b1" aria-hidden="true" /><div className="blob b2" aria-hidden="true" /><div className="blob b3" aria-hidden="true" />
        <div className="wrap hero-in">
          <div>
            <span className="chip-label rise" style={{ '--d': '0ms' }}>{profile.role}</span>
            <h1 className="rise" style={{ '--d': '120ms' }}>
              {profile.firstName}
              <br />
              <span className="ul">{profile.lastName}</span>
            </h1>
            <p className="lead rise" style={{ '--d': '260ms' }}>{profile.intro}</p>
            <div className="hero-actions rise" style={{ '--d': '380ms' }}>
              <Link to="/mandate" className="btn btn-solid">Our mandate <span className="arr">→</span></Link>
              <Link to="/about" className="btn btn-ghost">About the PS</Link>
              {contact.helpline && <span className="help-pill"><i /> GBV helpline <b>{contact.helpline}</b></span>}
            </div>
          </div>
          <div className="rise" style={{ '--d': '300ms', position: 'relative' }}>
            <Portrait eager badge />
            {top && (
              <div className="float-card">
                <b>{top.year}</b>
                <span>{top.title}, {top.body?.split(',')[0]}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      <Marquee items={profile.interests} />

      <section className="wrap section-tight" aria-label="Key figures">
        <div className="stats">
          {profile.stats.map((s, i) => (
            <Reveal key={s.label} className="stat" delay={i * 110}>
              <b><CountUp to={Number(s.value) || 0} />{s.suffix}</b>
              <span>{s.label}</span>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="wrap section">
        <Reveal className="section-head">
          <div><span className="chip-label">Mandate</span><h2 className="title">Five priorities, <em>one</em> promise</h2></div>
          <Link to="/mandate" className="link-arrow">The full mandate <span>→</span></Link>
        </Reveal>
        <div className="pri">
          {mandate.priorities.map((p, i) => (
            <Reveal key={p.title} className="pri-card" delay={i * 90}>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="wrap section-tight">
        <Reveal variant="scale" className="quote-band">
          <div className="blob b1" aria-hidden="true" />
          <blockquote>
            <p>{mandate.vision}</p>
            <cite>{mandate.visionSource}</cite>
          </blockquote>
        </Reveal>
      </section>

      <section className="wrap section">
        <Reveal className="section-head">
          <div><span className="chip-label">Initiatives</span><h2 className="title">What the Department is <em>doing</em></h2></div>
        </Reveal>
        <div className="snap" tabIndex={0} aria-label="Initiatives, scroll sideways">
          {mandate.initiatives.map((n) => (
            <div className="init" key={n.title}>
              <span className="tag">{n.tag}</span>
              <h3>{n.title}</h3>
              <p>{n.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap section-tight">
        <div className="split">
          <Reveal variant="left"><Portrait parallax={false} /></Reveal>
          <Reveal variant="right" className="prose">
            <span className="chip-label">About</span>
            <h2 className="title" style={{ margin: '14px 0 20px' }}>From the classroom to the <em>Cabinet table</em></h2>
            <p>{profile.bio[0]}</p>
            <p style={{ marginBottom: 26 }}>{profile.bio[1]}</p>
            <Link to="/about" className="btn btn-solid">Read the full profile <span className="arr">→</span></Link>
          </Reveal>
        </div>
      </section>

      {projects.length > 0 && (
        <section className="wrap section">
          <Reveal className="section-head">
            <div><span className="chip-label">Projects</span><h2 className="title">On the ground</h2></div>
            <Link to="/projects" className="link-arrow">All projects <span>→</span></Link>
          </Reveal>
          <div className="grid grid-3">
            {projects.slice(0, 3).map((p, i) => (
              <Reveal key={p.id} delay={i * 100}>
                <Link to={`/projects/${p.id}`} className="card card-link">
                  <div className="card-img">{p.photos?.[0] ? <img src={p.photos[0]} alt={p.title} loading="lazy" /> : <div className="img-fallback">{p.category?.[0]}</div>}</div>
                  <div className="card-body"><span className="tag">{p.category}</span><h3>{p.title}</h3><span className="meta">{[p.county, p.year].filter(Boolean).join(' · ')}</span></div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <section className="wrap section">
        <Reveal className="section-head">
          <div><span className="chip-label">News</span><h2 className="title">In the <em>headlines</em></h2></div>
          <Link to="/news" className="link-arrow">News and events <span>→</span></Link>
        </Reveal>
        <div className="grid grid-3">
          {press.slice(0, 3).map((n, i) => (
            <Reveal key={n.id} className="card" delay={i * 100}>
              <span className="tag">{n.category || 'News'}</span>
              <h3>{n.title}</h3>
              <span className="meta">{[n.outlet, formatDate(n.date)].filter(Boolean).join(' · ')}</span>
              {n.url && <a href={n.url} target="_blank" rel="noreferrer" className="link-arrow">Read <span>→</span></a>}
            </Reveal>
          ))}
        </div>
      </section>

      <section className="wrap">
        <Reveal variant="scale" className="cta">
          <div><h2>Write to the office of the Principal Secretary</h2><p>Partnerships, invitations, media requests or concerns about gender equality in your community.</p></div>
          <Link to="/contact" className="btn btn-gold">Get in touch <span className="arr">→</span></Link>
        </Reveal>
      </section>
    </>
  )
}
