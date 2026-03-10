import { useState, useCallback, useEffect } from 'react'
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react'

// ── Gallery photos ────────────────────────────────────────────────────────
// Add your photos to public/images/gallery/ and list them here
const photos = [
  { src: '/images/gallery/exco.jpg',      caption: 'Executives',            category: 'Executives' },
  { src: '/images/gallery/excos.jpg',     caption: 'Executives',            category: 'Executives' },
  { src: '/images/gallery/pres.jpg',      caption: 'President',             category: 'Executives' },
  { src: '/images/gallery/HOD.jpg',       caption: 'HOD Games',             category: 'Events'     },
  { src: '/images/gallery/deans.jpg',     caption: "Dean's Games",          category: 'Events'     },
  { src: '/images/gallery/dec.jpg',       caption: 'DECAGON',               category: 'Events'     },
  { src: '/images/gallery/SYM.jpg',       caption: 'Symposium',             category: 'Events'     },
  { src: '/images/gallery/ind.jpg',       caption: 'Independence Day',      category: 'Events'     },
  { src: '/images/gallery/signout.jpg',   caption: 'Sign Out',              category: 'Events'     },
  { src: '/images/gallery/synergist.jpg', caption: 'Synergist',             category: 'Events'     },
  { src: '/images/gallery/lasu.jpg',      caption: 'LASU',                  category: 'Events'     },
  { src: '/images/gallery/all.jpg',       caption: 'Group Photo',           category: 'Events'     },
  { src: '/images/gallery/crowd.jpg',     caption: 'Event',                 category: 'Events'     },
  { src: '/images/gallery/fo.jpg',        caption: 'Event',                 category: 'Events'     },
  { src: '/images/gallery/WID.png',       caption: 'Event',                 category: 'Events'     },
  { src: '/images/gallery/tem.png',       caption: 'Event',                 category: 'Events'     },
]

const CATEGORIES = ['All', ...Array.from(new Set(photos.map(p => p.category)))]

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

      {/* Overlay */}
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
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft')  onPrev()
      if (e.key === 'ArrowRight') onNext()
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
  const [activeCategory, setActiveCategory] = useState('All')
  const [lightboxIdx, setLightboxIdx]       = useState(null)

  const filtered = activeCategory === 'All'
    ? photos
    : photos.filter(p => p.category === activeCategory)

  const openLightbox  = useCallback((idx) => setLightboxIdx(idx), [])
  const closeLightbox = useCallback(() => setLightboxIdx(null), [])
  const prevPhoto     = useCallback(() => setLightboxIdx(i => (i - 1 + filtered.length) % filtered.length), [filtered])
  const nextPhoto     = useCallback(() => setLightboxIdx(i => (i + 1) % filtered.length), [filtered])

  return (
    <div className="pt-16">

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-blueDark to-brand-blue text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-black mb-4">Photo Gallery</h1>
        <p className="text-blue-100 max-w-xl mx-auto">
          Relive the memories from NAMSSN UNILAG's events, competitions, and activities.
        </p>
      </section>

      {/* Filter */}
      <div className="sticky top-16 z-30 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
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
          {filtered.length === 0 ? (
            <p className="text-gray-400 italic text-center py-20">No photos in this category yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((photo, i) => (
                <GalleryTile key={photo.src} photo={photo} onClick={() => openLightbox(i)} />
              ))}
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
          photo={filtered[lightboxIdx]}
          onClose={closeLightbox}
          onPrev={prevPhoto}
          onNext={nextPhoto}
        />
      )}
    </div>
  )
}
