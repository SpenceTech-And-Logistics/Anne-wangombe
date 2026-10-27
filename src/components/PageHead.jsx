export default function PageHead({ eyebrow, title, lead }) {
  return (
    <section className="page-head">
      <div className="blob b1" aria-hidden="true" /><div className="blob b2" aria-hidden="true" />
      <div className="wrap page-head-in">
        <span className="chip-label rise" style={{ '--d': '0ms' }}>{eyebrow}</span>
        <h1 className="rise" style={{ '--d': '90ms' }}>{title}</h1>
        {lead && <p className="lead rise" style={{ '--d': '180ms' }}>{lead}</p>}
      </div>
    </section>
  )
}
