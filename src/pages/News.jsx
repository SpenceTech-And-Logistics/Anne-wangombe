import { useState } from 'react'
import PageHead from '../components/PageHead.jsx'
import { Reveal } from '../components/Reveal.jsx'
import { formatDate } from '../lib/media.js'
import { useContent } from '../lib/useContent.js'

export default function News() {
  const { press, events } = useContent()
  const [cat, setCat] = useState('All')
  const cats = ['All', ...new Set(press.map((n) => n.category).filter(Boolean))]
  const shown = cat === 'All' ? press : press.filter((n) => n.category === cat)
  const meta = (n) => [n.outlet, formatDate(n.date)].filter(Boolean).join(' · ')

  return (
    <>
      <PageHead eyebrow="News and events" title={<>The Principal Secretary <em>in the news</em></>} />
      <section className="wrap section-tight">
        {cats.length > 2 && (
          <div className="chips" role="group" aria-label="Filter news" style={{ marginBottom: 28 }}>
            {cats.map((c) => <button key={c} type="button" className="chip" aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>)}
          </div>
        )}
        <div className="grid grid-2">
          {shown.map((n, i) => (
            <Reveal key={n.id} className="card card-link" delay={(i % 2) * 100}>
              {n.image && <div className="card-img"><img src={n.image} alt="" loading="lazy" /></div>}
              <div className="card-body">
                <span className="tag">{n.category || 'News'}</span>
                <h3>{n.title}</h3>
                {n.summary && <p>{n.summary}</p>}
                <span className="meta">{meta(n)}</span>
                {n.url && <a href={n.url} target="_blank" rel="noreferrer" className="link-arrow">Read the article <span>→</span></a>}
              </div>
            </Reveal>
          ))}
        </div>
        <p className="note">Each item links to the original article. Stories are added from the dashboard.</p>
      </section>

      <section className="wrap section">
        <Reveal><span className="chip-label">Events</span><h2 className="title" style={{ marginBottom: 20 }}>Where she has <em>spoken</em></h2></Reveal>
        <div>
          {events.map((e) => {
            const d = e.date ? new Date(e.date) : null
            const ok = d && !Number.isNaN(d.getTime())
            return (
              <Reveal className="event" key={e.id}>
                <div className="date-tile" aria-hidden="true">
                  {ok ? <><b>{d.getDate()}</b><span>{d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</span></> : <b>✺</b>}
                </div>
                <div>
                  <span className="meta">{[ok ? formatDate(e.date) : '', e.venue].filter(Boolean).join(' · ')}</span>
                  <h3>{e.title}</h3>
                  {e.description && <p>{e.description}</p>}
                  {e.photo && <img src={e.photo} alt="" loading="lazy" style={{ borderRadius: 18, marginTop: 14, maxHeight: 260, objectFit: 'cover' }} />}
                  {e.url && <p style={{ marginTop: 12 }}><a href={e.url} target="_blank" rel="noreferrer" className="link-arrow">More <span>→</span></a></p>}
                </div>
              </Reveal>
            )
          })}
        </div>
      </section>
    </>
  )
}
