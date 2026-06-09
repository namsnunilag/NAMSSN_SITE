import { useState, useRef } from 'react'
import { CheckCircle2, AlertCircle, Copy, Check, Upload, Shirt } from 'lucide-react'
import usePageTitle from '../hooks/usePageTitle'

const SUPABASE_URL      = import.meta.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

const JERSEY_PRICE = 12000
const SIZES = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'XXXXL']

const BANK = {
  name:    'Moniepoint MFB',
  account: '8123174623',
  holder:  'NAMSSN UNILAG OFFICIAL SERVICES',
}

async function uploadReceipt(file, key) {
  if (!SUPABASE_URL) throw new Error('no-backend')
  const ext      = (file.name.split('.').pop() || 'jpg').toLowerCase()
  const mimeMap  = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', pdf: 'application/pdf', heic: 'image/heic', heif: 'image/heif' }
  const mime     = file.type || mimeMap[ext] || 'application/octet-stream'
  const filename = `jersey_${key}_${Date.now()}.${ext}`
  const res = await fetch(
    `${SUPABASE_URL}/storage/v1/object/decagon-receipts/${filename}`,
    {
      method: 'POST',
      headers: {
        apikey:         SUPABASE_ANON_KEY,
        Authorization:  `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': mime,
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
                   focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/40 transition"
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
    <button type="button" onClick={copy} className="ml-2 text-gray-500 hover:text-cyan-400 transition shrink-0">
      {copied ? <Check size={13} className="text-cyan-400" /> : <Copy size={13} />}
    </button>
  )
}

function BankDetails() {
  return (
    <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 overflow-hidden">
      <div className="px-4 py-3 border-b border-cyan-400/10">
        <p className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
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
                label === 'Account No.' ? 'text-cyan-400 font-black tracking-wider' :
                label === 'Amount'      ? 'text-brand-orange font-black' : 'text-white'
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
            ? 'border-cyan-400/40 bg-cyan-400/5 text-cyan-300'
            : 'border-white/10 bg-white/5 text-gray-500 hover:border-white/20'
        }`}>
        <Upload size={15} className="shrink-0" />
        <span className="text-sm truncate">{value ? value.name : 'Click to upload your receipt'}</span>
      </button>
      <p className="text-xs text-gray-600">JPG, PNG or PDF · max 5 MB</p>
      <input ref={inputRef} type="file" accept="image/*,.pdf,.heic,.heif" className="hidden" required={required}
        onChange={e => {
          const f = e.target.files?.[0]
          if (f && f.size <= 5 * 1024 * 1024) onChange(f)
          else if (f) alert('File too large. Max 5 MB.')
        }} />
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

  const [view, setView]           = useState('front')
  const [form, setForm]           = useState({ fullName: '', email: '', phone: '', jerseyName: '', jerseyNumber: '', size: '' })
  const [receipt, setReceipt]     = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.size)  { setError('Please select a size.'); return }
    if (!receipt)    { setError('Please upload your payment receipt.'); return }
    setLoading(true); setError('')
    try {
      const key = form.email.replace(/[@.]/g, '_')
      const receiptUrl = await uploadReceipt(receipt, key)
      await saveJerseyOrder({
        full_name:     form.fullName,
        email:         form.email,
        phone:         form.phone,
        jersey_name:   form.jerseyName,
        jersey_number: form.jerseyNumber,
        size:          form.size,
        amount:        JERSEY_PRICE,
        receipt_url:   receiptUrl,
      })
      setSubmitted(true)
    } catch (err) {
      if (err.message === 'no-backend') setError('Order system is temporarily unavailable. Please contact the team.')
      else setError('Something went wrong. Please try again or contact the team.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: '#0D1B2A', color: '#fff' }}>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-16 pb-10 text-center">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(#00CCFF 1px,transparent 1px),linear-gradient(90deg,#00CCFF 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[260px] rounded-full blur-[120px] opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse,#00CCFF,transparent)' }} />
        <div className="relative max-w-xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400 mb-3">Dean's Games 2026</p>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-2">NAMSSN Jersey</h1>
          <p className="text-gray-400 text-sm mb-1">Your name & number printed on the back</p>
          <p className="text-3xl font-black text-cyan-400 mt-4">₦{JERSEY_PRICE.toLocaleString()}</p>
          <p className="text-gray-500 text-sm mt-1">per jersey · limited stock · preorder now</p>
        </div>
      </section>

      {/* Jersey preview */}
      <section className="max-w-2xl mx-auto px-4 pb-6">
        <div className="flex gap-2 justify-center mb-4">
          {[{ key: 'front', label: 'Front' }, { key: 'back', label: 'Back' }].map(({ key, label }) => (
            <button key={key} onClick={() => setView(key)}
              className={`text-xs font-bold px-5 py-2 rounded-xl border transition ${
                view === key
                  ? 'bg-cyan-400/15 border-cyan-400/40 text-cyan-300'
                  : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/20'
              }`}>
              {label}
            </button>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02] aspect-[4/5]">
            <img
              src={view === 'front' ? '/images/jersey/jersey-front.png' : '/images/jersey/jersey-back.png'}
              alt={`Jersey ${view}`}
              className="w-full h-full object-cover scale-110"
            />
          </div>
          <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02]">
            <img
              src={view === 'front' ? '/images/jersey/jersey-model-front.png' : '/images/jersey/jersey-model-back.png'}
              alt={`Jersey ${view} on model`}
              className="w-full object-cover"
            />
          </div>
        </div>
        <p className="text-xs text-gray-600 text-center mt-2">
          Navy blue · Cyan accents · Your name & number on back
        </p>
      </section>

      {/* Form / Success */}
      <section className="max-w-2xl mx-auto px-4 pb-24">
        {submitted ? (
          <div className="flex flex-col items-center gap-6 py-4 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-400/20 flex items-center justify-center">
              <AlertCircle size={30} className="text-amber-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">Order submitted!</h2>
              <p className="text-gray-400 text-sm mt-1 max-w-xs">
                Your order is <span className="text-amber-400 font-bold">pending payment verification</span>. We'll confirm via <span className="text-cyan-400">{form.email}</span> once payment is verified.
              </p>
            </div>
            <div className="w-full rounded-2xl border border-white/20 bg-white/[0.04] overflow-hidden">
              <div className="bg-cyan-400/10 border-b border-white/10 px-5 py-3">
                <p className="text-[10px] font-bold text-amber-400 uppercase tracking-[0.2em]">Dean's Games — Pending Verification</p>
              </div>
              <div className="px-5 py-4 space-y-3">
                {[
                  { label: 'Name',          value: form.fullName    },
                  { label: 'Jersey Name',   value: form.jerseyName  },
                  { label: 'Jersey No.',    value: form.jerseyNumber },
                  { label: 'Size',          value: form.size        },
                  { label: 'Amount Paid',   value: `₦${JERSEY_PRICE.toLocaleString()}` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center gap-4">
                    <span className="text-xs text-gray-500 shrink-0">{label}</span>
                    <span className="text-sm font-bold text-white text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-600">You will receive a confirmation email once your payment is verified by our team.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 bg-white/[0.03] border border-white/10 rounded-2xl p-6 sm:p-8">
            <h2 className="text-base font-black text-white mb-1">Order Your Jersey</h2>

            {/* Size */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Size</label>
              <div className="grid grid-cols-4 gap-2">
                {SIZES.map(sz => (
                  <button key={sz} type="button"
                    onClick={() => setForm(f => ({ ...f, size: sz }))}
                    className={`py-3 rounded-xl border text-sm font-black transition-all ${
                      form.size === sz
                        ? 'border-cyan-400/60 bg-cyan-400/10 text-cyan-300'
                        : 'border-white/10 bg-white/[0.02] text-gray-400 hover:border-white/20'
                    }`}>
                    {sz}
                  </button>
                ))}
              </div>
              {!form.size && <p className="text-xs text-gray-600">Select your size</p>}
            </div>

            {/* Jersey personalisation */}
            <Field label="Name on Jersey Back" placeholder="e.g. JUBRIL (max 15 chars)"
              value={form.jerseyName} onChange={set('jerseyName')} required maxLength={15} />
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
              className="w-full py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#0D1B2A] font-black text-sm
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
