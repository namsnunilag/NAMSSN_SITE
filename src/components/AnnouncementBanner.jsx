import { useState } from 'react'
import { Link } from 'react-router-dom'
import { X, Info, AlertTriangle, CheckCircle } from 'lucide-react'
import { siteAnnouncements } from '../data/announcements'

const typeConfig = {
  info:    { bg: 'bg-brand-blue',    icon: Info,          text: 'text-white', btn: 'bg-white/20 hover:bg-white/30' },
  warning: { bg: 'bg-brand-orange',  icon: AlertTriangle, text: 'text-white', btn: 'bg-white/20 hover:bg-white/30' },
  success: { bg: 'bg-green-600',     icon: CheckCircle,   text: 'text-white', btn: 'bg-white/20 hover:bg-white/30' },
}

export default function AnnouncementBanner() {
  const [dismissed, setDismissed] = useState([])

  const active = siteAnnouncements.filter(a => a.active && !dismissed.includes(a.id))
  if (active.length === 0) return null

  const a = active[0]
  const cfg = typeConfig[a.type] || typeConfig.info
  const Icon = cfg.icon

  return (
    <div className={`${cfg.bg} ${cfg.text} relative z-40`}>
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-3">
        <Icon size={15} className="shrink-0" />
        <p className="flex-1 text-sm font-medium text-center leading-snug">
          {a.message}
          {a.href && (
            <a
              href={a.href}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 underline font-bold hover:no-underline"
            >
              {a.linkText || 'Read More'}
            </a>
          )}
          {a.link && !a.href && (
            <Link
              to={a.link}
              className="ml-2 underline font-bold hover:no-underline"
            >
              {a.linkText || 'Learn More'}
            </Link>
          )}
        </p>
        <button
          onClick={() => setDismissed(d => [...d, a.id])}
          className={`shrink-0 p-1 rounded-full ${cfg.btn} transition-colors`}
          aria-label="Dismiss announcement"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}
