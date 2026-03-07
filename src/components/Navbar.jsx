import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const links = [
  { to: '/',           label: 'Home' },
  { to: '/about',      label: 'About' },
  { to: '/events',     label: 'Events' },
  { to: '/executives', label: 'Executives' },
  { to: '/gallery',    label: 'Gallery' },
  { to: '/contact',    label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen]       = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [logoFailed, setLogoFailed] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const activeClass = 'text-brand-orange font-semibold'
  const inactiveClass = 'text-white hover:text-brand-blueLight transition-colors duration-200'

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
          <nav className="hidden md:flex items-center gap-6">
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
          </nav>

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
        <nav className="md:hidden bg-brand-blueDark border-t border-brand-blue/30 px-4 pb-4 pt-2">
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
        </nav>
      )}
    </header>
  )
}
