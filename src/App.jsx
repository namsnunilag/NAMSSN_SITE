import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useState, useEffect, createContext, useContext } from 'react'
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

  return (
    <ThemeContext.Provider value={{ isDark, toggle }}>
      <BrowserRouter>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <AnnouncementBanner />
          <Navbar onToggleDark={toggle} isDark={isDark} />
          <main className="flex-grow">
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
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </ThemeContext.Provider>
  )
}
