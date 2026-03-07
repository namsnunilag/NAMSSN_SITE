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
    registrationDate: 'March 25, 2025',
    registrationLink: null,
  },
  {
    id: 3,
    title: 'Annual Symposium 2025',
    date: 'June 14, 2025',
    time: '11:00 AM',
    location: 'Mathematics Department Seminar Room',
    category: 'Academic',
    image: '/images/events/SYM.jpg',
    shortDescription: 'Student research presentations and guest lectures from industry professionals.',
    fullDescription: `The Annual Symposium provides a platform for students to present their research projects and hear from distinguished alumni and industry professionals working in mathematics, data science, finance, and related fields. This is an invaluable networking and learning opportunity for all mathematical sciences students.`,
    highlights: [
      'Student research presentations',
      'Guest lectures from industry leaders',
      'Networking with NAMSSN alumni',
      'Q&A sessions with professionals',
    ],
    registrationStatus: 'coming-soon',
    registrationDate: 'May 1, 2025',
    registrationLink: null,
  },
]

export const pastEvents = [
  {
    id: 4,
    title: "HOD Games 2024",
    date: 'November 20, 2024',
    time: '9:00 AM',
    location: 'UNILAG Sports Complex',
    category: 'Sports',
    image: '/images/events/HOD.jpg',
    shortDescription: 'Annual HOD sports competition bringing together students and staff.',
    fullDescription: `The HOD Games 2024 was a fantastic event that brought together students and staff of the Mathematics Department for a day of friendly sporting competition. Events included football, volleyball, and relay races.`,
    highlights: [
      'Student vs staff matches',
      'Multiple sporting events',
      'Department unity and bonding',
    ],
    registrationStatus: 'closed',
    registrationDate: null,
    registrationLink: null,
  },
  {
    id: 5,
    title: 'Freshers Orientation 2024',
    date: 'October 5, 2024',
    time: '10:00 AM',
    location: 'Mathematics Department, UNILAG',
    category: 'Orientation',
    image: '/images/events/fo.jpg',
    shortDescription: 'Welcome event for new mathematical sciences students.',
    fullDescription: `The Freshers Orientation 2024 welcomed new students to the Department of Mathematics and to NAMSSN UNILAG. Students learned about department resources, NAMSSN activities, and got to meet their senior colleagues and executives.`,
    highlights: [
      'Welcome address from executives',
      'Department tour',
      'Meet-and-greet with senior students',
      'Introduction to NAMSSN activities',
    ],
    registrationStatus: 'closed',
    registrationDate: null,
    registrationLink: null,
  },
  {
    id: 6,
    title: 'DataMatics Workshop 2024',
    date: 'September 14, 2024',
    time: '1:00 PM',
    location: 'Computer Science Lab, UNILAG',
    category: 'Workshop',
    image: '/images/events/tem.png',
    shortDescription: 'Hands-on data analysis and Python programming workshop.',
    fullDescription: `DataMatics was a full-day hands-on workshop introducing students to data analysis using Python and Excel. Participants learned data cleaning, visualization, and basic statistical analysis with real-world datasets.`,
    highlights: [
      'Python & Excel for data analysis',
      'Real-world dataset projects',
      'Certificates of participation',
      'Hands-on coding sessions',
    ],
    registrationStatus: 'closed',
    registrationDate: null,
    registrationLink: null,
  },
]

export const registrationStatusConfig = {
  'open':        { label: 'Registration Open',   color: 'bg-green-100 text-green-800 border-green-200' },
  'coming-soon': { label: 'Registration Soon',   color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  'closed':      { label: 'Registration Closed', color: 'bg-red-100 text-red-700 border-red-200' },
  'none':        { label: '',                    color: '' },
}

export const allEvents = [...upcomingEvents, ...pastEvents]

export const findEvent = (id) => allEvents.find((e) => e.id === Number(id))
