# SEO plan: PS Anne Wang'ombe website

A living record of how the site is set up for search and sharing, what has been done, and what is next.
Update the **Log** at the bottom every time something SEO-related changes.

## Goal
When someone searches **Anne Wang'ombe**, **Anne Wangombe**, **Ann Wang'ombe**, **Gender PS Kenya** or
**PS Gender and Affirmative Action**, this site should be the first result, show a clean title and description,
and produce a proper preview card when shared on WhatsApp, Facebook, X or LinkedIn.

## How it works
| Piece | File | What it does |
|---|---|---|
| Page titles and descriptions | `src/data/seo.js` (`PAGES`) | One place for every page's title (under ~60 characters) and description (under ~160). |
| Structured data | `src/data/seo.js` (`jsonLd`) | Tells Google who she is: Person, job title, department, ministry, universities, KEPAM, social profiles, and the name spellings people use (`alternateName`). |
| Pages for crawlers | `seo-plugin.js` | After `npm run build`, writes a separate HTML file for each page (`about.html`, `mandate.html`…) with its own tags, so Google and WhatsApp see the right title without running JavaScript. |
| Project pages | `seo-plugin.js` | Reads the published projects from Firestore during the build and writes a page plus sitemap entry for each one. |
| Sitemap and robots | `seo-plugin.js` | Generates `sitemap.xml` and `robots.txt` (blocks `/admin` and `/api/`). |
| Tags while browsing | `src/lib/seo.js` | Updates title, description, canonical link and share tags as visitors move between pages. |
| Share image | `public/og-image.png` | 1200 × 630 preview card. Replace with a version using her real portrait once the office supplies one (same size and file name). |
| Site address | `site.config.js` (`siteUrl`) | Used for canonical links and the sitemap. **Change it when a custom domain is added, then redeploy.** |

New projects added in the dashboard get their own search page after the next deploy (any push to `main`, or "Retry deployment" in Cloudflare).

## Checklist
### Done
- [x] Unique title and description for every page
- [x] Canonical links, Open Graph and Twitter/X card tags
- [x] Person and WebSite structured data with alternate name spellings
- [x] Static HTML per page for crawlers and link previews
- [x] `sitemap.xml` (pages and published projects) and `robots.txt`
- [x] Dashboard, 404 and unknown pages marked `noindex`
- [x] 1200 × 630 share image

### To do (owner)
- [ ] **Google Search Console**: add the site, verify (the HTML-tag method: send me the tag and I'll add it), then submit `/sitemap.xml`.
- [ ] **Bing Webmaster Tools**: import from Search Console.
- [ ] **Custom domain**: if one is bought, set it in `site.config.js` and Cloudflare, then resubmit the sitemap.
- [ ] **Real portrait**: upload in the dashboard and send a copy so the share image and structured data can use it.
- [ ] **Links back to the site**: ask the office to link it from gender.go.ke, MIGECAH and her Facebook/Instagram bios. These links do more for ranking than anything on the page itself.
- [ ] Confirm the live address: `https://ps-anne-wangombe.spencetechandlogistics.workers.dev`.

### To do (later improvements)
- [ ] Per-project share images (use the project's first photo).
- [ ] News items as `NewsArticle` structured data.
- [ ] Event items as `Event` structured data with dates once dates are filled in.
- [ ] Image alt text review across the gallery.
- [ ] Check Core Web Vitals in Search Console after a month of traffic.

## Log
| Date | Change |
|---|---|
| 2026-10-30 | SEO set up: per-page titles and descriptions, structured data, static HTML per page, sitemap, robots.txt, share image, noindex on dashboard and 404. |
