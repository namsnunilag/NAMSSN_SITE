import { useState, useEffect, useCallback } from 'react'
import emailjs from '@emailjs/browser'
import {
  LogOut, RefreshCw, CheckCircle2, XCircle, ExternalLink,
  Search, Users, Clock, CheckCheck, ShieldAlert, BookOpen, Trophy, Trash2, Download, Pencil, Medal,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────────────────────

const SUPABASE_URL      = import.meta.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
const ADMIN_PASSWORD    = import.meta.env.VITE_ADMIN_PASSWORD || 'decagon2026'
const SESSION_KEY       = 'decagon_admin_auth'

const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID || ''
const EMAILJS_CONFIRM_TID = import.meta.env.VITE_EMAILJS_CONFIRM_TEMPLATE_ID || ''
const EMAILJS_REJECT_TID  = import.meta.env.VITE_EMAILJS_REJECT_TEMPLATE_ID || ''
const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ''
const WHATSAPP_LINK       = 'https://chat.whatsapp.com/IGMTNSA8zP1DPCx2dow56o?mode=hqctswi'

// ─────────────────────────────────────────────────────────────────────────────
// Supabase helpers
// ─────────────────────────────────────────────────────────────────────────────

async function fetchRegistrations() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/decagon_registrations?select=*&order=created_at.desc`,
    { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
  )
  if (!res.ok) throw new Error(`Fetch failed (${res.status})`)
  return res.json()
}

async function fetchSignups() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/challenge_signups?select=*&order=created_at.desc`,
    { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
  )
  if (!res.ok) throw new Error(`Fetch failed (${res.status})`)
  return res.json()
}

async function sendEmail(templateId, params) {
  if (!EMAILJS_SERVICE_ID || !EMAILJS_PUBLIC_KEY || !templateId) return
  await emailjs.send(EMAILJS_SERVICE_ID, templateId, params, EMAILJS_PUBLIC_KEY)
}

async function deleteSignup(id) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/challenge_signups?id=eq.${id}`,
    {
      method: 'DELETE',
      headers: {
        apikey:        SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Prefer:        'return=minimal',
      },
    }
  )
  if (!res.ok) throw new Error(`Delete failed (${res.status})`)
}

async function deleteRegistration(id) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/decagon_registrations?id=eq.${id}`,
    {
      method: 'DELETE',
      headers: {
        apikey:        SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Prefer:        'return=minimal',
      },
    }
  )
  if (!res.ok) throw new Error(`Delete failed (${res.status})`)
}

async function setStatus(id, status) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/decagon_registrations?id=eq.${id}`,
    {
      method: 'PATCH',
      headers: {
        apikey:         SUPABASE_ANON_KEY,
        Authorization:  `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        Prefer:         'return=minimal',
      },
      body: JSON.stringify({ payment_status: status }),
    }
  )
  if (!res.ok) throw new Error(`Update failed (${res.status})`)
}

async function updateCompetitionScore(id, score) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/decagon_registrations?id=eq.${id}`,
    {
      method: 'PATCH',
      headers: {
        apikey:         SUPABASE_ANON_KEY,
        Authorization:  `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        Prefer:         'return=minimal',
      },
      body: JSON.stringify({ score }),
    }
  )
  if (!res.ok) throw new Error(`Update failed (${res.status})`)
}

async function updateChallengeScore(id, score, days_completed) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/challenge_signups?id=eq.${id}`,
    {
      method: 'PATCH',
      headers: {
        apikey:         SUPABASE_ANON_KEY,
        Authorization:  `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        Prefer:         'return=minimal',
      },
      body: JSON.stringify({ score, days_completed }),
    }
  )
  if (!res.ok) throw new Error(`Update failed (${res.status})`)
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function exportCSV(rows, columns, filename) {
  const header = columns.map(c => c.label).join(',')
  const body = rows.map(r =>
    columns.map(c => {
      const val = r[c.key] ?? ''
      return `"${String(val).replace(/"/g, '""')}"`
    }).join(',')
  ).join('\n')
  const blob = new Blob([header + '\n' + body], { type: 'text/csv' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function fmt(dateStr) {
  return new Date(dateStr).toLocaleString('en-NG', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  })
}

function StatusBadge({ status }) {
  const map = {
    pending_review: { label: 'Pending',   cls: 'bg-amber-500/15 text-amber-400  border-amber-500/20' },
    confirmed:      { label: 'Confirmed', cls: 'bg-green-500/15 text-green-400  border-green-500/20' },
    rejected:       { label: 'Rejected',  cls: 'bg-red-500/15   text-red-400    border-red-500/20'   },
  }
  const { label, cls } = map[status] ?? { label: status, cls: 'bg-white/5 text-gray-400 border-white/10' }
  return <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${cls}`}>{label}</span>
}

function ScoreModal({ type, person, onSave, onClose }) {
  const [score, setScore]   = useState(person.score ?? 0)
  const [days,  setDays]    = useState(person.days_completed ?? 0)
  const [saving, setSaving] = useState(false)

  const submit = async e => {
    e.preventDefault()
    setSaving(true)
    try { await onSave(score, days) }
    finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#1e293b] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <h2 className="text-base font-black text-white mb-1">Edit Score</h2>
        <p className="text-xs text-gray-500 mb-5 truncate">{person.full_name}</p>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Points / Score</label>
            <input
              type="number" min="0" value={score}
              onChange={e => setScore(Number(e.target.value))}
              className="mt-1.5 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white
                         focus:outline-none focus:ring-2 focus:ring-cyan-400/40 transition"
            />
          </div>
          {type === 'challenge' && (
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Days Completed (0–20)</label>
              <input
                type="number" min="0" max="20" value={days}
                onChange={e => setDays(Math.min(20, Number(e.target.value)))}
                className="mt-1.5 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white
                           focus:outline-none focus:ring-2 focus:ring-cyan-400/40 transition"
              />
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 text-sm font-bold text-gray-400 bg-white/5 border border-white/10 hover:border-white/20 py-2.5 rounded-xl transition">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 text-sm font-bold text-[#0f172a] bg-cyan-400 hover:bg-cyan-300 py-2.5 rounded-xl transition disabled:opacity-50">
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Login screen
// ─────────────────────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }) {
  const [pw, setPw]       = useState('')
  const [error, setError] = useState('')

  const submit = e => {
    e.preventDefault()
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, '1')
      onLogin()
    } else {
      setError('Incorrect password.')
      setPw('')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f172a' }}>
      <div className="w-full max-w-sm px-6">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert size={22} className="text-cyan-400" />
          </div>
          <h1 className="text-xl font-black text-white">Decagon Admin</h1>
          <p className="text-sm text-gray-500 mt-1">NAMSSN UNILAG</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Password</label>
            <input
              type="password" value={pw} onChange={e => { setPw(e.target.value); setError('') }}
              placeholder="Enter admin password" autoFocus required
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600
                         focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/40 transition"
            />
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-[#0f172a] font-black py-3 rounded-xl transition">
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Competition Registrations tab
// ─────────────────────────────────────────────────────────────────────────────

function RegistrationsTab() {
  const [rows, setRows]           = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')
  const [filter, setFilter]       = useState('all')
  const [search, setSearch]       = useState('')
  const [updating, setUpdating]   = useState(null)
  const [deleting, setDeleting]   = useState(null)
  const [scoreModal, setScoreModal] = useState(null)

  const load = useCallback(async () => {
    setLoading(true); setError('')
    try { setRows(await fetchRegistrations()) }
    catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const handleStatus = async (id, status) => {
    setUpdating(id)
    try {
      await setStatus(id, status)
      setRows(r => r.map(x => x.id === id ? { ...x, payment_status: status } : x))

      // Send email notification
      const reg = rows.find(r => r.id === id)
      if (reg) {
        if (status === 'confirmed') {
          await sendEmail(EMAILJS_CONFIRM_TID, {
            to_name:        reg.full_name,
            to_email:       reg.email,
            matric:         reg.matric,
            department:     reg.department,
            whatsapp_link:  WHATSAPP_LINK,
          })
        } else if (status === 'rejected') {
          await sendEmail(EMAILJS_REJECT_TID, {
            to_name:  reg.full_name,
            to_email: reg.email,
            matric:   reg.matric,
          })
        }
      }
    } catch {
      alert('Failed to update. Please try again.')
    } finally {
      setUpdating(null)
    }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete registration for ${name}? This cannot be undone.`)) return
    setDeleting(id)
    try {
      await deleteRegistration(id)
      setRows(r => r.filter(x => x.id !== id))
    } catch {
      alert('Failed to delete. Please try again.')
    } finally {
      setDeleting(null)
    }
  }

  const handleScoreSave = async (score) => {
    try {
      await updateCompetitionScore(scoreModal.id, score)
      setRows(r => r.map(x => x.id === scoreModal.id ? { ...x, score } : x))
      setScoreModal(null)
    } catch {
      alert('Failed to update score. Please try again.')
    }
  }

  const total     = rows.length
  const pending   = rows.filter(r => r.payment_status === 'pending_review').length
  const confirmed = rows.filter(r => r.payment_status === 'confirmed').length
  const rejected  = rows.filter(r => r.payment_status === 'rejected').length

  const visible = rows.filter(r => {
    const matchFilter = filter === 'all' || r.payment_status === filter
    const q = search.toLowerCase()
    const matchSearch = !q
      || r.full_name?.toLowerCase().includes(q)
      || r.matric?.toLowerCase().includes(q)
      || r.email?.toLowerCase().includes(q)
      || r.department?.toLowerCase().includes(q)
    return matchFilter && matchSearch
  })

  return (
    <>
    {scoreModal && (
      <ScoreModal
        type="competition"
        person={scoreModal}
        onSave={handleScoreSave}
        onClose={() => setScoreModal(null)}
      />
    )}
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total',     value: total,     icon: Users,      cls: 'text-white'     },
          { label: 'Pending',   value: pending,   icon: Clock,      cls: 'text-amber-400' },
          { label: 'Confirmed', value: confirmed, icon: CheckCheck, cls: 'text-green-400' },
          { label: 'Rejected',  value: rejected,  icon: XCircle,    cls: 'text-red-400'   },
        ].map(({ label, value, icon: Icon, cls }) => (
          <div key={label} className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
              <Icon size={16} className={cls} />
            </div>
            <div>
              <p className="text-2xl font-black text-white">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter + Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="flex gap-2 flex-wrap">
          {[
            { key: 'all',            label: 'All'       },
            { key: 'pending_review', label: 'Pending'   },
            { key: 'confirmed',      label: 'Confirmed' },
            { key: 'rejected',       label: 'Rejected'  },
          ].map(({ key, label }) => (
            <button key={key} onClick={() => setFilter(key)}
              className={`text-xs font-bold px-4 py-2 rounded-xl border transition ${
                filter === key
                  ? 'bg-cyan-400/15 border-cyan-400/40 text-cyan-300'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
              }`}>
              {label}
            </button>
          ))}
        </div>
        <div className="relative flex-1 sm:max-w-xs ml-auto">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search name, matric, email…"
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-gray-600
                       focus:outline-none focus:ring-2 focus:ring-cyan-400/30 transition" />
        </div>
        <button onClick={() => exportCSV(rows, [
          { label: 'Full Name',     key: 'full_name'      },
          { label: 'Email',         key: 'email'          },
          { label: 'Phone',         key: 'phone'          },
          { label: 'Matric',        key: 'matric'         },
          { label: 'Department',    key: 'department'     },
          { label: 'Level',         key: 'level'          },
          { label: 'Status',        key: 'payment_status' },
          { label: 'Score',         key: 'score'          },
          { label: 'Receipt URL',   key: 'receipt_url'    },
          { label: 'Biodata URL',   key: 'biodata_url'    },
          { label: 'Registered At', key: 'created_at'     },
        ], 'decagon_registrations.csv')}
          className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 bg-cyan-400/10 hover:bg-cyan-400/20 border border-cyan-400/20 px-3 py-2 rounded-xl transition shrink-0">
          <Download size={13} /> Export CSV
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
          {error} — Make sure you've run supabase-setup.sql.
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-gray-500 text-sm">Loading…</div>
      ) : visible.length === 0 ? (
        <div className="text-center py-20 text-gray-600 text-sm">
          {rows.length === 0 ? 'No registrations yet.' : 'No results match your filter.'}
        </div>
      ) : (
        <div className="space-y-2">
          {visible.map((r, i) => (
            <div key={r.id}
              className="bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <span className="text-xs text-gray-600 font-bold w-5 shrink-0 hidden sm:block">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4">
                <div>
                  <p className="text-sm font-bold text-white truncate">{r.full_name}</p>
                  <p className="text-xs text-gray-500 truncate">{r.email}</p>
                </div>
                <div>
                  <p className="text-sm font-mono text-cyan-400">{r.matric}</p>
                  <p className="text-xs text-gray-500">{r.department} · {r.level}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">{r.phone}</p>
                  <p className="text-xs text-gray-600">{fmt(r.created_at)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                <StatusBadge status={r.payment_status} />
                {r.score > 0 && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full border bg-violet-500/10 text-violet-400 border-violet-500/20">
                    {r.score} pts
                  </span>
                )}
                {r.biodata_url && (
                  <a href={r.biodata_url} target="_blank" rel="noreferrer"
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-cyan-400 transition bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                    <ExternalLink size={12} /> biodata
                  </a>
                )}
                {r.receipt_url && (
                  <a href={r.receipt_url} target="_blank" rel="noreferrer"
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-cyan-400 transition bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                    <ExternalLink size={12} /> Receipt
                  </a>
                )}
                {r.payment_status !== 'confirmed' && (
                  <button onClick={() => handleStatus(r.id, 'confirmed')} disabled={updating === r.id}
                    className="flex items-center gap-1 text-xs text-green-400 hover:text-white hover:bg-green-500 transition bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-lg disabled:opacity-40">
                    <CheckCircle2 size={12} /> {updating === r.id ? '…' : 'Confirm'}
                  </button>
                )}
                {r.payment_status !== 'rejected' && (
                  <button onClick={() => handleStatus(r.id, 'rejected')} disabled={updating === r.id}
                    className="flex items-center gap-1 text-xs text-red-400 hover:text-white hover:bg-red-500 transition bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-lg disabled:opacity-40">
                    <XCircle size={12} /> {updating === r.id ? '…' : 'Reject'}
                  </button>
                )}
                <button onClick={() => setScoreModal(r)}
                  className="flex items-center gap-1 text-xs text-violet-400 hover:text-white hover:bg-violet-600 transition bg-violet-500/10 border border-violet-500/20 px-3 py-1.5 rounded-lg">
                  <Pencil size={12} /> Score
                </button>
                <button onClick={() => handleDelete(r.id, r.full_name)} disabled={deleting === r.id}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-white hover:bg-red-600 transition bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg disabled:opacity-40">
                  <Trash2 size={12} /> {deleting === r.id ? '…' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-gray-700 text-center">Showing {visible.length} of {total} registrations</p>
    </div>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 20-Day Challenge Signups tab
// ─────────────────────────────────────────────────────────────────────────────

function SignupsTab() {
  const [rows, setRows]           = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')
  const [search, setSearch]       = useState('')
  const [deleting, setDeleting]   = useState(null)
  const [scoreModal, setScoreModal] = useState(null)

  const load = useCallback(async () => {
    setLoading(true); setError('')
    try { setRows(await fetchSignups()) }
    catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete signup for ${name}? This cannot be undone.`)) return
    setDeleting(id)
    try {
      await deleteSignup(id)
      setRows(r => r.filter(x => x.id !== id))
    } catch {
      alert('Failed to delete. Please try again.')
    } finally {
      setDeleting(null)
    }
  }

  const handleScoreSave = async (score, days_completed) => {
    try {
      await updateChallengeScore(scoreModal.id, score, days_completed)
      setRows(r => r.map(x => x.id === scoreModal.id ? { ...x, score, days_completed } : x))
      setScoreModal(null)
    } catch {
      alert('Failed to update score. Please try again.')
    }
  }

  const visible = rows.filter(r => {
    const q = search.toLowerCase()
    return !q
      || r.full_name?.toLowerCase().includes(q)
      || r.email?.toLowerCase().includes(q)
      || r.department?.toLowerCase().includes(q)
  })

  return (
    <>
    {scoreModal && (
      <ScoreModal
        type="challenge"
        person={scoreModal}
        onSave={handleScoreSave}
        onClose={() => setScoreModal(null)}
      />
    )}
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 flex items-center gap-3 col-span-2 sm:col-span-1">
          <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
            <Users size={16} className="text-cyan-400" />
          </div>
          <div>
            <p className="text-2xl font-black text-white">{rows.length}</p>
            <p className="text-xs text-gray-500">Total Signups</p>
          </div>
        </div>
      </div>

      {/* Search + Export */}
      <div className="flex gap-3 items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search name, email, dept…"
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-gray-600
                       focus:outline-none focus:ring-2 focus:ring-cyan-400/30 transition" />
        </div>
        <button onClick={() => exportCSV(rows, [
          { label: 'Full Name',      key: 'full_name'      },
          { label: 'Email',          key: 'email'          },
          { label: 'Department',     key: 'department'     },
          { label: 'Score',          key: 'score'          },
          { label: 'Days Completed', key: 'days_completed' },
          { label: 'Signed Up At',   key: 'created_at'     },
        ], 'decagon_challenge_signups.csv')}
          className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 bg-cyan-400/10 hover:bg-cyan-400/20 border border-cyan-400/20 px-3 py-2 rounded-xl transition shrink-0">
          <Download size={13} /> Export CSV
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
          {error} — Make sure you've run supabase-setup.sql.
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-gray-500 text-sm">Loading…</div>
      ) : visible.length === 0 ? (
        <div className="text-center py-20 text-gray-600 text-sm">
          {rows.length === 0 ? 'No signups yet.' : 'No results match your search.'}
        </div>
      ) : (
        <div className="space-y-2">
          {visible.map((r, i) => (
            <div key={r.id}
              className="bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <span className="text-xs text-gray-600 font-bold w-5 shrink-0 hidden sm:block">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4">
                <div>
                  <p className="text-sm font-bold text-white truncate">{r.full_name}</p>
                  <p className="text-xs text-gray-500 truncate">{r.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">{r.department}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">{r.days_completed ?? 0}/20 days · {r.score ?? 0} pts</p>
                  <p className="text-xs text-gray-600">{fmt(r.created_at)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full border bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
                  Signed Up
                </span>
                <button onClick={() => setScoreModal(r)}
                  className="flex items-center gap-1 text-xs text-violet-400 hover:text-white hover:bg-violet-600 transition bg-violet-500/10 border border-violet-500/20 px-3 py-1.5 rounded-lg">
                  <Pencil size={12} /> Score
                </button>
                <button onClick={() => handleDelete(r.id, r.full_name)} disabled={deleting === r.id}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-white hover:bg-red-600 transition bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg disabled:opacity-40">
                  <Trash2 size={12} /> {deleting === r.id ? '…' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-gray-700 text-center">Showing {visible.length} of {rows.length} signups</p>
    </div>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Leaderboard tab
// ─────────────────────────────────────────────────────────────────────────────

function LeaderboardTab() {
  const [rows, setRows]       = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  const load = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/challenge_signups?select=id,full_name,department,score,days_completed&order=score.desc,days_completed.desc,created_at.asc`,
        { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
      )
      if (!res.ok) throw new Error(`Fetch failed (${res.status})`)
      const data = await res.json()
      setRows(data.map((p, i) => ({ ...p, rank: i + 1 })))
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const rankStyle = rank => {
    if (rank === 1) return { badge: 'bg-amber-400/15 text-amber-300 border-amber-400/30',  row: 'border-amber-400/20 bg-amber-400/[0.04]' }
    if (rank === 2) return { badge: 'bg-gray-400/15  text-gray-300  border-gray-400/30',   row: 'border-gray-400/20  bg-gray-400/[0.03]'  }
    if (rank === 3) return { badge: 'bg-orange-400/15 text-orange-300 border-orange-400/30', row: 'border-orange-400/20 bg-orange-400/[0.03]' }
    return { badge: 'bg-white/5 text-gray-500 border-white/10', row: 'border-white/[0.07] bg-white/[0.02]' }
  }

  const topScore = rows[0]?.score ?? 0

  return (
    <div className="space-y-5">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-white">Challenge Leaderboard</h2>
          <p className="text-xs text-gray-500 mt-0.5">{rows.length} participants · sorted by score</p>
        </div>
        <button onClick={load} disabled={loading}
          className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 bg-cyan-400/10 hover:bg-cyan-400/20 border border-cyan-400/20 px-3 py-2 rounded-xl transition disabled:opacity-40">
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* Live indicator */}
      {!loading && rows.length > 0 && (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs text-cyan-400 font-semibold uppercase tracking-wider">
            {topScore > 0 ? 'Live scores' : 'Challenge not started — scores at 0'}
          </span>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Column headers */}
      {!loading && rows.length > 0 && (
        <div className="grid grid-cols-[2.5rem_1fr_5rem_5rem] gap-2 px-4 mb-1">
          <span className="text-xs text-gray-600">#</span>
          <span className="text-xs text-gray-600">Participant</span>
          <span className="text-xs text-gray-600 text-center">Days</span>
          <span className="text-xs text-gray-600 text-right">Score</span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-gray-500 text-sm">Loading…</div>
      ) : rows.length === 0 ? (
        <div className="text-center py-20 text-gray-600 text-sm">No sign-ups yet.</div>
      ) : (
        <div className="space-y-2">
          {rows.map(p => {
            const { badge, row } = rankStyle(p.rank)
            return (
              <div key={p.id}
                className={`grid grid-cols-[2.5rem_1fr_5rem_5rem] gap-2 items-center px-4 py-3 rounded-xl border ${row}`}>
                <span className={`text-xs font-black text-center px-1.5 py-0.5 rounded-lg border ${badge}`}>
                  #{p.rank}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white truncate">{p.full_name}</p>
                  <p className="text-xs text-gray-500 truncate">{p.department}</p>
                </div>
                <span className="text-xs text-gray-400 text-center tabular-nums">
                  {p.days_completed ?? 0}/20
                </span>
                <span className={`text-sm font-black tabular-nums text-right ${(p.score ?? 0) > 0 ? 'text-cyan-400' : 'text-gray-600'}`}>
                  {p.score ?? 0}
                </span>
              </div>
            )
          })}
        </div>
      )}
      <p className="text-xs text-gray-700 text-center">Scores update as you edit them in the Challenge Signups tab</p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard shell
// ─────────────────────────────────────────────────────────────────────────────

function Dashboard({ onLogout }) {
  const [tab, setTab] = useState('registrations')

  const reload = () => {
    // trigger re-mount of the active tab by toggling a key — simplest approach
    setTab(t => t)
  }

  return (
    <div className="min-h-screen" style={{ background: '#0f172a', color: '#fff' }}>

      {/* Header */}
      <div className="border-b border-white/10 px-4 sm:px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-base font-black text-white">Decagon 5.0 — Admin</h1>
          <p className="text-xs text-gray-500">NAMSSN UNILAG</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onLogout}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-400 transition bg-white/5 border border-white/10 px-3 py-2 rounded-lg">
            <LogOut size={13} /> Sign Out
          </button>
        </div>
      </div>

      {/* Tab selector */}
      <div className="px-4 sm:px-8 pt-6">
        <div className="flex gap-3 border-b border-white/10 pb-0">
          {[
            { key: 'registrations', label: 'Competition Registrations', icon: Trophy   },
            { key: 'signups',       label: '20-Day Challenge Signups',  icon: BookOpen },
            { key: 'leaderboard',   label: 'Leaderboard',               icon: Medal    },
          ].map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex items-center gap-2 text-sm font-bold px-4 py-3 border-b-2 transition -mb-px ${
                tab === key
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}>
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="px-4 sm:px-8 py-6">
        {tab === 'registrations' && <RegistrationsTab />}
        {tab === 'signups'       && <SignupsTab />}
        {tab === 'leaderboard'   && <LeaderboardTab />}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────────────────────

export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === '1')

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY)
    setAuthed(false)
  }

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />
  return <Dashboard onLogout={logout} />
}
