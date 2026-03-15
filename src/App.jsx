import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef, createContext, useContext } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AnnouncementBanner from './components/AnnouncementBanner'
import Home from './pages/Home'
import About from './pages/About'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import Executives from './pages/Executives'
// import Gallery from './pages/Gallery'
import Contact from './pages/Contact'
import Newsletter from './pages/Newsletter'
import Academics from './pages/Academics'
import Resources from './pages/Resources'
import Community from './pages/Community'
import Merchandise from './pages/Merchandise'
import Research from './pages/Research'
import PiDay from './pages/PiDay'
import StudentExecutives from './pages/StudentExecutives'
import StudentExecutiveDetail from './pages/StudentExecutiveDetail'

export const ThemeContext = createContext({ isDark: false, toggle: () => {} })
export const useTheme = () => useContext(ThemeContext)

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) }
      }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    const timer = setTimeout(() => {
      document.querySelectorAll('.reveal').forEach(el => obs.observe(el))
    }, 100)
    return () => { clearTimeout(timer); obs.disconnect() }
  }, [pathname])

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
        <div className="flex flex-col min-h-screen">
          <div ref={headerRef} className="fixed top-0 inset-x-0 z-50">
            <AnnouncementBanner />
            <Navbar onToggleDark={toggle} isDark={isDark} />
          </div>
          <main className="flex-grow" style={{ paddingTop: 'var(--header-h, 64px)' }}>
            <Routes>
              <Route path="/"             element={<Home />} />
              <Route path="/about"        element={<About />} />
              <Route path="/events"       element={<Events />} />
              <Route path="/events/:id"   element={<EventDetail />} />
              <Route path="/executives"   element={<Executives />} />
              {/* <Route path="/gallery"      element={<Gallery />} /> */}
              <Route path="/contact"      element={<Contact />} />
              <Route path="/newsletter"   element={<Newsletter />} />
              <Route path="/academics"    element={<Academics />} />
              <Route path="/resources"    element={<Resources />} />
              <Route path="/community"    element={<Community />} />
              <Route path="/merchandise"  element={<Merchandise />} />
              <Route path="/research"     element={<Research />} />
              <Route path="/celebration/pi-day"   element={<PiDay />} />
              <Route path="/student-executives"        element={<StudentExecutives />} />
              <Route path="/student-executives/:id"   element={<StudentExecutiveDetail />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </ThemeContext.Provider>
  )
}
