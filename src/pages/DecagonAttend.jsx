import { useState, useEffect } from 'react'
import { Ticket, CheckCircle2, AlertCircle } from 'lucide-react'
import emailjs from '@emailjs/browser'
import usePageTitle from '../hooks/usePageTitle'

const SUPABASE_URL      = import.meta.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || ''
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ''
const EMAILJS_TICKET_TID = import.meta.env.VITE_EMAILJS_TICKET_TEMPLATE_ID || ''

const FREEBIE_SLOTS = 50

async function saveAttendance(data) {
  if (!SUPABASE_URL) throw new Error('no-backend')
  const res = await fetch(`${SUPABASE_URL}/rest/v1/decagon_attendance`, {
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

function ErrorBox({ message }) {
  if (!message) return null
  return (
    <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
      <AlertCircle size={15} className="text-red-400 shrink-0 mt-0.5" />
      <p className="text-sm text-red-300">{message}</p>
    </div>
  )
}

function TicketCard({ ticket }) {
  const typeLabel = ticket.studentType === 'unilag' ? 'Unilag Student' : 'Non-Unilag Student'
  return (
    <div className="w-full rounded-2xl border border-white/20 bg-white/[0.04] overflow-hidden">
      <div className="bg-brand-orange/20 border-b border-white/10 px-5 py-3">
        <p className="text-[10px] font-bold text-brand-orange uppercase tracking-[0.2em]">Decagon 5.0 — Grand Finale</p>
        <p className="text-xs text-gray-400 mt-0.5">June 6th, 2026 · University of Lagos</p>
      </div>
      <div className="px-5 py-4 space-y-3">
        {[
          { label: 'Name',        value: ticket.fullName },
          { label: 'Type',        value: typeLabel },
          { label: 'Meal Ticket', value: '×1' },
          { label: 'Ticket ID',   value: ticket.ticketId, mono: true },
        ].map(({ label, value, mono }) => (
          <div key={label} className="flex justify-between items-center gap-4">
            <span className="text-xs text-gray-500 shrink-0">{label}</span>
            <span className={`text-sm font-bold text-right ${mono ? 'text-cyan-400 font-mono tracking-widest' : 'text-white'}`}>
              {value}
            </span>
          </div>
        ))}
      </div>
      {ticket.isFreebie && (
        <div className="border-t border-white/10 px-5 py-3 bg-cyan-400/5 flex items-center gap-2">
          <span className="text-base">🎁</span>
          <span className="text-xs font-bold text-cyan-400">You qualify for a freebie! Collect at the venue.</span>
        </div>
      )}
    </div>
  )
}

export default function DecagonAttend() {
  usePageTitle('Attend — Decagon 5.0 Grand Finale')

  const [form, setForm]             = useState({ fullName: '', email: '', studentType: 'unilag' })
  const [submitted, setSubmitted]   = useState(false)
  const [ticketData, setTicketData] = useState(null)
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState('')
  const [attendeeCount, setAttendeeCount] = useState(0)
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  useEffect(() => {
    if (!SUPABASE_URL) return
    fetch(`${SUPABASE_URL}/rest/v1/decagon_attendance?select=id`, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}`, Prefer: 'count=exact' },
    })
      .then(r => {
        const c = r.headers.get('content-range')
        const n = c ? parseInt(c.split('/')[1]) : 0
        setAttendeeCount(isNaN(n) ? 0 : n)
      })
      .catch(() => {})
  }, [])

  const freebieLeft    = Math.max(0, FREEBIE_SLOTS - attendeeCount)
  const willGetFreebie = attendeeCount < FREEBIE_SLOTS

  const generateTicketId = () => 'DCG-' + Math.random().toString(36).substring(2, 8).toUpperCase()

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true); setError('')
    const ticketId = generateTicketId()
    try {
      await saveAttendance({
        full_name:    form.fullName,
        email:        form.email,
        student_type: form.studentType,
        ticket_id:    ticketId,
        meal_ticket:  1,
        is_freebie:   willGetFreebie,
      })
      if (EMAILJS_SERVICE_ID && EMAILJS_TICKET_TID) {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TICKET_TID, {
          to_name:      form.fullName,
          to_email:     form.email,
          ticket_id:    ticketId,
          student_type: form.studentType === 'unilag' ? 'Unilag Student' : 'Non-Unilag Student',
          meal_ticket:  '×1',
          freebie:      willGetFreebie ? 'Yes — collect at the venue 🎁' : 'No',
          event_date:   'June 6th, 2026',
          event_venue:  'University of Lagos',
        }, EMAILJS_PUBLIC_KEY)
      }
      setTicketData({ ...form, ticketId, isFreebie: willGetFreebie })
      setSubmitted(true)
    } catch (err) {
      if (err.message === 'duplicate')       setError('This email is already registered. Check your inbox for your ticket.')
      else if (err.message === 'no-backend') setError('Registration system is temporarily unavailable. Please try again.')
      else                                   setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: '#0D1B2A', color: '#fff' }}>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-16 pb-14 text-center">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(#00CCFF 1px,transparent 1px),linear-gradient(90deg,#00CCFF 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[280px] rounded-full blur-[120px] opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse,#FF6B35,transparent)' }} />
        <div className="relative max-w-xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-orange mb-3">Decagon 5.0</p>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">Grand Finale</h1>
          <p className="text-gray-400 text-base mb-2">June 6th, 2026 · University of Lagos</p>
          <p className="text-gray-500 text-sm">Free entry · Register to secure your spot & meal ticket</p>

          {freebieLeft > 0 ? (
            <div className="mt-5 inline-flex items-center gap-2 bg-cyan-400/10 border border-cyan-400/20 px-4 py-2 rounded-full">
              <span className="text-sm font-bold text-cyan-400">
                🎁 {freebieLeft} freebie spot{freebieLeft !== 1 ? 's' : ''} remaining — first {FREEBIE_SLOTS} attendees
              </span>
            </div>
          ) : (
            <div className="mt-5 inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
              <span className="text-sm text-gray-500">Freebie spots filled · {FREEBIE_SLOTS}/{FREEBIE_SLOTS}</span>
            </div>
          )}
        </div>
      </section>

      {/* Form / Success */}
      <section className="max-w-lg mx-auto px-4 pb-24">
        {submitted && ticketData ? (
          <div className="flex flex-col items-center gap-6 py-4">
            <div className="w-16 h-16 rounded-full bg-green-400/20 flex items-center justify-center">
              <CheckCircle2 size={30} className="text-green-400" />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-black text-white">You're registered!</h2>
              <p className="text-gray-400 text-sm mt-1">
                Your ticket has been sent to <span className="text-cyan-400">{ticketData.email}</span>
              </p>
            </div>
            <TicketCard ticket={ticketData} />
            <p className="text-xs text-gray-600 text-center">
              Show this ticket or your confirmation email at the venue on June 6th.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 bg-white/[0.03] border border-white/10 rounded-2xl p-6 sm:p-8">
            <h2 className="text-base font-black text-white mb-1">Register to Attend</h2>

            <Field label="Full Name" placeholder="e.g. Jubril Dokun"
              value={form.fullName} onChange={set('fullName')} required />

            <Field label="Email Address" type="email" placeholder="your@email.com"
              value={form.email} onChange={set('email')} required />

            {/* Student type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'unilag',     label: 'Unilag Student'     },
                  { value: 'non-unilag', label: 'Non-Unilag Student' },
                ].map(({ value, label }) => (
                  <button key={value} type="button"
                    onClick={() => setForm(f => ({ ...f, studentType: value }))}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      form.studentType === value
                        ? 'border-cyan-400/60 bg-cyan-400/10'
                        : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                    }`}>
                    <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                      form.studentType === value ? 'border-cyan-400' : 'border-gray-600'
                    }`}>
                      {form.studentType === value && <div className="w-2 h-2 rounded-full bg-cyan-400" />}
                    </div>
                    <span className="text-sm font-bold text-white">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Meal ticket — locked */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Meal Ticket</label>
              <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 cursor-not-allowed">
                <span className="text-sm text-white flex-1">Included with registration</span>
                <span className="text-cyan-400 font-black text-sm">×1</span>
                <span className="text-[10px] text-gray-600 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">Fixed</span>
              </div>
            </div>

            <ErrorBox message={error} />

            <button type="submit" disabled={loading}
              className="w-full py-4 rounded-xl bg-brand-orange hover:bg-orange-500 text-white font-black text-sm
                         transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              <Ticket size={16} />
              {loading ? 'Registering…' : 'Register & Get Ticket'}
            </button>
            <p className="text-center text-xs text-gray-600">Your ticket will be sent to your email address.</p>
          </form>
        )}
      </section>
    </div>
  )
}
