import { useEffect, useMemo, useState } from 'react'
import {
  Check, CheckCircle2, Clock3, Download, ExternalLink, Eye, RefreshCw, Search,
  Ticket, Users, X, XCircle,
} from 'lucide-react'

const ORDER_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'unconfirmed', label: 'Unconfirmed' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'declined', label: 'Declined' },
]

const DECLINE_REASONS = [
  'Receipt image is blurry/unreadable',
  'Amount transferred does not match ticket price',
  'No matching credit found on Moniepoint',
  'Duplicate receipt submitted',
]

function formatNaira(value) {
  return `₦${Number(value).toLocaleString('en-NG')}`
}

function formatDate(value) {
  return new Date(value).toLocaleString('en-NG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function statusLabel(status) {
  return {
    unconfirmed: 'Unconfirmed',
    confirmed: 'Confirmed',
    declined: 'Declined',
  }[status] || status
}

function StatusBadge({ status }) {
  const styles = {
    unconfirmed: 'bg-amber-400/10 text-amber-300 ring-amber-400/20',
    confirmed: 'bg-green-400/10 text-green-300 ring-green-400/20',
    declined: 'bg-red-400/10 text-red-300 ring-red-400/20',
  }
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${styles[status] || 'bg-white/10 text-gray-300 ring-white/10'}`}>{statusLabel(status)}</span>
}

function csvCell(value) {
  let text = String(value ?? '')
  if (/^[\s]*[=+\-@]/.test(text)) text = `'${text}`
  return `"${text.replaceAll('"', '""')}"`
}

export default function MovieNightAdminTab({ request }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState('orders')
  const [selected, setSelected] = useState(null)
  const [receiptUrl, setReceiptUrl] = useState('')
  const [receiptLoading, setReceiptLoading] = useState(false)
  const [action, setAction] = useState('')
  const [declineReason, setDeclineReason] = useState('')

  async function apiCall({ method = 'GET', view = 'data', id, body } = {}) {
    const search = new URLSearchParams({ view })
    if (id) search.set('id', id)
    const url = `/api/movie-night/admin?${search}`
    const response = await request(url, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : {},
      body: body ? JSON.stringify(body) : undefined,
    })
    const result = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(result.error || 'That action could not be completed.')
    return result
  }

  async function refresh() {
    setLoading(true)
    setError('')
    try {
      setData(await apiCall())
    } catch (loadError) {
      setError(loadError.message || 'Movie Night information could not be loaded.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void refresh() }, [])

  useEffect(() => {
    let active = true
    if (!selected) {
      setReceiptUrl('')
      setReceiptLoading(false)
      return () => { active = false }
    }
    setReceiptUrl('')
    setReceiptLoading(true)
    apiCall({ view: 'receipt', id: selected.id })
      .then(result => { if (active) setReceiptUrl(result.url) })
      .catch(loadError => { if (active) setError(loadError.message || 'The receipt could not be opened.') })
      .finally(() => { if (active) setReceiptLoading(false) })
    return () => { active = false }
  }, [selected?.id])

  const orders = data?.orders || []
  const tickets = data?.tickets || []
  const confirmedSlots = orders
    .filter(order => order.payment_status === 'confirmed')
    .reduce((sum, order) => sum + order.ticket_count, 0)
  const pendingSlots = orders
    .filter(order => order.payment_status === 'unconfirmed')
    .reduce((sum, order) => sum + order.ticket_count, 0)
  const filteredOrders = useMemo(() => {
    const search = query.trim().toLowerCase()
    return orders.filter(order => {
      const matchesStatus = filter === 'all' || order.payment_status === filter
      const haystack = [
        order.buyer_name, order.buyer_email, order.buyer_phone, order.payer_account_name,
        order.order_ref, order.partner_name, order.partner_email,
      ].filter(Boolean).join(' ').toLowerCase()
      return matchesStatus && (!search || haystack.includes(search))
    })
  }, [orders, filter, query])

  function noticeAfter(text) {
    setNotice(text)
    window.setTimeout(() => setNotice(''), 5000)
  }

  async function confirmOrder() {
    if (!selected) return
    setAction('confirm')
    setError('')
    try {
      const result = await apiCall({
        method: 'POST',
        body: { action: 'confirm', orderId: selected.id },
      })
      const failed = result.tickets.filter(ticket => !ticket.emailSent)
      noticeAfter(failed.length
        ? `Payment confirmed. ${failed.length} ticket email${failed.length === 1 ? '' : 's'} need a resend.`
        : 'Payment confirmed and ticket email sent.')
      setSelected(null)
      await refresh()
    } catch (actionError) {
      setError(actionError.message || 'Payment could not be confirmed.')
    } finally {
      setAction('')
    }
  }

  async function declineOrder() {
    if (!selected || !declineReason.trim()) {
      setError('Choose a reason or add a short note before declining.')
      return
    }
    setAction('decline')
    setError('')
    try {
      await apiCall({
        method: 'POST',
        body: { action: 'decline', orderId: selected.id, reason: declineReason.trim() },
      })
      setSelected(null)
      setDeclineReason('')
      noticeAfter('Payment declined. The student can now see your reason when checking the order.')
      await refresh()
    } catch (actionError) {
      setError(actionError.message || 'Payment could not be declined.')
    } finally {
      setAction('')
    }
  }

  async function resendTicket(ticket) {
    setAction(ticket.id)
    setError('')
    try {
      await apiCall({ method: 'POST', body: { action: 'resend', ticketId: ticket.id } })
      noticeAfter(`Ticket email sent to ${ticket.holder_email}.`)
      await refresh()
    } catch (actionError) {
      setError(actionError.message || 'Ticket email could not be sent.')
      await refresh()
    } finally {
      setAction('')
    }
  }

  async function toggleCheckin(ticket) {
    setAction(ticket.id)
    setError('')
    try {
      await apiCall({
        method: 'POST',
        body: { action: 'checkin', ticketId: ticket.id, checkedIn: !ticket.checked_in },
      })
      await refresh()
    } catch (actionError) {
      setError(actionError.message || 'Check-in could not be updated.')
    } finally {
      setAction('')
    }
  }

  function exportConfirmedAttendees() {
    const confirmed = orders.filter(order => order.payment_status === 'confirmed')
    const attendeeTickets = tickets.filter(ticket => confirmed.some(order => order.id === ticket.order_id))
    const header = ['Ticket Code', 'Attendee Name', 'Email Address', 'Ticket Tier', 'Order Reference', 'Checked In']
    const rows = attendeeTickets.map(ticket => {
      const order = confirmed.find(row => row.id === ticket.order_id)
      return [
        ticket.ticket_code,
        ticket.holder_name,
        ticket.holder_email,
        order?.ticket_type === 'couples' ? 'Couples Pass' : 'Single Pass',
        order?.order_ref,
        ticket.checked_in ? 'Yes' : 'No',
      ]
    })
    const csv = [header, ...rows].map(row => row.map(csvCell).join(',')).join('\r\n')
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'namssn-movie-night-confirmed-attendees.csv'
    link.click()
    URL.revokeObjectURL(link.href)
  }

  const kpis = [
    { label: 'Total confirmed revenue', value: formatNaira(data?.confirmedRevenue || 0), icon: CheckCircle2, color: 'text-green-300' },
    { label: 'Tickets allocated / reserved', value: `${data?.capacity?.sold || 0} / ${data?.capacity?.max || 100}`, icon: Users, color: 'text-cyan-300' },
    { label: 'Payments to review', value: data?.pendingCount ?? 0, icon: Clock3, color: 'text-amber-300' },
    { label: 'Declined orders', value: data?.declinedCount ?? 0, icon: XCircle, color: 'text-red-300' },
    { label: 'Gate check-ins', value: data?.checkinCount ?? 0, icon: Ticket, color: 'text-purple-300' },
  ]

  return (
    <section className="space-y-6 text-white">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black">NAMSSN Movie Night</h2>
          <p className="mt-1 text-sm text-gray-400">Friday, December 18, 2026 • 6:00 PM Prompt • LT018, UNILAG</p>
          <p className="mt-1 text-xs text-gray-500">Orders, individual e-tickets, and event-night check-in.</p>
        </div>
        <button onClick={() => void refresh()} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-gray-200 hover:bg-white/10 disabled:opacity-50">
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {notice && <p role="status" className="rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-200">{notice}</p>}
      {error && <p role="alert" className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {kpis.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-gray-400">{label}</span>
              <Icon size={16} className={color} />
            </div>
            <p className="mt-3 text-2xl font-black">{value}</p>
            {label === 'Tickets allocated / reserved' && <p className="mt-1 text-xs text-gray-500">{confirmedSlots} confirmed + {pendingSlots} pending · Single 1, Couples 2</p>}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10">
        <div className="flex gap-5">
          {[
            { id: 'orders', label: 'Orders' },
            { id: 'tickets', label: 'E-Tickets & Check-In' },
          ].map(item => (
            <button key={item.id} onClick={() => setTab(item.id)} className={`border-b-2 px-1 pb-3 text-sm font-bold transition ${
              tab === item.id ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}>{item.label}</button>
          ))}
        </div>
        {tab === 'tickets' && (
          <button onClick={exportConfirmedAttendees} className="mb-2 inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-3 py-2 text-xs font-black text-[#0f172a] hover:bg-cyan-300">
            <Download size={14} /> Export Confirmed Attendees CSV
          </button>
        )}
      </div>

      {tab === 'orders' && (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap gap-2">
              {ORDER_FILTERS.map(item => (
                <button key={item.value} onClick={() => setFilter(item.value)} className={`rounded-full px-3.5 py-2 text-xs font-bold transition ${
                  filter === item.value ? 'bg-cyan-400 text-[#0f172a]' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}>{item.label}</button>
              ))}
            </div>
            <label className="flex min-w-64 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
              <Search size={16} className="shrink-0 text-gray-500" />
              <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search name, email, sender, reference..." className="w-full bg-transparent text-sm outline-none placeholder:text-gray-600" />
            </label>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="bg-white/[0.04] text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3">Buyer</th><th className="px-4 py-3">Sender account</th>
                  <th className="px-4 py-3">Pass / Attendees</th><th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Submitted</th><th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3"><span className="sr-only">View order</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredOrders.map(order => (
                  <tr key={order.id} className="transition hover:bg-white/[0.03]">
                    <td className="px-4 py-4">
                      <strong className="block">{order.buyer_name}</strong>
                      <span className="mt-1 block text-xs text-gray-500">{order.buyer_email} · {order.buyer_phone}</span>
                      <span className="mt-1 block text-xs font-bold text-cyan-300">{order.order_ref}</span>
                    </td>
                    <td className="px-4 py-4 text-gray-300">{order.payer_account_name}</td>
                    <td className="px-4 py-4">
                      <span className="font-bold">{order.ticket_type === 'couples' ? 'Couples Pass' : 'Single Pass'}</span>
                      {order.ticket_type === 'couples' && (
                        <span className="mt-1 block text-xs text-gray-400">{order.partner_name} · {order.partner_email}</span>
                      )}
                    </td>
                    <td className="px-4 py-4 font-bold">{formatNaira(order.amount_ngn)}</td>
                    <td className="px-4 py-4 text-xs text-gray-400">{formatDate(order.created_at)}</td>
                    <td className="px-4 py-4"><StatusBadge status={order.payment_status} /></td>
                    <td className="px-4 py-4">
                      <button onClick={() => { setSelected(order); setDeclineReason(''); setError('') }} aria-label={`Review ${order.order_ref}`} className="rounded-lg bg-white/5 p-2 text-gray-300 hover:bg-cyan-400 hover:text-[#0f172a]">
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {!loading && filteredOrders.length === 0 && (
                  <tr><td colSpan="7" className="px-4 py-10 text-center text-sm text-gray-500">No orders match this view.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'tickets' && (
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-white/[0.04] text-xs uppercase tracking-wide text-gray-500">
              <tr><th className="px-4 py-3">Ticket</th><th className="px-4 py-3">Attendee</th><th className="px-4 py-3">Tier</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Gate</th><th className="px-4 py-3">Check-in</th></tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tickets.map(ticket => {
                const order = orders.find(item => item.id === ticket.order_id)
                return (
                  <tr key={ticket.id}>
                    <td className="px-4 py-4 font-black text-cyan-300">{ticket.ticket_code}</td>
                    <td className="px-4 py-4"><strong className="block">{ticket.holder_name}</strong><span className="text-xs text-gray-500">{ticket.holder_email}</span></td>
                    <td className="px-4 py-4 text-gray-300">{order?.ticket_type === 'couples' ? 'Couples Pass' : 'Single Pass'}</td>
                    <td className="px-4 py-4">
                      {ticket.email_sent
                        ? <span className="inline-flex items-center gap-1 text-xs font-bold text-green-300"><CheckCircle2 size={14} /> Sent</span>
                        : <span className="inline-flex items-center gap-1 text-xs font-bold text-red-300" title={ticket.email_error || 'Not sent'}><XCircle size={14} /> Failed</span>}
                      {!ticket.email_sent && ticket.email_error && <span className="mt-1 block max-w-48 truncate text-[11px] text-gray-500" title={ticket.email_error}>{ticket.email_error}</span>}
                    </td>
                    <td className="px-4 py-4">
                      {ticket.checked_in
                        ? <span className="inline-flex items-center gap-1 text-xs font-bold text-green-300"><Check size={14} /> Checked in</span>
                        : <span className="text-xs text-gray-500">Not checked in</span>}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => void resendTicket(ticket)} disabled={Boolean(action)} className="rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-gray-200 hover:bg-white/10 disabled:opacity-50">
                          {action === ticket.id ? 'Sending...' : 'Resend Email'}
                        </button>
                        <button onClick={() => void toggleCheckin(ticket)} disabled={Boolean(action)} className={`rounded-lg px-3 py-2 text-xs font-bold disabled:opacity-50 ${
                          ticket.checked_in ? 'border border-white/10 text-gray-300 hover:bg-white/10' : 'bg-green-500 text-[#0f172a] hover:bg-green-400'
                        }`}>
                          {action === ticket.id ? 'Saving...' : ticket.checked_in ? 'Undo' : 'Check In'}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {!loading && tickets.length === 0 && (
                <tr><td colSpan="6" className="px-4 py-10 text-center text-sm text-gray-500">Confirmed attendee tickets will appear here.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div role="presentation" className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-3 sm:p-6" onMouseDown={event => { if (event.target === event.currentTarget && !action) setSelected(null) }}>
          <section role="dialog" aria-modal="true" aria-labelledby="movie-night-review-title" className="max-h-[94vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-white/10 bg-[#111c2c] shadow-2xl">
            <header className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#111c2c] px-5 py-4">
              <div>
                <h3 id="movie-night-review-title" className="text-lg font-black">Review payment</h3>
                <p className="mt-1 text-xs text-gray-400">{selected.order_ref} · {formatDate(selected.created_at)}</p>
              </div>
              <button onClick={() => setSelected(null)} disabled={Boolean(action)} aria-label="Close review" className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white"><X size={18} /></button>
            </header>
            <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    ['Buyer', selected.buyer_name],
                    ['Buyer email', selected.buyer_email],
                    ['Phone', selected.buyer_phone],
                    ['Sender account', selected.payer_account_name],
                    ['Pass', selected.ticket_type === 'couples' ? 'Couples Pass' : 'Single Pass'],
                    ['Amount', formatNaira(selected.amount_ngn)],
                    ...(selected.ticket_type === 'couples' ? [['Partner', `${selected.partner_name} · ${selected.partner_email}`]] : []),
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-xl bg-white/[0.04] p-3">
                      <span className="block text-[11px] font-bold uppercase text-gray-500">{label}</span>
                      <strong className="mt-1 block break-words text-gray-100">{value}</strong>
                    </div>
                  ))}
                  <div className="rounded-xl bg-white/[0.04] p-3"><span className="block text-[11px] font-bold uppercase text-gray-500">Status</span><span className="mt-2 inline-block"><StatusBadge status={selected.payment_status} /></span></div>
                </div>
                {selected.payment_status === 'unconfirmed' ? (
                  <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <label className="block text-xs font-bold text-gray-300">
                      Decline reason
                      <select value={DECLINE_REASONS.includes(declineReason) ? declineReason : declineReason ? 'custom' : ''} onChange={event => setDeclineReason(event.target.value === 'custom' ? '' : event.target.value)} className="mt-2 w-full rounded-lg border border-white/10 bg-[#0f172a] px-3 py-2.5 text-sm text-white">
                        <option value="">Choose a reason</option>
                        {DECLINE_REASONS.map(reason => <option key={reason} value={reason}>{reason}</option>)}
                        <option value="custom">Write a custom note</option>
                      </select>
                    </label>
                    {(!DECLINE_REASONS.includes(declineReason)) && (
                      <textarea value={declineReason} onChange={event => setDeclineReason(event.target.value)} maxLength={500} rows={3} placeholder="Add a short reason the student can understand" className="w-full resize-y rounded-lg border border-white/10 bg-[#0f172a] px-3 py-2.5 text-sm text-white placeholder:text-gray-600" />
                    )}
                    <div className="grid gap-2 sm:grid-cols-2">
                      <button onClick={() => void confirmOrder()} disabled={Boolean(action)} className="rounded-xl bg-green-500 px-4 py-3 text-sm font-black text-[#0f172a] hover:bg-green-400 disabled:cursor-wait disabled:opacity-50">
                        {action === 'confirm' ? 'Confirming...' : 'Confirm Payment & Send Ticket(s)'}
                      </button>
                      <button onClick={() => void declineOrder()} disabled={Boolean(action) || !declineReason.trim()} className="rounded-xl bg-red-500/15 px-4 py-3 text-sm font-black text-red-200 ring-1 ring-inset ring-red-500/30 hover:bg-red-500/25 disabled:cursor-not-allowed disabled:opacity-50">
                        {action === 'decline' ? 'Declining...' : 'Decline Payment'}
                      </button>
                    </div>
                  </div>
                ) : selected.decline_reason ? (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200"><strong>Decline reason</strong><p className="mt-1">{selected.decline_reason}</p></div>
                ) : null}
              </div>
              <div className="min-h-72 overflow-hidden rounded-xl border border-white/10 bg-[#0b1220]">
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                  <strong className="text-sm">Transfer receipt</strong>
                  {receiptUrl && <a href={receiptUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-cyan-300 hover:text-cyan-200">Open receipt <ExternalLink size={13} /></a>}
                </div>
                {receiptLoading ? <p className="p-8 text-center text-sm text-gray-400">Opening receipt...</p>
                  : receiptUrl?.toLowerCase().includes('.pdf') ? <iframe title="Payment receipt PDF" src={receiptUrl} className="h-[540px] w-full bg-white" />
                    : receiptUrl ? <a href={receiptUrl} target="_blank" rel="noreferrer" className="block cursor-zoom-in p-3"><img src={receiptUrl} alt="Uploaded transfer receipt" className="mx-auto max-h-[540px] w-full object-contain" /></a>
                      : <p className="p-8 text-center text-sm text-gray-400">The receipt preview is not available.</p>}
              </div>
            </div>
          </section>
        </div>
      )}
    </section>
  )
}
