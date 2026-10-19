// ── Shared events data ─────────────────────────────────────────────────────
// Edit this file to add/update/remove events.
// registrationStatus: 'open' | 'coming-soon' | 'closed' | 'none'

export const pastEvents = [
  {
    id: 1,
    title: 'Decagon 5.0',
    date: 'May – June 2026',
    time: 'TBA',
    location: 'University of Lagos',
    category: 'Competition',
    image: '/images/events/decagon5.jpg',
    shortDescription: 'The Ultimate Calculus Competition — 4 phases, 50+ competitors, 200+ audience, ₦340,000 in prizes.',
    fullDescription: `Decagon 5.0 is NAMSSN UNILAG's flagship annual calculus competition, now in its fifth edition. Running across May and June 2026, it is a multi-phase event that brings together the brightest mathematical minds from across the university.\n\nThe competition features four distinct phases — a 20-Day Calculus Challenge open to all, an exclusive Mini Conference, a multi-stage Main Competition, and a Grand Finale before an open audience of 200+ students, faculty, and delegates.\n\nFor enquiries, contact:\n+234 816 533 6309 | +234 903 449 5638`,
    highlights: [
      '50+ registered competitors, 10+ departments',
      '4 elimination stages leading to the Grand Finale',
      'Top 5 finalists compete live on stage in June 2026',
      '1st: ₦150,000 · 2nd: ₦100,000 · 3rd: ₦70,000',
      '20-Day Challenge open to all — ₦20,000 prize',
      'Mini Conference with faculty and expert speakers',
      'Open audience Grand Finale — 200+ expected',
      'Registration closed — competition underway',
    ],
    phases: [
      {
        num: '01',
        title: '20-Day Calculus Challenge',
        when: 'May 3, 2026',
        tag: 'Open to all',
        prize: '₦20,000 prize',
        desc: 'Starts May 3rd. A new calculus problem drops every day for 20 days. Anyone can join — no fee required. Points are awarded for correctness and speed.',
      },
      {
        num: '02',
        title: 'Mini Conference',
        when: 'May 2026',
        tag: 'Invite / Registration',
        prize: null,
        desc: 'Exclusive talks and structured Q&A sessions with faculty members and invited experts covering advanced topics in calculus and mathematical sciences.',
      },
      {
        num: '03',
        title: 'Main Calculus Competition',
        when: 'May 2026',
        tag: 'Registered competitors only',
        prize: null,
        desc: 'Registered competitors go through multiple elimination stages — online screening, written qualifying round, semi-final — until the top 5 are identified for the Grand Finale.',
      },
      {
        num: '04',
        title: 'Grand Finale & Awards',
        when: 'June 2026',
        tag: 'Open audience',
        prize: '₦150,000 · ₦100,000 · ₦70,000',
        desc: 'The top 5 finalists compete live on stage before an open audience of 200+ students, faculty, and delegates. Winners are crowned and prizes awarded.',
      },
    ],
    competitionPrizes: [
      { place: '1st', amount: '₦150,000', icon: '🥇' },
      { place: '2nd', amount: '₦100,000', icon: '🥈' },
      { place: '3rd', amount: '₦70,000',  icon: '🥉' },
    ],
    challengePrize: '₦20,000',
    theme: 'decagon',
    registrationStatus: 'closed',
    registrationDate: '2026-04-15',
    registrationLink: '/decagon',
  },
  {
    id: 2,
    title: "Dean's Games 2026",
    date: 'June 12, 2026',
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
    registrationStatus: 'closed',
    registrationDate: null,
  },
  {
    id: 3,
    session: '2026/2027 Session',
    title: 'Techmatics Bootcamp',
    date: 'September 21, 2026',
    time: 'Completed',
    location: 'Google Meet',
    category: 'Training',
    image: '/images/events/techmatics.jpg',
    shortDescription: 'A four-week bootcamp exploring mathematical applications and the role of mathematics in tech careers.',
    fullDescription: `Techmatics Bootcamp was a four-week training programme introducing undergraduates to mathematical applications and technology careers. The programme covered computational thinking, mathematical computing, digital productivity and AI, and career pathways for mathematics.\n\nThe programme has concluded.`,
    highlights: [
      'Computational thinking',
      'Mathematical computing',
      'Digital productivity and AI',
      'Career pathways for mathematics',
    ],
    registrationStatus: 'closed',
    registrationDate: null,
  },
]

export const upcomingEvents = []

export const registrationStatusConfig = {
  'open':        { label: 'Registration Open',   color: 'bg-green-100 text-green-800 border-green-200' },
  'coming-soon': { label: 'Registration Soon',   color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  'closed':      { label: 'Registration Closed', color: 'bg-red-100 text-red-700 border-red-200' },
  'none':        { label: '',                    color: '' },
}

export const allEvents = [...upcomingEvents, ...pastEvents]

export const findEvent = (id) => allEvents.find((e) => e.id === Number(id))
