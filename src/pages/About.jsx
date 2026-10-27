import { Link } from 'react-router-dom'
import PageHead from '../components/PageHead.jsx'
import Portrait from '../components/Portrait.jsx'
import { Reveal } from '../components/Reveal.jsx'
import { useContent } from '../lib/useContent.js'

export default function About() {
  const { profile } = useContent()
  return (
    <>
      <PageHead eyebrow="About" title={<>The <em>person</em> behind the portfolio</>} lead={`${profile.fullName}, ${profile.role}, ${profile.department}.`} />

      <section className="wrap section-tight">
        <div className="split">
          <Reveal variant="left"><Portrait badge /></Reveal>
          <Reveal variant="right" className="prose">
            {profile.bio.map((p, i) => <p key={i}>{p}</p>)}
            {profile.outside && <p>{profile.outside}</p>}
          </Reveal>
        </div>
      </section>

      <section className="wrap section-tight">
        <Reveal className="glance">
          <div><small>Role</small><b>{profile.role}</b></div>
          <div><small>Department</small><b>{profile.department}</b></div>
          <div><small>Ministry</small><b>{profile.ministry}</b></div>
          {profile.sworn && <div><small>Appointed</small><b>{profile.sworn.replace('Sworn in as Principal Secretary on ', '')}</b></div>}
        </Reveal>
      </section>

      <section className="wrap section">
        <Reveal><span className="chip-label">Career</span><h2 className="title" style={{ marginBottom: 32 }}>Positions <em>held</em></h2></Reveal>
        <div className="steps">
          {profile.positions.map((t, i) => (
            <Reveal key={t.title} className="step" delay={i * 80} variant="left">
              <div>
                {t.when && <span className="when">{t.when}</span>}
                <h3>{t.title}</h3>
                {t.detail && <p>{t.detail}</p>}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="wrap section-tight">
        <Reveal><span className="chip-label">Education</span><h2 className="title" style={{ marginBottom: 28 }}>Qualifications</h2></Reveal>
        <div className="grid grid-3">
          {profile.education.map((e, i) => (
            <Reveal key={e.title} className="card" delay={i * 90}>
              {e.when && <span className="num">{e.when}</span>}
              <h3>{e.title}</h3>
              {e.detail && <p>{e.detail}</p>}
            </Reveal>
          ))}
        </div>
        {profile.membership && <p className="note" style={{ marginTop: 22 }}>{profile.membership}</p>}
      </section>

      <section className="wrap section">
        <Reveal variant="scale" className="cta">
          <div><h2>See what the Department is delivering</h2><p>Priorities, initiatives and the vision behind them.</p></div>
          <Link to="/mandate" className="btn btn-gold">The mandate <span className="arr">→</span></Link>
        </Reveal>
      </section>
    </>
  )
}
