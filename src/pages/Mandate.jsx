import PageHead from '../components/PageHead.jsx'
import { Reveal } from '../components/Reveal.jsx'
import { useContent } from '../lib/useContent.js'

export default function Mandate() {
  const { mandate: m, contact } = useContent()
  return (
    <>
      <PageHead eyebrow="Mandate" title={<>A fair and just society, <em>for every Kenyan</em></>} lead={m.mission} />

      <section className="wrap section-tight">
        <div className="pri">
          {m.priorities.map((p, i) => (
            <Reveal key={p.title} className="pri-card" delay={i * 90}>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="wrap section">
        <Reveal><span className="chip-label">Initiatives</span><h2 className="title" style={{ marginBottom: 28 }}>Programmes in <em>action</em></h2></Reveal>
        <div className="grid grid-3">
          {m.initiatives.map((n, i) => (
            <Reveal key={n.title} className="init" delay={i * 90}>
              <span className="tag">{n.tag}</span>
              <h3>{n.title}</h3>
              <p>{n.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {contact.helpline && (
        <section className="wrap section-tight">
          <Reveal variant="scale" className="cta">
            <div><h2>Experiencing or witnessing violence?</h2><p>Call the GBV helpline, which documents cases and refers survivors to help.</p></div>
            <div className="help-pill" style={{ background: '#fff', color: 'var(--ink)' }}><i /> <b style={{ fontSize: 38 }}>{contact.helpline}</b></div>
          </Reveal>
        </section>
      )}

      <section className="wrap section-tight">
        <Reveal className="quote-band">
          <blockquote><p>{m.vision}</p><cite>{m.visionSource}</cite></blockquote>
        </Reveal>
        {m.approach && <p className="prose" style={{ marginTop: 28, maxWidth: 780 }}><span style={{ fontSize: 18, lineHeight: 1.75 }}>{m.approach}</span></p>}
        {m.source && <p className="note">{m.source}</p>}
      </section>
    </>
  )
}
