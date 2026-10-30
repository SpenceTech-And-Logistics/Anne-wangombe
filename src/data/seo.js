// Search engine settings: one place for every page's title and description, the structured data
// Google reads about her, and the name spellings people search for.
// Used in the browser (src/lib/seo.js) and at build time (seo-plugin.js). See SEO.md for the plan.

import { siteConfig } from '../../site.config.js'
import { defaults } from './content.js'

export const SITE_URL = (siteConfig.siteUrl || '').replace(/\/$/, '')
export const SITE_NAME = "Anne Wang'ombe"
export const OG_IMAGE = '/og-image.png'

const P = defaults.profile
const C = defaults.contact
const ROLE = 'Principal Secretary, Gender and Affirmative Action'

export const HOME_TITLE = `Anne Wang'ombe | ${ROLE}, Kenya`
export const HOME_DESC =
  "Official website of Ms. Anne Njoki Wang'ombe, Principal Secretary for Gender and Affirmative Action, Kenya. Her profile, career, work to end gender-based violence, projects, awards, news and contact."

// Keep titles under ~60 characters and descriptions under ~160 so Google shows them in full.
export const PAGES = {
  '/': { title: HOME_TITLE, description: HOME_DESC },
  '/about': {
    title: "About Anne Njoki Wang'ombe | Profile and career",
    description:
      "Biography of PS Anne Njoki Wang'ombe: three decades in public administration, HR and education at KEMRI and KRA Staff Pension Scheme, and her education.",
  },
  '/mandate': {
    title: "Mandate and priorities | PS Anne Wang'ombe",
    description:
      'The priorities of the State Department for Gender and Affirmative Action: gender equality, women’s empowerment, affirmative action and ending GBV.',
  },
  '/projects': {
    title: "Projects | PS Anne Wang'ombe",
    description:
      "Programmes PS Anne Wang'ombe has led or supported: GBV safe houses, Women Enterprise Fund support, anti-FGM declarations and policy reform.",
  },
  '/awards': {
    title: "Awards and rankings | PS Anne Wang'ombe",
    description: "Honours and rankings for PS Anne Wang'ombe, including Politrack Africa's ranking of Kenya's Principal Secretaries.",
  },
  '/news': {
    title: "News and events | PS Anne Wang'ombe",
    description: "Press coverage, statements and events featuring PS Anne Wang'ombe, Principal Secretary for Gender and Affirmative Action.",
  },
  '/gallery': {
    title: "Gallery | PS Anne Wang'ombe",
    description: "Photos and videos of PS Anne Wang'ombe at events, field visits and official engagements across Kenya.",
  },
  '/contact': {
    title: "Contact the office | PS Anne Wang'ombe",
    description: "Write to the office of PS Anne Wang'ombe for media, partnership and speaking requests. GBV helpline: 1195 (toll-free).",
  },
}

/** Title and description for any path; null for paths that should not be indexed. */
export function pageSeo(path, project) {
  if (PAGES[path]) return PAGES[path]
  if (path.startsWith('/projects/') && project) {
    return {
      title: `${project.title} | PS Anne Wang'ombe`.slice(0, 90),
      description: clip(project.description || `A project by the State Department for Gender and Affirmative Action, ${project.county || 'Kenya'}.`),
    }
  }
  return null
}

export const clip = (s = '', n = 158) => (s.length > n ? `${s.slice(0, n - 1).replace(/\s+\S*$/, '')}…` : s)

/** Structured data (schema.org) so Google knows who she is and which spellings refer to her. */
export function jsonLd(url = SITE_URL) {
  const sameAs = [...(C.social || []), ...(C.links || [])].map((l) => l.url).filter(Boolean)
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${url}/#person`,
        name: "Anne Njoki Wang'ombe",
        alternateName: ["Anne Wang'ombe", 'Anne Wangombe', "Ann Wang'ombe", 'Ann Wangombe', 'PS Anne Wangombe', 'Gender PS Kenya'],
        honorificPrefix: 'Ms.',
        jobTitle: 'Principal Secretary',
        description: HOME_DESC,
        url: `${url}/`,
        image: url ? `${url}${OG_IMAGE}` : undefined,
        nationality: { '@type': 'Country', name: 'Kenya' },
        worksFor: {
          '@type': 'GovernmentOrganization',
          name: P.department,
          url: 'https://gender.go.ke',
          parentOrganization: { '@type': 'GovernmentOrganization', name: P.ministry },
        },
        alumniOf: [
          { '@type': 'CollegeOrUniversity', name: 'University of Nairobi' },
          { '@type': 'CollegeOrUniversity', name: 'Kenyatta University' },
          { '@type': 'CollegeOrUniversity', name: 'Jomo Kenyatta University of Agriculture and Technology' },
        ],
        memberOf: { '@type': 'Organization', name: 'Kenya Association for Public Administration and Management (KEPAM)' },
        knowsAbout: ['Gender equality', "Women's economic empowerment", 'Affirmative action', 'Gender-based violence prevention', 'Public administration', 'Human resource management'],
        sameAs,
      },
      { '@type': 'WebSite', '@id': `${url}/#website`, name: SITE_NAME, url: `${url}/`, inLanguage: 'en-KE', about: { '@id': `${url}/#person` } },
    ],
  }
}
