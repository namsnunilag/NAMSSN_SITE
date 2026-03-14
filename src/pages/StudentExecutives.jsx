import { useState } from 'react'
import { Mail, MessageCircle, Instagram, Twitter, X, ChevronRight } from 'lucide-react'
import usePageTitle from '../hooks/usePageTitle'

// ── Executive data — fill in bio, email, whatsapp, instagram, twitter ────────
const executives = [
  {
    name: 'Oludare Samuel Oladapo',
    role: 'President',
    image: '/images/executives/president.jpg',
    initials: 'OO',
    bio: 'Add bio here.',
    email: '',
    whatsapp: '',
    instagram: '',
    twitter: '',
  },
  {
    name: 'Amure McDonald Oluwatunmibewo',
    role: 'Vice President',
    image: '/images/executives/vp.jpg',
    initials: 'AM',
    bio: 'Add bio here.',
    email: '',
    whatsapp: '',
    instagram: '',
    twitter: '',
  },
  {
    name: 'Chukwuma Miran-Ambrose',
    role: 'General Secretary',
    image: '/images/executives/gs.jpg',
    initials: 'CM',
    bio: 'Add bio here.',
    email: '',
    whatsapp: '',
    instagram: '',
    twitter: '',
  },
  {
    name: 'Akesinro Damilola Gold',
    role: 'Asst. General Secretary',
    image: '/images/executives/ags.jpg',
    initials: 'AG',
    bio: 'Add bio here.',
    email: '',
    whatsapp: '',
    instagram: '',
    twitter: '',
  },
  {
    name: 'Olowolayemo Temiloluwa Mercy',
    role: 'Public Relations Officer',
    image: '/images/executives/pro.jpg',
    initials: 'OT',
    bio: 'Add bio here.',
    email: '',
    whatsapp: '',
    instagram: '',
    twitter: '',
  },
  {
    name: 'Azeezat Abdulazeez Temitope',
    role: 'Financial Secretary',
    image: '/images/executives/fin.jpg',
    initials: 'AR',
    bio: 'Add bio here.',
    email: '',
    whatsapp: '',
    instagram: '',
    twitter: '',
  },
  {
    name: 'Oguntuga Demilade Gabriel',
    role: 'Treasurer',
    image: '/images/executives/treasurer.jpg',
    initials: 'OD',
    bio: 'Add bio here.',
    email: '',
    whatsapp: '',
    instagram: '',
    twitter: '',
  },
  {
    name: 'Salami Malik Demola',
    role: 'Social Secretary',
    image: '/images/executives/social.jpg',
    initials: 'SM',
    bio: 'Add bio here.',
    email: '',
    whatsapp: '',
    instagram: '',
    twitter: '',
  },
  {
    name: 'Adesanya Racheal Teniola',
    role: 'Welfare Director',
    image: '/images/executives/welfare.jpg',
    initials: 'AA',
    bio: 'Add bio here.',
    email: '',
    whatsapp: '',
    instagram: '',
    twitter: '',
  },
  {
    name: 'George Ademola Samuel',
    role: 'Sports Secretary',
    image: '/images/executives/sport.jpg',
    initials: 'GA',
    bio: 'Add bio here.',
    email: '',
    whatsapp: '',
    instagram: '',
    twitter: '',
  },
  {
    name: 'Adebisi Oluwaseye Christopher',
    role: 'Director of Studies',
    image: '/images/executives/academic.jpg',
    initials: 'AO',
    bio: 'Add bio here.',
    email: '',
    whatsapp: '',
    instagram: '',
    twitter: '',
  },
  {
    name: 'Aderibigbe Michael Oloruntomiwa',
    role: 'Librarian',
    image: '/images/executives/library.jpg',
    initials: 'AM',
    bio: 'Add bio here.',
    email: '',
    whatsapp: '',
    instagram: '',
    twitter: '',
  },
]

const roleColors = {
  'President':               'bg-brand-orange/10 text-brand-orange border-brand-orange/20',
  'Vice President':          'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300',
  'General Secretary':       'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300',
  'Asst. General Secretary': 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300',
  'Public Relations Officer':'bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300',
  'Financial Secretary':     'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300',
  'Treasurer':               'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300',
  'Social Secretary':        'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300',
  'Welfare Director':        'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300',
  'Sports Secretary':        'bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300',
  'Director of Studies':     'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300',
  'Librarian':               'bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300',
}

function Avatar({ exec, size = 'md' }) {
  const [failed, setFailed] = useState(false)
  const sizeClass = size === 'lg' ? 'w-32 h-32' : 'w-20 h-20'
  const textSize  = size === 'lg' ? 'text-3xl' : 'text-xl'
  return failed ? (
    <div className={`${sizeClass} rounded-full bg-gradient-to-br from-brand-blueDark to-brand-blue flex items-center justify-center ${textSize} font-black text-white shrink-0`}>
      {exec.initials}
    </div>
  ) : (
    <img
      src={exec.image}
      alt={exec.name}
      className={`${sizeClass} rounded-full object-cover object-top shrink-0`}
      onError={() => setFailed(true)}
    />
  )
}

function ContactLinks({ exec, size = 'sm' }) {
  const btnClass = size === 'sm'
    ? 'p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-brand-blue/10 dark:hover:bg-brand-blue/20 text-gray-500 dark:text-gray-400 hover:text-brand-blue transition-colors'
    : 'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors'

  return (
    <div className="flex flex-wrap gap-2">
      {exec.whatsapp && (
        <a href={`https://wa.me/${exec.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
          className={size === 'lg'
            ? `${btnClass} bg-green-500 hover:bg-green-600 text-white`
            : btnClass}
          title="WhatsApp"
        >
          <MessageCircle size={size === 'lg' ? 16 : 15} />
          {size === 'lg' && <span>WhatsApp</span>}
        </a>
      )}
      {exec.email && (
        <a href={`mailto:${exec.email}`}
          className={size === 'lg'
            ? `${btnClass} bg-brand-orange hover:bg-brand-yellow hover:text-brand-blueDark text-white`
            : btnClass}
          title="Email"
        >
          <Mail size={size === 'lg' ? 16 : 15} />
          {size === 'lg' && <span>Email</span>}
        </a>
      )}
      {exec.instagram && (
        <a href={`https://instagram.com/${exec.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
          className={size === 'lg'
            ? `${btnClass} bg-pink-500 hover:bg-pink-600 text-white`
            : btnClass}
          title="Instagram"
        >
          <Instagram size={size === 'lg' ? 16 : 15} />
          {size === 'lg' && <span>Instagram</span>}
        </a>
      )}
      {exec.twitter && (
        <a href={`https://twitter.com/${exec.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
          className={size === 'lg'
            ? `${btnClass} bg-sky-500 hover:bg-sky-600 text-white`
            : btnClass}
          title="Twitter / X"
        >
          <Twitter size={size === 'lg' ? 16 : 15} />
          {size === 'lg' && <span>Twitter</span>}
        </a>
      )}
    </div>
  )
}

// ── Modal ──────────────────────────────────────────────────────────────────────
function Modal({ exec, onClose }) {
  if (!exec) return null
  const roleColor = roleColors[exec.role] || 'bg-gray-100 text-gray-700 border-gray-200'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-md p-8 relative animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <X size={16} />
        </button>

        {/* Profile */}
        <div className="flex flex-col items-center text-center gap-4">
          <Avatar exec={exec} size="lg" />
          <div>
            <h2 className="text-2xl font-black text-brand-blueDark dark:text-white">{exec.name}</h2>
            <span className={`inline-block mt-1 text-xs font-bold px-3 py-1 rounded-full border ${roleColor}`}>
              {exec.role}
            </span>
          </div>
          {exec.bio && exec.bio !== 'Add bio here.' && (
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed text-center">
              {exec.bio}
            </p>
          )}
          {(exec.whatsapp || exec.email || exec.instagram || exec.twitter) && (
            <div className="w-full pt-4 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider mb-3">Reach Out</p>
              <div className="flex flex-wrap justify-center gap-2">
                <ContactLinks exec={exec} size="lg" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Card ───────────────────────────────────────────────────────────────────────
function ExecCard({ exec, featured = false, onClick }) {
  const roleColor = roleColors[exec.role] || 'bg-gray-100 text-gray-700 border-gray-200'

  if (featured) {
    return (
      <div
        onClick={onClick}
        className="cursor-pointer col-span-full bg-gradient-to-r from-brand-blueDark to-brand-blue rounded-3xl p-8 flex flex-col sm:flex-row items-center gap-6 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
      >
        <Avatar exec={exec} size="lg" />
        <div className="text-center sm:text-left flex-1">
          <span className="inline-block text-xs font-bold px-3 py-1 rounded-full border bg-brand-orange/20 text-brand-orange border-brand-orange/30 mb-2">
            {exec.role}
          </span>
          <h2 className="text-2xl font-black text-white">{exec.name}</h2>
          {exec.bio && exec.bio !== 'Add bio here.' && (
            <p className="text-blue-100 text-sm mt-2 leading-relaxed line-clamp-2">{exec.bio}</p>
          )}
          <div className="mt-4 flex flex-wrap gap-2 justify-center sm:justify-start">
            <ContactLinks exec={exec} size="sm" />
            <button className="inline-flex items-center gap-1 text-white/70 hover:text-white text-xs font-semibold transition-colors">
              View Profile <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-brand-blue/20 transition-all duration-200 hover:-translate-y-1 flex flex-col items-center text-center gap-3"
    >
      <Avatar exec={exec} size="md" />
      <div>
        <span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full border mb-1 ${roleColor}`}>
          {exec.role}
        </span>
        <h3 className="font-bold text-brand-blueDark dark:text-white text-sm leading-tight">{exec.name}</h3>
      </div>
      {exec.bio && exec.bio !== 'Add bio here.' && (
        <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed line-clamp-2">{exec.bio}</p>
      )}
      <div className="flex gap-2 mt-auto pt-1">
        <ContactLinks exec={exec} size="sm" />
      </div>
      <span className="text-brand-orange text-xs font-semibold inline-flex items-center gap-0.5 hover:gap-1 transition-all">
        View Profile <ChevronRight size={12} />
      </span>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function StudentExecutives() {
  usePageTitle(
    'Student Executives',
    'Meet the elected NAMSSN UNILAG student executives for the 2025/2026 session. Find out about your student leaders and how to reach them.'
  )

  const [selected, setSelected] = useState(null)
  const [president, ...rest] = executives

  return (
    <div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-blueDark to-brand-blue text-white py-20 px-4 text-center">
        <h1 className="hero-anim hero-anim-1 text-4xl md:text-5xl font-black mb-4">Student Executives</h1>
        <p className="hero-anim hero-anim-2 text-blue-100 max-w-xl mx-auto">
          Meet your elected NAMSSN UNILAG leaders for the 2025/2026 session. Click any card to view their profile and get in touch.
        </p>
      </section>

      {/* Grid */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            {/* President — featured full-width card */}
            <ExecCard exec={president} featured onClick={() => setSelected(president)} />

            {/* Rest of executives */}
            {rest.map(exec => (
              <ExecCard key={exec.name} exec={exec} onClick={() => setSelected(exec)} />
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {selected && <Modal exec={selected} onClose={() => setSelected(null)} />}

    </div>
  )
}
