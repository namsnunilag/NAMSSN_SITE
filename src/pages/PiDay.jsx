import { Link } from 'react-router-dom'
import { Download, ArrowRight } from 'lucide-react'
import usePageTitle from '../hooks/usePageTitle'

const INTEGRALS = [
  {
    number: 'I',
    name: 'The Gaussian Integral',
    integral: '∫_{-∞}^{∞} e^{-x²} dx',
    result: '√π',
    technique: 'Polar coordinates',
    description:
      'The most famous integral in mathematics. No elementary antiderivative exists — the trick is to square the integral and convert to polar coordinates.',
  },
  {
    number: 'II',
    name: 'The Dirichlet Sinc Integral',
    integral: '∫_0^{∞} (sin x)/x dx',
    result: 'π/2',
    technique: "Feynman's trick",
    description:
      "Standard techniques fail here. Feynman's differentiation under the integral sign introduces a decay parameter, turning the problem into an ODE.",
  },
  {
    number: 'III',
    name: 'The 22/7 − π Integral',
    integral: '∫_0^1 x⁴(1−x)⁴/(1+x²) dx',
    result: '22/7 − π',
    technique: 'Polynomial long division',
    description:
      'Since the integrand is strictly positive on (0,1), this result is a rigorous proof that 22/7 > π. Only polynomial division and arctan are needed.',
  },
  {
    number: 'IV',
    name: "Euler's Log-Sine Integral",
    integral: '∫_0^{π/2} ln(sin x) dx',
    result: '−(π/2) ln 2',
    technique: 'Symmetry & functional equation',
    description:
      'Exploiting the symmetry of sin and cos over [0, π/2] and the double-angle identity yields a self-referential equation that solves algebraically.',
  },
  {
    number: 'V',
    name: 'The Ahmed Integral',
    integral: '∫_0^1 arctan(√(x²+2)) / [(1+x²)√(x²+2)] dx',
    result: '5π²/96',
    technique: 'Hyperbolic sub + Feynman',
    description:
      "Published by Z. Ahmed in 2002. Three layers of technique: an arctan identity, a hyperbolic substitution, and Feynman's trick — which generates a mirror of itself.",
  },
]

export default function PiDay() {
  usePageTitle(
    'Pi Day 2026 — Five Integrals Converging to π',
    'Happy Pi Day! The NAMSSN Academic Team presents five remarkable integrals that each resolve to an expression involving π. Download the full step-by-step solutions.'
  )

  return (
    <div>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative bg-brand-blueDark text-white py-20 px-4 text-center overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5 select-none pointer-events-none flex items-center justify-center">
          <span className="text-[32rem] font-black leading-none">π</span>
        </div>

        <div className="relative z-10">
          <span className="inline-block bg-brand-orange/20 text-brand-orange text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
            March 14, 2026
          </span>
          <h1 className="text-5xl md:text-7xl font-black mb-2">
            Happy <span className="text-brand-orange">Pi</span> Day
          </h1>
          <p className="text-brand-blueLight text-lg mb-2">π ≈ 3.14159265358979...</p>
          <p className="text-blue-100 max-w-xl mx-auto mb-10 text-lg">
            The NAMSSN Academic Team presents <strong>five remarkable integrals</strong> — each resolving elegantly to an expression involving π.
          </p>

          {/* CTA */}
          <a
            href="/pi-day-2026.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-yellow hover:text-brand-blueDark text-white font-bold px-8 py-4 rounded-full text-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <Download size={20} /> Download Full Solutions (PDF)
          </a>

          <p className="mt-4 text-blue-200 text-sm">
            By <strong>Kamal</strong> · Edited by <strong>Abdulrasheed</strong> · Proofread by <strong>Oluwadamilola</strong>
          </p>
        </div>
      </section>

      {/* ── Editorial note ───────────────────────────────────────────────────── */}
      <section className="bg-white dark:bg-gray-800 py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg italic border-l-4 border-brand-orange pl-6 text-left">
            "Today we celebrate Pi Day, the annual homage to the most celebrated constant in all of mathematics.
            March 14 (3/14) mirrors the opening digits of π = 3.14..., a number that quietly governs geometry,
            probability, physics, and analysis alike. These are not trivial computations; they are among the most
            beautiful results in mathematical analysis."
          </p>
          <p className="mt-4 text-brand-orange font-semibold text-right">— Abdulrasheed, Editor</p>
        </div>
      </section>

      {/* ── Five integrals ───────────────────────────────────────────────────── */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-brand-blueDark dark:text-white text-center mb-2">
            The Five Integrals
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-center mb-12">
            Each integral uses a distinct technique — full step-by-step proofs in the PDF.
          </p>

          <div className="space-y-6">
            {INTEGRALS.map((item) => (
              <div
                key={item.number}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-5"
              >
                {/* Number */}
                <div className="shrink-0 w-14 h-14 rounded-xl bg-brand-blueDark flex items-center justify-center text-white font-black text-xl">
                  {item.number}
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-bold text-brand-blueDark dark:text-white text-lg">{item.name}</h3>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-orange/10 text-brand-orange">
                      {item.technique}
                    </span>
                  </div>

                  {/* Integral expression */}
                  <div className="font-mono text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 mb-3 flex items-center justify-between gap-4 flex-wrap">
                    <span className="text-gray-700 dark:text-gray-300">{item.integral}</span>
                    <span className="font-black text-brand-orange text-base">= {item.result}</span>
                  </div>

                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Download CTA ─────────────────────────────────────────────────────── */}
      <section className="bg-brand-blueDark text-white py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="text-6xl mb-4 font-black text-brand-orange">π</div>
          <h2 className="text-3xl font-black mb-4">Read the Full Solutions</h2>
          <p className="text-blue-100 mb-8">
            Every integral is solved step-by-step — substitutions, limits, and all the working shown in full.
            Download the PDF and work through them yourself.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/pi-day-2026.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-yellow hover:text-brand-blueDark text-white font-bold px-8 py-4 rounded-full transition-all duration-200"
            >
              <Download size={18} /> Download PDF
            </a>
            <Link
              to="/community"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-full transition-all duration-200"
            >
              Read Article <ArrowRight size={18} />
            </Link>
          </div>
          <p className="mt-8 text-blue-300 text-sm">
            "The mathematician's patterns, like the painter's or the poet's, must be beautiful." — G.H. Hardy
          </p>
        </div>
      </section>

    </div>
  )
}
