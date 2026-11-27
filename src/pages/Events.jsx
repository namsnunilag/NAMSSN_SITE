import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, MapPin, Clock, ArrowRight, Ticket } from 'lucide-react'
import { upcomingEvents, pastEvents, registrationStatusConfig } from '../data/events'
import usePageTitle from '../hooks/usePageTitle'

const pastEventSessions = [...new Set(pastEvents.map(event => event.session || '2025/2026 Session'))]

function RegistrationBadge({ status }) {
  const cfg = registrationStatusConfig[status] || registrationStatusConfig['none']
  if (!cfg.label) return null
  return (
    <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full border ${cfg.color}`}>
      {cfg.label}
    </span>
  )
}

function EventCard({ event }) {
  const [imgFailed, setImgFailed] = useState(false)

  return (
    <Link
      to={`/events/${event.id}`}
      className="reveal group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 hover:border-brand-blue/20 transition-all duration-200 hover:-translate-y-1 flex flex-col"
    >
      {/* Image */}
      <div className="h-48 bg-gradient-to-br from-brand-blue to-brand-blueDark overflow-hidden relative">
        {!imgFailed ? (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-white/20 text-6xl font-black">∑</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 text-brand-blueDark text-xs font-semibold px-2.5 py-1 rounded-full">
            {event.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-brand-blueDark dark:text-white text-lg group-hover:text-brand-blue transition-colors leading-tight">
            {event.title}
          </h3>
          <RegistrationBadge status={event.registrationStatus} />
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4 flex-grow">{event.shortDescription}</p>
        <div className="space-y-1.5 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Calendar size={12} className="text-brand-orange shrink-0" />
            {event.date}
          </div>
          <div className="flex items-center gap-2">
            <Clock size={12} className="text-brand-orange shrink-0" />
            {event.time}
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={12} className="text-brand-orange shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <span className="text-brand-orange text-sm font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
            View Details <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </Link>
  )
}

function MovieNightCard() {
  const [availability, setAvailability] = useState(null)

  useEffect(() => {
    let active = true
    fetch('/api/movie-night/capacity')
      .then(response => {
        if (!response.ok) throw new Error('Ticket availability could not be loaded.')
        return response.json()
      })
      .then(data => { if (active) setAvailability(data) })
      .catch(() => { if (active) setAvailability({ unavailable: true }) })
    return () => { active = false }
  })

  const soldOut = availability?.remaining === 0

  return (
    <article className="reveal overflow-hidden rounded-2xl border border-blue-900/20 bg-[#07152e] text-white shadow-lg shadow-blue-950/10">
      <div className="grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="flex min-h-[260px] items-center justify-center bg-[#07152e] p-5 sm:p-8">
          <img
            src="/images/events/movie-night-flyer.jpeg"
            alt="NAMSSN Movie Night flyer"
            className="max-h-[440px] w-full rounded-xl object-contain"
            loading="lazy"
          />
        </div>
        <div className="flex flex-col justify-center p-6 sm:p-9">
          <span className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-blue-300/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-200">
            <Ticket size={13} /> Social Event
          </span>
          <h3 className="text-3xl font-black tracking-tight sm:text-4xl">NAMSSN Movie Night</h3>
          <p className="mt-2 text-lg font-medium text-blue-200">Your ticket to good vibes</p>
          <div className="mt-6 grid gap-3 text-sm text-blue-50 sm:grid-cols-2">
            <p className="flex items-center gap-2"><Calendar size={16} className="text-cyan-300" /> Dec 18, 2026</p>
            <p className="flex items-center gap-2"><Clock size={16} className="text-cyan-300" /> 6:00 PM Prompt</p>
            <p className="flex items-center gap-2 sm:col-span-2"><MapPin size={16} className="text-cyan-300" /> LT018, University of Lagos</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-xl border border-white/15 bg-white/5 px-4 py-3">
              <span className="block text-xs text-blue-200">Single Pass</span>
              <strong className="text-xl">₦2,000</strong>
            </span>
            <span className="rounded-xl border border-white/15 bg-white/5 px-4 py-3">
              <span className="block text-xs text-blue-200">Couples Pass</span>
              <strong className="text-xl">₦3,500</strong>
            </span>
          </div>
          {availability?.unavailable && (
            <p className="mt-4 text-sm text-amber-200">Ticket availability will be checked when you register.</p>
          )}
          {soldOut ? (
            <span role="status" className="mt-7 inline-flex w-fit rounded-full bg-white/15 px-6 py-3 font-bold text-white/60">Tickets Sold Out</span>
          ) : (
            <Link to="/events/movie-night" className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-cyan-300 px-6 py-3 font-bold text-[#06152e] transition hover:bg-cyan-200">
              Get your ticket <ArrowRight size={17} />
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}

export default function Events() {
  usePageTitle('Events', 'Upcoming NAMSSN UNILAG events including DECAGON mathematics competition, Dean\'s Games, and more. Register and stay updated on activities for maths students at UNILAG.')

  const eventStructuredData = {
    '@context': 'https://schema.org',
    '@graph': upcomingEvents.map(e => ({
      '@type': 'Event',
      name: e.title,
      description: e.shortDescription,
      startDate: e.date,
      location: {
        '@type': 'Place',
        name: e.location,
        address: { '@type': 'PostalAddress', addressLocality: 'Lagos', addressCountry: 'NG' },
      },
      organizer: {
        '@type': 'Organization',
        name: 'NAMSSN UNILAG Chapter',
        url: 'https://www.namssnunilag.one',
      },
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    })),
  }

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(eventStructuredData) }}
    />
    <div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-blueDark to-brand-blue text-white py-20 px-4 text-center">
        <h1 className="hero-anim hero-anim-1 text-4xl md:text-5xl font-black mb-4">Events</h1>
        <p className="hero-anim hero-anim-2 text-blue-100 max-w-xl mx-auto">
          Stay up to date with NAMSSN UNILAG's competitions, workshops, social events, and more.
        </p>
      </section>

      {/* Upcoming */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="reveal text-2xl font-bold text-brand-blueDark dark:text-white mb-2">Upcoming Events</h2>
          <p className="reveal text-gray-500 dark:text-gray-400 mb-8">Don't miss out. Register before spots fill up!</p>
          <div className="space-y-6">
            <MovieNightCard />
            {upcomingEvents.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
                {upcomingEvents.map(e => <EventCard key={e.id} event={e} />)}
              </div>
            )}
          </div>

          <details className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-6">
            <summary className="cursor-pointer text-lg font-bold text-brand-blueDark dark:text-white">Past Events</summary>
            {pastEventSessions.map(session => (
              <details key={session} className="mt-4 ml-4">
                <summary className="cursor-pointer font-semibold text-gray-600 dark:text-gray-300">{session}</summary>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 stagger">
                  {pastEvents.filter(event => (event.session || '2025/2026 Session') === session).map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </details>
            ))}
          </details>
        </div>
      </section>

    </div>
    </>
  )
}
