export default function Marquee({ items, reverse = false }) {
  if (!items?.length) return null
  const row = [...items, ...items]
  return (
    <div className={`marquee ${reverse ? 'rev' : ''}`} aria-label={items.join(', ')}>
      <div className="marquee-track" aria-hidden="true">
        {row.map((t, i) => (
          <span key={i}>{t}<i>✺</i></span>
        ))}
      </div>
    </div>
  )
}
