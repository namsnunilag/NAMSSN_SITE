import { useState } from 'react'
import { Mail, MapPin, Phone, Send, Camera, BriefcaseBusiness } from 'lucide-react'
import usePageTitle from '../hooks/usePageTitle'

const socials = [
  // ── Replace '#' hrefs with your actual social media URLs ──────────────
  { icon: Send,              label: 'Twitter/X', href: 'https://x.com/namssn_unilag',  handle: '@namssn_unilag' },
  { icon: Camera,            label: 'Instagram', href: 'https://www.instagram.com/namssn_unilag/',  handle: '@namssn_unilag' },
  { icon: BriefcaseBusiness, label: 'LinkedIn',  href: 'https://www.linkedin.com/in/namssn-unilag-chapter-a18b5a281/',  handle: 'NAMSSN UNILAG' },
]

const contactInfo = [
  {
    icon: MapPin,
    label: 'Address',
    value: 'Department of Mathematics, University of Lagos, Akoka, Lagos State, Nigeria',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'namsnunilag9@gmail.com',
    href: 'mailto:namsnunilag9@gmail.com',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+2349034495638',
    href: 'tel:+2349034495638',
  },
]

export default function Contact() {
  usePageTitle('Contact Us', 'Get in touch with NAMSSN UNILAG via email, WhatsApp, or social media. Reach the mathematical sciences student association at the University of Lagos.')
  const [form,      setForm]      = useState({ name: '', email: '', subject: '', message: '' })
  const [emailReady, setEmailReady] = useState(false)
  const [error,     setError]     = useState('')

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setEmailReady(false)

    if (!form.name || !form.email || !form.message) {
      setError('Please fill in all required fields.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Please enter a valid email address.')
      return
    }

    const subject = form.subject || `Message from ${form.name}`
    const body = `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
    setEmailReady(true)
    window.location.href = `mailto:namsnunilag9@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <>
      {/* ── PAGE HERO ───────────────────────────────────────────────────── */}
      <section className="bg-brand-blueDark pt-12 pb-16">
        <div className="section-container text-center">
          <p className="hero-anim hero-anim-1 text-brand-orange font-semibold text-sm uppercase tracking-widest mb-3">
            Get In Touch
          </p>
          <h1 className="hero-anim hero-anim-2 text-4xl md:text-5xl font-display font-black text-white mb-4">
            Contact Us
          </h1>
          <p className="hero-anim hero-anim-3 text-blue-200 text-lg max-w-2xl mx-auto">
            Have questions about NAMSSN UNILAG? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* ── MAIN SECTION ────────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="section-container">
          <div className="grid lg:grid-cols-3 gap-12">

            {/* ── CONTACT FORM ────────────────────────────────────────────── */}
            <div className="reveal from-left lg:col-span-2">
              <div className="card p-8 md:p-10">
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">
                  Send Us a Message
                </h2>

                {
                  <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Your full name"
                          required
                          className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-4 py-3 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          required
                          className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-4 py-3 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        Subject
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        placeholder="What is this about?"
                        className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-4 py-3 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="message"
                        rows={6}
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Write your message here…"
                        required
                        className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-4 py-3 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition resize-none"
                      />
                    </div>

                    {error && (
                      <p className="text-red-500 text-sm">{error}</p>
                    )}
                    {emailReady && (
                      <p className="text-sm text-gray-600 dark:text-gray-300" role="status">
                        Your email app should open with the message ready to send. If it doesn't, email us directly at namsnunilag9@gmail.com.
                      </p>
                    )}

                    <button
                      type="submit"
                      className="btn-primary w-full justify-center"
                    >
                      Open Email App <Send size={16} />
                    </button>
                  </form>
                }
              </div>
            </div>

            {/* ── CONTACT INFO SIDEBAR ─────────────────────────────────── */}
            <div className="reveal from-right space-y-6">
              {/* Info cards */}
              {contactInfo.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="card p-6 flex gap-4 items-start">
                  <div className="h-10 w-10 rounded-xl bg-brand-blue/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon size={20} className="text-brand-blue" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">{label}</p>
                    {href ? (
                      <a href={href} className="text-gray-700 dark:text-gray-300 text-sm hover:text-brand-blue transition-colors">
                        {value}
                      </a>
                    ) : (
                      <p className="text-gray-700 dark:text-gray-300 text-sm">{value}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* Social media */}
              <div className="card p-6">
                <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-4">
                  Follow Us
                </h3>
                <div className="space-y-3">
                  {socials.map(({ icon: Icon, label, href, handle }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 group"
                    >
                      <div className="h-9 w-9 rounded-full bg-brand-blue/10 group-hover:bg-brand-blue flex items-center justify-center transition-colors duration-200">
                        <Icon size={16} className="text-brand-blue group-hover:text-white transition-colors duration-200" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{label}</p>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-brand-blue transition-colors">
                          {handle}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GOOGLE MAPS ─────────────────────────────────────────────────── */}
      {/* Replace the src with your actual embedded Google Maps URL for UNILAG */}
      <section className="h-80 bg-gray-200 dark:bg-gray-700">
        <iframe
          title="UNILAG Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.2!2d3.3964!3d6.5158!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8c5e4e3f7d71%3A0x4e6adf58dc52b9e0!2sUniversity%20of%20Lagos!5e0!3m2!1sen!2sng!4v1"
          className="w-full h-full border-0 grayscale"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </>
  )
}
