import { useState, useEffect, useCallback } from 'react'
import {
  LogOut, RefreshCw, CheckCircle2, XCircle, ExternalLink,
  Search, Users, Clock, CheckCheck, ShieldAlert,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────────────────────

const SUPABASE_URL      = import.meta.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
const ADMIN_PASSWORD    = import.meta.env.VITE_ADMIN_PASSWORD || 'decagon2026'
const SESSION_KEY       = 'decagon_admin_auth'

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

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

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
  return (
    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${cls}`}>{label}</span>
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
// Dashboard
// ─────────────────────────────────────────────────────────────────────────────

function Dashboard({ onLogout }) {
  const [rows, setRows]         = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [filter, setFilter]     = useState('all')   // all | pending_review | confirmed | rejected
  const [search, setSearch]     = useState('')
  const [updating, setUpdating] = useState(null)    // id being updated

  const load = useCallback(async () => {
    setLoading(true); setError('')
    try {
      setRows(await fetchRegistrations())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleStatus = async (id, status) => {
    setUpdating(id)
    try {
      await setStatus(id, status)
      setRows(r => r.map(x => x.id === id ? { ...x, payment_status: status } : x))
    } catch {
      alert('Failed to update status. Please try again.')
    } finally {
      setUpdating(null)
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
    <div className="min-h-screen" style={{ background: '#0f172a', color: '#fff' }}>

      {/* Header */}
      <div className="border-b border-white/10 px-4 sm:px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-base font-black text-white">Decagon 5.0 — Registrations</h1>
          <p className="text-xs text-gray-500">NAMSSN UNILAG Admin</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={load} disabled={loading}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition disabled:opacity-40 bg-white/5 border border-white/10 px-3 py-2 rounded-lg">
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button onClick={onLogout}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-400 transition bg-white/5 border border-white/10 px-3 py-2 rounded-lg">
            <LogOut size={13} /> Sign Out
          </button>
        </div>
      </div>

      <div className="px-4 sm:px-8 py-6 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total',     value: total,     icon: Users,        cls: 'text-white'        },
            { label: 'Pending',   value: pending,   icon: Clock,        cls: 'text-amber-400'    },
            { label: 'Confirmed', value: confirmed, icon: CheckCheck,   cls: 'text-green-400'    },
            { label: 'Rejected',  value: rejected,  icon: XCircle,      cls: 'text-red-400'      },
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
        <div className="flex flex-col sm:flex-row gap-3">
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
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search name, matric, email…"
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-gray-600
                         focus:outline-none focus:ring-2 focus:ring-cyan-400/30 transition"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
            {error} — Check that you've run supabase-setup.sql and added the SELECT policy.
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div className="text-center py-20 text-gray-500 text-sm">Loading registrations…</div>
        ) : visible.length === 0 ? (
          <div className="text-center py-20 text-gray-600 text-sm">
            {rows.length === 0 ? 'No registrations yet.' : 'No results match your filter.'}
          </div>
        ) : (
          <div className="space-y-2">
            {visible.map((r, i) => (
              <div key={r.id}
                className="bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4">

                {/* Number */}
                <span className="text-xs text-gray-600 font-bold w-5 shrink-0 hidden sm:block">
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Details */}
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

                {/* Status + Actions */}
                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  <StatusBadge status={r.payment_status} />

                  {/* View receipt */}
                  {r.receipt_url && (
                    <a href={r.receipt_url} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1 text-xs text-gray-400 hover:text-cyan-400 transition bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                      <ExternalLink size={12} /> Receipt
                    </a>
                  )}

                  {/* Confirm */}
                  {r.payment_status !== 'confirmed' && (
                    <button
                      onClick={() => handleStatus(r.id, 'confirmed')}
                      disabled={updating === r.id}
                      className="flex items-center gap-1 text-xs text-green-400 hover:text-white hover:bg-green-500 transition bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-lg disabled:opacity-40">
                      <CheckCircle2 size={12} />
                      {updating === r.id ? '…' : 'Confirm'}
                    </button>
                  )}

                  {/* Reject */}
                  {r.payment_status !== 'rejected' && (
                    <button
                      onClick={() => handleStatus(r.id, 'rejected')}
                      disabled={updating === r.id}
                      className="flex items-center gap-1 text-xs text-red-400 hover:text-white hover:bg-red-500 transition bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-lg disabled:opacity-40">
                      <XCircle size={12} />
                      {updating === r.id ? '…' : 'Reject'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-gray-700 text-center">
          Showing {visible.length} of {total} registrations
        </p>
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
