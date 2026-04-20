import { Link } from 'react-router-dom'
import { Download, ArrowRight } from 'lucide-react'
import katex from 'katex'
import usePageTitle from '../hooks/usePageTitle'

function M({ tex, block = false }) {
  const html = katex.renderToString(tex, { throwOnError: false, displayMode: block })
  return block
    ? <div className="overflow-x-auto py-1" dangerouslySetInnerHTML={{ __html: html }} />
    : <span dangerouslySetInnerHTML={{ __html: html }} />
}

const INTEGRALS = [
  {
    number: 'I',
    name: 'The Gaussian Integral',
    tex: '\\displaystyle\\int_{-\\infty}^{\\infty} e^{-x^2}\\,dx = \\sqrt{\\pi}',
    technique: "Polar coordinates",
    description:
      'The most famous integral in mathematics. No elementary antiderivative exists — the trick is to square the integral and convert to polar coordinates.',
  },
  {
    number: 'II',
    name: 'The Dirichlet Sinc Integral',
    tex: '\\displaystyle\\int_0^{\\infty} \\frac{\\sin x}{x}\\,dx = \\frac{\\pi}{2}',
    technique: "Feynman's trick",
    description:
      "Standard techniques fail here. Feynman's differentiation under the integral sign introduces a decay parameter, turning the problem into an ODE.",
  },
  {
    number: 'III',
    name: 'The 22/7 − π Integral',
    tex: '\\displaystyle\\int_0^1 \\frac{x^4(1-x)^4}{1+x^2}\\,dx = \\frac{22}{7} - \\pi',
    technique: 'Polynomial long division',
    description:
      'Since the integrand is strictly positive on (0,1), this is a rigorous proof that 22/7 > π. Only polynomial division and arctan are needed.',
  },
  {
    number: 'IV',
    name: "Euler's Log-Sine Integral",
    tex: '\\displaystyle\\int_0^{\\pi/2} \\ln(\\sin x)\\,dx = -\\frac{\\pi}{2}\\ln 2',
    technique: 'Symmetry & functional equation',
    description:
      'Exploiting the symmetry of sin and cos over [0, π/2] and the double-angle identity yields a self-referential equation that solves algebraically.',
  },
  {
    number: 'V',
    name: 'The Ahmed Integral',
    tex: '\\displaystyle\\int_0^1 \\frac{\\tan^{-1}\\!\\sqrt{x^2+2}}{(1+x^2)\\sqrt{x^2+2}}\\,dx = \\frac{5\\pi^2}{96}',
    technique: 'Hyperbolic sub + Feynman',
    description:
      "Published by Z. Ahmed in 2002. Three layers: an arctan identity, a hyperbolic substitution, and Feynman's trick — which generates a mirror of itself.",
  },
]

export default function PiDay() {
  usePageTitle(
    'Pi Day 2026 — Five Integrals Converging to π',
    'Happy Pi Day! The NAMSSN Academic Team presents five remarkable integrals that each resolve to an expression involving π. Download the full step-by-step solutions.',
    'https://www.namssnunilag.one/og-image.png'
  )

  return (
    <div>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative bg-brand-blueDark text-white py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-5 select-none pointer-events-none flex items-center justify-center">
          <span className="text-[32rem] font-black leading-none">π</span>
        </div>

        <div className="relative z-10">
          <span className="inline-block bg-brand-orange/20 text-brand-orange text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
            March 14, 2026
          </span>
          <h1 className="text-5xl md:text-7xl font-black mb-3">
            Happy <span className="text-brand-orange">Pi</span> Day
          </h1>
          <div className="text-brand-blueLight text-lg mb-2">
            <M tex="\pi \approx 3.14159265358979\ldots" />
          </div>
          <p className="text-blue-100 max-w-xl mx-auto mb-10 text-lg">
            The NAMSSN Academic Team presents <strong>five remarkable integrals</strong> — each resolving elegantly to an expression involving <M tex="\pi" />.
          </p>

          <a
            href="/pi-day-2026.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-yellow hover:text-brand-blueDark text-white font-bold px-8 py-4 rounded-full text-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <Download size={20} /> Download Full Solutions (PDF)
          </a>

          <p className="mt-4 text-blue-200 text-sm">
            By <strong>Adebisi Oluwaseye Christopher</strong> · Edited &amp; Proofread by <strong>Toyobo Oluwadamilola Oluwatimileyin</strong> · Published by <strong>NAMSSN 2026</strong>
          </p>
        </div>
      </section>

      {/* ── Editorial note ───────────────────────────────────────────────────── */}
      <section className="bg-white dark:bg-gray-800 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg italic border-l-4 border-brand-orange pl-6">
            "Today we celebrate Pi Day, the annual homage to the most celebrated constant in all of mathematics.
            March 14 (3/14) mirrors the opening digits of <M tex="\pi = 3.14\ldots" />, a number that quietly governs geometry,
            probability, physics, and analysis alike. These are not trivial computations; they are among the most
            beautiful results in mathematical analysis."
          </p>
          <p className="mt-4 text-brand-orange font-semibold text-right">— Adebisi Oluwaseye Christopher, Chief Editor</p>
        </div>
      </section>

      {/* ── Glance table ─────────────────────────────────────────────────────── */}
      <section className="bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-black text-brand-blueDark dark:text-white text-center mb-8">
            The Five Integrals at a Glance
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-brand-blueDark text-white">
                  <th className="px-4 py-3 text-left font-bold">#</th>
                  <th className="px-4 py-3 text-left font-bold">Integral</th>
                  <th className="px-4 py-3 text-left font-bold">Result</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { n: 'I',   lhs: '\\int_{-\\infty}^{\\infty} e^{-x^2}\\,dx',                                                              rhs: '\\sqrt{\\pi}' },
                  { n: 'II',  lhs: '\\int_0^{\\infty} \\dfrac{\\sin x}{x}\\,dx',                                                            rhs: '\\dfrac{\\pi}{2}' },
                  { n: 'III', lhs: '\\int_0^1 \\dfrac{x^4(1-x)^4}{1+x^2}\\,dx',                                                            rhs: '\\dfrac{22}{7} - \\pi' },
                  { n: 'IV',  lhs: '\\int_0^{\\pi/2} \\ln(\\sin x)\\,dx',                                                                  rhs: '-\\dfrac{\\pi}{2}\\ln 2' },
                  { n: 'V',   lhs: '\\int_0^1 \\dfrac{\\tan^{-1}\\!\\sqrt{x^2+2}}{(1+x^2)\\sqrt{x^2+2}}\\,dx',                              rhs: '\\dfrac{5\\pi^2}{96}' },
                ].map((row, i) => (
                  <tr key={row.n} className={i % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'}>
                    <td className="px-4 py-4 font-black text-brand-orange text-base">{row.n}</td>
                    <td className="px-4 py-4 overflow-x-auto"><M tex={row.lhs} /></td>
                    <td className="px-4 py-4 font-bold text-brand-orange"><M tex={row.rhs} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Five integrals detail ─────────────────────────────────────────────── */}
      <section className="py-16 bg-white dark:bg-gray-800 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-brand-blueDark dark:text-white text-center mb-2">
            Meet the Integrals
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-center mb-12">
            Full step-by-step proofs are in the PDF — download it below.
          </p>

          <div className="space-y-6">
            {INTEGRALS.map((item) => (
              <div
                key={item.number}
                className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-5"
              >
                <div className="shrink-0 w-14 h-14 rounded-xl bg-brand-blueDark flex items-center justify-center text-white font-black text-xl">
                  {item.number}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <h3 className="font-bold text-brand-blueDark dark:text-white text-lg">{item.name}</h3>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-orange/10 text-brand-orange">
                      {item.technique}
                    </span>
                  </div>

                  {/* Rendered math */}
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-4 mb-3 overflow-x-auto text-center">
                    <M tex={item.tex} block />
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
            Every integral is solved step-by-step — substitutions, limits, and all working shown in full.
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
          <p className="mt-8 text-blue-300 text-sm italic">
            "The mathematician's patterns, like the painter's or the poet's, must be beautiful." — G.H. Hardy
          </p>
        </div>
      </section>

    </div>
  )
}
