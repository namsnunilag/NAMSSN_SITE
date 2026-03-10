import { useState, useEffect, useRef } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { Menu, X, ChevronDown, Moon, Sun } from 'lucide-react'

const links = [
  { to: '/',        label: 'Home' },
  { to: '/about',   label: 'About' },
  { to: '/events',  label: 'Events' },
  { to: '/contact', label: 'Contact' },
]

const execDropdown = [
  { tab: 'patrons',    label: 'Patrons' },
  { tab: 'lecturers',  label: 'Lecturers' },
  { tab: 'executives', label: 'Student Executives' },
]

const exploreDropdown = [
  { to: '/newsletter',  label: 'Newsletter' },
  { to: '/academics',   label: 'Academics' },
  { to: '/resources',   label: 'Student Resources' },
  { to: '/community',   label: 'Community' },
  { to: '/merchandise', label: 'Merchandise' },
]

export default function Navbar({ onToggleDark, isDark }) {
  const [open, setOpen]             = useState(false)
  const [scrolled, setScrolled]     = useState(false)
  const [logoFailed, setLogoFailed] = useState(false)
  const [dropOpen, setDropOpen]     = useState(false)
  const [exploreOpen, setExploreOpen] = useState(false)
  const dropRef                     = useRef(null)
  const exploreRef                  = useRef(null)
  const navigate                    = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false)
      if (exploreRef.current && !exploreRef.current.contains(e.target)) setExploreOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const goToSection = (tab) => {
    setDropOpen(false)
    setOpen(false)
    navigate(`/executives?tab=${tab}`)
  }

  const activeClass   = 'text-brand-orange font-semibold'
  const inactiveClass = 'text-white hover:text-brand-blueLight transition-colors duration-200'

  const exploreRoutes = exploreDropdown.map(x => x.to)
  const exploreActive = exploreRoutes.some(r => window.location.pathname === r)

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-brand-blueDark shadow-lg' : 'bg-brand-blueDark/95 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            {!logoFailed ? (
              <img
                src="/logo.png"
                alt="NAMSSN logo"
                className="h-10 w-10 object-contain rounded-full"
                onError={() => setLogoFailed(true)}
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-brand-orange flex items-center justify-center text-white font-bold text-xs">
                N
              </div>
            )}
            <div className="hidden sm:block">
              <p className="font-bold text-white text-sm leading-tight">NAMSSN</p>
              <p className="text-brand-blueLight text-xs leading-tight">UNILAG Chapter</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-5">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) => isActive ? activeClass : inactiveClass}
              >
                {label}
              </NavLink>
            ))}

            {/* Explore dropdown */}
            <div className="relative" ref={exploreRef}>
              <button
                onClick={() => { setExploreOpen(o => !o); setDropOpen(false) }}
                className={`flex items-center gap-1 transition-colors duration-200 ${
                  exploreActive ? activeClass : inactiveClass
                }`}
              >
                Explore
                <ChevronDown
                  size={15}
                  className={`transition-transform duration-200 ${exploreOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {exploreOpen && (
                <div className="absolute top-full right-0 mt-2 w-52 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50">
                  {exploreDropdown.map(({ to, label }) => (
                    <NavLink
                      key={to}
                      to={to}
                      onClick={() => setExploreOpen(false)}
                      className={({ isActive }) =>
                        `block px-4 py-3 text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-brand-orange/10 text-brand-orange'
                            : 'text-gray-700 dark:text-gray-200 hover:bg-brand-blue/5 dark:hover:bg-brand-blue/20 hover:text-brand-blue'
                        }`
                      }
                    >
                      {label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>

            {/* Executives dropdown */}
            <div className="relative" ref={dropRef}>
              <button
                onClick={() => { setDropOpen(o => !o); setExploreOpen(false) }}
                className={`flex items-center gap-1 transition-colors duration-200 ${
                  window.location.pathname === '/executives' ? activeClass : inactiveClass
                }`}
              >
                Executives
                <ChevronDown
                  size={15}
                  className={`transition-transform duration-200 ${dropOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {dropOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50">
                  {execDropdown.map(({ tab, label }) => (
                    <button
                      key={tab}
                      onClick={() => goToSection(tab)}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-brand-blue/5 dark:hover:bg-brand-blue/20 hover:text-brand-blue transition-colors font-medium"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Dark mode toggle */}
          <button
            onClick={onToggleDark}
            className="p-2 rounded-full text-white hover:bg-brand-blue/50 transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-white p-2 rounded-md hover:bg-brand-blue/50 transition-colors"
            onClick={() => setOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="md:hidden bg-brand-blueDark border-t border-brand-blue/30 px-4 pb-4 pt-2 max-h-[80vh] overflow-y-auto">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block py-2 px-3 rounded-md text-sm font-medium mb-1 ${
                  isActive
                    ? 'bg-brand-orange/20 text-brand-orange'
                    : 'text-white hover:bg-brand-blue/40 hover:text-brand-blueLight'
                }`
              }
            >
              {label}
            </NavLink>
          ))}

          {/* Mobile Explore links */}
          <div className="border-t border-brand-blue/30 mt-2 pt-2">
            <p className="text-brand-blueLight text-xs font-semibold uppercase tracking-wider px-3 mb-1">Explore</p>
            {exploreDropdown.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block py-2 px-3 rounded-md text-sm font-medium mb-1 ${
                    isActive
                      ? 'bg-brand-orange/20 text-brand-orange'
                      : 'text-white hover:bg-brand-blue/40 hover:text-brand-blueLight'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Mobile executives sub-links */}
          <div className="border-t border-brand-blue/30 mt-2 pt-2">
            <p className="text-brand-blueLight text-xs font-semibold uppercase tracking-wider px-3 mb-1">Executives</p>
            {execDropdown.map(({ tab, label }) => (
              <button
                key={tab}
                onClick={() => goToSection(tab)}
                className="block w-full text-left py-2 px-3 rounded-md text-sm font-medium mb-1 text-white hover:bg-brand-blue/40 hover:text-brand-blueLight"
              >
                {label}
              </button>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
