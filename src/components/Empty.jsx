import { Link } from 'react-router-dom'

export default function Empty({ title, text, cta }) {
  return (
    <div className="empty">
      <div className="empty-mark" aria-hidden="true">✺</div>
      <h3>{title}</h3>
      <p>{text}</p>
      {cta && <Link to={cta.to} className="btn btn-ghost">{cta.label}</Link>}
    </div>
  )
}
