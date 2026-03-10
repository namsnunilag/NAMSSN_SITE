import { useState, useCallback, useEffect } from 'react'
import { X, ZoomIn, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'

// ── "See More" links (Google Photos albums) ───────────────────────────────────
// Fill in each album URL when ready. Leave as '' to hide the button.
const SEE_MORE_LINKS = {
  'Freshers Orientation': '',   // e.g. 'https://photos.app.goo.gl/...'
  'HOD Games':            '',
  'Executives':           '',
  'Events':               '',
}

// ── Gallery photos ────────────────────────────────────────────────────────────
// Drop images into the matching folder under public/images/gallery/<category-folder>/
// Executives  → public/images/gallery/executives/
// Events      → public/images/gallery/events/
// HOD Games   → public/images/gallery/hod-games/
// Freshers    → public/images/gallery/freshers/

const photos = [
  // ── Executives ──────────────────────────────────────────────────────────────
  { src: '/images/gallery/executives/exco.jpg',      caption: 'Executives',             category: 'Executives' },
  { src: '/images/gallery/executives/excos.jpg',     caption: 'Executives',             category: 'Executives' },
  { src: '/images/gallery/executives/president.jpg', caption: 'President',              category: 'Executives' },
  { src: '/images/gallery/executives/vp.jpg',        caption: 'Vice President',         category: 'Executives' },
  { src: '/images/gallery/executives/gs.jpg',        caption: 'General Secretary',      category: 'Executives' },
  { src: '/images/gallery/executives/ags.jpg',       caption: 'Asst. General Secretary',category: 'Executives' },
  { src: '/images/gallery/executives/treasurer.jpg', caption: 'Treasurer',              category: 'Executives' },
  { src: '/images/gallery/executives/fin.jpg',       caption: 'Financial Secretary',    category: 'Executives' },
  { src: '/images/gallery/executives/pro.jpg',       caption: 'PRO',                    category: 'Executives' },
  { src: '/images/gallery/executives/social.jpg',    caption: 'Social Director',        category: 'Executives' },
  { src: '/images/gallery/executives/sport.jpg',     caption: 'Sports Director',        category: 'Executives' },
  { src: '/images/gallery/executives/academic.jpg',  caption: 'Academic Director',      category: 'Executives' },
  { src: '/images/gallery/executives/welfare.jpg',   caption: 'Welfare Director',       category: 'Executives' },
  { src: '/images/gallery/executives/library.jpg',   caption: 'Library Director',       category: 'Executives' },

  // ── Events ──────────────────────────────────────────────────────────────────
  { src: '/images/gallery/events/deans.jpg',      caption: "Dean's Games", category: 'Events' },
  { src: '/images/gallery/events/dec.jpg',        caption: 'DECAGON',      category: 'Events' },
  { src: '/images/gallery/events/SYM.jpg',        caption: 'Symposium',    category: 'Events' },
  { src: '/images/gallery/events/ind.jpg',        caption: 'Independence Day', category: 'Events' },
  { src: '/images/gallery/events/signout.jpg',    caption: 'Sign Out',     category: 'Events' },
  { src: '/images/gallery/events/synergist.jpg',  caption: 'Synergist',    category: 'Events' },
  { src: '/images/gallery/events/lasu.jpg',       caption: 'LASU',         category: 'Events' },
  { src: '/images/gallery/events/crowd.jpg',      caption: 'Event',        category: 'Events' },
  { src: '/images/gallery/events/fo.jpg',         caption: 'Event',        category: 'Events' },
  { src: '/images/gallery/events/WID.png',        caption: 'Event',        category: 'Events' },
  { src: '/images/gallery/events/tem.png',        caption: 'Event',        category: 'Events' },

  // ── HOD Games ───────────────────────────────────────────────────────────────
  { src: '/images/gallery/hod-games/HOD.jpg',     caption: 'HOD Games',    category: 'HOD Games' },
  // Add more: hod-games/hg2.jpg, hg3.jpg …

  // ── Freshers Orientation ─────────────────────────────────────────────────────
  // Add up to 8: freshers/fo1.jpg, fo2.jpg … fo8.jpg
]

const CATEGORY_ORDER = ['Freshers Orientation', 'HOD Games', 'Executives', 'Events']
const CATEGORIES = CATEGORY_ORDER.filter(
  cat => photos.some(p => p.category === cat)
)

// Max photos shown per category before "See More"
const PREVIEW_LIMIT = 8

function GalleryTile({ photo, onClick }) {
  const [failed, setFailed] = useState(false)

  return (
    <button
      onClick={() => !failed && onClick()}
      className="group relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-brand-blue to-brand-blueDark shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 w-full"
    >
      {!failed ? (
        <img
          src={photo.src}
          alt={photo.caption}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-white/30">
          <span className="text-4xl font-black">∑</span>
          <span className="text-xs">{photo.caption}</span>
        </div>
      )}

      {/* Hover overlay */}
      {!failed && (
        <div className="absolute inset-0 bg-brand-blueDark/0 group-hover:bg-brand-blueDark/50 transition-all duration-200 flex items-center justify-center">
          <ZoomIn size={28} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </div>
      )}
    </button>
  )
}

function Lightbox({ photo, onClose, onPrev, onNext }) {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
    const handler = (e) => {
      if (e.key === 'Escape')      onClose()
      if (e.key === 'ArrowLeft')   onPrev()
      if (e.key === 'ArrowRight')  onNext()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [photo, onClose, onPrev, onNext])

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={(e) => { e.stopPropagation(); onPrev() }}
        className="absolute left-4 text-white bg-black/40 hover:bg-brand-orange p-2 rounded-full transition-colors"
      >
        <ChevronLeft size={24} />
      </button>

      <div
        className="relative max-w-4xl max-h-[90vh] w-full"
        onClick={e => e.stopPropagation()}
      >
        {!failed ? (
          <img
            src={photo.src}
            alt={photo.caption}
            className="w-full h-full max-h-[80vh] object-contain rounded-xl"
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="w-full h-64 flex items-center justify-center text-white/30 text-5xl font-black">
            ∑
          </div>
        )}
        {photo.caption && (
          <p className="text-center text-white/70 text-sm mt-3">{photo.caption}</p>
        )}
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); onNext() }}
        className="absolute right-4 text-white bg-black/40 hover:bg-brand-orange p-2 rounded-full transition-colors"
      >
        <ChevronRight size={24} />
      </button>

      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white bg-black/40 hover:bg-red-500 p-2 rounded-full transition-colors"
      >
        <X size={20} />
      </button>
    </div>
  )
}

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0])
  const [lightboxIdx, setLightboxIdx]       = useState(null)

  const allFiltered = photos.filter(p => p.category === activeCategory)

  // Cap at PREVIEW_LIMIT only if a "See More" link exists for this category
  const seeMoreLink   = SEE_MORE_LINKS[activeCategory] || null
  const displayPhotos = seeMoreLink
    ? allFiltered.slice(0, PREVIEW_LIMIT)
    : allFiltered

  const openLightbox  = useCallback((idx) => setLightboxIdx(idx), [])
  const closeLightbox = useCallback(() => setLightboxIdx(null), [])
  const prevPhoto     = useCallback(() => setLightboxIdx(i => (i - 1 + displayPhotos.length) % displayPhotos.length), [displayPhotos])
  const nextPhoto     = useCallback(() => setLightboxIdx(i => (i + 1) % displayPhotos.length), [displayPhotos])

  return (
    <div className="pt-16">

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-blueDark to-brand-blue text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-black mb-4">Photo Gallery</h1>
        <p className="text-blue-100 max-w-xl mx-auto">
          Relive the memories from NAMSSN UNILAG's events, competitions, and activities.
        </p>
      </section>

      {/* Category filter */}
      <div className="sticky top-16 z-30 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setLightboxIdx(null) }}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-brand-orange text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">

          {/* Section heading */}
          <div className="mb-6">
            <h2 className="text-2xl font-black text-brand-blueDark dark:text-white">{activeCategory}</h2>
            {seeMoreLink && (
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Showing up to {PREVIEW_LIMIT} photos — see the full album below.
              </p>
            )}
          </div>

          {displayPhotos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <span className="text-6xl font-black text-brand-blue/20 mb-4">∑</span>
              <p className="text-gray-400 italic">No photos in this category yet.</p>
              <p className="text-gray-400 text-sm mt-1">Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {displayPhotos.map((photo, i) => (
                <GalleryTile key={photo.src + i} photo={photo} onClick={() => openLightbox(i)} />
              ))}
            </div>
          )}

          {/* See More button */}
          {isCategory && seeMoreLink && (
            <div className="mt-8 flex justify-center">
              <a
                href={seeMoreLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-sm"
              >
                See Full Album
                <ExternalLink size={16} />
              </a>
            </div>
          )}

          <p className="text-center text-gray-400 dark:text-gray-500 text-sm mt-10 italic">
            More photos coming soon — follow us on Instagram @namssn_unilag
          </p>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <Lightbox
          photo={displayPhotos[lightboxIdx]}
          onClose={closeLightbox}
          onPrev={prevPhoto}
          onNext={nextPhoto}
        />
      )}
    </div>
  )
}
