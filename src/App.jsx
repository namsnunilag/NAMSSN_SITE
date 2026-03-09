import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AnnouncementBanner from './components/AnnouncementBanner'
import Home from './pages/Home'
import About from './pages/About'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import Executives from './pages/Executives'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'
import Newsletter from './pages/Newsletter'
import Academics from './pages/Academics'
import Resources from './pages/Resources'
import Community from './pages/Community'
import Merchandise from './pages/Merchandise'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <AnnouncementBanner />
        <Navbar />
        <main className="flex-grow">
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
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
