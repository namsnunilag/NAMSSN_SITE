import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import usePageTitle from '../hooks/usePageTitle'

// ── Lecturers ────────────────────────────────────────────────────────────────
// Prof. ABIALA first (HOD), then remaining Profs, then Drs. ADETUNJI in middle.
const lecturers = [
  { name: 'Prof. ABIALA I.O',    image: '/images/lecturers/abiala.jpg',      initials: 'AI' },
  { name: 'Prof. Akewe H',       image: '/images/lecturers/akewe.jpg',       initials: 'AH' },
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
    name: 'Prof. ABIALA I.O',
    role: 'Head of Department, Mathematics',
    image: '/images/executives/hd.jpg',
    initials: 'AI',
  },
  {
    name: 'Dr. ADETUNJI P',
    role: 'Staff Adviser, Department of Mathematics',
    image: '/images/executives/ca.jpg',
    initials: 'PA',
  },
]

// ── Student Executives ───────────────────────────────────────────────────────
// Update names and image filenames as needed
const executives = [
  { name: 'Oludare Samuel Oladapo',          role: 'President',                image: '/images/executives/president.jpg',  initials: 'OO' },
  { name: 'Amure McDonald Oluwatunmibewo',   role: 'Vice President',           image: '/images/executives/vp.jpg',          initials: 'AM' },
  { name: 'Chukwuma Miran-Ambrose',          role: 'General Secretary',        image: '/images/executives/gs.jpg',          initials: 'CM' },
  { name: 'Akesinro Damilola Gold',          role: 'Asst. General Secretary',  image: '/images/executives/ags.jpg',          initials: 'AG' },
  { name: 'Olowolayemo Temiloluwa Mercy',    role: 'Public Relations Officer', image: '/images/executives/pro.jpg',          initials: 'OT' },
  { name: 'Azeezat Abdulazeez Temitope',     role: 'Financial Secretary',      image: '/images/executives/fin.jpg',          initials: 'AR' },
  { name: 'Oguntuga Demilade Gabriel',       role: 'Treasurer',                image: '/images/executives/treasurer.jpg',    initials: 'OD' },
  { name: 'Salami Malik Demola',             role: 'Social Secretary',         image: '/images/executives/social.jpg',       initials: 'SM' },
  { name: 'Adesanya Racheal Teniola',        role: 'Welfare Director',         image: '/images/executives/welfare.jpg',      initials: 'AA' },
  { name: 'George Ademola Samuel',           role: 'Sports Secretary',         image: '/images/executives/sport.jpg',        initials: 'GA' },
  { name: 'Adebisi Oluwaseye Christopher',   role: 'Director of Studies',      image: '/images/executives/academic.jpg',     initials: 'AO' },
  { name: 'Aderibigbe Michael Oloruntomiwa', role: 'Librarian',                image: '/images/executives/library.jpg',      initials: 'AM' },
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
    <div className="reveal bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="aspect-[3/4] bg-gradient-to-br from-brand-blue/20 to-brand-blueDark/20 overflow-hidden">
        {!failed ? (
          <img
            src={exec.image}
            alt={exec.name}
            className="w-full h-full object-cover object-top" loading="lazy"
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-blue to-brand-blueDark">
            <span className="text-white font-black text-3xl">{exec.initials}</span>
          </div>
        )}
      </div>
      <div className="px-3 py-2 text-center">
        <h3 className="font-bold text-brand-blueDark dark:text-white text-sm leading-tight">{exec.name}</h3>
        <p className="text-brand-orange text-xs font-medium mt-0.5">{exec.role}</p>
      </div>
    </div>
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
  usePageTitle('Executives & Lecturers')
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = searchParams.get('tab') || 'patrons'

  const setTab = (t) => setSearchParams({ tab: t })

  return (
    <div className="pt-16">

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-blueDark to-brand-blue text-white py-16 px-4 text-center">
        <h1 className="hero-anim hero-anim-1 text-4xl md:text-5xl font-black mb-4">Our Leadership</h1>
        <p className="hero-anim hero-anim-2 text-blue-100 max-w-xl mx-auto mb-8">
          Meet the patrons, lecturers, and student executives of NAMSSN UNILAG 2025/2026.
        </p>

        {/* Tab buttons */}
        <div className="hero-anim hero-anim-3 inline-flex bg-white/10 rounded-full p-1 gap-1">
          {Object.entries(TABS).map(([key, { label }]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
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
              <p className="text-gray-500 dark:text-gray-400 mb-8">Your elected NAMSSN UNILAG executives for the 2025/2026 session</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 stagger">
                {executives.map((e) => <ExecCard key={e.role} exec={e} />)}
              </div>
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
