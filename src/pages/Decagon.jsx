import { useState } from 'react'
import { Trophy, Users, Layers, Star, ChevronRight, Lock, Medal, Clock, BookOpen } from 'lucide-react'
import usePageTitle from '../hooks/usePageTitle'

// ── Colour tokens for Decagon's own identity ────────────────────────────────
// Dark navy bg  →  #0D1B2A
// Cyan accent   →  #00CCFF  (brand-blueLight)
// Gold / orange →  #FC7307  (brand-orange)

// ── Registration form ────────────────────────────────────────────────────────
const DEPARTMENTS = [
  'Mathematics', 'Statistics', 'Computer Science', 'Physics',
  'Chemistry', 'Biochemistry', 'Microbiology', 'Botany',
  'Zoology', 'Marine Sciences', 'Geosciences', 'Other',
]

function RegistrationSection() {
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', matric: '', department: '', level: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    // TODO: POST to Supabase + trigger Paystack payment
    // For now simulates the flow
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-cyan-400/20 flex items-center justify-center">
        <Star size={32} className="text-cyan-400" />
      </div>
      <h3 className="text-2xl font-black text-white">You're registered!</h3>
      <p className="text-gray-400 max-w-sm">
        We'll send confirmation and payment details to <span className="text-cyan-400">{form.email}</span>.
        Watch your inbox.
      </p>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Full Name" placeholder="e.g. Amira Hassan" value={form.fullName} onChange={set('fullName')} required />
        <Field label="Email Address" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
        <Field label="Phone Number" type="tel" placeholder="+234 800 000 0000" value={form.phone} onChange={set('phone')} required />
        <Field label="Matric Number" placeholder="e.g. 190404001" value={form.matric} onChange={set('matric')} required />
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Department</label>
          <select
            required
            value={form.department}
            onChange={set('department')}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/40"
          >
            <option value="" disabled>Select department</option>
            {DEPARTMENTS.map(d => <option key={d} value={d} className="bg-[#0D1B2A]">{d}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Level</label>
          <select
            required
            value={form.level}
            onChange={set('level')}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/40"
          >
            <option value="" disabled>Select level</option>
            {['100', '200', '300', '400', '500'].map(l => (
              <option key={l} value={l} className="bg-[#0D1B2A]">{l} Level</option>
            ))}
          </select>
        </div>
      </div>

      {/* Payment notice */}
      <div className="flex items-start gap-3 bg-brand-orange/10 border border-brand-orange/20 rounded-xl p-4">
        <Lock size={16} className="text-brand-orange shrink-0 mt-0.5" />
        <p className="text-sm text-gray-300">
          A <span className="text-brand-orange font-bold">registration fee</span> is required to complete your entry.
          You'll be redirected to a secure payment page after submitting this form.
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-brand-orange hover:bg-brand-yellow hover:text-[#0D1B2A] text-white font-black py-4 rounded-xl transition-all text-base flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {loading ? 'Processing…' : <>Register & Pay <ChevronRight size={18} /></>}
      </button>
    </form>
  )
}

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
        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/40"
      />
    </div>
  )
}

// ── Leaderboard (placeholder) ────────────────────────────────────────────────
const MOCK_LEADERS = [
  { rank: 1, name: 'Aisha Bello', dept: 'Mathematics', score: 940, badge: '🥇' },
  { rank: 2, name: 'Emeka Nwosu', dept: 'Computer Science', score: 910, badge: '🥈' },
  { rank: 3, name: 'Fatima Yusuf', dept: 'Statistics', score: 875, badge: '🥉' },
  { rank: 4, name: 'Tunde Adeyemi', dept: 'Physics', score: 850, badge: null },
  { rank: 5, name: 'Zara Okafor', dept: 'Biochemistry', score: 820, badge: null },
]

function LeaderboardSection() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <span className="text-xs text-cyan-400 font-semibold uppercase tracking-wider">Live — updates after each day's challenge</span>
      </div>
      {MOCK_LEADERS.map((p) => (
        <div
          key={p.rank}
          className={`flex items-center gap-4 px-4 py-3 rounded-xl border transition-all ${
            p.rank === 1
              ? 'bg-brand-orange/10 border-brand-orange/30'
              : p.rank <= 3
              ? 'bg-white/5 border-white/10'
              : 'bg-white/[0.03] border-white/5'
          }`}
        >
          <span className="w-8 text-center text-lg font-black text-gray-400">
            {p.badge ?? `#${p.rank}`}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">{p.name}</p>
            <p className="text-xs text-gray-500">{p.dept}</p>
          </div>
          <span className={`text-sm font-black tabular-nums ${p.rank === 1 ? 'text-brand-orange' : 'text-cyan-400'}`}>
            {p.score.toLocaleString()} pts
          </span>
        </div>
      ))}
      <p className="text-center text-xs text-gray-600 pt-2">
        * Sample data — real scores will populate when the challenge begins
      </p>
    </div>
  )
}

// ── 20-Day Challenge preview ─────────────────────────────────────────────────
function ChallengeSection() {
  const days = Array.from({ length: 20 }, (_, i) => i + 1)
  return (
    <div className="space-y-6">
      <p className="text-gray-400 text-sm leading-relaxed">
        Every day for 20 days, a new calculus problem drops on this page. Registered participants
        submit their answer before midnight. Points are awarded for correctness and speed.
        The leaderboard updates live.
      </p>
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
        {days.map(d => (
          <div
            key={d}
            className={`aspect-square rounded-xl flex items-center justify-center text-xs font-black border transition-all ${
              d === 1
                ? 'bg-cyan-400/20 border-cyan-400/40 text-cyan-300'
                : 'bg-white/[0.04] border-white/5 text-gray-600'
            }`}
          >
            {d === 1 ? <BookOpen size={14} /> : d}
          </div>
        ))}
      </div>
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center space-y-2">
        <Clock size={28} className="text-gray-500 mx-auto" />
        <p className="text-white font-bold">Challenge hasn't started yet</p>
        <p className="text-gray-500 text-sm">Day 1 will unlock when the organizers go live</p>
      </div>
    </div>
  )
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function Decagon() {
  usePageTitle('Decagon 5.0 — The Ultimate Calculus Competition')

  const stats = [
    { icon: Users,  value: '50+',   label: 'Participants' },
    { icon: Layers, value: '10+',   label: 'Departments' },
    { icon: Star,   value: '4',     label: 'Stages' },
    { icon: Trophy, value: '₦320k', label: 'Prize Pool' },
  ]

  const prizes = [
    { place: '2nd', amount: '₦100,000', icon: '🥈', color: 'border-gray-400/30 bg-gray-400/5' },
    { place: '1st', amount: '₦150,000', icon: '🥇', color: 'border-brand-orange/40 bg-brand-orange/10', featured: true },
    { place: '3rd', amount: '₦70,000',  icon: '🥉', color: 'border-amber-700/30 bg-amber-700/5' },
  ]

  return (
    <div className="min-h-screen" style={{ background: '#0D1B2A', color: '#fff' }}>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden px-4 pt-16 pb-20 text-center">
        {/* grid bg */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(#00CCFF 1px, transparent 1px), linear-gradient(90deg, #00CCFF 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
        {/* glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[120px] opacity-20"
          style={{ background: 'radial-gradient(ellipse, #00CCFF, transparent)' }}
        />

        <div className="relative max-w-3xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400 mb-4">
            NAMSSN UNILAG presents
          </p>
          <h1 className="text-6xl sm:text-8xl font-black mb-2 leading-none"
            style={{ background: 'linear-gradient(135deg, #00CCFF 0%, #ffffff 50%, #FC7307 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            Decagon
          </h1>
          <div className="inline-block bg-brand-orange text-white text-sm font-black px-3 py-1 rounded-full mb-6">
            5.0
          </div>
          <p className="text-xl text-gray-300 font-semibold mb-2">The Ultimate Calculus Competition</p>
          <p className="text-gray-500 text-sm mb-10">Registration opens · April 15, 2026</p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                <Icon size={18} className="text-cyan-400 mx-auto mb-2" />
                <p className="text-2xl font-black text-white">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main content ── */}
      <div className="max-w-6xl mx-auto px-4 pb-24 space-y-16">

        {/* Prizes */}
        <section>
          <SectionTitle icon={Trophy} label="Prizes to Be Won" />
          <div className="flex flex-col sm:flex-row items-end justify-center gap-4">
            {prizes.map(({ place, amount, icon, color, featured }) => (
              <div
                key={place}
                className={`w-full sm:w-56 border rounded-2xl p-6 text-center transition-all ${color} ${featured ? 'sm:-translate-y-4 shadow-lg shadow-brand-orange/20' : ''}`}
              >
                <div className="text-4xl mb-3">{icon}</div>
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">{place} Place</p>
                <p className={`text-3xl font-black ${featured ? 'text-brand-orange' : 'text-white'}`}>{amount}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Registration + Leaderboard side by side */}
        <div className="grid lg:grid-cols-2 gap-8">

          {/* Registration */}
          <section className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 sm:p-8">
            <SectionTitle icon={Medal} label="Register" />
            <RegistrationSection />
          </section>

          {/* Leaderboard */}
          <section className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 sm:p-8">
            <SectionTitle icon={Trophy} label="Leaderboard" />
            <LeaderboardSection />
          </section>
        </div>

        {/* 20-Day Challenge */}
        <section className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 sm:p-8">
          <SectionTitle icon={BookOpen} label="20-Day Challenge" />
          <ChallengeSection />
        </section>

        {/* Contact */}
        <section className="text-center text-gray-500 text-sm space-y-1">
          <p className="font-semibold text-gray-400">For enquiries</p>
          <p>+234 816 533 6309 &nbsp;·&nbsp; +234 903 449 5638</p>
          <p>@namssn_unilag</p>
        </section>

      </div>
    </div>
  )
}

function SectionTitle({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-8 h-8 rounded-lg bg-cyan-400/10 flex items-center justify-center shrink-0">
        <Icon size={16} className="text-cyan-400" />
      </div>
      <h2 className="text-lg font-black text-white">{label}</h2>
      <div className="flex-1 h-px bg-white/5" />
    </div>
  )
}
