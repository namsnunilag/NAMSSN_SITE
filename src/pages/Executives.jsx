import { useState } from 'react'

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
    name: 'Professor Abiala',
    role: 'Head of Department, Matheamatics',
    image: '/images/executives/hd.jpg',
    initials: 'HOD',
  },
  {
    name: 'Dr. Patience A. Adetunji',
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
  { name: 'Adesanya Racheal Teniola',        role: 'Financial Secretary',      image: '/images/executives/fin.jpg',          initials: 'AR' },
  { name: 'Oguntuga Demilade Gabriel',       role: 'Treasurer',                image: '/images/executives/treasurer.jpg',    initials: 'OD' },
  { name: 'Salami Malik Demola',             role: 'Social Secretary',         image: '/images/executives/social.jpg',       initials: 'SM' },
  { name: 'Azeezat Abdulazeez Temitope',    role: 'Welfare Director',         image: '/images/executives/welfare.jpg',      initials: 'AA' },
  { name: 'George Ademola Samuel',           role: 'Sports Secretary',         image: '/images/executives/sport.jpg',        initials: 'GA' },
  { name: 'Adebisi Oluwaseye Christopher',   role: 'Director of Studies',      image: '/images/executives/academic.jpg',     initials: 'AO' },
  { name: 'Aderibigbe Michael Oloruntomiwa', role: 'Librarian',                image: '/images/executives/library.jpg',      initials: 'AM' },
]

function PatronCard({ patron }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
      <div className="w-28 h-28 rounded-full mx-auto mb-4 overflow-hidden bg-brand-blue/10">
        {!failed ? (
          <img
            src={patron.image}
            alt={patron.name}
            className="w-full h-full object-cover"
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-blue to-brand-blueDark">
            <span className="text-white font-bold text-base">{patron.initials}</span>
          </div>
        )}
      </div>
      <h3 className="font-bold text-brand-blueDark text-base mb-0.5">{patron.name}</h3>
      <p className="text-brand-orange text-sm font-medium">{patron.role}</p>
    </div>
  )
}

function ExecCard({ exec }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="h-52 bg-gradient-to-br from-brand-blue/20 to-brand-blueDark/20 overflow-hidden">
        {!failed ? (
          <img
            src={exec.image}
            alt={exec.name}
            className="w-full h-full object-cover object-top"
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-blue to-brand-blueDark">
            <span className="text-white font-black text-3xl">{exec.initials}</span>
          </div>
        )}
      </div>
      <div className="p-4 text-center">
        <h3 className="font-bold text-brand-blueDark text-base">{exec.name}</h3>
        <p className="text-brand-orange text-sm font-medium">{exec.role}</p>
      </div>
    </div>
  )
}

export default function Executives() {
  return (
    <div className="pt-16">

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-blueDark to-brand-blue text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-black mb-4">Our Leadership</h1>
        <p className="text-blue-100 max-w-xl mx-auto">
          Meet the patrons and student executives driving NAMSSN UNILAG forward in 2024/2025.
        </p>
      </section>

      {/* ── Patrons ── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-brand-blueDark mb-2">Our Patrons</h2>
          <p className="text-gray-500 mb-8">Distinguished academics who guide and support NAMSSN UNILAG</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {patrons.map((p) => (
              <PatronCard key={p.name} patron={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Student Executives ── */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-brand-blueDark mb-2">Student Executives</h2>
          <p className="text-gray-500 mb-8">Your elected NAMSSN UNILAG executives for the 2024/2025 session</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {executives.map((e) => (
              <ExecCard key={e.role} exec={e} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
