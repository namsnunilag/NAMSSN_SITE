import { useState } from 'react'
import {
  Trophy, Users, Layers, Star, ChevronRight, Lock,
  Medal, Clock, BookOpen, Mic, Zap, Calendar, MapPin,
  CheckCircle2, ArrowRight,
} from 'lucide-react'
import usePageTitle from '../hooks/usePageTitle'

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const DEPARTMENTS = [
  'Mathematics', 'Statistics', 'Computer Science', 'Physics',
  'Chemistry', 'Biochemistry', 'Microbiology', 'Botany',
  'Zoology', 'Marine Sciences', 'Geosciences', 'Other',
]

function Field({ label, type = 'text', placeholder, value, onChange, required }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500
                   focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/40 transition"
      />
    </div>
  )
}

function SelectField({ label, value, onChange, required, options, placeholder }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</label>
      <select
        required={required}
        value={value}
        onChange={onChange}
        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white
                   focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/40 transition"
      >
        <option value="" disabled className="bg-[#0D1B2A]">{placeholder}</option>
        {options.map(o => <option key={o} value={o} className="bg-[#0D1B2A]">{o}</option>)}
      </select>
    </div>
  )
}

function SectionTitle({ icon: Icon, label, accent = 'text-cyan-400', bg = 'bg-cyan-400/10' }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
        <Icon size={16} className={accent} />
      </div>
      <h2 className="text-lg font-black text-white">{label}</h2>
      <div className="flex-1 h-px bg-white/5" />
    </div>
  )
}

function SuccessBanner({ email, message }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
      <div className="w-14 h-14 rounded-full bg-cyan-400/20 flex items-center justify-center">
        <CheckCircle2 size={28} className="text-cyan-400" />
      </div>
      <h3 className="text-xl font-black text-white">{message}</h3>
      <p className="text-gray-400 text-sm max-w-xs">
        A confirmation will be sent to <span className="text-cyan-400">{email}</span>
      </p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Competition Registration
// ─────────────────────────────────────────────────────────────────────────────

function CompetitionRegistration() {
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', matric: '', department: '', level: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    // TODO: POST to Supabase → trigger Paystack payment
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) return <SuccessBanner email={form.email} message="Registration received!" />

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Full Name" placeholder="e.g. Amira Hassan" value={form.fullName} onChange={set('fullName')} required />
        <Field label="Email Address" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
        <Field label="Phone Number" type="tel" placeholder="+234 800 000 0000" value={form.phone} onChange={set('phone')} required />
        <Field label="Matric Number" placeholder="e.g. 190404001" value={form.matric} onChange={set('matric')} required />
        <SelectField label="Department" value={form.department} onChange={set('department')} required
          placeholder="Select department" options={DEPARTMENTS} />
        <SelectField label="Level" value={form.level} onChange={set('level')} required
          placeholder="Select level" options={['100', '200', '300', '400', '500'].map(l => `${l} Level`)} />
      </div>

      {/* Competition stages info */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
        <p className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Competition Stages</p>
        {[
          'Stage 1 — Online Screening (all registered participants)',
          'Stage 2 — Written Qualifying Round',
          'Stage 3 — Semi-Final (top scorers advance)',
          'Stage 4 — Final Selection (top 5 qualify for Grand Finale)',
          'Grand Finale — Live stage, June 2026 · Open audience',
        ].map((s, i) => (
          <div key={i} className="flex items-start gap-2 text-sm text-gray-400">
            <ArrowRight size={13} className="text-cyan-400 shrink-0 mt-0.5" />
            {s}
          </div>
        ))}
      </div>

      {/* Payment notice */}
      <div className="flex items-start gap-3 bg-brand-orange/10 border border-brand-orange/20 rounded-xl p-4">
        <Lock size={15} className="text-brand-orange shrink-0 mt-0.5" />
        <p className="text-sm text-gray-300">
          A <span className="text-brand-orange font-bold">registration fee</span> is required to confirm your entry.
          You'll be directed to a secure payment page immediately after submitting.
        </p>
      </div>

      <button type="submit" disabled={loading}
        className="w-full bg-brand-orange hover:bg-brand-yellow hover:text-[#0D1B2A] text-white font-black py-4 rounded-xl
                   transition-all text-base flex items-center justify-center gap-2 disabled:opacity-60">
        {loading ? 'Processing…' : <>Register for the Competition <ChevronRight size={18} /></>}
      </button>
    </form>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 20-Day Challenge Registration + Leaderboard
// ─────────────────────────────────────────────────────────────────────────────

function ChallengeRegistration() {
  const [form, setForm] = useState({ fullName: '', email: '', department: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    // TODO: POST to Supabase
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) return <SuccessBanner email={form.email} message="You're in the Challenge!" />

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <Field label="Full Name" placeholder="e.g. Emeka Nwosu" value={form.fullName} onChange={set('fullName')} required />
        <Field label="Email Address" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
        <SelectField label="Department" value={form.department} onChange={set('department')} required
          placeholder="Select department" options={DEPARTMENTS} />
      </div>

      <div className="bg-cyan-400/5 border border-cyan-400/15 rounded-xl p-4 text-sm text-gray-400 space-y-1">
        <p className="text-cyan-300 font-semibold text-xs uppercase tracking-wider mb-1">How it works</p>
        <p>· A new question drops daily for 20 days in May 2026</p>
        <p>· Submit your answer before midnight each day</p>
        <p>· Points awarded for correctness + speed</p>
        <p>· Top performer wins <span className="text-cyan-300 font-bold">₦50,000</span></p>
        <p className="pt-1 text-gray-500">Open to everyone — no fee required</p>
      </div>

      <button type="submit" disabled={loading}
        className="w-full bg-cyan-400/10 hover:bg-cyan-400/20 border border-cyan-400/30 text-cyan-300 font-black py-4 rounded-xl
                   transition-all text-base flex items-center justify-center gap-2 disabled:opacity-60">
        {loading ? 'Signing up…' : <>Join the 20-Day Challenge <ChevronRight size={18} /></>}
      </button>
    </form>
  )
}

const MOCK_LEADERS = [
  { rank: 1, name: 'Aisha Bello',   dept: 'Mathematics',      score: 940, days: 18, badge: '🥇' },
  { rank: 2, name: 'Emeka Nwosu',   dept: 'Computer Science', score: 910, days: 17, badge: '🥈' },
  { rank: 3, name: 'Fatima Yusuf',  dept: 'Statistics',       score: 875, days: 17, badge: '🥉' },
  { rank: 4, name: 'Tunde Adeyemi', dept: 'Physics',          score: 850, days: 16, badge: null },
  { rank: 5, name: 'Zara Okafor',   dept: 'Biochemistry',     score: 820, days: 15, badge: null },
]

function ChallengeLeaderboard() {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <span className="text-xs text-cyan-400 font-semibold uppercase tracking-wider">
          Updates daily after each question closes
        </span>
      </div>

      {/* Header */}
      <div className="grid grid-cols-[2rem_1fr_auto_auto] gap-2 px-2 mb-1">
        <span className="text-xs text-gray-600">#</span>
        <span className="text-xs text-gray-600">Participant</span>
        <span className="text-xs text-gray-600 text-center">Days</span>
        <span className="text-xs text-gray-600 text-right">Score</span>
      </div>

      {MOCK_LEADERS.map(p => (
        <div key={p.rank}
          className={`grid grid-cols-[2rem_1fr_auto_auto] gap-2 items-center px-4 py-3 rounded-xl border transition-all ${
            p.rank === 1
              ? 'bg-brand-orange/10 border-brand-orange/30'
              : p.rank <= 3
              ? 'bg-white/5 border-white/10'
              : 'bg-white/[0.02] border-white/5'
          }`}
        >
          <span className="text-base text-center">{p.badge ?? <span className="text-xs text-gray-500 font-bold">#{p.rank}</span>}</span>
          <div className="min-w-0">
            <p className="text-sm font-bold text-white truncate">{p.name}</p>
            <p className="text-xs text-gray-500 truncate">{p.dept}</p>
          </div>
          <span className="text-xs text-gray-500 text-center">{p.days}/20</span>
          <span className={`text-sm font-black tabular-nums text-right ${p.rank === 1 ? 'text-brand-orange' : 'text-cyan-400'}`}>
            {p.score.toLocaleString()}
          </span>
        </div>
      ))}

      <p className="text-center text-xs text-gray-600 pt-2">* Sample data — live scores populate when the challenge begins</p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 20-Day Question Grid
// ─────────────────────────────────────────────────────────────────────────────

function QuestionGrid() {
  const days = Array.from({ length: 20 }, (_, i) => i + 1)
  // TODO: pull real unlock state from Supabase per day
  return (
    <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
      {days.map(d => (
        <div key={d}
          className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 text-xs font-black border transition-all cursor-default ${
            d === 1
              ? 'bg-cyan-400/20 border-cyan-400/40 text-cyan-300'   // active today
              : 'bg-white/[0.03] border-white/5 text-gray-700'       // locked
          }`}
        >
          <span className="text-[10px] text-gray-600 font-normal">Day</span>
          {d}
        </div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────

export default function Decagon() {
  usePageTitle('Decagon 5.0 — The Ultimate Calculus Competition')

  const phases = [
    {
      num: '01',
      icon: BookOpen,
      title: '20-Day Calculus Challenge',
      when: 'May 2026',
      desc: 'Open to everyone. A new calculus problem drops daily for 20 days. Participants submit answers, earn points, and compete on a live leaderboard.',
      prize: '₦50,000 winner's prize',
      accent: 'border-cyan-400/30 bg-cyan-400/5',
      tag: 'Open to all',
    },
    {
      num: '02',
      icon: Mic,
      title: 'Mini Conference',
      when: 'May 2026',
      desc: 'Exclusive talks and panel Q&A sessions featuring faculty members and invited experts. A platform for deep mathematical discourse.',
      prize: null,
      accent: 'border-white/10 bg-white/[0.03]',
      tag: 'Invite / Registration',
    },
    {
      num: '03',
      icon: Zap,
      title: 'Main Calculus Competition',
      when: 'May 2026',
      desc: 'Multiple elimination stages. All registered competitors sit a screening, then advance through written and oral rounds. The top 5 earn a spot in the Grand Finale.',
      prize: null,
      accent: 'border-brand-orange/20 bg-brand-orange/5',
      tag: 'Registered competitors only',
    },
    {
      num: '04',
      icon: Trophy,
      title: 'Grand Finale & Awards',
      when: 'June 2026',
      desc: 'The top 5 finalists compete live on stage before an open audience of 200+ students, faculty, and delegates. Winners are crowned and prizes are awarded.',
      prize: '₦150,000 · ₦100,000 · ₦70,000',
      accent: 'border-brand-yellow/30 bg-brand-yellow/5',
      tag: 'Open audience',
    },
  ]

  const prizes = [
    { place: '2nd', amount: '₦100,000', icon: '🥈', dim: true },
    { place: '1st', amount: '₦150,000', icon: '🥇', featured: true },
    { place: '3rd', amount: '₦70,000',  icon: '🥉', dim: true },
  ]

  return (
    <div className="min-h-screen" style={{ background: '#0D1B2A', color: '#fff' }}>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 pt-16 pb-20 text-center">
        {/* grid */}
        <div className="absolute inset-0 opacity-[0.035]"
          style={{ backgroundImage: 'linear-gradient(#00CCFF 1px,transparent 1px),linear-gradient(90deg,#00CCFF 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
        {/* glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[320px] rounded-full blur-[140px] opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse,#00CCFF,transparent)' }} />

        <div className="relative max-w-3xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400 mb-4">
            NAMSSN UNILAG · Department of Mathematics
          </p>
          <h1 className="text-6xl sm:text-8xl font-black mb-2 leading-none"
            style={{ background: 'linear-gradient(135deg,#00CCFF 0%,#ffffff 50%,#FC7307 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Decagon
          </h1>
          <div className="inline-block bg-brand-orange text-white text-sm font-black px-3 py-1 rounded-full mb-6">5.0</div>
          <p className="text-xl text-gray-300 font-semibold mb-3">The Ultimate Calculus Competition</p>

          {/* Meta */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 mb-10">
            <span className="flex items-center gap-1.5"><Calendar size={14} className="text-cyan-400" /> May – June 2026</span>
            <span className="text-white/10">|</span>
            <span className="flex items-center gap-1.5"><MapPin size={14} className="text-cyan-400" /> University of Lagos</span>
            <span className="text-white/10">|</span>
            <span className="flex items-center gap-1.5"><Users size={14} className="text-cyan-400" /> 200+ expected</span>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            {[
              { icon: Layers, value: '4', label: 'Phases' },
              { icon: Users,  value: '50+', label: 'Competitors' },
              { icon: Star,   value: '4',  label: 'Competition Stages' },
              { icon: Trophy, value: '₦370k', label: 'Total Prizes' },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                <Icon size={17} className="text-cyan-400 mx-auto mb-2" />
                <p className="text-2xl font-black text-white">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 pb-24 space-y-20">

        {/* ── Event Phases ────────────────────────────────────────────────────── */}
        <section>
          <SectionTitle icon={Calendar} label="Event Phases" />
          <div className="grid sm:grid-cols-2 gap-4">
            {phases.map(p => (
              <div key={p.num} className={`border rounded-2xl p-6 space-y-3 ${p.accent}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <p.icon size={17} className="text-cyan-300" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Phase {p.num}</p>
                      <h3 className="text-base font-black text-white leading-tight">{p.title}</h3>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">{p.when}</span>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">{p.desc}</p>
                <div className="flex flex-wrap items-center gap-2">
                  {p.prize && (
                    <span className="text-xs font-bold text-brand-orange bg-brand-orange/10 border border-brand-orange/20 px-2.5 py-1 rounded-full">
                      {p.prize}
                    </span>
                  )}
                  <span className="text-xs text-gray-500 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">{p.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Grand Finale Prizes ──────────────────────────────────────────────── */}
        <section>
          <SectionTitle icon={Trophy} label="Grand Finale Prizes" accent="text-brand-orange" bg="bg-brand-orange/10" />
          <div className="flex flex-col sm:flex-row items-end justify-center gap-4">
            {prizes.map(({ place, amount, icon, featured, dim }) => (
              <div key={place}
                className={`w-full sm:w-52 rounded-2xl p-6 text-center border transition-all ${
                  featured
                    ? 'bg-brand-orange/10 border-brand-orange/40 sm:-translate-y-4 shadow-xl shadow-brand-orange/10'
                    : 'bg-white/[0.03] border-white/10'
                }`}
              >
                <div className="text-4xl mb-3">{icon}</div>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">{place} Place</p>
                <p className={`text-3xl font-black ${featured ? 'text-brand-orange' : dim ? 'text-gray-300' : 'text-white'}`}>{amount}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-600 mt-6">
            + <span className="text-cyan-400 font-semibold">₦50,000</span> for the 20-Day Challenge winner
          </p>
        </section>

        {/* ── Competition Registration ─────────────────────────────────────────── */}
        <section className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 sm:p-8">
          <SectionTitle icon={Medal} label="Competition Registration" accent="text-brand-orange" bg="bg-brand-orange/10" />
          <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-xl">
            <p className="text-sm text-gray-400 leading-relaxed">
              Register here to compete in <span className="text-white font-semibold">Decagon 5.0's Main Calculus Competition</span>.
              You will go through multiple elimination stages in May 2026.
              The <span className="text-white font-semibold">top 5 finalists</span> earn a spot on the Grand Finale stage in June 2026.
              This is separate from the 20-Day Challenge.
            </p>
          </div>
          <CompetitionRegistration />
        </section>

        {/* ── 20-Day Challenge ─────────────────────────────────────────────────── */}
        <section className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-10">
          <div>
            <SectionTitle icon={BookOpen} label="20-Day Calculus Challenge" />
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Running alongside the main competition, the 20-Day Challenge is <span className="text-white font-semibold">open to everyone</span> — no competition registration or fee needed.
              A calculus question drops every day for 20 days. Answer before midnight. The leaderboard updates live.
              The top performer takes home <span className="text-cyan-300 font-bold">₦50,000</span>.
            </p>

            {/* Question grid */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Challenge Days</p>
              <QuestionGrid />
              <p className="text-xs text-gray-600 mt-3">Day 1 unlocks when the challenge goes live in May 2026</p>
            </div>
          </div>

          {/* Sign up + leaderboard */}
          <div className="grid lg:grid-cols-2 gap-8 pt-4 border-t border-white/5">
            <div>
              <p className="text-sm font-bold text-gray-300 mb-4">Sign Up for the Challenge</p>
              <ChallengeRegistration />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-300 mb-4">Live Leaderboard</p>
              <ChallengeLeaderboard />
            </div>
          </div>
        </section>

        {/* ── Mini Conference ──────────────────────────────────────────────────── */}
        <section className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 sm:p-8">
          <SectionTitle icon={Mic} label="Mini Conference" />
          <p className="text-sm text-gray-400 leading-relaxed mb-4">
            An exclusive academic gathering featuring talks by faculty members and invited experts.
            Attendees engage in structured Q&A sessions covering advanced topics in calculus and mathematical sciences.
          </p>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-4">
            <Clock size={16} className="text-gray-500 shrink-0" />
            <p className="text-sm text-gray-500">Conference details — speakers, schedule, and access — will be announced in May 2026</p>
          </div>
        </section>

        {/* ── Contact ──────────────────────────────────────────────────────────── */}
        <section className="text-center text-gray-500 text-sm space-y-1.5 pb-4">
          <p className="font-semibold text-gray-400 text-base">Contact the Decagon Team</p>
          <p>+234 816 533 6309 &nbsp;·&nbsp; +234 903 449 5638</p>
          <p className="text-gray-600">@namssn_unilag on Instagram, X, and Facebook</p>
        </section>

      </div>
    </div>
  )
}
