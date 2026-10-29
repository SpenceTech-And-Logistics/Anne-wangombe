# PS Anne Wang'ombe: official website

Multi-page React + Vite site for the Principal Secretary, State Department for Gender and Affirmative Action, with a Firebase admin dashboard at `/admin`.
Built by SpenceTec and Logistics Limited.

## Run locally
```bash
npm install
npm run dev      # http://localhost:5173
npm run lint
npm run build    # output in dist/
```

## Content
The site ships with built-in content (profile, positions, mandate, initiatives, award and news) taken from the State Department, the National Police Service leadership page, MIGECAH and Kenya News Agency.
Once Firebase is connected, anything saved in the dashboard replaces the built-in version.

**Photos:** put `portrait.jpg` (home page) and `about.jpg` (About page) in `src/assets/images/` (`.png` / `.webp` also work), or upload them from the dashboard (Profile and career: Home page portrait, About page photo). Without an About photo, the About page reuses the portrait.

## Firebase setup (free Spark plan, no Storage needed)
1. Firebase console: create a project, then Build, Firestore Database, create (production mode).
2. Build, Authentication, Sign-in method: enable **Email/Password**. Add the office users under Users.
3. Project settings, Your apps, add a **Web app**. Copy `apiKey`, `authDomain`, `projectId`, `appId` into `site.config.js`.
4. Firestore, Rules: paste the contents of `firestore.rules` and Publish.
5. Make someone an administrator: Firestore, start collection `admins`, document ID = that user's **UID** (shown on the "No access" screen after they sign in), field `ok` = boolean `true`.
6. Authentication, Settings, Authorized domains: add the live domain and the `*.workers.dev` address.
7. Redeploy. Open `/admin`.

Photos are resized in the browser and stored in Firestore (about 100 to 200 KB each; a project can hold up to 5). Videos are links (YouTube, Google Drive, Facebook, TikTok).
Projects, News and Events support **Import from file** (CSV or JSON; duplicates by title are skipped). Use the "CSV template" button for the columns.

## Deploy to Cloudflare Workers
```bash
npm run build
npx wrangler deploy
```
`wrangler.jsonc` serves `dist/` with single-page-app fallback, so `/about`, `/admin` etc. work on refresh.
