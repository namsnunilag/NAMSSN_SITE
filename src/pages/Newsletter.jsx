import { useState } from 'react'
import { X, Newspaper, ChevronLeft, ChevronRight } from 'lucide-react'
import { newsletters } from '../data/newsletters'

// Lightbox for a single newsletter — flips through its pages (images)
function Lightbox({ newsletter, onClose }) {
  const [page, setPage] = useState(0)
  const pages = newsletter.images
  const total = pages.length
  const isMulti = total > 1

  const prev = () => setPage(p => (p - 1 + total) % total)
  const next = () => setPage(p => (p + 1) % total)

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white/70 hover:text-white p-1"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        {/* Image */}
        <div className="flex items-center justify-center max-h-[80vh] overflow-hidden rounded-xl bg-black">
          <img
            src={pages[page]}
            alt={`${newsletter.title} — ${isMulti ? (page === 0 ? 'Front' : 'Back') : 'Page 1'}`}
            className="max-h-[80vh] max-w-full object-contain"
          />
        </div>

        {/* Caption + page indicator */}
        <div className="mt-3 text-center text-white">
          <p className="font-semibold">{newsletter.title}</p>
          <p className="text-white/60 text-sm">
            {newsletter.week} · {newsletter.date}
            {isMulti && (
              <span className="ml-2 text-brand-orange font-semibold">
                {page === 0 ? '(Front)' : '(Back)'}
              </span>
            )}
          </p>
        </div>

        {/* Page navigation — only shown when front + back exist */}
        {isMulti && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-brand-orange text-white p-2 rounded-full transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-brand-orange text-white p-2 rounded-full transition-colors"
              aria-label="Next page"
            >
              <ChevronRight size={20} />
            </button>

            {/* Dot indicators */}
            <div className="flex justify-center gap-2 mt-3">
              {pages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`h-2 rounded-full transition-all duration-200 ${
                    i === page ? 'w-6 bg-brand-orange' : 'w-2 bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={i === 0 ? 'Front' : 'Back'}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function Newsletter() {
  const [open, setOpen] = useState(null) // the newsletter object currently open

  return (
    <div className="pt-16">

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-blueDark to-brand-blue text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-black mb-4">Newsletter</h1>
        <p className="text-blue-100 max-w-xl mx-auto">
          Stay in the loop with NAMSSN UNILAG's weekly digest — announcements, events, highlights, and more.
        </p>
      </section>

      {/* Grid */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">

          {newsletters.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 rounded-full bg-brand-blue/10 flex items-center justify-center mb-4">
                <Newspaper size={36} className="text-brand-blue/40" />
              </div>
              <h3 className="text-xl font-bold text-gray-400 mb-2">No newsletters yet</h3>
              <p className="text-gray-400 text-sm max-w-sm">
                Check back soon — newsletters will appear here as they are published each week.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsletters.map((item) => {
                const isMulti = item.images.length > 1
                return (
                  <button
                    key={item.id}
                    onClick={() => setOpen(item)}
                    className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 hover:border-brand-blue/20 transition-all duration-200 hover:-translate-y-1 text-left"
                  >
                    {/* Thumbnail — always the front image */}
                    <div className="h-64 bg-brand-blue/10 overflow-hidden relative">
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={e => { e.currentTarget.style.display = 'none' }}
                      />
                      {/* Front + back badge */}
                      {isMulti && (
                        <span className="absolute top-3 right-3 bg-brand-orange text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                          Front & Back
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-5">
                      <span className="text-xs font-semibold text-brand-orange uppercase tracking-wider">
                        {item.week}
                      </span>
                      <h3 className="font-bold text-brand-blueDark dark:text-white mt-1 mb-1 group-hover:text-brand-blue transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-gray-400 dark:text-gray-500 text-xs mb-2">{item.date}</p>
                      {item.description && (
                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed line-clamp-2">{item.description}</p>
                      )}
                      <p className="mt-3 text-brand-orange text-sm font-semibold group-hover:underline">
                        {isMulti ? 'View Full Issue (2 pages) →' : 'View Full Issue →'}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {open && (
        <Lightbox newsletter={open} onClose={() => setOpen(null)} />
      )}
    </div>
  )
}
