import usePageTitle from '../hooks/usePageTitle'

const STARS = [
  { top: '8%',  left: '10%', size: '1.1rem', delay: '0s',   duration: '2.4s' },
  { top: '15%', left: '80%', size: '0.8rem', delay: '0.5s', duration: '3.1s' },
  { top: '25%', left: '55%', size: '1.3rem', delay: '1s',   duration: '2.7s' },
  { top: '5%',  left: '40%', size: '0.9rem', delay: '1.5s', duration: '2.2s' },
  { top: '35%', left: '90%', size: '0.7rem', delay: '0.3s', duration: '3.5s' },
  { top: '50%', left: '5%',  size: '1.0rem', delay: '0.8s', duration: '2.9s' },
  { top: '60%', left: '75%', size: '0.8rem', delay: '1.2s', duration: '2.6s' },
  { top: '70%', left: '30%', size: '1.2rem', delay: '0.6s', duration: '3.2s' },
  { top: '80%', left: '60%', size: '0.9rem', delay: '1.8s', duration: '2.4s' },
  { top: '90%', left: '20%', size: '0.7rem', delay: '0.2s', duration: '3.0s' },
  { top: '12%', left: '65%', size: '1.1rem', delay: '1.3s', duration: '2.8s' },
  { top: '45%', left: '48%', size: '0.6rem', delay: '0.9s', duration: '3.3s' },
]

const PARTICLES = [
  { left: '15%', delay: '0s',   duration: '6s'  },
  { left: '30%', delay: '1.5s', duration: '8s'  },
  { left: '50%', delay: '0.8s', duration: '7s'  },
  { left: '65%', delay: '2.2s', duration: '5.5s'},
  { left: '80%', delay: '0.4s', duration: '9s'  },
  { left: '42%', delay: '3s',   duration: '6.5s'},
]

export default function Eid() {
  usePageTitle(
    'Eid Mubarak — NAMSSN UNILAG',
    'NAMSSN UNILAG wishes all Muslim faithfuls a blessed Eid celebration. Taqabbalallahu minna wa minkum.',
  )

  return (
    <>
      <style>{`
        @keyframes floatCrescent {
          0%, 100% { transform: translateY(0px) rotate(-5deg); }
          50%       { transform: translateY(-24px) rotate(5deg); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.15; transform: scale(0.8); }
          50%       { opacity: 1;    transform: scale(1.3); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes riseParticle {
          0%   { transform: translateY(0) scale(1);    opacity: 0.7; }
          100% { transform: translateY(-100vh) scale(0); opacity: 0; }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.15; transform: scale(1);    }
          50%       { opacity: 0.30; transform: scale(1.15); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }

        .crescent   { animation: floatCrescent 4s ease-in-out infinite; }
        .star-twinkle { animation: twinkle var(--dur) var(--del) ease-in-out infinite; }
        .particle   { animation: riseParticle var(--dur) var(--del) ease-in linear infinite; }
        .glow-orb   { animation: pulseGlow 3s ease-in-out infinite; }

        .fade-up-1  { animation: fadeUp 0.8s 0.2s both; }
        .fade-up-2  { animation: fadeUp 0.8s 0.5s both; }
        .fade-up-3  { animation: fadeUp 0.8s 0.8s both; }
        .fade-up-4  { animation: fadeUp 0.8s 1.1s both; }
        .fade-up-5  { animation: fadeUp 0.8s 1.4s both; }

        .shimmer-text {
          background: linear-gradient(90deg, #f97316 0%, #fbbf24 40%, #f97316 60%, #fbbf24 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
      `}</style>

      <div className="min-h-screen bg-brand-blueDark relative overflow-hidden">

        {/* Glow orb */}
        <div className="glow-orb absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-brand-orange/20 blur-3xl pointer-events-none" />

        {/* Twinkling stars */}
        {STARS.map((s, i) => (
          <span
            key={i}
            className="star-twinkle absolute text-yellow-300 pointer-events-none select-none"
            style={{ top: s.top, left: s.left, fontSize: s.size, '--del': s.delay, '--dur': s.duration }}
          >✦</span>
        ))}

        {/* Rising particles */}
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className="particle absolute bottom-0 w-1.5 h-1.5 rounded-full bg-brand-orange/60 pointer-events-none"
            style={{ left: p.left, '--del': p.delay, '--dur': p.duration }}
          />
        ))}

        {/* Hero */}
        <section className="relative z-10 pt-20 pb-12 px-4 text-center">
          <div className="max-w-2xl mx-auto">

            <div className="fade-up-1">
              <p className="text-brand-orange text-xs font-bold uppercase tracking-widest mb-6">
                From NAMSSN UNILAG
              </p>
            </div>

            <div className="crescent fade-up-2 text-9xl leading-none mb-4">🌙</div>

            <div className="fade-up-3">
              <h1 className="text-6xl md:text-8xl font-black text-white mb-3">
                Eid <span className="shimmer-text">Mubarak</span>
              </h1>
            </div>

            <div className="fade-up-4">
              <p className="text-blue-200 text-xl md:text-2xl font-medium mb-8 tracking-widest">
                تَقَبَّلَ اللهُ مِنَّا وَمِنْكُمْ
              </p>
            </div>

            <div className="fade-up-5">
              <p className="text-blue-100 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
                To every Muslim student, family, and friend in our community — NAMSSN UNILAG joins you
                in celebrating the end of this blessed month of fasting, reflection, and devotion.
                May Allah accept your worship, grant you joy, and fill your home with peace and
                abundance this Eid and always.
              </p>
            </div>

          </div>
        </section>

        {/* Divider */}
        <div className="relative z-10 flex items-center gap-4 max-w-sm mx-auto px-8 mb-12">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-brand-orange text-lg">✦</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Message card */}
        <section className="relative z-10 pb-24 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 text-center backdrop-blur-sm">
              <p className="text-brand-orange text-2xl md:text-3xl font-black mb-6">
                🌟 Taqabbalallahu Minna Wa Minkum 🌟
              </p>
              <p className="text-blue-100 text-base leading-relaxed mb-8">
                May Allah accept our deeds and yours. This Eid, we celebrate not just the end of
                Ramadan but the spirit of community, sacrifice, and gratitude that unites us all.
                NAMSSN is a family, and today we celebrate with our Muslim brothers and sisters.
              </p>
              <div className="flex items-center gap-3 justify-center">
                <div className="h-px w-12 bg-brand-orange/40" />
                <p className="text-brand-orange font-bold text-xs uppercase tracking-widest">
                  NAMSSN UNILAG · 2025/2026 Session
                </p>
                <div className="h-px w-12 bg-brand-orange/40" />
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  )
}
