import { useEffect, useMemo, useState } from 'react'
import { Calendar, Check, Clock3, Copy, MapPin, Ticket, Upload, Users } from 'lucide-react'
import usePageTitle from '../hooks/usePageTitle'

export const MAX_MOVIE_NIGHT_TICKETS = 100
const ACCOUNT_NUMBER = '7017847100'
const ACCOUNT_NAME = 'Demilade Gabriel Oguntuga'
const PRICES = { single: 2000, couples: 3500 }
const MAX_RECEIPT_BYTES = 5 * 1024 * 1024
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

function formatNaira(amount) {
  return `₦${Number(amount).toLocaleString('en-NG')}`
}

function StepHeading({ number, title }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-700 text-sm font-black text-white">{number}</span>
      <h3 className="text-xl font-bold text-slate-950 dark:text-white">{title}</h3>
    </div>
  )
}

function Field({ label, children, helper }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-800 dark:text-slate-100">
      {label}
      {children}
      {helper && <span className="text-xs font-normal leading-relaxed text-slate-500 dark:text-slate-400">{helper}</span>}
    </label>
  )
}

function TextInput(props) {
  return (
    <input
      {...props}
      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
    />
  )
}

function StatusLookup() {
  const [lookup, setLookup] = useState('')
  const [orders, setOrders] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function checkStatus(event) {
    event.preventDefault()
    setError('')
    setOrders(null)
    setLoading(true)
    try {
      const response = await fetch(`/api/movie-night/status?lookup=${encodeURIComponent(lookup.trim())}`)
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'We could not check that order. Please try again.')
      setOrders(data.orders || [data])
    } catch (requestError) {
      setError(requestError.message || 'We could not check that order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-8">
      <div className="mb-5">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700 dark:text-blue-300">Already registered?</p>
        <h2 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">Check your order</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">Enter your email address or order reference to see the latest update.</p>
      </div>
      <form onSubmit={checkStatus} className="flex flex-col gap-3 sm:flex-row">
        <TextInput
          value={lookup}
          onChange={event => setLookup(event.target.value)}
          placeholder="Email address or MNO-XXXX"
          aria-label="Email address or order reference"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-800 disabled:cursor-wait disabled:opacity-60 dark:bg-blue-600 dark:hover:bg-blue-500"
        >
          {loading ? 'Checking...' : 'Check status'}
        </button>
      </form>
      {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-200">{error}</p>}
      {orders && (
        <div aria-live="polite" className="mt-4 space-y-3">
          {orders.map(order => (
            <div key={order.orderRef} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-slate-900 dark:text-white">{order.orderRef}</span>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                  order.status === 'Confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200'
                    : order.status === 'Declined' ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200'
                      : 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200'
                }`}>{order.status}</span>
              </div>
              {order.declineReason && <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Update: {order.declineReason}</p>}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default function MovieNight() {
  usePageTitle(
    'NAMSSN Movie Night',
    'Your ticket to good vibes. Join NAMSSN UNILAG for Movie Night on December 18, 2026.',
    'https://www.namssnunilag.one/images/events/movie-night-flyer.jpeg',
  )

  const [ticketType, setTicketType] = useState('single')
  const [receipt, setReceipt] = useState(null)
  const [availability, setAvailability] = useState(null)
  const [confirmation, setConfirmation] = useState(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const amountDue = PRICES[ticketType]
  const soldOut = availability?.remaining === 0

  const acceptedTypes = useMemo(() => new Set(['image/jpeg', 'image/png', 'image/webp', 'application/pdf']), [])

  useEffect(() => {
    let active = true
    fetch('/api/movie-night/capacity')
      .then(async response => {
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Ticket availability is temporarily unavailable.')
        if (active) setAvailability(data)
      })
      .catch(() => { if (active) setAvailability({ unavailable: true }) })
    return () => { active = false }
  }, [])

  async function copyAccountNumber() {
    setCopied(false)
    setCopyError('')
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Copy is unavailable in this browser.')
      await navigator.clipboard.writeText(ACCOUNT_NUMBER)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch (copyFailure) {
      setCopyError(copyFailure.message || 'Could not copy the account number.')
    }
  }

  function chooseReceipt(file) {
    setError('')
    if (!file) {
      setReceipt(null)
      return
    }
    if (!acceptedTypes.has(file.type)) {
      setReceipt(null)
      setError('Choose a JPG, PNG, WEBP, or PDF receipt.')
      return
    }
    if (file.size > MAX_RECEIPT_BYTES) {
      setReceipt(null)
      setError('Your receipt must be no larger than 5MB.')
      return
    }
    setReceipt(file)
  }

  async function submitOrder(event) {
    event.preventDefault()
    setError('')
    if (!receipt) {
      setError('Please add your transfer receipt before submitting.')
      return
    }
    const form = event.currentTarget
    const formData = new FormData(form)
    const buyerEmail = String(formData.get('buyerEmail') || '').trim().toLowerCase()
    const partnerEmail = String(formData.get('partnerEmail') || '').trim().toLowerCase()
    if (!EMAIL_PATTERN.test(buyerEmail)) {
      setError('Enter a valid email address.')
      return
    }
    if (ticketType === 'couples' && (!EMAIL_PATTERN.test(partnerEmail) || partnerEmail === buyerEmail)) {
      setError(partnerEmail === buyerEmail ? 'Use a different email for each attendee.' : "Enter a valid partner's email address.")
      return
    }
    if (!SUPABASE_ANON_KEY) {
      setError('Ticket registration is not configured yet. Please try again later.')
      return
    }

    setSubmitting(true)
    try {
      const uploadLinkResponse = await fetch('/api/movie-night/receipt-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mimeType: receipt.type, size: receipt.size }),
      })
      const uploadLink = await uploadLinkResponse.json()
      if (!uploadLinkResponse.ok) {
        throw new Error(uploadLink.error || 'We could not prepare your receipt upload.')
      }
      const fileUploadResponse = await fetch(uploadLink.uploadUrl, {
        method: 'PUT',
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': receipt.type,
          'x-upsert': 'false',
        },
        body: receipt,
      })
      if (!fileUploadResponse.ok) {
        throw new Error('Your receipt could not be uploaded. Please try again.')
      }
      const response = await fetch('/api/movie-night/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketType,
          buyerName: formData.get('buyerName'),
          buyerEmail,
          buyerPhone: formData.get('buyerPhone'),
          payerAccountName: formData.get('payerAccountName'),
          partnerName: ticketType === 'couples' ? formData.get('partnerName') : null,
          partnerEmail: ticketType === 'couples' ? partnerEmail : null,
          receiptPath: uploadLink.path,
        }),
      })
      const result = await response.json()
      if (!response.ok) {
        if (response.status === 409 && /sold out/i.test(result.error || '')) {
          setAvailability({ sold: MAX_MOVIE_NIGHT_TICKETS, max: MAX_MOVIE_NIGHT_TICKETS, remaining: 0 })
        }
        throw new Error(result.error || 'We could not submit your order. Please try again.')
      }
      setAvailability(current => current && !current.unavailable
        ? {
          ...current,
          sold: current.sold + result.ticketCount,
          remaining: Math.max(0, current.remaining - result.ticketCount),
        }
        : current)
      setConfirmation({
        ...result,
        buyerName: formData.get('buyerName'),
        buyerEmail,
        partnerName: ticketType === 'couples' ? formData.get('partnerName') : null,
        partnerEmail: ticketType === 'couples' ? partnerEmail : null,
        ticketType,
        buyerPhone: formData.get('buyerPhone'),
      })
      setReceipt(null)
      form.reset()
    } catch (submitError) {
      setError(submitError.message || 'We could not submit your order. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <section className="overflow-hidden bg-[#07152e] text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14 lg:px-8 lg:py-16">
          <div className="order-2 lg:order-1">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-cyan-200">NAMSSN UNILAG presents</p>
            <h1 className="mt-4 text-4xl font-black leading-tight sm:text-6xl">NAMSSN<br />Movie Night</h1>
            <p className="mt-4 text-xl font-medium text-blue-200">Your ticket to good vibes</p>
            <div className="mt-8 grid gap-4 text-sm sm:grid-cols-2">
              <p className="flex items-center gap-2"><Calendar size={18} className="text-cyan-300" /> Friday, December 18, 2026 <span className="text-blue-200">(18 • 12 • 2026)</span></p>
              <p className="flex items-center gap-2"><Clock3 size={18} className="text-cyan-300" /> 6:00 PM Prompt</p>
              <p className="flex items-center gap-2 sm:col-span-2"><MapPin size={18} className="text-cyan-300" /> LT018, University of Lagos (UNILAG)</p>
            </div>
            <a href="#register" className="mt-8 inline-flex rounded-full bg-cyan-300 px-6 py-3 font-black text-[#07152e] transition hover:bg-cyan-200">
              Get your ticket
            </a>
          </div>
          <div className="order-1 flex min-h-64 items-center justify-center rounded-3xl bg-[#0b1c3e] p-3 sm:p-5 lg:order-2">
            <img
              src="/images/events/movie-night-flyer.jpeg"
              alt="NAMSSN Movie Night event flyer"
              className="max-h-[720px] w-full rounded-2xl object-contain"
            />
          </div>
        </div>
      </section>

      <section id="register" className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.75fr)] lg:px-8 lg:py-16">
        <div>
          <div className="mb-7">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700 dark:text-blue-300">Save your spot</p>
            <h2 className="mt-2 text-3xl font-black">Register for Movie Night</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">Choose a pass, add attendee details, then upload your transfer receipt.</p>
          </div>

          {availability?.unavailable && (
            <p className="mb-5 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
              We could not load ticket availability right now. You can still submit your details, and we will check your spot before accepting the order.
            </p>
          )}

          {soldOut && (
            <div role="status" className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-900 dark:border-red-900 dark:bg-red-950/40 dark:text-red-100">
              <h3 className="text-lg font-black">Tickets Sold Out</h3>
              <p className="mt-1 text-sm">All 100 ticket spots have been reserved. Thanks for the love!</p>
            </div>
          )}

          {confirmation ? (
            <section aria-live="polite" className="rounded-3xl border border-green-200 bg-green-50 p-6 dark:border-green-900 dark:bg-green-950/30 sm:p-8">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-green-600 text-white"><Check size={26} /></span>
              <h3 className="mt-4 text-2xl font-black text-green-950 dark:text-green-100">Order received!</h3>
              <p className="mt-2 text-sm leading-relaxed text-green-900 dark:text-green-200">Thanks, {confirmation.buyerName}. We have your details and transfer receipt. We will email you once your payment has been reviewed.</p>
              <div className="mt-5 rounded-2xl border border-green-200 bg-white p-5 text-sm dark:border-green-900 dark:bg-slate-900">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold text-slate-600 dark:text-slate-300">Order reference</span>
                  <strong className="text-lg text-slate-950 dark:text-white">{confirmation.orderRef}</strong>
                </div>
                <div className="mt-3 flex justify-between gap-3"><span>Buyer</span><strong className="text-right">{confirmation.buyerName}<br />{confirmation.buyerEmail}</strong></div>
                {confirmation.ticketType === 'couples' && (
                  <div className="mt-2 flex justify-between gap-3"><span>Partner</span><strong className="text-right">{confirmation.partnerName}<br />{confirmation.partnerEmail}</strong></div>
                )}
                <div className="mt-3 flex justify-between gap-3"><span>Pass</span><strong>{confirmation.ticketType === 'couples' ? 'Couples Pass' : 'Single Pass'}</strong></div>
                <div className="mt-2 flex justify-between gap-3"><span>Amount paid</span><strong>{formatNaira(confirmation.amountNgn)}</strong></div>
                <div className="mt-2 flex justify-between gap-3"><span>Attendees</span><strong>{confirmation.ticketCount}</strong></div>
                <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2.5 font-bold text-amber-900 dark:bg-amber-950/40 dark:text-amber-100">Pending Payment Verification</p>
              </div>
              <p className="mt-4 text-xs text-green-900 dark:text-green-200">A separate e-ticket will be sent to each attendee after the payment is confirmed.</p>
            </section>
          ) : (
            <form onSubmit={submitOrder} className="space-y-5">
              <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-7">
                <StepHeading number="1" title="Select ticket type" />
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { id: 'single', title: 'Single Pass', detail: 'Admits 1 person', price: 2000, Icon: Ticket },
                    { id: 'couples', title: 'Couples Pass', detail: 'Admits 2 people', price: 3500, Icon: Users },
                  ].map(({ id, title, detail, price, Icon }) => (
                    <label key={id} className={`relative cursor-pointer rounded-2xl border p-4 transition ${
                      ticketType === id ? 'border-blue-700 bg-blue-50 ring-2 ring-blue-700/15 dark:border-blue-400 dark:bg-blue-950/30' : 'border-slate-200 hover:border-blue-300 dark:border-slate-600'
                    } ${soldOut ? 'pointer-events-none opacity-50' : ''}`}>
                      <input type="radio" name="ticketType" value={id} checked={ticketType === id} onChange={() => setTicketType(id)} className="sr-only" disabled={soldOut} />
                      <div className="flex items-start justify-between gap-2">
                        <span className="flex items-center gap-2 font-bold"><Icon size={18} className="text-blue-700 dark:text-blue-300" />{title}</span>
                        <span className="text-lg font-black">{formatNaira(price)}</span>
                      </div>
                      <span className="mt-2 block text-sm text-slate-600 dark:text-slate-300">{detail}</span>
                    </label>
                  ))}
                </div>
                <p aria-live="polite" className="mt-4 rounded-xl bg-slate-100 px-4 py-3 text-sm font-bold dark:bg-slate-900">Total due: <span className="text-blue-800 dark:text-blue-300">{formatNaira(amountDue)}</span></p>
              </section>

              <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-7">
                <StepHeading number="2" title="Attendee details" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Full Name">
                    <TextInput name="buyerName" autoComplete="name" maxLength={120} required placeholder="Your full name" />
                  </Field>
                  <Field label="Email Address">
                    <TextInput name="buyerEmail" type="email" autoComplete="email" maxLength={254} required placeholder="you@example.com" />
                  </Field>
                  <Field label="WhatsApp / Phone Number">
                    <TextInput name="buyerPhone" type="tel" autoComplete="tel" maxLength={40} required placeholder="+234..." />
                  </Field>
                  <Field label="Sender Account Name on Transfer" helper='Name on the bank account you transferred from'>
                    <TextInput name="payerAccountName" maxLength={120} required placeholder="Name on the bank account" />
                  </Field>
                  {ticketType === 'couples' && (
                    <>
                      <Field label="Partner's Full Name">
                        <TextInput name="partnerName" maxLength={120} required placeholder="Partner's full name" />
                      </Field>
                      <Field label="Partner's Email Address" helper="Enter your partner's email so they receive their own separate e-ticket">
                        <TextInput name="partnerEmail" type="email" maxLength={254} required placeholder="partner@example.com" />
                      </Field>
                    </>
                  )}
                </div>
              </section>

              <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-7">
                <StepHeading number="3" title="Make transfer and upload receipt" />
                <div className="rounded-2xl bg-[#07152e] p-5 text-white sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-200">Bank transfer</p>
                      <p className="mt-2 text-xl font-black">Moniepoint</p>
                    </div>
                    <div className="rounded-xl bg-white/10 px-4 py-2 text-right">
                      <span className="block text-xs text-blue-200">Exact amount due</span>
                      <strong className="text-2xl">{formatNaira(amountDue)}</strong>
                    </div>
                  </div>
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <span className="text-2xl font-black tracking-wider">{ACCOUNT_NUMBER}</span>
                    <button type="button" onClick={copyAccountNumber} className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-sm font-bold hover:bg-white/20">
                      {copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-blue-100">{ACCOUNT_NAME}</p>
                  {copyError && <p role="alert" className="mt-2 text-xs text-amber-200">{copyError}</p>}
                </div>

                <label className={`mt-5 flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-6 text-center transition ${
                  receipt ? 'border-green-500 bg-green-50 dark:bg-green-950/20' : 'border-slate-300 bg-slate-50 hover:border-blue-500 dark:border-slate-600 dark:bg-slate-900'
                }`}>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf"
                    className="sr-only"
                    onChange={event => chooseReceipt(event.target.files?.[0] || null)}
                    required={!receipt}
                  />
                  {receipt ? <Check size={24} className="text-green-700 dark:text-green-300" /> : <Upload size={24} className="text-blue-700 dark:text-blue-300" />}
                  <span className="mt-2 text-sm font-bold">{receipt ? receipt.name : 'Choose your transfer receipt'}</span>
                  <span className="mt-1 text-xs text-slate-500 dark:text-slate-400">Upload a screenshot or PDF receipt (JPG, PNG, or PDF, max 5MB)</span>
                  <span className="mt-1 text-xs text-slate-500 dark:text-slate-400">WEBP files are also accepted</span>
                </label>
                {receipt && <button type="button" onClick={() => setReceipt(null)} className="mt-2 text-xs font-bold text-red-700 underline dark:text-red-300">Remove receipt</button>}
              </section>

              {error && <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-800 dark:bg-red-950/40 dark:text-red-200">{error}</p>}
              <button
                type="submit"
                disabled={submitting || soldOut}
                className="w-full rounded-2xl bg-blue-800 px-6 py-4 text-base font-black text-white shadow-lg shadow-blue-900/15 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-600 dark:hover:bg-blue-500"
              >
                {soldOut ? 'Tickets Sold Out' : submitting ? 'Submitting your order...' : `Submit order • ${formatNaira(amountDue)}`}
              </button>
              <p className="text-center text-xs text-slate-500 dark:text-slate-400">Your order reference will appear as soon as your details and receipt are received.</p>
            </form>
          )}
        </div>

        <aside className="space-y-6 lg:pt-[72px]">
          <div className="rounded-3xl bg-gradient-to-br from-[#07152e] to-[#123b76] p-6 text-white shadow-lg sm:p-7">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-200">Event details</p>
            <p className="mt-3 text-2xl font-black">Good people. Great movies.</p>
            <ul className="mt-5 space-y-3 text-sm text-blue-50">
              <li className="flex gap-2"><Calendar size={17} className="shrink-0 text-cyan-300" />Friday, December 18, 2026</li>
              <li className="flex gap-2"><Clock3 size={17} className="shrink-0 text-cyan-300" />6:00 PM Prompt</li>
              <li className="flex gap-2"><MapPin size={17} className="shrink-0 text-cyan-300" />LT018, University of Lagos</li>
            </ul>
            {availability && !availability.unavailable && (
              <p className="mt-6 border-t border-white/15 pt-4 text-sm font-semibold">
                {soldOut ? 'Tickets Sold Out' : `${availability.remaining} of ${MAX_MOVIE_NIGHT_TICKETS} ticket spots left`}
              </p>
            )}
          </div>
          <StatusLookup />
        </aside>
      </section>
    </main>
  )
}
