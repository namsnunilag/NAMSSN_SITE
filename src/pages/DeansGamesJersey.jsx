import { useState, useRef, useEffect } from 'react'
import { CheckCircle2, AlertCircle, Copy, Check, Upload, Shirt } from 'lucide-react'
import usePageTitle from '../hooks/usePageTitle'

const SUPABASE_URL      = import.meta.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

const JERSEY_PRICE = 12000
const SIZES = ['S', 'M', 'L', 'XL', 'XXL']

const BANK = {
  name:    'Moniepoint MFB',
  account: '8123174623',
  holder:  'NAMSSN UNILAG OFFICIAL SERVICES',
}

async function uploadReceipt(file, key) {
  if (!SUPABASE_URL) throw new Error('no-backend')
  const ext      = file.name.split('.').pop()
  const filename = `jersey_${key}_${Date.now()}.${ext}`
  const res = await fetch(
    `${SUPABASE_URL}/storage/v1/object/decagon-receipts/${filename}`,
    {
      method: 'POST',
      headers: {
        apikey:         SUPABASE_ANON_KEY,
        Authorization:  `Bearer ${SUPABASE_ANON_KEY}`,
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

async function saveJerseyOrder(data) {
  if (!SUPABASE_URL) throw new Error('no-backend')
  const res = await fetch(`${SUPABASE_URL}/rest/v1/deans_games_jersey_orders`, {
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
    throw new Error(body.message || `HTTP ${res.status}`)
  }
}

function Field({ label, type = 'text', placeholder, value, onChange, required, maxLength }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</label>
      <input
        type={type} placeholder={placeholder} value={value}
        onChange={onChange} required={required} maxLength={maxLength}
        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500
                   focus:outline-none focus:ring-2 focus:ring-red-400/40 focus:border-red-400/40 transition"
      />
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
    <button type="button" onClick={copy} className="ml-2 text-gray-500 hover:text-red-400 transition shrink-0">
      {copied ? <Check size={13} className="text-red-400" /> : <Copy size={13} />}
    </button>
  )
}

function BankDetails() {
  return (
    <div className="rounded-xl border border-red-400/20 bg-red-400/5 overflow-hidden">
      <div className="px-4 py-3 border-b border-red-400/10">
        <p className="text-xs font-bold text-red-400 uppercase tracking-wider">
          Transfer ₦{JERSEY_PRICE.toLocaleString()} to this account
        </p>
      </div>
      <div className="px-4 py-4 space-y-3">
        {[
          { label: 'Bank',         value: BANK.name,    copy: false },
          { label: 'Account No.',  value: BANK.account, copy: true  },
          { label: 'Account Name', value: BANK.holder,  copy: false },
          { label: 'Amount',       value: `₦${JERSEY_PRICE.toLocaleString()}`, copy: false },
        ].map(({ label, value, copy }) => (
          <div key={label} className="flex justify-between items-center gap-4">
            <span className="text-xs text-gray-500 shrink-0">{label}</span>
            <div className="flex items-center">
              <span className={`text-sm font-bold text-right ${
                label === 'Account No.' ? 'text-red-400 font-black tracking-wider' :
                label === 'Amount'      ? 'text-red-400 font-black' : 'text-white'
              }`}>{value}</span>
              {copy && <CopyButton text={value} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function FileUpload({ value, onChange, required }) {
  const inputRef = useRef(null)
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Upload Payment Receipt</label>
      <button type="button" onClick={() => inputRef.current?.click()}
        className={`flex items-center gap-3 border rounded-xl px-4 py-3 transition text-left ${
          value
            ? 'border-red-400/40 bg-red-400/5 text-red-300'
            : 'border-white/10 bg-white/5 text-gray-500 hover:border-white/20'
        }`}>
        <Upload size={15} className="shrink-0" />
        <span className="text-sm truncate">{value ? value.name : 'Click to upload your receipt'}</span>
      </button>
      <p className="text-xs text-gray-600">JPG, PNG or PDF · max 5 MB</p>
      <input ref={inputRef} type="file" accept="image/*,.pdf" className="hidden" required={required}
        onChange={e => { const f = e.target.files?.[0]; if (f && f.size <= 5 * 1024 * 1024) onChange(f); else if (f) alert('File too large. Max 5 MB.') }} />
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

export default function DeansGamesJersey() {
  usePageTitle("Dean's Games Jersey — Preorder")

  const [form, setForm]           = useState({ fullName: '', email: '', phone: '', jerseyName: '', jerseyNumber: '', size: '' })
  const [receipt, setReceipt]     = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.size)    { setError('Please select a size.'); return }
    if (!receipt)      { setError('Please upload your payment receipt.'); return }
    setLoading(true); setError('')
    try {
      const key = form.email.replace(/[@.]/g, '_')
      const receiptUrl = await uploadReceipt(receipt, key)
      await saveJerseyOrder({
        full_name:      form.fullName,
        email:          form.email,
        phone:          form.phone,
        jersey_name:    form.jerseyName,
        jersey_number:  form.jerseyNumber,
        size:           form.size,
        amount:         JERSEY_PRICE,
        receipt_url:    receiptUrl,
      })
      setSubmitted(true)
    } catch (err) {
      if (err.message === 'no-backend') setError('Order system is temporarily unavailable. Please contact the team.')
      else setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: '#0D1B2A', color: '#fff' }}>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-16 pb-14 text-center">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(#ef4444 1px,transparent 1px),linear-gradient(90deg,#ef4444 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[280px] rounded-full blur-[120px] opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse,#ef4444,transparent)' }} />
        <div className="relative max-w-xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-400 mb-3">Dean's Games 2026</p>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">Jersey Preorder</h1>
          <p className="text-gray-400 text-base mb-2">Red jersey · Your name & number on the back</p>
          <p className="text-3xl font-black text-red-400 mt-4">₦{JERSEY_PRICE.toLocaleString()}</p>
          <p className="text-gray-500 text-sm mt-1">per jersey · limited stock</p>
        </div>
      </section>

      {/* Form / Success */}
      <section className="max-w-lg mx-auto px-4 pb-24">
        {submitted ? (
          <div className="flex flex-col items-center gap-6 py-4 text-center">
            <div className="w-16 h-16 rounded-full bg-red-400/20 flex items-center justify-center">
              <CheckCircle2 size={30} className="text-red-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">Order received!</h2>
              <p className="text-gray-400 text-sm mt-1">
                We'll confirm your order via <span className="text-red-400">{form.email}</span>
              </p>
            </div>
            <div className="w-full rounded-2xl border border-white/20 bg-white/[0.04] overflow-hidden">
              <div className="bg-red-500/20 border-b border-white/10 px-5 py-3">
                <p className="text-[10px] font-bold text-red-400 uppercase tracking-[0.2em]">Dean's Games — Jersey Order</p>
              </div>
              <div className="px-5 py-4 space-y-3">
                {[
                  { label: 'Name',          value: form.fullName },
                  { label: 'Jersey Name',   value: form.jerseyName },
                  { label: 'Jersey No.',    value: form.jerseyNumber },
                  { label: 'Size',          value: form.size },
                  { label: 'Amount Paid',   value: `₦${JERSEY_PRICE.toLocaleString()}` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center gap-4">
                    <span className="text-xs text-gray-500 shrink-0">{label}</span>
                    <span className="text-sm font-bold text-white text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-600">Pickup/delivery details will be communicated before the event.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 bg-white/[0.03] border border-white/10 rounded-2xl p-6 sm:p-8">
            <h2 className="text-base font-black text-white mb-1">Order Your Jersey</h2>

            {/* Size */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Size</label>
              <div className="flex gap-2 flex-wrap">
                {SIZES.map(sz => (
                  <button key={sz} type="button"
                    onClick={() => setForm(f => ({ ...f, size: sz }))}
                    className={`w-12 h-12 rounded-xl border text-sm font-black transition-all ${
                      form.size === sz
                        ? 'border-red-400/60 bg-red-400/10 text-red-300'
                        : 'border-white/10 bg-white/[0.02] text-gray-400 hover:border-white/20'
                    }`}>
                    {sz}
                  </button>
                ))}
              </div>
              {!form.size && <p className="text-xs text-gray-600">Select your size</p>}
            </div>

            {/* Jersey name + number */}
            <Field label="Name on Jersey Back" placeholder="e.g. JUBRIL"
              value={form.jerseyName} onChange={set('jerseyName')} required maxLength={20} />
            <Field label="Number on Jersey Back" placeholder="e.g. 10"
              value={form.jerseyNumber} onChange={set('jerseyNumber')} required maxLength={3} />

            {/* Personal details */}
            <Field label="Your Full Name" placeholder="e.g. Jubril Dokun"
              value={form.fullName} onChange={set('fullName')} required />
            <Field label="Email Address" type="email" placeholder="your@email.com"
              value={form.email} onChange={set('email')} required />
            <Field label="Phone Number" type="tel" placeholder="+234 800 000 0000"
              value={form.phone} onChange={set('phone')} required />

            {/* Bank details */}
            <BankDetails />

            {/* Receipt */}
            <FileUpload value={receipt} onChange={setReceipt} required />

            <ErrorBox message={error} />

            <button type="submit" disabled={loading}
              className="w-full py-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-black text-sm
                         transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              <Shirt size={16} />
              {loading ? 'Placing order…' : `Place Order · ₦${JERSEY_PRICE.toLocaleString()}`}
            </button>
            <p className="text-center text-xs text-gray-600">
              Orders will be confirmed via email. Pickup details communicated before the event.
            </p>
          </form>
        )}
      </section>
    </div>
  )
}
