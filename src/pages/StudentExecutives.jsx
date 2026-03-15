import { useState } from 'react'
import { Link } from 'react-router-dom'
import { studentExecutives } from '../data/studentExecutives'
import usePageTitle from '../hooks/usePageTitle'

function ExecCard({ exec }) {
  const [failed, setFailed] = useState(false)
  return (
    <Link
      to={`/student-executives/${exec.id}`}
      className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-brand-blue/20 transition-all duration-200 hover:-translate-y-1"
    >
      <div className="aspect-[3/4] bg-gradient-to-br from-brand-blue/20 to-brand-blueDark/20 overflow-hidden">
        {!failed ? (
          <img
            src={exec.image}
            alt={exec.name}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-blueDark to-brand-blue">
            <span className="text-white font-black text-3xl">{exec.initials}</span>
          </div>
        )}
      </div>
      <div className="px-3 py-3 text-center">
        <h3 className="font-bold text-brand-blueDark dark:text-white text-sm leading-tight">{exec.name}</h3>
        <p className="text-brand-orange text-xs font-medium mt-0.5">{exec.role}</p>
        <span className="inline-block mt-2 text-xs text-brand-blue dark:text-brand-blueLight font-semibold group-hover:underline">
          View Profile →
        </span>
      </div>
    </Link>
  )
}

export default function StudentExecutives() {
  usePageTitle('Student Executives', 'Meet the elected NAMSSN UNILAG student executives for the 2025/2026 session.')

  return (
    <div>
      <section className="bg-gradient-to-br from-brand-blueDark to-brand-blue text-white py-20 px-4 text-center">
        <h1 className="hero-anim hero-anim-1 text-4xl md:text-5xl font-black mb-4">Student Executives</h1>
        <p className="hero-anim hero-anim-2 text-blue-100 max-w-xl mx-auto">
          Your elected NAMSSN UNILAG leaders for the 2025/2026 session. Click any card to learn more and get in touch.
        </p>
      </section>

      <section className="py-16 bg-gray-50 dark:bg-gray-900 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 stagger">
            {studentExecutives.map(exec => (
              <ExecCard key={exec.id} exec={exec} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
