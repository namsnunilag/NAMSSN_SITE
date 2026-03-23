// ── Shared events data ─────────────────────────────────────────────────────
// Edit this file to add/update/remove events.
// registrationStatus: 'open' | 'coming-soon' | 'closed' | 'none'

export const upcomingEvents = [
  {
    id: 1,
    title: 'DECAGON 2025',
    date: 'April 12, 2025',
    time: '9:00 AM',
    location: 'Faculty of Science Auditorium, UNILAG',
    category: 'Competition',
    image: '/images/events/dec.jpg',
    shortDescription: 'Annual inter-departmental mathematics competition open to all science students.',
    fullDescription: `DECAGON is NAMSSN UNILAG's flagship annual mathematics competition. It brings together the brightest mathematical minds from across the university to compete in a series of challenging problems covering algebra, calculus, statistics, and mathematical reasoning. The competition promotes academic excellence and friendly rivalry among departments.`,
    highlights: [
      'Open to all UNILAG science students',
      'Cash prizes for top 3 positions',
      'Certificates for all participants',
      'Problem sets from algebra, calculus, stats & logic',
    ],
    registrationStatus: 'open',
    registrationDate: null,
    registrationLink: 'https://forms.gle/your-decagon-form',
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
