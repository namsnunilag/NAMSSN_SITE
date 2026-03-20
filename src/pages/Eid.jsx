import usePageTitle from '../hooks/usePageTitle'

export default function Eid() {
  usePageTitle(
    'Eid Mubarak — NAMSSN UNILAG',
    'NAMSSN UNILAG wishes all Muslim faithfuls a blessed Eid celebration. Taqabbalallahu minna wa minkum.',
  )

  return (
    <div className="min-h-screen bg-[#0a2e1a]">

      {/* Hero */}
      <section className="relative overflow-hidden py-24 px-4 text-center">
        {/* Background glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <div className="w-[600px] h-[600px] rounded-full bg-green-700/20 blur-3xl" />
        </div>

        {/* Stars decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none opacity-30">
          {['top-10 left-16', 'top-20 right-24', 'top-36 left-1/3', 'top-8 right-1/3',
            'bottom-24 left-20', 'bottom-16 right-16', 'bottom-32 left-1/2'].map((pos, i) => (
            <span key={i} className={`absolute ${pos} text-yellow-300 text-lg`}>✦</span>
          ))}
        </div>

        <div className="relative z-10 max-w-2xl mx-auto">
          {/* Crescent */}
          <div className="text-8xl mb-4 leading-none">🌙</div>

          <p className="text-green-300 text-sm font-bold uppercase tracking-widest mb-3">
            From NAMSSN UNILAG
          </p>

          <h1 className="text-5xl md:text-7xl font-black text-white mb-2">
            Eid <span className="text-yellow-400">Mubarak</span>
          </h1>

          <p className="text-green-300 text-lg md:text-xl font-medium mb-10 tracking-wide">
            تَقَبَّلَ اللهُ مِنَّا وَمِنْكُمْ
          </p>

          <p className="text-green-100 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
            To every Muslim student, family, and friend in our community — NAMSSN UNILAG joins you
            in celebrating the end of this blessed month of fasting, reflection, and devotion.
            May Allah accept your worship, grant you joy, and fill your home with peace and abundance
            this Eid and always.
          </p>
        </div>
      </section>

      {/* Divider */}
      <div className="flex items-center gap-4 max-w-md mx-auto px-8">
        <div className="flex-1 h-px bg-green-800" />
        <span className="text-yellow-400 text-xl">✦</span>
        <div className="flex-1 h-px bg-green-800" />
      </div>

      {/* Message card */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-green-900/40 border border-green-700/40 rounded-3xl p-8 md:p-12 text-center">
            <p className="text-yellow-400 text-3xl md:text-4xl font-black mb-6">
              🌟 Taqabbalallahu Minna Wa Minkum 🌟
            </p>
            <p className="text-green-100 text-base leading-relaxed mb-6">
              May Allah accept our deeds and yours. This Eid, we celebrate not just the end of Ramadan
              but the spirit of community, sacrifice, and gratitude that unites us all — regardless of faith.
              NAMSSN is a family, and today we celebrate with our Muslim brothers and sisters.
            </p>
            <p className="text-green-400 font-bold text-sm uppercase tracking-widest">
              NAMSSN UNILAG · 2025/2026 Session
            </p>
          </div>
        </div>
      </section>

      {/* Bottom crescent */}
      <section className="pb-20 text-center">
        <p className="text-green-600 text-5xl">☽</p>
      </section>

    </div>
  )
}
