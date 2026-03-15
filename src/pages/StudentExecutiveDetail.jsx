import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Mail, MessageCircle, Instagram, Twitter, Linkedin } from 'lucide-react'
import { studentExecutives } from '../data/studentExecutives'
import usePageTitle from '../hooks/usePageTitle'

export default function StudentExecutiveDetail() {
  const { id } = useParams()
  const exec = studentExecutives.find(e => e.id === id)
  const [failed, setFailed] = useState(false)

  usePageTitle(exec ? exec.name : 'Executive')

  if (!exec) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-2xl font-bold text-brand-blueDark">Profile not found</p>
      <Link to="/student-executives" className="text-brand-orange hover:underline">← Back to Executives</Link>
    </div>
  )

  const currentIndex = studentExecutives.findIndex(e => e.id === id)
  const prev = studentExecutives[currentIndex - 1] || null
  const next = studentExecutives[currentIndex + 1] || null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* Hero banner */}
      <div className="bg-gradient-to-br from-brand-blueDark to-brand-blue h-48 relative">
        <div className="absolute inset-0 opacity-10 flex items-center justify-center select-none">
          <span className="text-white text-[12rem] font-black leading-none">{exec.initials}</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-16">

        {/* Back link */}
        <div className="pt-6 mb-6">
          <Link to="/student-executives" className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-brand-orange transition-colors">
            <ArrowLeft size={14} /> Back to Executives
          </Link>
        </div>

        {/* Profile card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">

          {/* Top section — photo + name */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 px-8 pt-8 pb-6 border-b border-gray-100 dark:border-gray-700">
            <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-lg shrink-0 bg-gradient-to-br from-brand-blueDark to-brand-blue">
              {!failed ? (
                <img
                  src={exec.image}
                  alt={exec.name}
                  className="w-full h-full object-cover object-top"
                  onError={() => setFailed(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white font-black text-3xl">
                  {exec.initials}
                </div>
              )}
            </div>
            <div className="text-center sm:text-left">
              <span className="inline-block bg-brand-orange/10 text-brand-orange text-xs font-bold px-3 py-1 rounded-full mb-2">
                {exec.role}
              </span>
              <h1 className="text-2xl md:text-3xl font-black text-brand-blueDark dark:text-white">{exec.name}</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">NAMSSN UNILAG · 2025/2026 Session</p>
            </div>
          </div>

          {/* Bio */}
          <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">About</h2>
            <div className="space-y-4">
              {exec.bio.split('\n\n').map((para, i) => (
                <p key={i} className="text-gray-600 dark:text-gray-300 leading-relaxed">{para}</p>
              ))}
            </div>
          </div>

          {/* Contact */}
          {(exec.whatsapp || exec.email || exec.instagram || exec.twitter || exec.linkedin) && (
            <div className="px-8 py-6">
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Get in Touch</h2>
              <div className="flex flex-wrap gap-3">
                {exec.whatsapp && (
                  <a
                    href={`https://wa.me/${exec.whatsapp.replace(/\D/g, '')}`}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors"
                  >
                    <MessageCircle size={15} /> WhatsApp
                  </a>
                )}
                {exec.email && (
                  <a
                    href={`mailto:${exec.email}`}
                    className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-yellow hover:text-brand-blueDark text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors"
                  >
                    <Mail size={15} /> Email
                  </a>
                )}
                {exec.instagram && (
                  <a
                    href={`https://instagram.com/${exec.instagram.replace('@','')}`}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors"
                  >
                    <Instagram size={15} /> Instagram
                  </a>
                )}
                {exec.twitter && (
                  <a
                    href={`https://twitter.com/${exec.twitter.replace('@','')}`}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors"
                  >
                    <Twitter size={15} /> Twitter
                  </a>
                )}
                {exec.linkedin && (
                  <a
                    href={`https://linkedin.com/in/${exec.linkedin.replace('@','')}`}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors"
                  >
                    <Linkedin size={15} /> LinkedIn
                  </a>
                )}
              </div>
            </div>
          )}
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
