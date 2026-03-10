import { Link } from 'react-router-dom'
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react'
import { upcomingEvents, registrationStatusConfig } from '../data/events'
import usePageTitle from '../hooks/usePageTitle'

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
      className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 hover:border-brand-blue/20 transition-all duration-200 hover:-translate-y-1 flex flex-col"
    >
      {/* Image */}
      <div className="h-48 bg-gradient-to-br from-brand-blue to-brand-blueDark overflow-hidden relative">
        {!imgFailed ? (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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

import { useState } from 'react'

export default function Events() {
  usePageTitle('Events')
  return (
    <div className="pt-16">

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-blueDark to-brand-blue text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-black mb-4">Events</h1>
        <p className="text-blue-100 max-w-xl mx-auto">
          Stay up to date with NAMSSN UNILAG's competitions, workshops, social events, and more.
        </p>
      </section>

      {/* Upcoming */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-brand-blueDark dark:text-white mb-2">Upcoming Events</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Don't miss out — register before spots fill up!</p>
          {upcomingEvents.length === 0 ? (
            <p className="text-gray-400 italic">No upcoming events at the moment. Check back soon!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map(e => <EventCard key={e.id} event={e} />)}
            </div>
          )}
        </div>
      </section>

    </div>
  )
}
