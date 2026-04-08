// ── Shared events data ─────────────────────────────────────────────────────
// Edit this file to add/update/remove events.
// registrationStatus: 'open' | 'coming-soon' | 'closed' | 'none'

export const upcomingEvents = [
  {
    id: 1,
    title: 'Decagon 5.0',
    date: 'TBD',
    time: 'TBD',
    location: 'UNILAG',
    category: 'Competition',
    image: '/images/events/decagon5.jpg',
    shortDescription: 'The Ultimate Calculus Competition — 50+ participants, 10+ departments, 4 stages, ₦320,000 in prizes.',
    fullDescription: `Decagon 5.0 is NAMSSN UNILAG's flagship calculus competition, now in its fifth edition. Open to students across 10+ departments, this high-stakes, multi-stage contest challenges participants with rigorous calculus problems and rewards academic excellence.\n\nWith 50+ expected participants and 4 elimination stages, only the sharpest minds will rise to the top. Whether you're here to win or to test your limits, Decagon 5.0 is an experience worth competing in.\n\nFor enquiries, contact:\n+234 816 533 6309 | +234 903 449 5638`,
    highlights: [
      '50+ participants from across UNILAG',
      '10+ departments represented',
      '4 competitive stages',
      '1st Place: ₦150,000 | 2nd Place: ₦100,000 | 3rd Place: ₦70,000',
      'Registration opens April 15th',
    ],
    registrationStatus: 'coming-soon',
    registrationDate: '2026-04-15',
    registrationLink: null,
  },
  {
    id: 2,
    title: "Dean's Games 2025",
    date: 'May 3, 2025',
    time: '10:00 AM',
    location: 'UNILAG Sports Complex',
    category: 'Sports',
    image: '/images/events/deans.jpg',
    shortDescription: 'Inter-departmental sports competition fostering unity and healthy competition.',
    fullDescription: `The Dean's Games is an annual sporting event organized by the Faculty of Physical and Earth Sciences. NAMSSN UNILAG participates and competes in a range of sporting activities including football, basketball, table tennis, and track events. It's a time for bonding, fun, and displaying our competitive spirit beyond academics.`,
    highlights: [
      'Multiple sporting disciplines',
      'Inter-departmental competition',
      'Faculty-wide event with prizes',
      'Social networking opportunity',
    ],
    registrationStatus: 'coming-soon',
    registrationDate: null,
    registrationLink: null,
  },
]

export const pastEvents = []

export const registrationStatusConfig = {
  'open':        { label: 'Registration Open',   color: 'bg-green-100 text-green-800 border-green-200' },
  'coming-soon': { label: 'Registration Soon',   color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  'closed':      { label: 'Registration Closed', color: 'bg-red-100 text-red-700 border-red-200' },
  'none':        { label: '',                    color: '' },
}

export const allEvents = [...upcomingEvents, ...pastEvents]

export const findEvent = (id) => allEvents.find((e) => e.id === Number(id))
