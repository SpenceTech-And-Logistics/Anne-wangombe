import { useEffect, useState } from 'react'
import { getDb } from '../../lib/firebase.js'
import { cleanTheme, DEFAULT_THEME, PRESETS, rememberTheme, THEME_KEYS } from '../../lib/theme.js'
import { useContent } from '../../lib/useContent.js'

// Relative brightness 0 (black) to 1 (white), for gentle warnings about hard-to-read choices.
function lum(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05) }
const same = (a, b) => THEME_KEYS.every(({ key }) => a[key] === b[key])

function Preview({ c }) {
  return (
    <div className="th-prev" style={{ background: c.blush, color: c.plum }}>
      <div className="th-bar" style={{ background: '#fff', borderColor: `color-mix(in srgb, ${c.plum} 10%, ${c.blush})` }}>
        <span className="th-seal" style={{ background: c.plum, color: c.gold }}>AW</span>
        <b>Anne Wang&apos;ombe</b>
        <span className="th-pill" style={{ background: c.coral }}>Contact</span>
      </div>
      <small style={{ color: c.berry }}>— Principal Secretary</small>
      <div className="th-name">Anne <em style={{ color: c.berry, boxShadow: `inset 0 -0.18em 0 ${c.gold}` }}>Wang&apos;ombe</em></div>
      <div className="th-row">
        <span className="th-btn" style={{ background: c.plum }}>Read her story →</span>
        <span className="th-help" style={{ borderColor: c.coral, color: c.coral }}>GBV helpline 1195</span>
      </div>
      <div className="th-foot" style={{ background: c.plum }}>
        <span style={{ color: c.gold }}>30+</span>
        <span style={{ color: `color-mix(in srgb, ${c.plum} 14%, #fff)` }}>Footer and dark panels</span>
      </div>
    </div>
  )
}

/** Dashboard screen for the site colour scheme (Firestore: site/theme). */
export default function ThemeEditor() {
  const { refresh } = useContent()
  const [saved, setSaved] = useState(null)
  const [c, setC] = useState(null)
  const [msg, setMsg] = useState(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let alive = true
    ;(async () => {
      const { fs, db } = await getDb()
      let t = DEFAULT_THEME
      try {
        const snap = await fs.getDoc(fs.doc(db, 'site', 'theme'))
        if (snap.exists()) t = cleanTheme(snap.data())
      } catch (e) {
        if (alive) setMsg({ bad: true, text: `Could not load: ${e.message}` })
      }
      if (alive) {
        setSaved(t)
        setC(t)
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  async function save(next = c) {
    setBusy(true)
    setMsg(null)
    try {
      const { fs, db } = await getDb()
      const clean = cleanTheme(next)
      await fs.setDoc(fs.doc(db, 'site', 'theme'), clean)
      rememberTheme(clean)
      setSaved(clean)
      setC(clean)
      refresh()
      setMsg({ text: 'Saved. The public site now uses these colours (visitors see them on their next page load).' })
    } catch (ex) {
      setMsg({ bad: true, text: ex.message })
    }
    setBusy(false)
  }

  if (!c) return <><div className="adm-top"><div><h1>Colours</h1></div></div><p>Loading…</p></>

  const warn = []
  if (lum(c.blush) < 0.75) warn.push('The background is quite dark; text may be hard to read. Choose a very light colour.')
  if (contrast(c.plum, c.blush) < 7) warn.push('The main colour is close to the background. A darker main colour keeps headings and buttons readable.')
  if (contrast(c.berry, c.blush) < 3) warn.push('The accent is too light against the background for headings and links.')

  return (
    <>
      <div className="adm-top">
        <div><h1>Colours</h1><p>Pick a ready-made scheme or set your own five colours. Every other shade on the site is worked out from these.</p></div>
        <div className="adm-actions"><a className="adm-btn ghost" href="/" target="_blank" rel="noreferrer">View site ↗</a></div>
      </div>

      <div className="adm-panel">
        <h2>Ready-made schemes</h2>
        <div className="th-presets">
          {PRESETS.map((p) => (
            <button key={p.name} type="button" className={`th-preset ${same(p.colors, c) ? 'on' : ''}`} onClick={() => setC(p.colors)} aria-pressed={same(p.colors, c)}>
              <span className="th-sw">{THEME_KEYS.map(({ key }) => <i key={key} style={{ background: p.colors[key] }} />)}</span>
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="adm-panel">
        <h2>Your colours</h2>
        <div className="th-grid">
          <div className="th-pickers">
            {THEME_KEYS.map(({ key, label, hint }) => (
              <label key={key} className="th-pick">
                <input type="color" value={cleanTheme(c)[key]} onChange={(e) => setC({ ...c, [key]: e.target.value })} />
                <span><b>{label}</b><small>{hint}</small></span>
                <input type="text" value={c[key]} maxLength={7} spellCheck={false} aria-label={`${label} hex code`}
                  onChange={(e) => { const v = e.target.value.trim(); setC({ ...c, [key]: v.startsWith('#') ? v : `#${v}` }) }}
                  onBlur={() => setC(cleanTheme({ ...saved, ...c }))} />
              </label>
            ))}
          </div>
          <div>
            <p className="th-label">Preview</p>
            <Preview c={cleanTheme(c)} />
          </div>
        </div>
        {warn.map((w) => <p key={w} className="adm-alert">{w}</p>)}
        {msg && <p className={msg.bad ? 'adm-alert' : 'adm-ok'} role="status">{msg.text}</p>}
        <div className="adm-actions">
          <button type="button" className="adm-btn" disabled={busy || same(cleanTheme(c), saved)} onClick={() => save()}>{busy ? 'Saving…' : 'Save colours'}</button>
          {!same(cleanTheme(c), saved) && <button type="button" className="adm-btn ghost" onClick={() => setC(saved)}>Undo changes</button>}
          {!same(saved, DEFAULT_THEME) && <button type="button" className="adm-link" onClick={() => save(DEFAULT_THEME)} disabled={busy}>Reset to the original plum and coral</button>}
        </div>
      </div>
    </>
  )
}
