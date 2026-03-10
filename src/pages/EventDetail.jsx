import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Calendar, MapPin, Clock, ArrowLeft, ExternalLink, Bell, CheckCircle2 } from 'lucide-react'
import { findEvent, registrationStatusConfig } from '../data/events'
import usePageTitle from '../hooks/usePageTitle'

// ── Countdown hook ──────────────────────────────────────────────────────────
function useCountdown(targetDateStr) {
  const [timeLeft, setTimeLeft] = useState(null)

  useEffect(() => {
    if (!targetDateStr) return
    const target = new Date(targetDateStr).getTime()

    const calc = () => {
      const diff = target - Date.now()
      if (diff <= 0) { setTimeLeft(null); return }
      setTimeLeft({
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000)  / 60000),
        seconds: Math.floor((diff % 60000)    / 1000),
      })
    }
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [targetDateStr])

  return timeLeft
}

function CountdownTimer({ date }) {
  const t = useCountdown(date)
  if (!t) return null
  return (
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-semibold">
        Registration opens in
      </p>
      <div className="grid grid-cols-4 gap-2">
        {[['Days', t.days], ['Hrs', t.hours], ['Min', t.minutes], ['Sec', t.seconds]].map(([label, val]) => (
          <div key={label} className="bg-brand-blueDark/5 rounded-lg p-2 text-center">
            <span className="block text-xl font-black text-brand-blueDark tabular-nums">
              {String(val).padStart(2, '0')}
            </span>
            <span className="text-xs text-gray-400">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function NotifyMeForm() {
  const [email, setEmail]   = useState('')
  const [sent, setSent]     = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    // Replace YOUR_FORM_ID with your actual Formspree form ID
    try {
      await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, _subject: 'NAMSSN Event Notification Signup' }),
      })
    } catch (_) { /* silent fail */ }
    setSent(true)
    setLoading(false)
  }

  if (sent) return (
    <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
      <CheckCircle2 size={16} /> We'll notify you when registration opens!
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <p className="text-xs text-gray-500">Get notified when registration opens:</p>
      <div className="flex gap-2">
        <input
          type="email"
          required
          placeholder="your@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-brand-orange hover:bg-brand-yellow hover:text-brand-blueDark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
        >
          <Bell size={14} /> Notify Me
        </button>
      </div>
    </form>
  )
}

function RegistrationBadge({ status }) {
  const cfg = registrationStatusConfig[status] || registrationStatusConfig['none']
  if (!cfg.label) return null
  return (
    <span className={`inline-block text-sm font-semibold px-3 py-1 rounded-full border ${cfg.color}`}>
      {cfg.label}
    </span>
  )
}

function HeroImage({ src, alt }) {
  const [failed, setFailed] = useState(false)
  if (failed) return (
    <div className="w-full h-full bg-gradient-to-br from-brand-blue to-brand-blueDark flex items-center justify-center">
      <span className="text-white/20 text-9xl font-black">∑</span>
    </div>
  )
  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover"
      onError={() => setFailed(true)}
    />
  )
}

export default function EventDetail() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const event    = findEvent(id)
  usePageTitle(event ? event.title : 'Event')

  if (!event) {
    return (
      <div className="pt-16 min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-2xl font-bold text-brand-blueDark">Event not found</p>
        <Link to="/events" className="text-brand-orange hover:underline">← Back to Events</Link>
      </div>
    )
  }

  return (
    <div>

      {/* Hero */}
      <section className="relative h-72 md:h-96 overflow-hidden bg-brand-blueDark">
        <HeroImage src={event.image} alt={event.title} />
        <div className="absolute inset-0 bg-brand-blueDark/60" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-sm mb-4 w-fit"
          >
            <ArrowLeft size={14} /> Back
          </button>
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
              {event.category}
            </span>
            <RegistrationBadge status={event.registrationStatus} />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white">{event.title}</h1>
        </div>
      </section>

      {/* Body */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-3 gap-8">

          {/* Main content */}
          <div className="md:col-span-2 space-y-6">

            {/* Event meta */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar size={18} className="text-brand-orange mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold">Date</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{event.date}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={18} className="text-brand-orange mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold">Time</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{event.time}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-brand-orange mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold">Venue</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{event.location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-brand-blueDark dark:text-white mb-3">About This Event</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">{event.fullDescription}</p>
            </div>

            {/* Highlights */}
            {event.highlights?.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-bold text-brand-blueDark dark:text-white mb-3">Highlights</h2>
                <ul className="space-y-2">
                  {event.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-600 dark:text-gray-300 text-sm">
                      <span className="text-brand-orange font-bold shrink-0">✦</span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">

            {/* Registration card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-brand-blueDark dark:text-white mb-4">Registration</h3>

              {event.registrationStatus === 'open' && event.registrationLink && (
                <a
                  href={event.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-yellow hover:text-brand-blueDark text-white font-bold py-3 rounded-xl transition-colors"
                >
                  Register Now <ExternalLink size={14} />
                </a>
              )}

              {event.registrationStatus === 'coming-soon' && (
                <div className="space-y-4">
                  {event.registrationDate && (
                    <CountdownTimer date={event.registrationDate} />
                  )}
                  <NotifyMeForm />
                </div>
              )}

              {event.registrationStatus === 'closed' && (
                <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-2">
                  Registration for this event has closed.
                </p>
              )}

              {event.registrationStatus === 'none' && (
                <p className="text-gray-500 text-sm text-center py-2">
                  No registration required.
                </p>
              )}
            </div>

            {/* Share / back */}
            <Link
              to="/events"
              className="w-full flex items-center justify-center gap-2 bg-brand-blueDark hover:bg-brand-blue text-white font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              <ArrowLeft size={14} /> All Events
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
