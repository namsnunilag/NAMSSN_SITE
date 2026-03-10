import { useState } from 'react'
import { Bell, BookOpen, FileText, Calendar, Download, ExternalLink, Megaphone, FlaskConical, Clock } from 'lucide-react'
import usePageTitle from '../hooks/usePageTitle'
import { announcements, courseMaterials, courseMaterialsLink, timetable } from '../data/academics'

const TABS = [
  { id: 'announcements', label: 'Announcements',    icon: Megaphone },
  { id: 'materials',     label: 'Course Materials', icon: BookOpen },
  { id: 'timetable',     label: 'Timetable',        icon: Calendar },
]

const announcementTypeConfig = {
  exam:     { color: 'bg-red-50 border-red-200 text-red-700',    badge: 'Exam', badgeColor: 'bg-red-100 text-red-700' },
  deadline: { color: 'bg-yellow-50 border-yellow-200',           badge: 'Deadline', badgeColor: 'bg-yellow-100 text-yellow-700' },
  result:   { color: 'bg-green-50 border-green-200',             badge: 'Result', badgeColor: 'bg-green-100 text-green-700' },
  general:  { color: 'bg-blue-50 border-blue-200',               badge: 'Notice', badgeColor: 'bg-blue-100 text-brand-blue' },
}

const LEVELS = ['100', '200', '300', '400', '500']

export default function Academics() {
  usePageTitle('Academics')
  const [activeTab, setActiveTab] = useState('announcements')
  const [levelFilter, setLevelFilter] = useState('all')

  const filteredMaterials = levelFilter === 'all'
    ? courseMaterials
    : courseMaterials.filter(m => m.level === levelFilter)

  return (
    <div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-blueDark to-brand-blue text-white py-20 px-4 text-center">
        <h1 className="hero-anim hero-anim-1 text-4xl md:text-5xl font-black mb-4">Academics</h1>
        <p className="hero-anim hero-anim-2 text-blue-100 max-w-xl mx-auto">
          Announcements, course materials, past questions, and timetables — all in one place.
        </p>
      </section>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-30">
        <div className="max-w-6xl mx-auto px-4 flex overflow-x-auto gap-1 py-1 scrollbar-hide">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold rounded-lg whitespace-nowrap transition-colors ${
                activeTab === id
                  ? 'text-brand-orange bg-brand-orange/10'
                  : 'text-gray-500 dark:text-gray-400 hover:text-brand-blueDark dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>
      </div>

      <section className="py-12 bg-gray-50 dark:bg-gray-900 min-h-[60vh]">
        <div className="max-w-6xl mx-auto px-4">

          {/* ── Announcements ── */}
          {activeTab === 'announcements' && (
            <div key="announcements" className="tab-reveal space-y-4">
              <h2 className="text-2xl font-bold text-brand-blueDark dark:text-white mb-6">Announcements</h2>
              {announcements.length === 0 ? (
                <EmptyState icon={Megaphone} text="No announcements at the moment. Check back soon." />
              ) : (
                announcements.map(a => {
                  const cfg = announcementTypeConfig[a.type] || announcementTypeConfig.general
                  return (
                    <div key={a.id} className={`rounded-2xl border p-5 ${cfg.color}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cfg.badgeColor}`}>
                              {cfg.badge}
                            </span>
                            <span className="text-xs text-gray-400">
                              {new Date(a.date).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                          </div>
                          <h3 className="font-bold text-gray-800 mb-1">{a.title}</h3>
                          <p className="text-sm text-gray-600 leading-relaxed">{a.content}</p>
                        </div>
                        <Bell size={16} className="text-gray-400 shrink-0 mt-1" />
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          )}

          {/* ── Course Materials ── */}
          {activeTab === 'materials' && (
            <div key="materials" className="tab-reveal">
              <h2 className="text-2xl font-bold text-brand-blueDark dark:text-white mb-6">Course Materials</h2>

              {/* Drive link — shows when set */}
              {courseMaterialsLink && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-brand-blue/20 dark:border-gray-700 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center shrink-0">
                      <BookOpen size={18} className="text-brand-blue" />
                    </div>
                    <div>
                      <p className="font-bold text-brand-blueDark dark:text-white">All Course Materials</p>
                      <p className="text-gray-400 dark:text-gray-500 text-sm">All levels — individual sorting coming soon</p>
                    </div>
                  </div>
                  <a
                    href={courseMaterialsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-yellow hover:text-brand-blueDark text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors"
                  >
                    <ExternalLink size={14} /> Open on Drive
                  </a>
                </div>
              )}

              {/* Individual cards (future use) */}
              {filteredMaterials.length > 0 && (
                <>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <button onClick={() => setLevelFilter('all')} className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${levelFilter === 'all' ? 'bg-brand-orange text-white' : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-brand-orange'}`}>All Levels</button>
                    {LEVELS.map(l => (
                      <button key={l} onClick={() => setLevelFilter(l)} className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${levelFilter === l ? 'bg-brand-orange text-white' : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-brand-orange'}`}>{l} Level</button>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredMaterials.map(m => (
                      <ResourceCard key={m.id} icon={m.type === 'pdf' ? FileText : ExternalLink} badge={`${m.level} Level`} title={m.title} subtitle={m.course} link={m.link} linkLabel={m.type === 'pdf' ? 'Download PDF' : 'Open Link'} isDownload={m.type === 'pdf'} />
                    ))}
                  </div>
                </>
              )}

              {!courseMaterialsLink && filteredMaterials.length === 0 && (
                <EmptyState icon={BookOpen} text="No course materials uploaded yet. Check back soon." />
              )}
            </div>
          )}

          {/* ── Timetable ── */}
          {activeTab === 'timetable' && (
            <div key="timetable" className="tab-reveal">
              <h2 className="text-2xl font-bold text-brand-blueDark dark:text-white mb-6">Timetable</h2>
              {!timetable.semester ? (
                <EmptyState icon={Calendar} text="No timetable uploaded yet. Check back when a new semester begins." />
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-brand-blueDark dark:text-white text-lg">{timetable.semester}</h3>
                    <div className="flex gap-3">
                      {timetable.pdf && (
                        <a
                          href={timetable.pdf}
                          download
                          className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-yellow hover:text-brand-blueDark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                        >
                          <Download size={14} /> Download PDF
                        </a>
                      )}
                    </div>
                  </div>
                  {timetable.image && (
                    <img
                      src={timetable.image}
                      alt="Timetable"
                      className="w-full rounded-xl border border-gray-100"
                    />
                  )}
                </div>
              )}
            </div>
          )}

        </div>
      </section>
    </div>
  )
}

function ResourceCard({ icon: Icon, badge, title, subtitle, link, linkLabel, isDownload }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center shrink-0">
          <Icon size={18} className="text-brand-blue" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-xs font-semibold text-brand-orange">{badge}</span>
          <h4 className="font-semibold text-brand-blueDark dark:text-white text-sm leading-snug mt-0.5">{title}</h4>
          {subtitle && <p className="text-gray-400 dark:text-gray-500 text-xs mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <a
        href={link}
        download={isDownload}
        target={!isDownload ? '_blank' : undefined}
        rel="noopener noreferrer"
        className="mt-auto inline-flex items-center gap-1.5 text-brand-orange hover:text-brand-blue text-sm font-semibold transition-colors"
      >
        {isDownload ? <Download size={13} /> : <ExternalLink size={13} />}
        {linkLabel}
      </a>
    </div>
  )
}

function EmptyState({ icon: Icon, text }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-20 h-20 rounded-full bg-brand-blue/10 flex items-center justify-center mb-4">
        <Icon size={36} className="text-brand-blue/40" />
      </div>
      <p className="text-gray-400 text-sm max-w-sm">{text}</p>
    </div>
  )
}
