import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { studentExecutives, pastStudentExecutives } from '../data/studentExecutives'
import usePageTitle from '../hooks/usePageTitle'

// ── Lecturers ────────────────────────────────────────────────────────────────
// Department lecturers, with the current HOD listed first.
const lecturers = [
  { name: 'Prof. Akewe H',       image: '/images/lecturers/akewe.jpg',       initials: 'AH' },
  { name: 'Prof. ABIALA I.O',    image: '/images/lecturers/abiala.jpg',      initials: 'AI' },
  { name: 'Prof. Olaleru J.O',   image: '/images/lecturers/olaleru.jpg',     initials: 'OJ' },
  { name: 'Prof. OKUNUGA S.A',   image: '/images/lecturers/okunuga.jpg',     initials: 'OS' },
  { name: 'Prof. MOGBADEMU A.A', image: '/images/lecturers/prof mogbademu.jpg', initials: 'MA' },
  { name: 'Dr. AKINFENWA O.A',  image: '/images/lecturers/akinfenwa.jpg',   initials: 'AO' },
  { name: 'Dr. EHIGIE J.O',     image: '/images/lecturers/ehigie.jpg',      initials: 'EJ' },
  { name: 'Dr. ABOLARINWA A',   image: '/images/lecturers/abolarinwa.jpg',  initials: 'AA' },
  { name: 'Dr. ADETUNJI P',     image: '/images/lecturers/adetunji.jpg',    initials: 'AP' },
  { name: 'Dr. AKINNUKAWE B',   image: '/images/lecturers/akinnukawe.jpg',  initials: 'AB' },
  { name: 'Dr. AROLOYE S.J',    image: '/images/lecturers/aroloye.jpg',     initials: 'AS' },
  { name: 'Dr. AYOADE A',       image: '/images/lecturers/ayoade.jpg',      initials: 'AA' },
  { name: 'Dr. EKE K',          image: '/images/lecturers/eke.jpg',         initials: 'EK' },
  { name: 'Dr. George O.O',     image: '/images/lecturers/george.jpg',      initials: 'GO' },
  { name: 'Dr. Hamzat A.I',     image: '/images/lecturers/hamzat.jpg',      initials: 'HA' },
  { name: 'Dr. Olaoluwa Hallowed Oluwadara', image: '/images/lecturers/Dr O. hallowed.jpg', initials: 'OHO' },
]

// ── Patrons ─────────────────────────────────────────────────────────────────
// Update names, titles, images as needed
const patrons = [
  {
    name: 'Professor Folasade Ogunsola',
    role: 'Vice Chancellor, University of Lagos',
    image: '/images/executives/vc.jpg',
    initials: 'FO',
  },
  {
    name: 'Professor Olayinka Taiwo Asekun',
    role: 'Dean, Faculty of Physical & Earth Sciences',
    image: '/images/executives/dean.jpg',
    initials: 'OA',
  },
  {
    name: 'Prof. Akewe H',
    role: 'Head of Department, Mathematics',
    image: '/images/lecturers/akewe.jpg',
    initials: 'AH',
  },
  {
    name: 'Dr. ADETUNJI P',
    role: 'Staff Adviser, Department of Mathematics',
    image: '/images/executives/ca.jpg',
    initials: 'PA',
  },
]

function PatronCard({ patron }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className="reveal bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="aspect-[3/4] bg-gradient-to-br from-brand-blue/20 to-brand-blueDark/20 overflow-hidden">
        {!failed ? (
          <img
            src={patron.image}
            alt={patron.name}
            className="w-full h-full object-cover object-top" loading="lazy"
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-blueDark to-brand-blue">
            <span className="text-white font-black text-3xl">{patron.initials}</span>
          </div>
        )}
      </div>
      <div className="px-3 py-2 text-center">
        <h3 className="font-bold text-brand-blueDark dark:text-white text-sm leading-tight">{patron.name}</h3>
        <p className="text-brand-orange text-xs font-medium mt-0.5">{patron.role}</p>
      </div>
    </div>
  )
}

function ExecCard({ exec }) {
  const [failed, setFailed] = useState(false)
  return (
    <Link
      to={`/student-executives/${exec.id}`}
      className="reveal group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-brand-blue/20 transition-all duration-200 hover:-translate-y-1"
    >
      <div className="aspect-[3/4] bg-gradient-to-br from-brand-blue/20 to-brand-blueDark/20 overflow-hidden">
        {!failed ? (
          <img
            src={exec.image}
            alt={exec.name}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300" loading="lazy"
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-blue to-brand-blueDark">
            <span className="text-white font-black text-3xl">{exec.initials}</span>
          </div>
        )}
      </div>
      <div className="px-3 py-3 text-center">
        <h3 className="font-bold text-brand-blueDark dark:text-white text-sm leading-tight">{exec.name}</h3>
        <p className="text-brand-orange text-xs font-medium mt-0.5">{exec.role}</p>
        <span className="inline-block mt-1.5 text-xs text-brand-blue dark:text-brand-blueLight font-semibold group-hover:underline">
          View Profile →
        </span>
      </div>
    </Link>
  )
}

function LecturerCard({ lecturer }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className="reveal bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="aspect-[3/4] bg-gradient-to-br from-brand-blue/20 to-brand-blueDark/20 overflow-hidden">
        {!failed ? (
          <img
            src={lecturer.image}
            alt={lecturer.name}
            className="w-full h-full object-cover object-top" loading="lazy"
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-blueDark to-brand-blue">
            <span className="text-white font-black text-3xl">{lecturer.initials}</span>
          </div>
        )}
      </div>
      <div className="px-3 py-2 text-center">
        <h3 className="font-bold text-brand-blueDark dark:text-white text-sm leading-tight">{lecturer.name}</h3>
      </div>
    </div>
  )
}

const TABS = {
  patrons:    { label: 'Patrons',            bg: 'bg-gray-50 dark:bg-gray-900' },
  lecturers:  { label: 'Lecturers',          bg: 'bg-white dark:bg-gray-800'   },
  executives: { label: 'Student Executives', bg: 'bg-gray-50 dark:bg-gray-900' },
}

export default function Executives() {
  usePageTitle('Executives & Lecturers', 'Meet the elected student executives and academic staff of the NAMSSN UNILAG chapter — the student leaders and lecturers of the Mathematics Department at the University of Lagos.')
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = searchParams.get('tab') || 'patrons'

  const setTab = (t) => setSearchParams({ tab: t })

  return (
    <div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-blueDark to-brand-blue text-white py-16 px-4 text-center">
        <h1 className="hero-anim hero-anim-1 text-4xl md:text-5xl font-black mb-4">Our Leadership</h1>
        <p className="hero-anim hero-anim-2 text-blue-100 max-w-xl mx-auto mb-8">
          Meet the patrons, lecturers, and student executives of NAMSSN UNILAG 2026/2027.
        </p>

        {/* Tab buttons */}
        <div className="hero-anim hero-anim-3 flex flex-wrap justify-center bg-white/10 rounded-2xl sm:rounded-full p-1 gap-1">
          {Object.entries(TABS).map(([key, { label }]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-3 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                tab === key
                  ? 'bg-brand-orange text-white shadow'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* ── Content ── */}
      <section className={`py-16 ${TABS[tab]?.bg || 'bg-white'}`}>
        <div className="max-w-6xl mx-auto px-4">

          {tab === 'patrons' && (
            <div key="patrons" className="tab-reveal">
              <h2 className="text-2xl font-bold text-brand-blueDark dark:text-white mb-2">Our Patrons</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8">Distinguished academics who guide and support NAMSSN UNILAG</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger">
                {patrons.map((p) => <PatronCard key={p.name} patron={p} />)}
              </div>
            </div>
          )}

          {tab === 'executives' && (
            <div key="executives" className="tab-reveal">
              <h2 className="text-2xl font-bold text-brand-blueDark dark:text-white mb-2">Student Executives</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8">The 2026/2027 NAMSSN UNILAG executive team.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 stagger">
                {studentExecutives.map(exec => <ExecCard key={exec.id} exec={exec} />)}
              </div>
              <details id="past-executives" className="border-t border-gray-200 dark:border-gray-700 mt-10 pt-6">
                <summary className="cursor-pointer text-lg font-bold text-brand-blueDark dark:text-white">Past Executives</summary>
                <div className="mt-5">
                  <h3 className="font-semibold text-gray-600 dark:text-gray-300 mb-4">2025/2026 Session</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 stagger">
                    {pastStudentExecutives.map(exec => <ExecCard key={exec.id} exec={exec} />)}
                  </div>
                </div>
              </details>
            </div>
          )}

          {tab === 'lecturers' && (
            <div key="lecturers" className="tab-reveal">
              <h2 className="text-2xl font-bold text-brand-blueDark dark:text-white mb-2">Our Lecturers</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8">Department of Mathematics, University of Lagos</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 stagger">
                {lecturers.map((l) => <LecturerCard key={l.name} lecturer={l} />)}
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  )
}
