// Site colour scheme. The five colours drive every other shade (see :root in global.css).
// Saved from the dashboard to Firestore (site/theme) and remembered in the browser so return visits
// open in the right colours straight away.

export const THEME_KEYS = [
  { key: 'plum', label: 'Main colour', hint: 'Menu, buttons, footer and dark panels' },
  { key: 'berry', label: 'Accent', hint: 'Italic headings, links and labels' },
  { key: 'coral', label: 'Highlight', hint: 'Contact button, small lines and the helpline' },
  { key: 'gold', label: 'Gold', hint: 'Underline, badge, numbers on dark' },
  { key: 'blush', label: 'Background', hint: 'Page background (keep it light)' },
]

export const PRESETS = [
  { name: 'Plum and coral', colors: { plum: '#34163a', berry: '#9b2e6b', coral: '#e8604c', gold: '#f4b23e', blush: '#fff4ec' } },
  { name: 'Kenyan green', colors: { plum: '#10301f', berry: '#1c7c45', coral: '#c8102e', gold: '#e6b23a', blush: '#f6f5ef' } },
  { name: 'Navy and teal', colors: { plum: '#0d1f33', berry: '#1f6f78', coral: '#e07a5f', gold: '#e9b44c', blush: '#f3f1ec' } },
  { name: 'Royal blue', colors: { plum: '#1b2559', berry: '#3446b8', coral: '#e85d75', gold: '#f2c14e', blush: '#f5f6fb' } },
  { name: 'Forest and amber', colors: { plum: '#1f2e1a', berry: '#5b7a2a', coral: '#d9783a', gold: '#e8b442', blush: '#f7f4ea' } },
  { name: 'Wine and rose', colors: { plum: '#3a0f1d', berry: '#a3214a', coral: '#e2725b', gold: '#e9b949', blush: '#fbf3f1' } },
  { name: 'Charcoal and orange', colors: { plum: '#1e1e24', berry: '#4a4e69', coral: '#f26a1b', gold: '#f5b700', blush: '#f6f5f2' } },
]

export const DEFAULT_THEME = PRESETS[0].colors
const STORE = 'site-theme'
const HEX = /^#[0-9a-f]{6}$/i

export function cleanTheme(t) {
  const out = {}
  for (const { key } of THEME_KEYS) out[key] = HEX.test(t?.[key] || '') ? t[key].toLowerCase() : DEFAULT_THEME[key]
  return out
}

export function applyTheme(t) {
  const theme = cleanTheme(t)
  const root = document.documentElement
  for (const [k, v] of Object.entries(theme)) root.style.setProperty(`--${k}`, v)
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme.plum)
  return theme
}

/** Applies and remembers the theme for the next visit. */
export function rememberTheme(t) {
  const theme = applyTheme(t)
  try {
    localStorage.setItem(STORE, JSON.stringify(theme))
  } catch {
    /* private mode: fine */
  }
}
