// Seed Firestore with the site's built-in content (src/data/content.js).
//
// Usage (from the project folder, after site.config.js has your Firebase values):
//   npm run seed            -> asks for an admin email and password, skips anything already in the database
//   npm run seed -- --force -> overwrites what is already there with the built-in content
//   npm run seed -- --dry   -> shows what would be written, writes nothing
//
// The account must be an administrator (Firestore: admins/<UID> with ok = true), because the
// security rules only let admins write. Nothing is stored; the password is only used to sign in.

import readline from 'node:readline'
import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { getFirestore, doc, getDoc, setDoc, terminate } from 'firebase/firestore'
import { siteConfig } from '../site.config.js'
import { defaults } from '../src/data/content.js'

const args = new Set(process.argv.slice(2))
const FORCE = args.has('--force')
const DRY = args.has('--dry')

// What goes where: site/{profile,mandate,contact} plus one document per item in each collection.
const jobs = [
  ...['profile', 'mandate', 'contact'].map((name) => ({ coll: 'site', id: name, data: defaults[name] })),
  ...['projects', 'awards', 'press', 'events', 'gallery'].flatMap((coll) =>
    defaults[coll].map((item, i) => {
      const { id, ...data } = item
      return { coll, id: id || `${coll}-${i + 1}`, data: { status: 'published', ...data } }
    }),
  ),
]

function ask(question, hidden = false) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true })
  if (hidden) {
    rl._writeToOutput = (s) => {
      if (s.includes(question)) rl.output.write(s)
      else rl.output.write('')
    }
  }
  return new Promise((resolve) =>
    rl.question(question, (answer) => {
      rl.close()
      if (hidden) process.stdout.write('\n')
      resolve(answer.trim())
    }),
  )
}

async function main() {
  if (DRY) {
    for (const j of jobs) console.log(`would write ${j.coll}/${j.id}`)
    console.log(`\n${jobs.length} documents. Nothing written (dry run).`)
    return
  }

  const cfg = siteConfig.firebase
  if (!cfg.apiKey || !cfg.projectId) {
    console.error('site.config.js has no Firebase values yet. Paste apiKey, authDomain, projectId and appId first.')
    process.exit(1)
  }

  const app = initializeApp(cfg)
  const auth = getAuth(app)
  const db = getFirestore(app)

  const email = process.env.ADMIN_EMAIL || (await ask('Admin email: '))
  const password = process.env.ADMIN_PASSWORD || (await ask('Password: ', true))

  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password)
    console.log(`Signed in as ${user.email} (UID ${user.uid})\n`)
  } catch (err) {
    console.error(`Sign-in failed: ${err.code || err.message}`)
    process.exit(1)
  }

  let written = 0
  let skipped = 0
  for (const j of jobs) {
    const ref = doc(db, j.coll, j.id)
    try {
      if (!FORCE && (await getDoc(ref)).exists()) {
        console.log(`  skip   ${j.coll}/${j.id} (already there)`)
        skipped++
        continue
      }
      await setDoc(ref, j.data)
      console.log(`  write  ${j.coll}/${j.id}`)
      written++
    } catch (err) {
      if (err.code === 'permission-denied') {
        console.error(
          `\nPermission denied on ${j.coll}/${j.id}.\n` +
            `Check that firestore.rules is published and that admins/${auth.currentUser.uid} exists with ok = true.`,
        )
        process.exit(1)
      }
      throw err
    }
  }

  console.log(`\nDone: ${written} written, ${skipped} skipped.${skipped && !FORCE ? ' Use --force to overwrite.' : ''}`)
  await signOut(auth)
  await terminate(db)
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
