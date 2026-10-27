import Empty from '../components/Empty.jsx'
import PageHead from '../components/PageHead.jsx'
import { Reveal } from '../components/Reveal.jsx'
import { useContent } from '../lib/useContent.js'

export default function Awards() {
  const { awards } = useContent()
  return (
    <>
      <PageHead eyebrow="Awards" title={<>Recognition for <em>public service</em></>} lead="Honours and rankings awarded to the Principal Secretary and the work of her State Department." />
      <section className="wrap section-tight">
        {awards.length === 0 ? (
          <Empty title="Awards will appear here" text="Recognition received by the Principal Secretary will be listed as it is published." />
        ) : (
          <div className="steps" style={{ gap: 22 }}>
            {awards.map((a, i) => (
              <Reveal key={a.id} className="award" delay={i * 90}>
                <div className="award-medal" aria-hidden="true">{a.year ? String(a.year).slice(-2) : '★'}</div>
                <div>
                  <span className="tag">{[a.year, a.body].filter(Boolean).join(' · ')}</span>
                  <h3>{a.title}</h3>
                  {a.description && <p>{a.description}</p>}
                  {a.photo && <img src={a.photo} alt={a.title} loading="lazy" />}
                  {a.url && <p style={{ marginTop: 16 }}><a href={a.url} target="_blank" rel="noreferrer" className="link-arrow">Read the report <span>→</span></a></p>}
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
