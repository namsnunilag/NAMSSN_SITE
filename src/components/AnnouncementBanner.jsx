import { useState } from 'react'
import { Link } from 'react-router-dom'
import { X, Info, AlertTriangle, CheckCircle } from 'lucide-react'
import { siteAnnouncements } from '../data/announcements'

const typeConfig = {
  info:    { bg: 'bg-brand-blue',    icon: Info,          text: 'text-white', btn: 'bg-white/20 hover:bg-white/30' },
  warning: { bg: 'bg-brand-orange',  icon: AlertTriangle, text: 'text-white', btn: 'bg-white/20 hover:bg-white/30' },
  success: { bg: 'bg-green-600',     icon: CheckCircle,   text: 'text-white', btn: 'bg-white/20 hover:bg-white/30' },
}

function BannerContent({ a, cfg, onDismiss }) {
  const Icon = cfg.icon
  return (
    <div className="max-w-7xl mx-auto px-4 py-2 sm:py-2.5 flex items-start sm:items-center gap-2 sm:gap-3">
      <Icon size={14} className="shrink-0 text-white mt-0.5 sm:mt-0" />
      <p className="flex-1 text-xs sm:text-sm font-medium text-center leading-snug">{a.message}</p>
      {a.linkText && <span className="shrink-0 text-xs sm:text-sm font-bold underline">{a.linkText}</span>}
      <button
        onClick={e => { e.preventDefault(); e.stopPropagation(); onDismiss() }}
        className={`shrink-0 p-1 rounded-full ${cfg.btn} transition-colors`}
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  )
}

export default function AnnouncementBanner() {
  const [dismissed, setDismissed] = useState([])

  const active = siteAnnouncements.filter(a => a.active && !dismissed.includes(a.id))
  if (active.length === 0) return null

  const a = active[0]
  const cfg = typeConfig[a.type] || typeConfig.info
  const dismiss = () => setDismissed(d => [...d, a.id])
  const isInternal = a.href?.startsWith('/')

  return (
    <div className={`${cfg.bg} text-white relative z-40`}>
      {isInternal ? (
        <Link to={a.href} className="block text-white hover:opacity-90 transition-opacity">
          <BannerContent a={a} cfg={cfg} onDismiss={dismiss} />
        </Link>
      ) : a.href ? (
        <a href={a.href} target="_blank" rel="noopener noreferrer" className="block text-white hover:opacity-90 transition-opacity">
          <BannerContent a={a} cfg={cfg} onDismiss={dismiss} />
        </a>
      ) : (
        <BannerContent a={a} cfg={cfg} onDismiss={dismiss} />
      )}
    </div>
  )
}
