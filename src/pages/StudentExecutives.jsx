import { useState } from 'react'
import { Link } from 'react-router-dom'
import { studentExecutives } from '../data/studentExecutives'
import { pastStudentExecutives } from '../data/pastStudentExecutives'
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
            className="w-full h-full object-cover object-top"
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
  usePageTitle('Student Executives', 'Meet the elected NAMSSN UNILAG student executives for the 2026/2027 session and browse past executives.')

  return (
    <div>
      <section className="bg-gradient-to-br from-brand-blueDark to-brand-blue text-white py-20 px-4 text-center">
        <h1 className="hero-anim hero-anim-1 text-4xl md:text-5xl font-black mb-4">Student Executives</h1>
        <p className="hero-anim hero-anim-2 text-blue-100 max-w-xl mx-auto">
          Your elected NAMSSN UNILAG leaders for the 2026/2027 session.
        </p>
      </section>

      <section className="py-16 bg-gray-50 dark:bg-gray-900 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-black text-brand-blueDark dark:text-white mb-6">2026/2027 Executive Team</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 stagger">
            {studentExecutives.map(exec => <ExecCard key={exec.id} exec={exec} />)}
          </div>
          <details id="past-executives" className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <summary className="cursor-pointer text-lg font-bold text-brand-blueDark dark:text-white">Past Executives</summary>
            <details className="mt-4 ml-4">
              <summary className="cursor-pointer font-semibold text-gray-600 dark:text-gray-300">2025/2026 Session</summary>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4 stagger mt-6">
                {pastStudentExecutives.map(exec => <ExecCard key={exec.id} exec={exec} />)}
              </div>
            </details>
          </details>
        </div>
      </section>
    </div>
  )
}
