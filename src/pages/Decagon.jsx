import { useState, useRef, useEffect } from 'react'
import {
  Trophy, Users, Layers, Star, ChevronRight, Lock,
  Medal, Clock, BookOpen, Mic, Zap, Calendar, MapPin,
  CheckCircle2, ArrowRight, AlertCircle, Upload, Copy, Check,
} from 'lucide-react'
import usePageTitle from '../hooks/usePageTitle'

// ─────────────────────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────────────────────

// Registration opens April 15 2026 at midnight (WAT = UTC+1)
const REGISTRATION_OPENS = new Date('2026-04-15T00:00:00+01:00')
const isRegistrationOpen = () => new Date() >= REGISTRATION_OPENS

const SUPABASE_URL      = import.meta.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

const BANK = {
  name:    'Moniepoint MFB',
  account: '8123174623',
  holder:  'NAMSSN UNILAG OFFICIAL SERVICES',
  amount:  '₦2,000',
  raw:     2000,
}

// ─────────────────────────────────────────────────────────────────────────────
// Supabase helpers
// ─────────────────────────────────────────────────────────────────────────────

async function uploadReceipt(file, matric) {
  if (!SUPABASE_URL) throw new Error('no-backend')
  const ext      = file.name.split('.').pop()
  const filename = `${matric.toUpperCase()}_${Date.now()}.${ext}`
  const res = await fetch(
    `${SUPABASE_URL}/storage/v1/object/decagon-receipts/${filename}`,
    {
      method: 'POST',
      headers: {
        apikey:        SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': file.type || 'application/octet-stream',
      },
      body: file,
    }
  )
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message || `Upload failed (${res.status})`)
  }
  return `${SUPABASE_URL}/storage/v1/object/public/decagon-receipts/${filename}`
}

async function saveRegistration(data) {
  if (!SUPABASE_URL) throw new Error('no-backend')
  const res = await fetch(`${SUPABASE_URL}/rest/v1/decagon_registrations`, {
    method: 'POST',
    headers: {
      apikey:         SUPABASE_ANON_KEY,
      Authorization:  `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      Prefer:         'return=minimal',
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.code === '23505' ? 'duplicate' : body.message || `HTTP ${res.status}`)
  }
}

async function saveChallengeSignup(data) {
  if (!SUPABASE_URL) throw new Error('no-backend')
  const res = await fetch(`${SUPABASE_URL}/rest/v1/challenge_signups`, {
    method: 'POST',
    headers: {
      apikey:         SUPABASE_ANON_KEY,
      Authorization:  `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      Prefer:         'return=minimal',
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.code === '23505' ? 'duplicate' : body.message || `HTTP ${res.status}`)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared UI helpers
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
        type={type} placeholder={placeholder} value={value}
        onChange={onChange} required={required}
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
      <select required={required} value={value} onChange={onChange}
        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white
                   focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/40 transition">
        <option value="" disabled className="bg-[#0D1B2A]">{placeholder}</option>
        {options.map(o => <option key={o} value={o} className="bg-[#0D1B2A]">{o}</option>)}
      </select>
    </div>
  )
}

function SuccessBanner({ email, message, sub, groupLink }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
      <div className="w-14 h-14 rounded-full bg-cyan-400/20 flex items-center justify-center">
        <CheckCircle2 size={28} className="text-cyan-400" />
      </div>
      <h3 className="text-xl font-black text-white">{message}</h3>
      <p className="text-gray-400 text-sm max-w-sm">
        {sub} <span className="text-cyan-400">{email}</span>
      </p>
      {groupLink && (
        <a href={groupLink} target="_blank" rel="noopener noreferrer"
          className="mt-2 flex items-center gap-2 bg-green-500/15 hover:bg-green-500/25 border border-green-500/30 text-green-400 font-bold text-sm px-5 py-3 rounded-xl transition-all">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Join the WhatsApp Group
        </a>
      )}
    </div>
  )
}

function ErrorBox({ message }) {
  if (!message) return null
  return (
    <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
      <AlertCircle size={15} className="text-red-400 shrink-0 mt-0.5" />
      <p className="text-sm text-red-300">{message}</p>
    </div>
  )
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button type="button" onClick={copy}
      className="ml-2 text-gray-500 hover:text-cyan-400 transition shrink-0">
      {copied ? <Check size={13} className="text-cyan-400" /> : <Copy size={13} />}
    </button>
  )
}

function FileUpload({ value, onChange, required, label = 'Upload File', hint = 'JPG, PNG or PDF · max 5 MB', placeholder = 'Click to upload file' }) {
  const inputRef = useRef(null)
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
        {label}
      </label>
      <div
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
          value
            ? 'border-cyan-400/40 bg-cyan-400/5'
            : 'border-white/10 hover:border-white/20 bg-white/[0.02]'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          required={required}
          onChange={e => onChange(e.target.files[0] || null)}
        />
        {value ? (
          <div className="flex items-center justify-center gap-2 text-cyan-400">
            <CheckCircle2 size={16} />
            <span className="text-sm font-semibold truncate max-w-[240px]">{value.name}</span>
          </div>
        ) : (
          <>
            <Upload size={20} className="text-gray-500 mx-auto mb-2" />
            <p className="text-sm text-gray-400">{placeholder}</p>
            <p className="text-xs text-gray-600 mt-1">{hint}</p>
          </>
        )}
      </div>
    </div>
  )
}

function BankDetails() {
  return (
    <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 overflow-hidden">
      <div className="px-4 py-3 border-b border-cyan-400/10">
        <p className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
          Step 3 — Transfer {BANK.amount} to this account
        </p>
      </div>
      <div className="px-4 py-4 space-y-3">
        {[
          { label: 'Bank',         value: BANK.name,    copy: false },
          { label: 'Account No.',  value: BANK.account, copy: true  },
          { label: 'Account Name', value: BANK.holder,  copy: false },
          { label: 'Amount',       value: BANK.amount,  copy: false },
        ].map(({ label, value, copy }) => (
          <div key={label} className="flex justify-between items-center gap-4">
            <span className="text-xs text-gray-500 shrink-0">{label}</span>
            <div className="flex items-center">
              <span className={`text-sm font-bold text-right ${
                label === 'Account No.' ? 'text-cyan-400 font-black tracking-wider' :
                label === 'Amount'      ? 'text-brand-orange font-black' :
                'text-white'
              }`}>{value}</span>
              {copy && <CopyButton text={value} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab 1 — Main Competition
// ─────────────────────────────────────────────────────────────────────────────

function useCountdown(target) {
  const [timeLeft, setTimeLeft] = useState(null)
  useEffect(() => {
    const calc = () => {
      const diff = target - Date.now()
      if (diff <= 0) { setTimeLeft(null); return }
      setTimeLeft({
        hours:   Math.floor(diff / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [target])
  return timeLeft
}

function CompetitionTab() {
  const [form, setForm]       = useState({ fullName: '', email: '', phone: '', matric: '', department: '', level: '' })
  const [receipt, setReceipt] = useState(null)
  const [biodata, setBiodata] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [open, setOpen]       = useState(isRegistrationOpen)
  const t = useCountdown(REGISTRATION_OPENS.getTime())
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  // flip to open automatically when countdown hits zero
  useEffect(() => { if (!t) setOpen(true) }, [t])

  if (!open) return (
    <div className="flex flex-col items-center justify-center gap-6 py-14 text-center">
      <div className="w-14 h-14 rounded-full bg-brand-orange/20 flex items-center justify-center">
        <Clock size={26} className="text-brand-orange" />
      </div>
      <div>
        <h3 className="text-xl font-black text-white mb-1">Registration opens at midnight</h3>
        <p className="text-gray-400 text-sm">April 15, 2026 · 12:00 AM WAT</p>
      </div>
      {t && (
        <div className="flex gap-4">
          {[['HRS', t.hours], ['MIN', t.minutes], ['SEC', t.seconds]].map(([label, val]) => (
            <div key={label} className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-center min-w-[72px]">
              <p className="text-3xl font-black text-white tabular-nums">{String(val).padStart(2, '0')}</p>
              <p className="text-xs text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-gray-600">Come back at midnight to register</p>
    </div>
  )

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')

    if (!biodata) {
      setError('Please upload your biodata before submitting.')
      return
    }
    if (!receipt) {
      setError('Please upload your payment receipt before submitting.')
      return
    }
    if (biodata.size > 5 * 1024 * 1024) {
      setError('biodata file is too large. Maximum size is 5 MB.')
      return
    }
    if (receipt.size > 5 * 1024 * 1024) {
      setError('Receipt file is too large. Maximum size is 5 MB.')
      return
    }

    setLoading(true)

    // 1. Upload biodata to Supabase Storage
    let biodataUrl = ''
    try {
      const ext      = biodata.name.split('.').pop()
      const filename = `${form.matric.toUpperCase()}_biodata_${Date.now()}.${ext}`
      const res = await fetch(
        `${SUPABASE_URL}/storage/v1/object/decagon-receipts/${filename}`,
        {
          method: 'POST',
          headers: {
            apikey:        SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': biodata.type || 'application/octet-stream',
          },
          body: biodata,
        }
      )
      if (!res.ok) throw new Error('upload failed')
      biodataUrl = `${SUPABASE_URL}/storage/v1/object/public/decagon-receipts/${filename}`
    } catch {
      setLoading(false)
      setError('Could not upload your biodata. Please check your connection and try again.')
      return
    }

    // 2. Upload receipt to Supabase Storage
    let receiptUrl = ''
    try {
      receiptUrl = await uploadReceipt(receipt, form.matric)
    } catch {
      setLoading(false)
      setError('Could not upload your receipt. Please check your connection and try again.')
      return
    }

    // 3. Save registration record
    try {
      await saveRegistration({
        full_name:       form.fullName,
        email:           form.email,
        phone:           form.phone,
        matric:          form.matric.trim().toUpperCase(),
        department:      form.department,
        level:           form.level,
        biodata_url: biodataUrl,
        receipt_url:     receiptUrl,
        payment_status:  'pending_review',
      })
      setSubmitted(true)
    } catch (err) {
      setLoading(false)
      if (err.message === 'duplicate') {
        setError('This matric number is already registered. Contact us if this is an error.')
      } else if (err.message === 'no-backend') {
        setError('Registration system is temporarily unavailable. Please contact the Decagon team.')
      } else {
        setError('Something went wrong saving your registration. Please try again.')
      }
    }
  }

  const stages = [
    { n: '01', title: 'Online Screening',           desc: 'All registered participants sit an online calculus assessment.' },
    { n: '02', title: 'Written Qualifying Round',   desc: 'Qualifiers from Stage 1 write a structured problem set.' },
    { n: '03', title: 'Semi-Final',                 desc: 'Top scorers advance to an oral and written semi-final round.' },
    { n: '04', title: 'Final Selection → Top 5',   desc: 'The top 5 are identified and earn their place on the Grand Finale stage.' },
    { n: 'GF', title: 'Grand Finale (June 2026)',   desc: 'Live competition on stage. Open audience of 200+. Winners crowned and prizes awarded.', finale: true },
  ]

  const prizes = [
    { place: '2nd', amount: '₦100,000', icon: '🥈' },
    { place: '1st', amount: '₦150,000', icon: '🥇', featured: true },
    { place: '3rd', amount: '₦70,000',  icon: '🥉' },
  ]

  if (submitted) return (
    <SuccessBanner
      email={form.email}
      message="Registration submitted!"
      sub="Your receipt is under review. We'll confirm your spot via email at"
    />
  )

  return (
    <div className="space-y-10">

      {/* Competition Stages */}
      <div>
        <SectionLabel>Competition Stages</SectionLabel>
        <div className="space-y-3">
          {stages.map(s => (
            <div key={s.n} className={`flex gap-4 p-4 rounded-xl border ${
              s.finale ? 'bg-brand-orange/10 border-brand-orange/30' : 'bg-white/[0.03] border-white/10'
            }`}>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-xs font-black ${
                s.finale ? 'bg-brand-orange/20 text-brand-orange' : 'bg-white/5 text-cyan-400'
              }`}>{s.n}</div>
              <div>
                <p className="text-sm font-bold text-white">{s.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prizes */}
      <div>
        <SectionLabel>Grand Finale Prizes</SectionLabel>
        <div className="flex flex-col sm:flex-row items-end justify-center gap-3">
          {prizes.map(({ place, amount, icon, featured }) => (
            <div key={place} className={`w-full sm:w-44 rounded-2xl p-5 text-center border ${
              featured ? 'bg-brand-orange/10 border-brand-orange/40 sm:-translate-y-3' : 'bg-white/[0.03] border-white/10'
            }`}>
              <div className="text-3xl mb-2">{icon}</div>
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">{place} Place</p>
              <p className={`text-2xl font-black ${featured ? 'text-brand-orange' : 'text-white'}`}>{amount}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Registration form */}
      <div>
        <SectionLabel>Register for the Competition</SectionLabel>
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Personal details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full Name"      placeholder="e.g. Amira Hassan"       value={form.fullName}   onChange={set('fullName')}   required />
            <Field label="Email Address"  type="email" placeholder="you@example.com"  value={form.email}      onChange={set('email')}      required />
            <Field label="Phone Number"   type="tel"   placeholder="+234 800 000 0000" value={form.phone}      onChange={set('phone')}      required />
            <Field label="Matric Number"  placeholder="e.g. 190404001"          value={form.matric}     onChange={set('matric')}     required />
            <SelectField label="Department" value={form.department} onChange={set('department')} required
              placeholder="Select department" options={DEPARTMENTS} />
            <SelectField label="Level"      value={form.level}       onChange={set('level')}       required
              placeholder="Select level" options={['100', '200', '300'].map(l => `${l} Level`)} />
          </div>

          {/* biodata upload */}
          <FileUpload
            value={biodata}
            onChange={setBiodata}
            required
            label="Step 2 — Upload biodata (confirms Year 1–3)"
            placeholder="Click to upload biodata"
            hint="JPG, PNG or PDF · max 5 MB"
          />

          {/* Bank details */}
          <BankDetails />

          {/* Receipt upload */}
          <FileUpload
            value={receipt}
            onChange={setReceipt}
            required
            label="Step 4 — Upload Payment Receipt"
            placeholder="Click to upload receipt"
            hint="JPG, PNG or PDF · max 5 MB"
          />

          <ErrorBox message={error} />

          <button type="submit" disabled={loading}
            className="w-full bg-brand-orange hover:bg-brand-yellow hover:text-[#0D1B2A] text-white font-black py-4 rounded-xl
                       transition-all flex items-center justify-center gap-2 disabled:opacity-60">
            {loading
              ? (receipt && !error ? 'Uploading receipt…' : 'Submitting…')
              : <>Submit Registration <ChevronRight size={18} /></>}
          </button>

          <p className="text-center text-xs text-gray-600">
            Your registration is confirmed once the Decagon team verifies your receipt.
          </p>
        </form>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab 2 — 20-Day Challenge
// ─────────────────────────────────────────────────────────────────────────────

const MOCK_LEADERS = [
  { rank: 1, name: 'Aisha Bello',   dept: 'Mathematics',      score: 940, days: 18, badge: '🥇' },
  { rank: 2, name: 'Emeka Nwosu',   dept: 'Computer Science', score: 910, days: 17, badge: '🥈' },
  { rank: 3, name: 'Fatima Yusuf',  dept: 'Statistics',       score: 875, days: 17, badge: '🥉' },
  { rank: 4, name: 'Tunde Adeyemi', dept: 'Physics',          score: 850, days: 16, badge: null },
  { rank: 5, name: 'Zara Okafor',   dept: 'Biochemistry',     score: 820, days: 15, badge: null },
]

function ChallengeTab() {
  const [form, setForm]       = useState({ fullName: '', email: '', department: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await saveChallengeSignup({ full_name: form.fullName, email: form.email, department: form.department })
      setSubmitted(true)
    } catch (err) {
      if (err.message === 'duplicate') {
        setError('This email is already signed up for the challenge.')
      } else if (err.message === 'no-backend') {
        setError('Signup system is temporarily unavailable. Please contact the Decagon team.')
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const days = Array.from({ length: 20 }, (_, i) => i + 1)

  return (
    <div className="space-y-10">

      <div className="grid sm:grid-cols-2 gap-3">
        {[
          { icon: BookOpen, title: 'Daily Questions',   desc: 'One calculus question drops every day starting May 3rd, for 20 days.' },
          { icon: Clock,    title: 'Submit by Midnight', desc: 'Each question closes at midnight. Late submissions are not accepted.' },
          { icon: Zap,      title: 'Points for Speed',  desc: 'Correct answers earn points. Faster submissions earn bonus points.' },
          { icon: Trophy,   title: '₦20,000 Prize',     desc: 'The top participant on the leaderboard wins ₦20,000.' },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-white/[0.03] border border-white/10 rounded-xl p-4 flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-400/10 flex items-center justify-center shrink-0">
              <Icon size={15} className="text-cyan-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">{title}</p>
              <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div>
        <SectionLabel>Challenge Days</SectionLabel>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {days.map(d => (
            <div key={d} className="aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 text-xs font-black border
                                    bg-white/[0.03] border-white/5 text-gray-700">
              <span className="text-[10px] text-gray-600 font-normal">Day</span>
              {d}
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-600 mt-3">Day 1 unlocks on May 3, 2026</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <SectionLabel>Sign Up — Free, Open to All</SectionLabel>
          {submitted
            ? <SuccessBanner email={form.email} message="You're in!" sub="Challenge details will be sent to" groupLink="https://chat.whatsapp.com/DnC6Z7LICSSITIEORFMqEJ?mode=gi_t" />
            : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Field label="Full Name"    placeholder="e.g. Emeka Nwosu"  value={form.fullName}   onChange={set('fullName')}   required />
                <Field label="Email Address" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
                <SelectField label="Department" value={form.department} onChange={set('department')} required
                  placeholder="Select department" options={DEPARTMENTS} />
                <p className="text-xs text-gray-500">No fee required. Open to all UNILAG students.</p>
                <ErrorBox message={error} />
                <button type="submit" disabled={loading}
                  className="w-full bg-cyan-400/10 hover:bg-cyan-400/20 border border-cyan-400/30 text-cyan-300 font-black py-4 rounded-xl
                             transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                  {loading ? 'Signing up…' : <>Join the Challenge <ChevronRight size={18} /></>}
                </button>
              </form>
            )
          }
        </div>

        <div>
          <SectionLabel>Live Leaderboard</SectionLabel>
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs text-cyan-400 font-semibold uppercase tracking-wider">Updates daily</span>
            </div>
            <div className="grid grid-cols-[2rem_1fr_auto_auto] gap-2 px-2 mb-1">
              <span className="text-xs text-gray-600">#</span>
              <span className="text-xs text-gray-600">Participant</span>
              <span className="text-xs text-gray-600 text-center">Days</span>
              <span className="text-xs text-gray-600 text-right">Score</span>
            </div>
            {MOCK_LEADERS.map(p => (
              <div key={p.rank} className={`grid grid-cols-[2rem_1fr_auto_auto] gap-2 items-center px-4 py-3 rounded-xl border ${
                p.rank === 1 ? 'bg-brand-orange/10 border-brand-orange/30'
                : p.rank <= 3 ? 'bg-white/5 border-white/10'
                : 'bg-white/[0.02] border-white/5'
              }`}>
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
            <p className="text-center text-xs text-gray-600 pt-1">* Sample data — live scores populate when challenge begins</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab 3 — Mini Conference
// ─────────────────────────────────────────────────────────────────────────────

function ConferenceTab() {
  return (
    <div className="space-y-6">
      <p className="text-gray-400 text-sm leading-relaxed">
        The Decagon 5.0 Mini Conference is an exclusive academic gathering running alongside the competition in
        May 2026. It brings together faculty members, invited experts, and students for structured talks and
        Q&amp;A sessions covering advanced topics in calculus and mathematical sciences.
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        {[
          { icon: Mic,      title: 'Expert Talks',    desc: 'Invited speakers from academia and industry present on topics in applied and pure mathematics.' },
          { icon: Users,    title: 'Panel Q&A',       desc: 'Attendees engage directly with speakers in open, structured question sessions.' },
          { icon: BookOpen, title: 'Topics',          desc: 'Advanced calculus, mathematical modelling, research in mathematical sciences.' },
          { icon: Star,     title: 'Exclusive Access', desc: 'Attendance is by invite or registration. Details will be announced closer to the event.' },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-white/[0.03] border border-white/10 rounded-xl p-4 flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-400/10 flex items-center justify-center shrink-0">
              <Icon size={15} className="text-cyan-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">{title}</p>
              <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-5">
        <Clock size={18} className="text-gray-500 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-white">Speakers &amp; Schedule — Coming Soon</p>
          <p className="text-xs text-gray-500 mt-0.5">Full conference details, speaker lineup, and registration will be announced in May 2026</p>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared small label
// ─────────────────────────────────────────────────────────────────────────────

function SectionLabel({ children }) {
  return <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{children}</p>
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────

const TABS = [
  { key: 'competition', label: 'Main Competition', icon: Trophy },
  { key: 'challenge',   label: '20-Day Challenge', icon: BookOpen },
  { key: 'conference',  label: 'Mini Conference',  icon: Mic },
]

const PHASES = [
  {
    num: '01', icon: BookOpen, title: '20-Day Calculus Challenge',
    when: 'May 3, 2026', tag: 'Open to all', prize: '₦20,000 prize',
    desc: 'Starts May 3rd. Open to everyone. A new calculus problem drops daily for 20 days. Earn points for correctness and speed.',
    accent: 'border-cyan-400/30 bg-cyan-400/5',
  },
  {
    num: '02', icon: Mic, title: 'Mini Conference',
    when: 'May 2026', tag: 'Invite / Registration', prize: null,
    desc: 'Exclusive talks and Q&A sessions with faculty and invited experts in mathematical sciences.',
    accent: 'border-white/10 bg-white/[0.03]',
  },
  {
    num: '03', icon: Zap, title: 'Main Calculus Competition',
    when: 'May 2026', tag: 'Registered competitors only', prize: null,
    desc: 'Multiple elimination stages. All registered competitors advance through screening, written and oral rounds. Top 5 qualify.',
    accent: 'border-brand-orange/20 bg-brand-orange/5',
  },
  {
    num: '04', icon: Trophy, title: 'Grand Finale & Awards',
    when: 'June 2026', tag: 'Open audience', prize: '₦150,000 · ₦100,000 · ₦70,000',
    desc: 'Top 5 finalists compete live on stage before 200+ students, faculty, and delegates. Winners crowned.',
    accent: 'border-brand-yellow/30 bg-brand-yellow/5',
  },
]

export default function Decagon() {
  usePageTitle('Decagon 5.0 — The Ultimate Calculus Competition')
  const [tab, setTab] = useState('competition')

  return (
    <div className="min-h-screen" style={{ background: '#0D1B2A', color: '#fff' }}>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-16 pb-20 text-center">
        <div className="absolute inset-0 opacity-[0.035]"
          style={{ backgroundImage: 'linear-gradient(#00CCFF 1px,transparent 1px),linear-gradient(90deg,#00CCFF 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[320px] rounded-full blur-[140px] opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse,#00CCFF,transparent)' }} />

        <div className="relative max-w-3xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400 mb-4">
            NAMSSN UNILAG · Department of Mathematics
          </p>
          <img src="/images/decagon-logo.svg" alt="Decagon 5.0"
            className="mx-auto mb-6 w-72 sm:w-96 max-w-full" />
          <p className="text-xl text-gray-300 font-semibold mb-3">The Ultimate Calculus Competition</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 mb-10">
            <span className="flex items-center gap-1.5"><Calendar size={14} className="text-cyan-400" /> May – June 2026</span>
            <span className="text-white/10">|</span>
            <span className="flex items-center gap-1.5"><MapPin size={14} className="text-cyan-400" /> University of Lagos</span>
            <span className="text-white/10">|</span>
            <span className="flex items-center gap-1.5"><Users size={14} className="text-cyan-400" /> 200+ expected</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            {[
              { icon: Layers, value: '4',     label: 'Phases' },
              { icon: Users,  value: '50+',   label: 'Competitors' },
              { icon: Star,   value: '4',     label: 'Comp. Stages' },
              { icon: Trophy, value: '₦340k', label: 'Total Prizes' },
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

      <div className="max-w-5xl mx-auto px-4 pb-24 space-y-16">

        {/* Event Phases */}
        <section>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Event Phases</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {PHASES.map(p => (
              <div key={p.num} className={`border rounded-2xl p-5 space-y-2.5 ${p.accent}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <p.icon size={16} className="text-cyan-300" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Phase {p.num}</p>
                      <h3 className="text-sm font-black text-white leading-tight">{p.title}</h3>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap shrink-0">{p.when}</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">{p.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {p.prize && (
                    <span className="text-xs font-bold text-brand-orange bg-brand-orange/10 border border-brand-orange/20 px-2.5 py-0.5 rounded-full">
                      {p.prize}
                    </span>
                  )}
                  <span className="text-xs text-gray-500 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full">{p.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tabs */}
        <section>
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            {TABS.map(({ key, label, icon: Icon }) => (
              <label key={key}
                className={`flex items-center gap-3 flex-1 cursor-pointer rounded-2xl border p-4 transition-all ${
                  tab === key
                    ? 'bg-cyan-400/10 border-cyan-400/40 text-white'
                    : 'bg-white/[0.03] border-white/10 text-gray-400 hover:border-white/20'
                }`}
              >
                <input type="radio" name="section" value={key} checked={tab === key}
                  onChange={() => setTab(key)} className="sr-only" />
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  tab === key ? 'bg-cyan-400/20' : 'bg-white/5'
                }`}>
                  <Icon size={16} className={tab === key ? 'text-cyan-400' : 'text-gray-500'} />
                </div>
                <span className="text-sm font-bold">{label}</span>
                {tab === key && <div className="ml-auto w-2 h-2 rounded-full bg-cyan-400 shrink-0" />}
              </label>
            ))}
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 sm:p-8">
            {tab === 'competition' && <CompetitionTab />}
            {tab === 'challenge'   && <ChallengeTab />}
            {tab === 'conference'  && <ConferenceTab />}
          </div>
        </section>

        {/* Contact */}
        <section className="text-center text-gray-500 text-sm space-y-1.5">
          <p className="font-semibold text-gray-400 text-base">Contact the Decagon Team</p>
          <p>+234 816 533 6309 &nbsp;·&nbsp; +234 903 449 5638</p>
          <p className="text-gray-600">@namssn_unilag on Instagram, X, and Facebook</p>
        </section>

      </div>
    </div>
  )
}
