import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ArrowRight, Trophy, Users, BookOpen, Star } from 'lucide-react'

// ── Hero slideshow images ───────────────────────────────────────────────────
// Drop your images in public/images/hero/ and list them here
const SLIDES = [
  { src: '/images/events/exco.jpg',  caption: 'NAMSSN UNILAG Executives 2024/2025' },
  { src: '/images/events/ind.jpg',   caption: 'INAUGURATION TO OFFICE' },
  { src: '/images/events/HOD.jpg',   caption: 'HOD GAMES' },
  { src: '/images/events/deans.jpg', caption: "Dean's Games 2025" },
]

// ── Floating math symbols ───────────────────────────────────────────────────
const SYMBOLS = [
  { sym: '∑', left: '5%',  dur: '14s', delay: '0s',   drift: '7s',  size: '2rem' },
  { sym: 'π', left: '12%', dur: '18s', delay: '2s',   drift: '9s',  size: '1.5rem' },
  { sym: '∫', left: '20%', dur: '12s', delay: '4s',   drift: '6s',  size: '2.2rem' },
  { sym: '√', left: '30%', dur: '16s', delay: '1s',   drift: '8s',  size: '1.8rem' },
  { sym: 'Δ', left: '40%', dur: '20s', delay: '3s',   drift: '10s', size: '1.6rem' },
  { sym: '∞', left: '50%', dur: '13s', delay: '5s',   drift: '7s',  size: '2rem' },
  { sym: 'θ', left: '60%', dur: '17s', delay: '0.5s', drift: '9s',  size: '1.7rem' },
  { sym: 'λ', left: '70%', dur: '15s', delay: '2.5s', drift: '8s',  size: '1.9rem' },
  { sym: 'μ', left: '80%', dur: '11s', delay: '4.5s', drift: '6s',  size: '1.6rem' },
  { sym: 'σ', left: '90%', dur: '19s', delay: '1.5s', drift: '9s',  size: '1.8rem' },
  { sym: '∂', left: '8%',  dur: '22s', delay: '6s',   drift: '11s', size: '1.5rem' },
  { sym: '∇', left: '25%', dur: '10s', delay: '3.5s', drift: '5s',  size: '2.1rem' },
  { sym: 'α', left: '45%', dur: '24s', delay: '7s',   drift: '12s', size: '1.4rem' },
  { sym: 'β', left: '55%', dur: '16s', delay: '8s',   drift: '8s',  size: '1.7rem' },
  { sym: 'Ω', left: '65%', dur: '13s', delay: '9s',   drift: '7s',  size: '2rem' },
  { sym: '±', left: '75%', dur: '18s', delay: '2s',   drift: '9s',  size: '1.8rem' },
  { sym: '≈', left: '85%', dur: '14s', delay: '5s',   drift: '7s',  size: '1.6rem' },
  { sym: '∝', left: '95%', dur: '20s', delay: '0s',   drift: '10s', size: '1.5rem' },
]

const STATS = [
  { icon: Users,    value: '500+',  label: 'Active Members' },
  { icon: Trophy,   value: '10+',   label: 'Annual Events' },
  { icon: BookOpen, value: '7',     label: 'Executives' },
  { icon: Star,     value: '2024',  label: 'Founded' },
]

const QUICK_LINKS = [
  { to: '/about',      label: 'About NAMSSN',   desc: 'Our mission, vision & history' },
  { to: '/events',     label: 'Upcoming Events', desc: 'DECAGON, Dean\'s Games & more' },
  { to: '/executives', label: 'Meet the Excos',  desc: 'Your 2024/2025 executive team' },
  { to: '/gallery',    label: 'Photo Gallery',   desc: 'Memories from our events' },
]

export default function Home() {
  const [current, setCurrent] = useState(0)
  const intervalRef = useRef(null)

  const startSlideshow = () => {
    clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % SLIDES.length)
    }, 8000)
  }

  useEffect(() => {
    startSlideshow()
    return () => clearInterval(intervalRef.current)
  }, [])

  const goTo = (idx) => {
    setCurrent(idx)
    startSlideshow()
  }
  const prev = () => goTo((current - 1 + SLIDES.length) % SLIDES.length)
  const next = () => goTo((current + 1) % SLIDES.length)

  return (
    <div className="pt-16">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative h-screen min-h-[600px] overflow-hidden bg-brand-blueDark">

        {/* Slideshow backgrounds */}
        {SLIDES.map((s, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: i === current ? 1 : 0 }}
          >
            <img
              src={s.src}
              alt={s.caption}
              className="w-full h-full object-cover"
              onError={e => { e.currentTarget.style.display = 'none' }}
            />
            <div className="absolute inset-0 bg-brand-blueDark/65" />
          </div>
        ))}

        {/* Floating math symbols */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {SYMBOLS.map((s, i) => (
            <span
              key={i}
              className="math-symbol absolute bottom-0 text-white/20 select-none"
              style={{
                left: s.left,
                fontSize: s.size,
                '--dur':   s.dur,
                '--delay': s.delay,
                '--drift': s.drift,
              }}
            >
              {s.sym}
            </span>
          ))}
        </div>

        {/* Sine wave decoration */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden h-16 pointer-events-none">
          <svg
            className="hero-sine"
            viewBox="0 0 1440 64"
            style={{ width: '200%', height: '64px' }}
            preserveAspectRatio="none"
          >
            <path
              d="M0,32 C180,64 360,0 540,32 C720,64 900,0 1080,32 C1260,64 1440,0 1620,32 C1800,64 1980,0 2160,32 C2340,64 2520,0 2700,32 C2880,64 2880,64 2880,64 L0,64 Z"
              fill="white"
              fillOpacity="0.06"
            />
          </svg>
        </div>

        {/* Hero content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          {/* Logo */}
          <img
            src="/logo.png"
            alt="NAMSSN Logo"
            className="w-24 h-24 object-contain mb-5 drop-shadow-2xl"
            onError={e => { e.currentTarget.style.display = 'none' }}
          />

          <p className="text-brand-blueLight text-sm sm:text-base font-semibold tracking-widest uppercase mb-3">
            University of Lagos Chapter
          </p>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-4">
            <span className="bg-gradient-to-r from-white via-brand-blueLight to-brand-yellow bg-clip-text text-transparent">
              NAMSSN
            </span>
            <br />
            <span className="text-white">UNILAG</span>
          </h1>

          <p className="text-gray-200 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            National Association of Mathematical Sciences Students of Nigerian Universities —
            empowering the next generation of mathematical minds.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/events"
              className="bg-brand-orange hover:bg-brand-yellow hover:text-brand-blueDark text-white font-bold px-7 py-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Upcoming Events
            </Link>
            <Link
              to="/about"
              className="border-2 border-white text-white hover:bg-white hover:text-brand-blueDark font-bold px-7 py-3 rounded-full transition-all duration-200"
            >
              Learn More
            </Link>
          </div>

          {/* Slide caption */}
          <p className="absolute bottom-20 text-white/60 text-xs sm:text-sm italic">
            {SLIDES[current].caption}
          </p>
        </div>

        {/* Arrows */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-brand-orange text-white p-2 rounded-full transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-brand-orange text-white p-2 rounded-full transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight size={20} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? 'w-6 bg-brand-orange' : 'w-2 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20">
          <div
            key={current}
            className="h-full bg-brand-orange"
            style={{ animation: 'progressBar 8s linear forwards' }}
          />
        </div>
      </section>

      {/* ── STATS BAND ────────────────────────────────────────────────────── */}
      <section className="bg-brand-blue text-white py-10">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <Icon size={28} className="text-brand-yellow" />
              <span className="text-3xl font-black">{value}</span>
              <span className="text-sm text-blue-200">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── QUICK LINKS ───────────────────────────────────────────────────── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-brand-blueDark text-center mb-2">Explore NAMSSN</h2>
          <p className="text-gray-500 text-center mb-10">Everything you need in one place</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {QUICK_LINKS.map(({ to, label, desc }) => (
              <Link
                key={to}
                to={to}
                className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-md border border-gray-100 hover:border-brand-blue/30 transition-all duration-200 hover:-translate-y-1"
              >
                <h3 className="font-bold text-brand-blueDark group-hover:text-brand-blue text-lg mb-1 transition-colors">
                  {label}
                </h3>
                <p className="text-gray-500 text-sm mb-4">{desc}</p>
                <span className="inline-flex items-center gap-1 text-brand-orange text-sm font-semibold group-hover:gap-2 transition-all">
                  View <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── DECAGON SPOTLIGHT ─────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-gradient-to-br from-brand-blueDark to-brand-blue rounded-3xl overflow-hidden">
            <div className="flex flex-col md:flex-row items-center gap-8 p-8 md:p-12">
              <div className="flex-1 text-white">
                <span className="inline-block bg-brand-orange text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
                  Flagship Event
                </span>
                <h2 className="text-3xl md:text-4xl font-black mb-4">DECAGON 2025</h2>
                <p className="text-blue-100 leading-relaxed mb-6">
                  The biggest mathematics competition on campus. Test your skills, win prizes,
                  and represent your department with pride.
                </p>
                <Link
                  to="/events/1"
                  className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-yellow hover:text-brand-blueDark text-white font-bold px-6 py-3 rounded-full transition-all duration-200"
                >
                  Register Now <ArrowRight size={16} />
                </Link>
              </div>
              <div className="text-white/10 text-[10rem] font-black select-none leading-none hidden md:block">
                ∑
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-gray-50 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-brand-blueDark mb-4">Join the NAMSSN Family</h2>
          <p className="text-gray-600 mb-8">
            Connect with fellow mathematical sciences students, participate in competitions,
            workshops, and build lifelong friendships.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-brand-blueDark hover:bg-brand-blue text-white font-bold px-8 py-4 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Contact Us <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}
