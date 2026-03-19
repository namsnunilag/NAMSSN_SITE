import { useState, useEffect } from 'react'
import { Gift, Lock, XCircle, Loader2, Trophy, AlertCircle } from 'lucide-react'
import usePageTitle from '../hooks/usePageTitle'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
const MAX_WINNERS = 28

const QUESTIONS = [
  { id: 1, question: 'Evaluate: ∫₀² x³ dx', answer: '4' },
  { id: 2, question: 'If f(x) = x² + 5x, find f′(2)', answer: '9' },
  { id: 3, question: 'What is log₂(64)?', answer: '6' },
  { id: 4, question: 'Find det(A) where A = [[4, 2], [1, 3]]', answer: '10' },
  { id: 5, question: 'If z = 3 + 4i, find |z|', answer: '5' },
  { id: 6, question: 'What is the sum of the first 9 positive odd numbers?', answer: '81' },
]

async function getCount() {
  if (!SUPABASE_URL) return 0 // demo mode
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/giveaway_entries?select=*`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Prefer: 'count=exact',
        Range: '0-0',
      },
    })
    const range = res.headers.get('content-range')
    return parseInt(range?.split('/')[1] || '0', 10)
  } catch {
    return 0
  }
}

async function submitEntry(name, matric) {
  // Demo mode — no backend configured yet
  if (!SUPABASE_URL) {
    await new Promise(r => setTimeout(r, 1200))
    return { success: true, position: 1 }
  }
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/enter_giveaway`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ p_name: name, p_matric: matric }),
  })
  return res.json()
}

export default function Giveaway() {
  usePageTitle(
    'NAMSSN Giveaway',
    'Answer a math question and be among the first 28 to win a mystery prize from NAMSSN UNILAG.',
  )

  const [question] = useState(
    () => QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)],
  )
  const [slotsLeft, setSlotsLeft] = useState(MAX_WINNERS)
  const [phase, setPhase] = useState('idle') // idle | wrong | loading | winner | full | duplicate | error
  const [name, setName] = useState('')
  const [matric, setMatric] = useState('')
  const [answer, setAnswer] = useState('')
  const [position, setPosition] = useState(null)
  const [attempted, setAttempted] = useState(false)

  useEffect(() => {
    getCount().then(count => setSlotsLeft(Math.max(0, MAX_WINNERS - count)))
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setAttempted(true)

    if (answer.trim() !== question.answer) {
      setPhase('wrong')
      return
    }

    if (slotsLeft <= 0) {
      setPhase('full')
      return
    }

    setPhase('loading')
    try {
      const result = await submitEntry(name.trim(), matric.trim().toUpperCase())
      if (result.success) {
        setPosition(result.position)
        setSlotsLeft(MAX_WINNERS - result.position)
        setPhase('winner')
      } else if (result.error === 'duplicate') {
        setPhase('duplicate')
      } else if (result.error === 'full') {
        setSlotsLeft(0)
        setPhase('full')
      } else {
        setPhase('error')
      }
    } catch {
      setPhase('error')
    }
  }

  const isDone = ['winner', 'wrong', 'full', 'duplicate'].includes(phase)

  return (
    <div className="min-h-screen bg-gray-950">

      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-950 via-brand-blueDark to-gray-950 text-white py-20 px-4 text-center border-b border-white/10">
        <div className="max-w-2xl mx-auto">
          <span className="inline-block bg-brand-orange/20 text-brand-orange text-xs font-bold px-3 py-1 rounded-full mb-6 uppercase tracking-widest">
            NAMSSN Giveaway
          </span>
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-brand-orange/10 border border-brand-orange/30 flex items-center justify-center">
            <Gift size={40} className="text-brand-orange" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Win a <span className="text-brand-orange">Mystery Prize</span>
          </h1>
          <p className="text-gray-300 text-lg mb-6">
            Answer one math question correctly. Be among the first{' '}
            <strong className="text-white">{MAX_WINNERS}</strong> to get it right — you win. 🎁
          </p>
          <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold border ${
            slotsLeft > 10
              ? 'bg-green-500/10 border-green-500/30 text-green-300'
              : slotsLeft > 0
              ? 'bg-red-500/10 border-red-500/30 text-red-300'
              : 'bg-gray-800 border-gray-700 text-gray-400'
          }`}>
            <span className={`w-2 h-2 rounded-full ${slotsLeft > 0 ? 'animate-pulse' : ''} ${
              slotsLeft > 10 ? 'bg-green-400' : slotsLeft > 0 ? 'bg-red-400' : 'bg-gray-500'
            }`} />
            {slotsLeft > 0
              ? <><span className="text-xl font-black">{slotsLeft}</span> / {MAX_WINNERS} slots remaining</>
              : 'All slots filled'}
          </div>
        </div>
      </section>

      <div className="max-w-xl mx-auto px-4 py-12">

        {/* ── WINNER ── */}
        {phase === 'winner' && (
          <div className="text-center bg-gradient-to-br from-brand-orange/20 to-yellow-500/10 border border-brand-orange/30 rounded-3xl p-10">
            <Trophy size={56} className="text-brand-orange mx-auto mb-4" />
            <h2 className="text-3xl font-black text-white mb-2">You Won! 🎉</h2>
            <p className="text-gray-300 mb-1">
              You are winner <strong className="text-brand-orange text-xl">#{position}</strong> of {MAX_WINNERS}.
            </p>
            <p className="text-gray-400 text-sm mt-3">
              NAMSSN will reach out to you with details about your mystery prize. Stay close!
            </p>
          </div>
        )}

        {/* ── WRONG ── */}
        {phase === 'wrong' && (
          <div className="text-center bg-red-500/10 border border-red-500/30 rounded-3xl p-10">
            <XCircle size={56} className="text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-white mb-2">Incorrect Answer</h2>
            <p className="text-gray-400">You only get one attempt. Better luck next time!</p>
          </div>
        )}

        {/* ── SLOTS FULL ── */}
        {phase === 'full' && (
          <div className="text-center bg-gray-800 border border-gray-700 rounded-3xl p-10">
            <Lock size={56} className="text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-white mb-2">All Slots Filled</h2>
            <p className="text-gray-400">All {MAX_WINNERS} winners have been picked. Watch out for the next giveaway!</p>
          </div>
        )}

        {/* ── DUPLICATE ── */}
        {phase === 'duplicate' && (
          <div className="text-center bg-yellow-500/10 border border-yellow-500/30 rounded-3xl p-10">
            <AlertCircle size={56} className="text-yellow-400 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-white mb-2">Already Entered</h2>
            <p className="text-gray-400">This matric number has already been used to enter the giveaway.</p>
          </div>
        )}

        {/* ── ERROR ── */}
        {phase === 'error' && (
          <div className="text-center bg-red-500/10 border border-red-500/30 rounded-3xl p-10">
            <XCircle size={56} className="text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-white mb-2">Something Went Wrong</h2>
            <p className="text-gray-400 mb-6">Please check your connection and try again.</p>
            <button
              onClick={() => setPhase('idle')}
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full text-sm font-semibold transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* ── ENTRY FORM ── */}
        {!isDone && phase !== 'error' && (
          <>
            {slotsLeft <= 0 ? (
              <div className="text-center bg-gray-800 border border-gray-700 rounded-3xl p-10">
                <Lock size={56} className="text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-black text-white mb-2">All Slots Filled</h2>
                <p className="text-gray-400">All {MAX_WINNERS} winners have been picked. Watch out for the next giveaway!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Question card */}
                <div className="bg-gray-900 border border-white/10 rounded-2xl p-6">
                  <p className="text-xs font-bold text-brand-orange uppercase tracking-widest mb-3">Your Question</p>
                  <p className="text-white text-xl font-bold leading-snug">{question.question}</p>
                </div>

                {/* Answer */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1.5">Your Answer</label>
                  <input
                    type="text"
                    value={answer}
                    onChange={e => setAnswer(e.target.value)}
                    placeholder="Enter your answer (number only)"
                    required
                    className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange/50 transition-colors"
                  />
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Adebisi Oluwaseye Christopher"
                    required
                    className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange/50 transition-colors"
                  />
                </div>

                {/* Matric */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1.5">Matric Number</label>
                  <input
                    type="text"
                    value={matric}
                    onChange={e => setMatric(e.target.value)}
                    placeholder="e.g. 200000000"
                    required
                    className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange/50 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={phase === 'loading'}
                  className="w-full flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-yellow hover:text-brand-blueDark text-white font-bold py-4 rounded-xl text-lg transition-all duration-200 disabled:opacity-60"
                >
                  {phase === 'loading' ? (
                    <><Loader2 size={20} className="animate-spin" /> Submitting...</>
                  ) : (
                    <><Gift size={20} /> Submit Entry</>
                  )}
                </button>

                <p className="text-center text-gray-500 text-xs">
                  One attempt per student · First {MAX_WINNERS} correct answers win · Prize revealed to winners
                </p>
              </form>
            )}
          </>
        )}

      </div>
    </div>
  )
}
