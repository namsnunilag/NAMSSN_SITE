import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  Calendar, MapPin, Clock, ArrowLeft, ExternalLink,
  Bell, CheckCircle2, Trophy, BookOpen, Mic, Zap, Users, Layers, Star,
} from 'lucide-react'
import { findEvent, registrationStatusConfig } from '../data/events'
import usePageTitle from '../hooks/usePageTitle'

// ── Countdown hook ────────────────────────────────────────────────────────────
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

// ── Generic event components ──────────────────────────────────────────────────
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
  const [email, setEmail]     = useState('')
  const [sent, setSent]       = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
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
      <div className="flex flex-col gap-2">
        <input type="email" required placeholder="your@email.com" value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
        />
        <button type="submit" disabled={loading}
          className="w-full bg-brand-orange hover:bg-brand-yellow hover:text-brand-blueDark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5">
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
  return <img src={src} alt={alt} className="w-full h-full object-cover" onError={() => setFailed(true)} />
}

// ── Decagon-themed countdown (dark) ───────────────────────────────────────────
function DecagonCountdown({ date }) {
  const t = useCountdown(date)
  if (!t) return null
  return (
    <div>
      <p className="text-xs text-gray-400 uppercase tracking-wider mb-2 font-semibold">
        Registration opens in
      </p>
      <div className="grid grid-cols-4 gap-2">
        {[['Days', t.days], ['Hrs', t.hours], ['Min', t.minutes], ['Sec', t.seconds]].map(([label, val]) => (
          <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-2 text-center">
            <span className="block text-xl font-black text-cyan-400 tabular-nums">
              {String(val).padStart(2, '0')}
            </span>
            <span className="text-xs text-gray-500">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function DecagonNotifyForm() {
  const [email, setEmail]     = useState('')
  const [sent, setSent]       = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, _subject: 'Decagon 5.0 Notification Signup' }),
      })
    } catch (_) { /* silent fail */ }
    setSent(true)
    setLoading(false)
  }

  if (sent) return (
    <div className="flex items-center gap-2 text-cyan-400 text-sm font-medium">
      <CheckCircle2 size={16} /> We will notify you when registration opens!
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <p className="text-xs text-gray-500">Get notified when registration opens:</p>
      <input type="email" required placeholder="your@email.com" value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full text-sm bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder-gray-500
                   focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
      />
      <button type="submit" disabled={loading}
        className="w-full bg-brand-orange hover:bg-brand-yellow hover:text-[#0D1B2A] text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5">
        <Bell size={14} /> Notify Me
      </button>
    </form>
  )
}

// ── Decagon-themed full page ──────────────────────────────────────────────────
function DecagonEventDetail({ event, navigate }) {
  const phaseIcons = { '01': BookOpen, '02': Mic, '03': Zap, '04': Trophy }

  const prizes = [
    event.competitionPrizes?.find(p => p.place === '2nd'),
    event.competitionPrizes?.find(p => p.place === '1st'),
    event.competitionPrizes?.find(p => p.place === '3rd'),
  ].filter(Boolean)

  return (
    <div className="min-h-screen" style={{ background: '#0D1B2A', color: '#fff' }}>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden px-4 pt-16 pb-20 text-center">
        {/* grid bg */}
        <div className="absolute inset-0 opacity-[0.035]"
          style={{ backgroundImage: 'linear-gradient(#00CCFF 1px,transparent 1px),linear-gradient(90deg,#00CCFF 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
        {/* glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[320px] rounded-full blur-[140px] opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse,#00CCFF,transparent)' }} />

        <div className="relative max-w-3xl mx-auto">
          {/* Back button */}
          <button onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-gray-400 hover:text-white text-sm mb-8 transition-colors">
            <ArrowLeft size={14} /> Back to Events
          </button>

          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400 mb-4">
            NAMSSN UNILAG · Department of Mathematics
          </p>

          {/* Official SVG logo */}
          <img src="/images/decagon-logo.svg" alt="Decagon 5.0"
            className="mx-auto mb-6 w-72 sm:w-96 max-w-full" />

          <p className="text-xl text-gray-300 font-semibold mb-3">The Ultimate Calculus Competition</p>

          {/* Meta */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 mb-10">
            <span className="flex items-center gap-1.5"><Calendar size={14} className="text-cyan-400" /> May – June 2026</span>
            <span className="text-white/10">|</span>
            <span className="flex items-center gap-1.5"><MapPin size={14} className="text-cyan-400" /> University of Lagos</span>
            <span className="text-white/10">|</span>
            <span className="flex items-center gap-1.5"><Users size={14} className="text-cyan-400" /> 200+ expected</span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            {[
              { icon: Layers, value: '4',    label: 'Phases' },
              { icon: Users,  value: '50+',  label: 'Competitors' },
              { icon: Star,   value: '4',    label: 'Comp. Stages' },
              { icon: Trophy, value: '₦370k', label: 'Total Prizes' },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                <Icon size={17} className="text-cyan-400 mx-auto mb-2" />
                <p className="text-2xl font-black text-white">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Body ── */}
      <div className="max-w-5xl mx-auto px-4 pb-24">
        <div className="grid md:grid-cols-3 gap-8">

          {/* Main content */}
          <div className="md:col-span-2 space-y-8">

            {/* About */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
              <h2 className="text-lg font-black text-white mb-3">About Decagon 5.0</h2>
              <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">{event.fullDescription}</p>
            </div>

            {/* Phases */}
            {event.phases?.length > 0 && (
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                <h2 className="text-lg font-black text-white mb-4">Event Phases</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {event.phases.map(p => {
                    const Icon = phaseIcons[p.num] || Trophy
                    const accents = {
                      '01': 'border-cyan-400/30 bg-cyan-400/5',
                      '02': 'border-white/10 bg-white/[0.02]',
                      '03': 'border-brand-orange/20 bg-brand-orange/5',
                      '04': 'border-yellow-400/20 bg-yellow-400/5',
                    }
                    return (
                      <div key={p.num} className={`border rounded-2xl p-4 space-y-2 ${accents[p.num] || 'border-white/10'}`}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                              <Icon size={14} className="text-cyan-300" />
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Phase {p.num}</p>
                              <p className="text-sm font-black text-white leading-tight">{p.title}</p>
                            </div>
                          </div>
                          <span className="text-xs text-gray-600 whitespace-nowrap shrink-0">{p.when}</span>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">{p.desc}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {p.prize && (
                            <span className="text-xs font-bold text-brand-orange bg-brand-orange/10 border border-brand-orange/20 px-2 py-0.5 rounded-full">
                              {p.prize}
                            </span>
                          )}
                          <span className="text-xs text-gray-500 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">{p.tag}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Grand Finale Prizes */}
            {prizes.length > 0 && (
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                <h2 className="text-lg font-black text-white mb-4">Grand Finale Prizes</h2>
                <div className="flex flex-col sm:flex-row items-end justify-center gap-3">
                  {prizes.map(p => (
                    <div key={p.place}
                      className={`w-full sm:w-44 rounded-2xl p-5 text-center border ${
                        p.place === '1st'
                          ? 'bg-brand-orange/10 border-brand-orange/40 sm:-translate-y-3'
                          : 'bg-white/[0.03] border-white/10'
                      }`}
                    >
                      <div className="text-3xl mb-2">{p.icon}</div>
                      <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">{p.place} Place</p>
                      <p className={`text-2xl font-black ${p.place === '1st' ? 'text-brand-orange' : 'text-white'}`}>{p.amount}</p>
                    </div>
                  ))}
                </div>
                {event.challengePrize && (
                  <p className="text-center text-sm text-gray-600 mt-4">
                    + <span className="text-cyan-400 font-semibold">₦20,000</span> for the 20-Day Challenge winner
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">

            {/* Registration card */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
              <h3 className="font-black text-white mb-4">Registration</h3>

              {event.registrationStatus === 'open' && event.registrationLink && (
                <a href={event.registrationLink} target="_blank" rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-yellow hover:text-[#0D1B2A] text-white font-bold py-3 rounded-xl transition-colors">
                  Register Now <ExternalLink size={14} />
                </a>
              )}

              {event.registrationStatus === 'coming-soon' && (
                <div className="space-y-4">
                  {event.registrationDate && <DecagonCountdown date={event.registrationDate} />}
                  <DecagonNotifyForm />
                </div>
              )}

              {event.registrationStatus === 'closed' && (
                <p className="text-gray-500 text-sm text-center py-2">Registration for this event has closed.</p>
              )}
            </div>

            {/* Back to events */}
            <Link to="/events"
              className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-semibold py-3 rounded-xl transition-colors text-sm">
              <ArrowLeft size={14} /> All Events
            </Link>

            {/* Contact */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-center space-y-1">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Enquiries</p>
              <p className="text-xs text-gray-500">+234 816 533 6309</p>
              <p className="text-xs text-gray-500">+234 903 449 5638</p>
              <p className="text-xs text-gray-600">@namssn_unilag</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Generic event detail ──────────────────────────────────────────────────────
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

  // Render Decagon-branded page for Decagon events
  if (event.theme === 'decagon') {
    return <DecagonEventDetail event={event} navigate={navigate} />
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative h-72 md:h-96 overflow-hidden bg-brand-blueDark">
        <HeroImage src={event.image} alt={event.title} />
        <div className="absolute inset-0 bg-brand-blueDark/60" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
          <button onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-sm mb-4 w-fit">
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
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-brand-blueDark dark:text-white mb-4">Registration</h3>

              {event.registrationStatus === 'open' && event.registrationLink && (
                <a href={event.registrationLink} target="_blank" rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-yellow hover:text-brand-blueDark text-white font-bold py-3 rounded-xl transition-colors">
                  Register Now <ExternalLink size={14} />
                </a>
              )}

              {event.registrationStatus === 'coming-soon' && (
                <div className="space-y-4">
                  {event.registrationDate && <CountdownTimer date={event.registrationDate} />}
                  <NotifyMeForm />
                </div>
              )}

              {event.registrationStatus === 'closed' && (
                <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-2">
                  Registration for this event has closed.
                </p>
              )}

              {event.registrationStatus === 'none' && (
                <p className="text-gray-500 text-sm text-center py-2">No registration required.</p>
              )}
            </div>

            <Link to="/events"
              className="w-full flex items-center justify-center gap-2 bg-brand-blueDark hover:bg-brand-blue text-white font-semibold py-3 rounded-xl transition-colors text-sm">
              <ArrowLeft size={14} /> All Events
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
