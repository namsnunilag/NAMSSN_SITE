import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Mail, MessageCircle, Instagram, Linkedin } from 'lucide-react'

// Official X (Twitter) brand logo
const XLogo = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.213 5.567L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
  </svg>
)
import { studentExecutives } from '../data/studentExecutives'
import { pastStudentExecutives } from '../data/pastStudentExecutives'
import usePageTitle from '../hooks/usePageTitle'

export default function StudentExecutiveDetail() {
  const { id, archiveId } = useParams()
  const profileId = archiveId || id
  const execInCurrent = studentExecutives.find(e => e.id === profileId)
  const execInPast = pastStudentExecutives.find(e => e.id === profileId)
  const isPast = Boolean(archiveId) || (!execInCurrent && Boolean(execInPast))
  const roster = isPast ? pastStudentExecutives : studentExecutives
  const exec = execInCurrent || execInPast
  const [failed, setFailed] = useState(false)
  const currentIndex = roster.findIndex(e => e.id === profileId)
  const prev = roster[currentIndex - 1] || null
  const next = roster[currentIndex + 1] || null

  // Reset failed state and preload adjacent images on navigation
  useEffect(() => {
    setFailed(false)
    const toPreload = [prev?.profileImage || prev?.image, next?.profileImage || next?.image].filter(Boolean)
    toPreload.forEach(src => { const img = new Image(); img.src = src })
  }, [profileId, prev?.profileImage, next?.profileImage, prev?.image, next?.image])

  usePageTitle(exec ? exec.name : 'Executive')

  if (!exec) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-2xl font-bold text-brand-blueDark">Profile not found</p>
      <Link to="/student-executives" className="text-brand-orange hover:underline">← Back to Executives</Link>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* Hero banner */}
      <div className="bg-gradient-to-br from-brand-blueDark to-brand-blue h-48 relative">
        <div className="absolute inset-0 opacity-10 flex items-center justify-center select-none">
          <span className="text-white text-[12rem] font-black leading-none">{exec.initials}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-16">

        {/* Back link */}
        <div className="pt-6 mb-6">
          <Link to="/student-executives" className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-brand-orange transition-colors">
            <ArrowLeft size={14} /> Back to Executives
          </Link>
        </div>

        {/* Profile card — two columns on desktop */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="flex flex-col md:flex-row">

            {/* Left — photo + name + socials */}
            <div className="md:w-64 lg:w-72 shrink-0 flex flex-col items-center px-8 pt-8 pb-8 border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-700">
              <div className="w-48 sm:w-56 aspect-[3/4] rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-brand-blueDark to-brand-blue mb-4">
                {!failed ? (
                  <img
                    src={exec.profileImage || exec.image}
                    alt={exec.name}
                    className="w-full h-full object-cover object-top"
                    onError={() => setFailed(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white font-black text-4xl">
                    {exec.initials}
                  </div>
                )}
              </div>

              <span className="inline-block bg-brand-orange/10 text-brand-orange text-xs font-bold px-3 py-1 rounded-full mb-2">
                {exec.role}
              </span>
              <h1 className="text-lg font-black text-brand-blueDark dark:text-white text-center leading-tight">{exec.name}</h1>

              {/* Contact */}
              {(exec.whatsapp || exec.email || exec.instagram || exec.twitter || exec.linkedin) && (
                <div className="mt-6 w-full">
                  <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Get in Touch</h2>
                  <div className="flex flex-wrap gap-2">
                    {exec.whatsapp && (
                      <a
                        href={`https://wa.me/${exec.whatsapp.replace(/\D/g, '')}`}
                        target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-3 py-2 rounded-full transition-colors"
                      >
                        <MessageCircle size={13} /> WhatsApp
                      </a>
                    )}
                    {exec.email && (
                      <a
                        href={`mailto:${exec.email}`}
                        className="inline-flex items-center gap-1.5 bg-brand-orange hover:bg-brand-yellow hover:text-brand-blueDark text-white text-xs font-semibold px-3 py-2 rounded-full transition-colors"
                      >
                        <Mail size={13} /> Email
                      </a>
                    )}
                    {exec.instagram && (
                      <a
                        href={`https://instagram.com/${exec.instagram.replace('@','')}`}
                        target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-pink-500 hover:bg-pink-600 text-white text-xs font-semibold px-3 py-2 rounded-full transition-colors"
                      >
                        <Instagram size={13} /> Instagram
                      </a>
                    )}
                    {exec.twitter && (
                      <a
                        href={`https://x.com/${exec.twitter.replace('@','')}`}
                        target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-black hover:bg-gray-900 text-white text-xs font-semibold px-3 py-2 rounded-full transition-colors"
                      >
                        <XLogo size={13} /> X
                      </a>
                    )}
                    {exec.linkedin && (
                      <a
                        href={`https://linkedin.com/in/${exec.linkedin.replace('@','')}`}
                        target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-2 rounded-full transition-colors"
                      >
                        <Linkedin size={13} /> LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right — bio */}
            <div className="flex-1 px-8 py-8">
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">About</h2>
              <div className="space-y-4">
                {exec.bio.split('\n\n').map((para, i) => (
                  <p key={i} className="text-gray-600 dark:text-gray-300 leading-relaxed">{para}</p>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Prev / Next navigation */}
        <div className="flex justify-between gap-4 mt-8">
          {prev ? (
            <Link
              to={`/student-executives/${prev.id}`}
              className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 hover:border-brand-blue/30 transition-all text-sm font-semibold text-brand-blueDark dark:text-white"
            >
              <ArrowLeft size={14} />
              <span className="truncate max-w-[140px]">{prev.name.split(' ')[0]}</span>
            </Link>
          ) : <div />}
          {next && (
            <Link
              to={`/student-executives/${next.id}`}
              className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 hover:border-brand-blue/30 transition-all text-sm font-semibold text-brand-blueDark dark:text-white ml-auto"
            >
              <span className="truncate max-w-[140px]">{next.name.split(' ')[0]}</span>
              <ArrowLeft size={14} className="rotate-180" />
            </Link>
          )}
        </div>

      </div>
    </div>
  )
}
