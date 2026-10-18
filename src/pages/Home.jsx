import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import usePageTitle from '../hooks/usePageTitle'
import { ArrowRight, Trophy, Users, BookOpen, Star, Zap, Heart, Globe, GraduationCap } from 'lucide-react'

// ── Hero slideshow images ───────────────────────────────────────────────────
// Drop your images in public/images/hero/ and list them here
const SLIDES = [
  { src: '/images/executives/NAMSSN EXCOS - 26/EXCOS.png',  caption: 'NAMSSN UNILAG Executives 2026/2027' },
  { src: '/images/hero/past_excos/ind.jpg',   caption: 'INAUGURATION TO OFFICE' },
  { src: '/images/hero/past_excos/HOD.jpg',   caption: 'HOD GAMES' },
  { src: '/images/hero/past_excos/deans.jpg', caption: "Dean's Games 2026" },
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
  { icon: Users,    value: '500+', label: 'Active Members' },
  { icon: Trophy,   value: '10+',  label: 'Annual Events' },
  { icon: BookOpen, value: '12',   label: 'Executives' },
  { icon: Star,     value: '100%', label: 'Student-Led' },
]

const QUICK_LINKS = [
  { to: '/about',       label: 'About NAMSSN',    desc: 'Our mission, vision & history' },
  { to: '/events',      label: 'Upcoming Events',  desc: 'DECAGON, Dean\'s Games & more' },
  { to: '/academics',   label: 'Academics',        desc: 'Materials, past questions & timetable' },
  { to: '/resources',   label: 'Student Resources', desc: 'CGPA calc, scholarships & jobs' },
  { to: '/newsletter',  label: 'Newsletter',        desc: 'Weekly NAMSSN digest' },
  { to: '/community',   label: 'Community',         desc: 'Articles & alumni showcase' },
  { to: '/merchandise', label: 'Merchandise',       desc: 'Get your official NAMSSN gear' },
  { to: '/research',    label: 'Research',           desc: 'Published papers by our lecturers' },
]

export default function Home() {
  usePageTitle(null, 'NAMSSN UNILAG is the official student association for Mathematical Sciences students at the University of Lagos. Join us for DECAGON, Dean\'s Games, academic resources, and a thriving community of Nigerian maths students.')
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
    <div>

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
              className="math-symbol absolute bottom-0 text-white select-none"
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
            className="hero-anim hero-anim-1 w-24 h-24 object-contain mb-5 drop-shadow-2xl"
            onError={e => { e.currentTarget.style.display = 'none' }}
          />

          <p className="hero-anim hero-anim-2 text-brand-blueLight text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3">
            University of Lagos Chapter
          </p>

          <h1 className="hero-anim hero-anim-3 text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-4 px-2">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-brand-yellow via-brand-orange to-brand-yellow bg-clip-text text-transparent">
              NAMSSN
            </span>
            <br />
            <span className="text-white">UNILAG</span>
          </h1>

          <p className="hero-anim hero-anim-4 text-gray-200 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed px-2">
            National Association of Mathematical Sciences Students of Nigeria.
            Empowering the next generation of mathematical minds at the University of Lagos.
          </p>

          <div className="hero-anim hero-anim-5 flex flex-col sm:flex-row gap-3 justify-center w-full px-6 sm:px-0 sm:w-auto">
            <Link
              to="/about"
              className="bg-brand-orange hover:bg-brand-yellow hover:text-brand-blueDark text-white font-bold px-7 py-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Learn More
            </Link>
            <Link
              to="/events"
              className="border-2 border-white text-white hover:bg-white hover:text-brand-blueDark font-bold px-7 py-3 rounded-full transition-all duration-200"
            >
              See Events
            </Link>
          </div>

          {/* Slide caption */}
          <p className="absolute bottom-20 text-white/60 text-xs sm:text-sm italic">
            {SLIDES[current].caption}
          </p>
        </div>

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

      </section>

      {/* ── STATS BAND ────────────────────────────────────────────────────── */}
      <section className="bg-brand-blue text-white py-10">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center stagger">
          {STATS.map(({ icon: Icon, value, label }) => (
            <div key={label} className="reveal pop flex flex-col items-center gap-2">
              <Icon size={28} className="text-brand-yellow" />
              <span className="text-3xl font-black">{value}</span>
              <span className="text-sm text-blue-200">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── QUICK LINKS ───────────────────────────────────────────────────── */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="reveal text-3xl font-bold text-brand-blueDark dark:text-white text-center mb-2">Explore NAMSSN</h2>
          <p className="reveal text-gray-500 dark:text-gray-400 text-center mb-10">Everything you need in one place</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-5 stagger">
            {QUICK_LINKS.map(({ to, label, desc }) => (
              <Link
                key={to}
                to={to}
                className="reveal group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 hover:border-brand-blue/30 transition-all duration-200 hover:-translate-y-1"
              >
                <h3 className="font-bold text-brand-blueDark dark:text-white group-hover:text-brand-blue text-lg mb-1 transition-colors">
                  {label}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{desc}</p>
                <span className="inline-flex items-center gap-1 text-brand-orange text-sm font-semibold group-hover:gap-2 transition-all">
                  View <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT US ──────────────────────────────────────────────────────── */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="reveal from-left w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-xl bg-brand-blue/10">
              <img
                src="/images/executives/NAMSSN EXCOS - 26/EXCOS.png"
                alt="NAMSSN UNILAG"
                className="w-full h-full object-cover object-center"
                loading="eager"
                decoding="sync"
                onError={e => { e.currentTarget.style.display = 'none' }}
              />
            </div>
            <div className="reveal from-right">
              <span className="inline-block bg-brand-orange/10 text-brand-orange text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
                About Us
              </span>
              <h2 className="text-3xl font-bold text-brand-blueDark dark:text-white mb-4">Who We Are</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                NAMSSN (National Association of Mathematical Sciences Students of Nigeria)
                UNILAG Chapter is the student body representing all mathematical sciences students at the
                University of Lagos, affiliated with the national NAMSSN body across Nigeria.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                From our flagship DECAGON competition to social events and workshops, we are dedicated
                to building the next generation of mathematical leaders who will make an impact in
                Nigeria and beyond.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 bg-brand-blueDark hover:bg-brand-blue text-white font-bold px-6 py-3 rounded-full transition-all duration-200"
              >
                Read More <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY JOIN ──────────────────────────────────────────────────────── */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="reveal text-3xl font-bold text-brand-blueDark dark:text-white text-center mb-2">What NAMSSN Offers You</h2>
          <p className="reveal text-gray-500 dark:text-gray-400 text-center mb-10">More than just a student association</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger">
            {[
              { icon: GraduationCap, title: 'Academic Growth',   desc: 'Access study groups, workshops, and resources to sharpen your mathematical skills.' },
              { icon: Zap,           title: 'Competitions',      desc: 'Represent your department in DECAGON, Dean\'s Games, and other inter-university events.' },
              { icon: Globe,         title: 'Networking',        desc: 'Connect with alumni, industry professionals, and students from across Nigeria.' },
              { icon: Heart,         title: 'Community & Fun',   desc: 'Build lifelong friendships through social events, hangouts, and shared experiences.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="reveal bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 text-center hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                <div className="w-12 h-12 bg-brand-orange/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon size={22} className="text-brand-orange" />
                </div>
                <h3 className="font-bold text-brand-blueDark dark:text-white text-base mb-2">{title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="reveal text-3xl font-bold text-brand-blueDark dark:text-white mb-4">Be Part of Something Bigger</h2>
          <p className="reveal text-gray-600 dark:text-gray-300 mb-8">
            You're already one of us. Participate in competitions, attend workshops,
            and build lifelong friendships with fellow mathematical sciences students.
          </p>
          <Link
            to="/contact"
            className="reveal inline-flex items-center gap-2 bg-brand-blueDark hover:bg-brand-blue text-white font-bold px-8 py-4 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Contact Us <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}
