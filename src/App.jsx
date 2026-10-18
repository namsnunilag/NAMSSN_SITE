import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { useState, useEffect, useRef, createContext, useContext, lazy, Suspense } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AnnouncementBanner from './components/AnnouncementBanner'

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Events = lazy(() => import('./pages/Events'))
const EventDetail = lazy(() => import('./pages/EventDetail'))
const Executives = lazy(() => import('./pages/Executives'))
const Gallery = lazy(() => import('./pages/Gallery'))
const Contact = lazy(() => import('./pages/Contact'))
const Newsletter = lazy(() => import('./pages/Newsletter'))
const Academics = lazy(() => import('./pages/Academics'))
const Resources = lazy(() => import('./pages/Resources'))
const Community = lazy(() => import('./pages/Community'))
const Merchandise = lazy(() => import('./pages/Merchandise'))
const Research = lazy(() => import('./pages/Research'))
const PiDay = lazy(() => import('./pages/PiDay'))
const Giveaway = lazy(() => import('./pages/Giveaway'))
const Eid = lazy(() => import('./pages/Eid'))
const StudentExecutiveDetail = lazy(() => import('./pages/StudentExecutiveDetail'))
const Decagon = lazy(() => import('./pages/Decagon'))
const DecagonAttend = lazy(() => import('./pages/DecagonAttend'))
const DeansGamesJersey = lazy(() => import('./pages/DeansGamesJersey'))
const Admin = lazy(() => import('./pages/Admin'))

export const ThemeContext = createContext({ isDark: false, toggle: () => {} })
export const useTheme = () => useContext(ThemeContext)

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])

  return null
}

export default function App() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])

  const toggle = () => setIsDark(d => !d)

  const headerRef = useRef(null)
  useEffect(() => {
    const el = headerRef.current
    if (!el) return
    const update = () => document.documentElement.style.setProperty('--header-h', `${el.offsetHeight}px`)
    update()
    const obs = new ResizeObserver(update)
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <ThemeContext.Provider value={{ isDark, toggle }}>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Admin — standalone, no navbar/footer */}
          <Route path="/admin" element={<Suspense fallback={<PageLoading />}><Admin /></Suspense>} />

          {/* All other pages — wrapped in nav + footer */}
          <Route path="/*" element={
            <div className="flex flex-col min-h-screen">
              <div ref={headerRef} className="fixed top-0 inset-x-0 z-50">
                <AnnouncementBanner />
                <Navbar onToggleDark={toggle} isDark={isDark} />
              </div>
              <main className="flex-grow" style={{ paddingTop: 'var(--header-h, 64px)' }}>
                <Suspense fallback={<PageLoading />}>
                  <Routes>
                    <Route path="/"             element={<Home />} />
                    <Route path="/about"        element={<About />} />
                    <Route path="/events"       element={<Events />} />
                    <Route path="/events/:id"   element={<EventDetail />} />
                    <Route path="/executives"   element={<Executives />} />
                    <Route path="/gallery"      element={<Gallery />} />
                    <Route path="/contact"      element={<Contact />} />
                    <Route path="/newsletter"   element={<Newsletter />} />
                    <Route path="/academics"    element={<Academics />} />
                    <Route path="/resources"    element={<Resources />} />
                    <Route path="/community"    element={<Community />} />
                    <Route path="/merchandise"  element={<Merchandise />} />
                    <Route path="/research"     element={<Research />} />
                    <Route path="/celebration/pi-day"        element={<PiDay />} />
                    <Route path="/giveaway"                  element={<Giveaway />} />
                    <Route path="/eid"                       element={<Eid />} />
                    <Route path="/student-executives"        element={<Navigate to="/executives?tab=executives" replace />} />
                    <Route path="/student-executives/:id"    element={<StudentExecutiveDetail />} />
                    <Route path="/decagon"                   element={<Decagon />} />
                    <Route path="/decagon/attend"            element={<DecagonAttend />} />
                    <Route path="/deans-games/jersey"        element={<DeansGamesJersey />} />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
            </div>
          } />
        </Routes>
        <Analytics />
      </BrowserRouter>
    </ThemeContext.Provider>
  )
}

function PageLoading() {
  return <div className="flex min-h-[50vh] items-center justify-center" role="status">Loading page...</div>
}
