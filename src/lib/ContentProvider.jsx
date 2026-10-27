import { useCallback, useEffect, useMemo, useState } from 'react'
import { defaults } from '../data/content.js'
import { getDb } from './firebase.js'
import { ContentContext } from './useContent.js'

const nonEmpty = (v) => (Array.isArray(v) ? v.length > 0 : v !== undefined && v !== null && v !== '')

function merge(base, over) {
  if (!over) return base
  const out = { ...base }
  for (const k of Object.keys(over)) if (nonEmpty(over[k])) out[k] = over[k]
  return out
}

const byDateDesc = (a, b) => String(b.date || b.year || '').localeCompare(String(a.date || a.year || ''))

export function ContentProvider({ children }) {
  const [remote, setRemote] = useState(null)
  const [tick, setTick] = useState(0)
  const refresh = useCallback(() => setTick((n) => n + 1), [])

  useEffect(() => {
    let alive = true
    ;(async () => {
      const kit = await getDb()
      if (!kit) return
      const { fs, db } = kit
      try {
        const [site, projects, awards, press, events, gallery] = await Promise.all(
          ['site', 'projects', 'awards', 'press', 'events', 'gallery'].map((c) => fs.getDocs(fs.collection(db, c))),
        )
        const list = (snap) => snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        const docs = Object.fromEntries(site.docs.map((d) => [d.id, d.data()]))
        if (alive) setRemote({ docs, projects: list(projects), awards: list(awards), press: list(press), events: list(events), gallery: list(gallery) })
      } catch (err) {
        console.warn('Could not load content from Firebase; showing built-in content.', err)
      }
    })()
    return () => {
      alive = false
    }
  }, [tick])

  const value = useMemo(() => {
    const r = remote
    const published = (items) => items.filter((i) => i.status !== 'draft')
    const projects = r && r.projects.length ? published(r.projects).sort(byDateDesc) : defaults.projects
    const awards = r && r.awards.length ? published(r.awards).sort(byDateDesc) : defaults.awards
    const press = r && r.press.length ? published(r.press).sort(byDateDesc) : defaults.press
    const events = r && r.events.length ? published(r.events).sort(byDateDesc) : defaults.events
    const gallery = r && r.gallery.length ? published(r.gallery) : defaults.gallery
    return {
      profile: merge(defaults.profile, r?.docs.profile),
      mandate: merge(defaults.mandate, r?.docs.mandate),
      contact: merge(defaults.contact, r?.docs.contact),
      projects,
      awards,
      press,
      events,
      gallery,
      live: Boolean(r),
      refresh,
    }
  }, [remote, refresh])

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}
