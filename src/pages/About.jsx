import { useState } from 'react'
import { Target, Eye, Heart, Award } from 'lucide-react'

function AboutImage() {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <div className="w-full h-full min-h-[320px] bg-gradient-to-br from-brand-blue to-brand-blueDark flex items-center justify-center rounded-2xl">
        <span className="text-white/30 text-8xl font-black">N</span>
      </div>
    )
  }
  return (
    <img
      src="/images/events/excos.jpg"
      alt="NAMSSN UNILAG Executive team"
      className="w-full h-full object-cover rounded-2xl shadow-xl"
      onError={() => setFailed(true)}
    />
  )
}

const values = [
  {
    icon: Target,
    title: 'Mission',
    desc: 'To promote academic excellence, professional development, and unity among mathematical sciences students at the University of Lagos.',
  },
  {
    icon: Eye,
    title: 'Vision',
    desc: 'To be the leading student association shaping the future of mathematics and its applications in Nigeria and beyond.',
  },
  {
    icon: Heart,
    title: 'Values',
    desc: 'Excellence, integrity, collaboration, innovation, and service to the mathematical sciences community.',
  },
  {
    icon: Award,
    title: 'Impact',
    desc: 'Organising competitions, workshops, and social events that prepare our members for successful careers in STEM fields.',
  },
]

export default function About() {
  return (
    <div className="pt-16">

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-blueDark to-brand-blue text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-black mb-4">About NAMSSN UNILAG</h1>
        <p className="text-blue-100 max-w-2xl mx-auto text-lg">
          The National Association of Mathematical Sciences Students of Nigerian Universities —
          University of Lagos Chapter
        </p>
      </section>

      {/* About section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="h-80 md:h-[420px]">
            <AboutImage />
          </div>
          <div>
            <span className="inline-block bg-brand-orange/10 text-brand-orange text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
              Our Story
            </span>
            <h2 className="text-3xl font-bold text-brand-blueDark mb-4">Who We Are</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              NAMSSN (National Association of Mathematical Sciences Students of Nigerian Universities)
              UNILAG Chapter is the student body representing all mathematical sciences students at the
              University of Lagos. We are affiliated with the national body of NAMSSN, which spans
              universities across Nigeria.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our chapter brings together students from the Department of Mathematics to foster
              academic growth, professional networking, and a sense of community. Through our
              events, competitions, and welfare initiatives, we strive to create an environment
              where every student can thrive.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-brand-blueDark text-center mb-2">What Drives Us</h2>
          <p className="text-gray-500 text-center mb-10">Our mission, vision, and core values</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                <div className="w-12 h-12 bg-brand-blue/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon size={22} className="text-brand-blue" />
                </div>
                <h3 className="font-bold text-brand-blueDark text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Department info */}
      <section className="py-16 bg-brand-blueDark text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">The Mathematics Department</h2>
          <p className="text-blue-100 leading-relaxed mb-6 max-w-3xl mx-auto">
            The Department of Mathematics at the University of Lagos is one of the oldest and most
            respected mathematics departments in Nigeria. It offers undergraduate and postgraduate
            programmes in Mathematics, Statistics, and related fields, producing graduates who
            excel in academia, industry, and public service.
          </p>
          <a
            href="https://unilag.edu.ng"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-brand-orange hover:bg-brand-yellow hover:text-brand-blueDark text-white font-bold px-6 py-3 rounded-full transition-all duration-200"
          >
            Visit UNILAG Website
          </a>
        </div>
      </section>
    </div>
  )
}
