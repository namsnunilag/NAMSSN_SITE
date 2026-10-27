import { Link } from 'react-router-dom'
import { Send, Camera, BriefcaseBusiness, Mail, MapPin } from 'lucide-react'

const navLinks = [
  { to: '/',            label: 'Home' },
  { to: '/about',       label: 'About' },
  { to: '/events',      label: 'Events' },
  { to: '/executives',  label: 'Executives' },
  { to: '/contact',     label: 'Contact' },
]

const exploreLinks = [
  { to: '/newsletter',  label: 'Newsletter' },
  { to: '/academics',   label: 'Academics' },
  { to: '/resources',   label: 'Student Resources' },
  { to: '/community',   label: 'Community' },
  { to: '/merchandise', label: 'Merchandise' },
]

const socials = [
  { icon: Send,               href: 'https://x.com/namssn_unilag',                                  label: 'Twitter' },
  { icon: Camera,             href: 'https://www.instagram.com/namssn_unilag/',                      label: 'Instagram' },
  { icon: BriefcaseBusiness,  href: 'https://www.linkedin.com/in/namssn-unilag-chapter-a18b5a281/', label: 'LinkedIn' },
]

export default function Footer() {
  return (
    <footer className="bg-brand-blueDark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">

          {/* Brand */}
          <div>
            <h3 className="font-bold text-lg mb-1">NAMSSN</h3>
            <p className="text-brand-blueLight text-sm mb-3">UNILAG Chapter</p>
            <p className="text-gray-300 text-sm leading-relaxed">
              Fostering academic excellence and professional growth among mathematical sciences students at the University of Lagos.
            </p>
            <div className="flex gap-3 mt-4">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-full bg-brand-blue/40 flex items-center justify-center hover:bg-brand-orange transition-colors"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-brand-blueLight mb-3">Quick Links</h4>
            <ul className="space-y-2">
              {navLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-gray-300 hover:text-brand-orange text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-brand-blueLight mb-3">Explore</h4>
            <ul className="space-y-2">
              {exploreLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-gray-300 hover:text-brand-orange text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-brand-blueLight mb-3">Contact</h4>
            <ul className="space-y-3">
              <li className="flex gap-2 text-sm text-gray-300">
                <MapPin size={14} className="shrink-0 mt-0.5 text-brand-orange" />
                <span>Dept. of Mathematics, University of Lagos, Akoka, Lagos</span>
              </li>
              <li className="flex gap-2 text-sm text-gray-300">
                <Mail size={14} className="shrink-0 mt-0.5 text-brand-orange" />
                <a href="mailto:namsnunilag9@gmail.com" className="hover:text-brand-orange transition-colors">
                  namsnunilag9@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter / CTA */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-brand-blueLight mb-3">Stay Updated</h4>
            <p className="text-gray-300 text-sm mb-4">Follow our socials for the latest events and announcements.</p>
            <Link
              to="/contact"
              className="inline-block bg-brand-orange hover:bg-brand-yellow text-white hover:text-brand-blueDark font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>

        <div className="border-t border-brand-blue/30 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-gray-400 text-xs text-center sm:text-left">
          <p>© {new Date().getFullYear()} NAMSSN UNILAG Chapter. All rights reserved.</p>
          <p>Built with ❤️ by NAMSSN UNILAG Web Team</p>
        </div>
      </div>
    </footer>
  )
}
