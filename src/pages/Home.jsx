import { Link } from 'react-router-dom'
import { CountUp, Reveal } from '../components/Reveal.jsx'
import Marquee from '../components/Marquee.jsx'
import Portrait from '../components/Portrait.jsx'
import { formatDate, videoInfo } from '../lib/media.js'
import { useContent } from '../lib/useContent.js'

// Lets the dashboard text use **double asterisks** for bold.
const withBold = (text = '') => text.split(/\*\*(.+?)\*\*/g).map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : part))

const shortDept = (d = '') => d.replace(/^State Department for /i, '')

export default function Home() {
  const { profile, mandate, contact, press, projects, awards, gallery } = useContent()
  const top = awards[0]
  const facts = (profile.facts || []).filter((f) => f.label && f.value)
  const career = (profile.positions || []).slice(0, 4)
  const video = gallery.find((g) => g.type === 'video' && g.url)
  const vid = video ? videoInfo(video.url) : null

  return (
    <>
      {/* Hero: who she is first, then what she does */}
      <section className="hero hero-profile">
        <div className="blob b1" aria-hidden="true" /><div className="blob b2" aria-hidden="true" />
        <div className="wrap hero-in">
          <div>
            <p className="eyebrow rise" style={{ '--d': '0ms' }}>
              {[profile.role, shortDept(profile.department)].filter(Boolean).join(' · ')}
            </p>
            <h1 className="rise" style={{ '--d': '120ms' }}>
              {profile.firstName}
              <br />
              <span className="ul">{profile.lastName}</span>
            </h1>
            <p className="lead lead-serif rise" style={{ '--d': '260ms' }}>{withBold(profile.headline || profile.intro)}</p>
            <div className="hero-actions rise" style={{ '--d': '380ms' }}>
              <Link to="/about" className="btn btn-solid">Read her story <span className="arr">→</span></Link>
              <Link to="/projects" className="btn btn-ghost">See her work</Link>
            </div>
            {facts.length > 0 && (
              <dl className="facts rise" style={{ '--d': '480ms' }}>
                {facts.map((f) => (
                  <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>
                ))}
              </dl>
            )}
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

      <section className="wrap" aria-label="Key figures">
        <div className="stats stats-line">
          {profile.stats.map((s, i) => (
            <Reveal key={s.label} className="stat" delay={i * 110}>
              <b><CountUp to={Number(s.value) || 0} />{s.suffix}</b>
              <span>{s.label}</span>
            </Reveal>
          ))}
        </div>
      </section>

      <Marquee items={profile.interests} />

      {/* Her story */}
      <section className="wrap section">
        <div className="split">
          <Reveal variant="left"><Portrait parallax={false} variant="homeAbout" /></Reveal>
          <Reveal variant="right" className="prose">
            <p className="eyebrow">Her story</p>
            <h2 className="title" style={{ margin: '10px 0 20px' }}>From the classroom to the <em>Cabinet table</em></h2>
            <p>{profile.bio[0]}</p>
            <p style={{ marginBottom: 26 }}>{profile.bio[1]}</p>
            <Link to="/about" className="btn btn-solid">Read the full profile <span className="arr">→</span></Link>
          </Reveal>
        </div>
      </section>

      {/* Career path */}
      {career.length > 0 && (
        <section className="tint section">
          <div className="wrap path-wrap">
            <Reveal className="path-intro">
              <p className="eyebrow">Career</p>
              <h2 className="title">A path built on <em>people</em></h2>
              <p className="muted">Three decades in human resources and education, across schools, universities, research and public finance, before taking up public office.</p>
              <Link to="/about" className="link-arrow">Positions and education <span>→</span></Link>
            </Reveal>
            <ol className="path">
              {career.map((c, i) => (
                <Reveal as="li" key={c.title} delay={i * 90} className={i === 0 ? 'is-now' : ''}>
                  <span className="when">{c.when || 'Earlier'}</span>
                  <h3>{c.title}</h3>
                  {c.detail && <p>{c.detail}</p>}
                </Reveal>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Her work */}
      {projects.length > 0 && (
        <section className="wrap section">
          <Reveal className="section-head">
            <div><p className="eyebrow">Her work</p><h2 className="title">On the <em>ground</em></h2></div>
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

      {/* Causes */}
      <section className="wrap section">
        <Reveal className="section-head">
          <div><p className="eyebrow">What she champions</p><h2 className="title">Five causes, <em>one</em> promise</h2></div>
          <Link to="/mandate" className="link-arrow">Her mandate <span>→</span></Link>
        </Reveal>
        <div className="pri">
          {mandate.priorities.map((p, i) => (
            <Reveal key={p.title} className="pri-card" delay={i * 90}>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </Reveal>
          ))}
        </div>
        {contact.helpline && (
          <Reveal className="help-line">
            <span className="help-pill"><i /> GBV helpline <b>{contact.helpline}</b></span>
            <span className="muted">Toll-free, any time of day. If you or someone you know is at risk, call.</span>
          </Reveal>
        )}
      </section>

      {/* Recognition */}
      {awards.length > 0 && (
        <section className="wrap section-tight">
          <Reveal className="section-head">
            <div><p className="eyebrow">Recognition</p><h2 className="title">Honours and <em>rankings</em></h2></div>
            <Link to="/awards" className="link-arrow">All awards <span>→</span></Link>
          </Reveal>
          <div className="honours">
            {awards.slice(0, 3).map((a, i) => (
              <Reveal key={a.id || a.title} className="honour" delay={i * 100}>
                <b>{a.year}</b>
                <div><h3>{a.title}</h3><span className="meta">{a.body}</span></div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Video, only when the gallery has one */}
      {video && (
        <section className="tint section">
          <div className="wrap">
            <Reveal className="section-head">
              <div><p className="eyebrow">Watch</p><h2 className="title">In her <em>own words</em></h2></div>
              <Link to="/gallery" className="link-arrow">All videos <span>→</span></Link>
            </Reveal>
            <Reveal variant="scale" className="video-feature">
              {vid.file ? (
                <video src={vid.file} poster={video.thumb || undefined} controls preload="metadata" playsInline />
              ) : vid.embed ? (
                <iframe src={vid.embed} title={video.title || 'Video'} loading="lazy" allow="accelerometer; encrypted-media; picture-in-picture" allowFullScreen />
              ) : (
                <a href={video.url} target="_blank" rel="noreferrer" className="video-link">
                  <span className="play" aria-hidden="true">▶</span>
                  <span>{video.title || 'Watch the video'}</span>
                </a>
              )}
            </Reveal>
            {video.title && (vid.embed || vid.file) && <p className="video-cap">{video.title}</p>}
          </div>
        </section>
      )}

      {/* News */}
      <section className="wrap section">
        <Reveal className="section-head">
          <div><p className="eyebrow">In the news</p><h2 className="title">Latest <em>headlines</em></h2></div>
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
          <div><h2>Media, partnership and speaking invitations are welcome.</h2><p>Write to her office and a member of the team will respond.</p></div>
          <Link to="/contact" className="btn btn-gold">Contact the office <span className="arr">→</span></Link>
        </Reveal>
      </section>
    </>
  )
}
