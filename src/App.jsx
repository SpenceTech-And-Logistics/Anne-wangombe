import { lazy, Suspense, useEffect, useRef } from 'react'
import { Outlet, Route, Routes, useLocation } from 'react-router-dom'
import Footer from './components/Footer.jsx'
import Navbar from './components/Navbar.jsx'
import { useScroll } from './lib/hooks.js'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Gallery from './pages/Gallery.jsx'
import Home from './pages/Home.jsx'
import News from './pages/News.jsx'
import NotFound from './pages/NotFound.jsx'
import Mandate from './pages/Mandate.jsx'
import Awards from './pages/Awards.jsx'
import ProjectDetail from './pages/ProjectDetail.jsx'
import Projects from './pages/Projects.jsx'

// The dashboard (and Firebase Auth) is only downloaded when someone opens /admin.
const AdminApp = lazy(() => import('./pages/admin/AdminApp.jsx'))

const TITLES = {
  '/about': 'About',
  '/mandate': 'Mandate',
  '/awards': 'Awards',
  '/projects': 'Projects',
  '/news': 'News and events',
  '/gallery': 'Gallery',
  '/contact': 'Contact',
}

function Layout() {
  const { pathname } = useLocation()
  const bar = useRef(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    const section = TITLES[pathname] || (pathname.startsWith('/projects/') ? 'Project' : '')
    document.title = section
      ? `${section} | PS Anne Wang'ombe`
      : "PS Anne Wang'ombe | State Department for Gender and Affirmative Action"
  }, [pathname])

  useScroll((y) => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    bar.current?.style.setProperty('--p', max > 0 ? Math.min(1, y / max) : 0)
  })

  return (
    <>
      <a href="#content" className="skip">Skip to content</a>
      <div className="scroll-progress" ref={bar} aria-hidden="true" />
      <Navbar />
      <main id="content" key={pathname} className="page">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="mandate" element={<Mandate />} />
        <Route path="awards" element={<Awards />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:id" element={<ProjectDetail />} />
        <Route path="news" element={<News />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route
        path="admin/*"
        element={
          <Suspense fallback={<p style={{ padding: 40 }}>Loading the dashboard…</p>}>
            <AdminApp />
          </Suspense>
        }
      />
    </Routes>
  )
}
