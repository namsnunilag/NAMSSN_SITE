import { useState } from 'react'
import { BookOpen, ExternalLink, Users } from 'lucide-react'
import { papers, mathFields } from '../data/papers'
import usePageTitle from '../hooks/usePageTitle'

function PaperCard({ paper }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-brand-blue/20 transition-all duration-200 flex flex-col gap-3">

      {/* Field badge */}
      <span className="self-start text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-blue/10 text-brand-blue dark:bg-brand-blue/20 dark:text-brand-blueLight">
        {paper.field}
      </span>

      {/* Title */}
      <h3 className="font-bold text-brand-blueDark dark:text-white text-base leading-snug">
        {paper.title}
      </h3>

      {/* Authors */}
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Users size={13} className="shrink-0 text-brand-orange" />
        <span>{paper.authors.join(', ')}</span>
      </div>

      {/* Journal & Year */}
      <div className="flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400">
        <BookOpen size={13} className="shrink-0 text-brand-orange mt-0.5" />
        <span className="italic">{paper.journal}, {paper.year}</span>
      </div>

      {/* Abstract toggle */}
      <div>
        <button
          onClick={() => setExpanded(e => !e)}
          className="text-xs text-brand-blue dark:text-brand-blueLight font-semibold hover:underline"
        >
          {expanded ? 'Hide abstract ▲' : 'Show abstract ▼'}
        </button>
        {expanded && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {paper.abstract}
          </p>
        )}
      </div>

      {/* External link */}
      {paper.link && (
        <a
          href={paper.link}
          target="_blank"
          rel="noopener noreferrer"
          className="self-start inline-flex items-center gap-1.5 text-sm font-semibold text-brand-orange hover:underline"
        >
          View Paper <ExternalLink size={13} />
        </a>
      )}
    </div>
  )
}

export default function Research() {
  usePageTitle(
    'Research',
    'Research papers by NAMSSN UNILAG lecturers across fields including Analysis, Algebra, Applied Mathematics, Statistics, Topology, and Differential Equations.'
  )

  const [activeField, setActiveField] = useState('All')

  const filtered = activeField === 'All'
    ? papers
    : papers.filter(p => p.field === activeField)

  // Group filtered papers by field for display
  const groups = activeField === 'All'
    ? mathFields.filter(f => f !== 'All').map(field => ({
        field,
        items: papers.filter(p => p.field === field),
      })).filter(g => g.items.length > 0)
    : [{ field: activeField, items: filtered }]

  return (
    <div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-blueDark to-brand-blue text-white py-20 px-4 text-center">
        <h1 className="hero-anim hero-anim-1 text-4xl md:text-5xl font-black mb-4">Research</h1>
        <p className="hero-anim hero-anim-2 text-blue-100 max-w-xl mx-auto">
          Published papers by NAMSSN UNILAG lecturers, grouped by field of mathematics.
        </p>
      </section>

      {/* Filter tabs */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-[var(--header-h,64px)] z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
            {mathFields.map(field => (
              <button
                key={field}
                onClick={() => setActiveField(field)}
                className={`shrink-0 text-sm font-semibold px-4 py-1.5 rounded-full transition-colors ${
                  activeField === field
                    ? 'bg-brand-orange text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-brand-blue/10 hover:text-brand-blue'
                }`}
              >
                {field}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Papers */}
      <section className="py-14 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 space-y-14">
          {groups.map(({ field, items }) => (
            <div key={field}>
              <h2 className="text-xl font-bold text-brand-blueDark dark:text-white mb-6 flex items-center gap-3">
                <span className="w-1 h-6 rounded-full bg-brand-orange inline-block" />
                {field}
                <span className="text-sm font-normal text-gray-400">({items.length} paper{items.length !== 1 ? 's' : ''})</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {items.map(paper => (
                  <PaperCard key={paper.id} paper={paper} />
                ))}
              </div>
            </div>
          ))}

          {groups.length === 0 && (
            <p className="text-gray-400 italic text-center py-12">No papers found for this field.</p>
          )}
        </div>
      </section>

    </div>
  )
}
