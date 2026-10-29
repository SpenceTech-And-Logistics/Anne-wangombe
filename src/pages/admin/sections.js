import { CATEGORIES, GALLERY_CATEGORIES, NEWS_CATEGORIES, defaults } from '../../data/content.js'

const status = { key: 'status', label: 'Status', type: 'select', options: [{ value: 'published', label: 'Published' }, { value: 'draft', label: 'Draft (hidden)' }] }
const badge = (it) => (it.status === 'draft' ? 'Draft' : 'Published')

export const profileFields = [
  { key: 'name', label: 'Name as shown' },
  { key: 'fullName', label: 'Full name' },
  { key: 'firstName', label: 'First name (home page heading)' },
  { key: 'lastName', label: 'Last name (home page heading)' },
  { key: 'role', label: 'Role' },
  { key: 'department', label: 'State Department' },
  { key: 'ministry', label: 'Ministry' },
  { key: 'sworn', label: 'Appointment line' },
  { key: 'headline', label: 'Home page introduction', type: 'textarea', wide: true, hint: 'The paragraph under her name. Wrap words in **double asterisks** to make them bold.' },
  { key: 'facts', label: 'Quick facts under the introduction', type: 'list', noun: 'fact', wide: true, fields: [{ key: 'label', label: 'Label (e.g. Current office)' }, { key: 'value', label: 'Value' }] },
  { key: 'bio', label: 'Biography paragraphs', type: 'strings', long: true, wide: true },
  { key: 'outside', label: 'Outside work', type: 'textarea', wide: true },
  { key: 'photo', label: 'Home page portrait', type: 'image', side: 1000, wide: true, hint: 'Shown at the top of the home page.' },
  { key: 'homeAboutPhoto', label: 'Home page About section photo', type: 'image', side: 1000, wide: true, hint: 'Shown beside "From the classroom to the Cabinet table" on the home page. Leave empty to reuse the About page photo.' },
  { key: 'aboutPhoto', label: 'About page photo', type: 'image', side: 1000, wide: true, hint: 'Shown on the About page. Leave empty to reuse the home page portrait.' },
  { key: 'interests', label: 'Words in the scrolling ticker', type: 'strings', wide: true },
  { key: 'stats', label: 'Key figures (home page)', type: 'list', noun: 'figure', wide: true, fields: [{ key: 'value', label: 'Number', type: 'number' }, { key: 'suffix', label: 'After the number (+, th)' }, { key: 'label', label: 'Label' }] },
  { key: 'positions', label: 'Positions held', type: 'list', noun: 'position', wide: true, fields: [{ key: 'when', label: 'Years or "Current"' }, { key: 'title', label: 'Position' }, { key: 'detail', label: 'Detail', type: 'textarea' }] },
  { key: 'education', label: 'Education', type: 'list', noun: 'qualification', wide: true, fields: [{ key: 'when', label: 'Years' }, { key: 'title', label: 'Qualification' }, { key: 'detail', label: 'Institution' }] },
  { key: 'membership', label: 'Memberships', type: 'textarea', wide: true },
]

export const mandateFields = [
  { key: 'mission', label: 'Mission', type: 'textarea', wide: true },
  { key: 'vision', label: 'Vision (quote band)', type: 'textarea', wide: true },
  { key: 'visionSource', label: 'Vision attributed to' },
  { key: 'priorities', label: 'Priorities', type: 'list', noun: 'priority', wide: true, fields: [{ key: 'title', label: 'Title' }, { key: 'text', label: 'Text', type: 'textarea' }] },
  { key: 'initiatives', label: 'Initiatives', type: 'list', noun: 'initiative', wide: true, fields: [{ key: 'title', label: 'Title' }, { key: 'tag', label: 'Small label' }, { key: 'text', label: 'Text', type: 'textarea' }] },
  { key: 'approach', label: 'Approach paragraph', type: 'textarea', wide: true },
  { key: 'source', label: 'Source note', wide: true },
]

export const contactFields = [
  { key: 'office', label: 'Office address', type: 'textarea', wide: true },
  { key: 'department', label: 'Department name' },
  { key: 'email', label: 'Office email', type: 'email' },
  { key: 'phone', label: 'Office phone', type: 'tel' },
  { key: 'helpline', label: 'GBV helpline number' },
  { key: 'social', label: 'Social links (Facebook, X, Instagram, YouTube, TikTok…)', type: 'list', noun: 'link', wide: true, fields: [{ key: 'label', label: 'Name' }, { key: 'url', label: 'Link', type: 'url' }] },
  { key: 'links', label: 'Other links', type: 'list', noun: 'link', wide: true, fields: [{ key: 'label', label: 'Name' }, { key: 'url', label: 'Link', type: 'url' }] },
]

export const projectsConfig = {
  coll: 'projects',
  title: 'Projects',
  blurb: 'Add what the Department has delivered. New items show on the site straight away.',
  noun: 'Project',
  empty: { title: '', category: CATEGORIES[0], year: String(new Date().getFullYear()), county: '', amount: 0, description: '', photos: [], status: 'published' },
  fields: [
    { key: 'title', label: 'Title', required: true, wide: true },
    { key: 'category', label: 'Category', type: 'select', options: CATEGORIES },
    { key: 'year', label: 'Year' },
    { key: 'county', label: 'County' },
    { key: 'amount', label: 'Amount (KES)', type: 'number' },
    { key: 'description', label: 'Description', type: 'textarea', wide: true, hint: 'One or two lines on what was done and who benefits.' },
    { key: 'photos', label: 'Photos', type: 'images', max: 5, wide: true },
    status,
  ],
  columns: [
    { key: 'title', label: 'Project' },
    { key: 'category', label: 'Category' },
    { key: 'year', label: 'Year' },
    { key: 'photos', label: 'Photos', render: (it) => (it.photos || []).length },
    { key: 'status', label: 'Status', render: badge },
  ],
  importer: {
    columns: ['title', 'category', 'year', 'county', 'amount', 'description'],
    example: ['Rescue centre launch', 'GBV response', '2025', 'Nairobi', '0', 'One line on what was done.'],
    map: (r) => ({
      title: String(r.title || '').trim(),
      category: CATEGORIES.includes(r.category) ? r.category : 'Other',
      year: String(r.year || ''),
      county: String(r.county || ''),
      amount: Number(String(r.amount || '0').replace(/[^\d.]/g, '')) || 0,
      description: String(r.description || ''),
      photos: [],
      status: 'published',
    }),
  },
}

export const awardsConfig = {
  coll: 'awards',
  title: 'Awards',
  blurb: 'Honours and rankings. Award photos also appear in the Gallery.',
  noun: 'Award',
  empty: { title: '', body: '', year: String(new Date().getFullYear()), description: '', url: '', photo: '', status: 'published' },
  fields: [
    { key: 'title', label: 'Award or ranking', required: true, wide: true },
    { key: 'body', label: 'Awarded by' },
    { key: 'year', label: 'Year' },
    { key: 'description', label: 'Description', type: 'textarea', wide: true },
    { key: 'url', label: 'Link to a report', type: 'url', wide: true },
    { key: 'photo', label: 'Photo', type: 'image', wide: true },
    status,
  ],
  columns: [
    { key: 'title', label: 'Award' },
    { key: 'body', label: 'Awarded by' },
    { key: 'year', label: 'Year' },
    { key: 'status', label: 'Status', render: badge },
  ],
  importer: {
    columns: ['title', 'body', 'year', 'description', 'url'],
    example: ['Ranked 9th among Principal Secretaries', 'Politrack Africa', '2024', 'One line on the award.', 'https://example.com/report'],
    map: (r) => ({
      title: String(r.title || '').trim(),
      body: String(r.body || ''),
      year: String(r.year || ''),
      description: String(r.description || ''),
      url: String(r.url || ''),
      photo: '',
      status: 'published',
    }),
  },
}

export const pressConfig = {
  coll: 'press',
  title: 'News and press',
  blurb: 'Press coverage and statements. Each item links to the original article.',
  noun: 'Story',
  empty: { title: '', outlet: '', date: '', url: '', category: NEWS_CATEGORIES[0], summary: '', image: '', status: 'published' },
  fields: [
    { key: 'title', label: 'Headline', required: true, wide: true },
    { key: 'outlet', label: 'Outlet or source' },
    { key: 'date', label: 'Date', type: 'date' },
    { key: 'category', label: 'Category', type: 'select', options: NEWS_CATEGORIES },
    { key: 'url', label: 'Link to the article', type: 'url' },
    { key: 'summary', label: 'Short summary', type: 'textarea', wide: true },
    { key: 'image', label: 'Photo', type: 'image', wide: true, hint: 'Also appears in the Gallery.' },
    status,
  ],
  columns: [
    { key: 'title', label: 'Headline' },
    { key: 'outlet', label: 'Outlet' },
    { key: 'date', label: 'Date' },
    { key: 'status', label: 'Status', render: badge },
  ],
  importer: {
    columns: ['title', 'outlet', 'date', 'url', 'category', 'summary'],
    example: ['Headline here', 'Kenya News Agency', '2026-05-12', 'https://example.com/article', 'Press coverage', 'One line summary.'],
    map: (r) => ({
      title: String(r.title || '').trim(),
      outlet: String(r.outlet || ''),
      date: String(r.date || ''),
      url: String(r.url || ''),
      category: NEWS_CATEGORIES.includes(r.category) ? r.category : 'Press coverage',
      summary: String(r.summary || ''),
      image: '',
      status: 'published',
    }),
  },
}

export const eventsConfig = {
  coll: 'events',
  title: 'Events',
  blurb: 'Conferences, launches and engagements the PS has addressed or attended.',
  noun: 'Event',
  empty: { title: '', date: '', venue: '', description: '', url: '', photo: '', status: 'published' },
  fields: [
    { key: 'title', label: 'Event', required: true, wide: true },
    { key: 'date', label: 'Date', type: 'date' },
    { key: 'venue', label: 'Venue or town' },
    { key: 'description', label: 'What happened', type: 'textarea', wide: true },
    { key: 'url', label: 'Link', type: 'url', wide: true },
    { key: 'photo', label: 'Photo', type: 'image', wide: true, hint: 'Also appears in the Gallery.' },
    status,
  ],
  columns: [
    { key: 'title', label: 'Event' },
    { key: 'date', label: 'Date' },
    { key: 'venue', label: 'Venue' },
    { key: 'status', label: 'Status', render: badge },
  ],
  importer: {
    columns: ['title', 'date', 'venue', 'description', 'url'],
    example: ['Conference name', '2026-03-08', 'Nairobi', 'What the PS said or did.', 'https://example.com'],
    map: (r) => ({ title: String(r.title || '').trim(), date: String(r.date || ''), venue: String(r.venue || ''), description: String(r.description || ''), url: String(r.url || ''), photo: '', status: 'published' }),
  },
}

export const galleryConfig = {
  coll: 'gallery',
  bulk: {
    categories: GALLERY_CATEGORIES,
    make: (src, title, category) => ({ type: 'photo', title, category, src, url: '', status: 'published' }),
  },
  title: 'Gallery',
  blurb: 'Standalone photos and videos. Photos from projects, awards, news and events appear here automatically.',
  noun: 'Item',
  empty: { type: 'photo', title: '', category: GALLERY_CATEGORIES[0], src: '', url: '', status: 'published' },
  fields: [
    { key: 'type', label: 'Type', type: 'select', options: [{ value: 'photo', label: 'Photo' }, { value: 'video', label: 'Video link' }] },
    { key: 'title', label: 'Caption' },
    { key: 'category', label: 'Category', type: 'select', options: GALLERY_CATEGORIES, showIf: (f) => f.type !== 'video' },
    { key: 'src', label: 'Photo', type: 'image', wide: true, showIf: (f) => f.type !== 'video' },
    { key: 'url', label: 'Video link', type: 'url', wide: true, hint: 'YouTube, Google Drive, Facebook or TikTok. YouTube thumbnails are automatic.', showIf: (f) => f.type === 'video' },
    status,
  ],
  columns: [
    { key: 'type', label: 'Type', render: (it) => (it.type === 'video' ? 'Video' : 'Photo') },
    { key: 'title', label: 'Caption' },
    { key: 'category', label: 'Category' },
    { key: 'status', label: 'Status', render: badge },
  ],
}

export const profileDefaults = defaults.profile
export const mandateDefaults = defaults.mandate
export const contactDefaults = defaults.contact
