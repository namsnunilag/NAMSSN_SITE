import { useEffect, useState } from 'react'
import { Images, X } from 'lucide-react'
import usePageTitle from '../hooks/usePageTitle'

const photos = [
  { src: '/images/gallery/events/crowd.jpg', title: 'Event Highlights', category: 'Events & Activities' },
  { src: '/images/gallery/events/deans.jpg', title: "Dean's Games", category: 'Events & Activities' },
  { src: '/images/gallery/events/dec.jpg', title: 'Decagon 5.0', category: 'Events & Activities' },
  { src: '/images/gallery/events/fo.jpg', title: "Freshers' Orientation", category: 'Events & Activities' },
  { src: '/images/gallery/events/ind.jpg', title: 'Inauguration', category: 'Events & Activities' },
  { src: '/images/gallery/events/lasu.jpg', title: 'LASU Visit', category: 'Events & Activities' },
  { src: '/images/gallery/events/signout.jpg', title: 'Sign Out', category: 'Events & Activities' },
  { src: '/images/gallery/events/SYM.jpg', title: 'Symposium', category: 'Events & Activities' },
  { src: '/images/gallery/events/synergist.jpg', title: 'Synergist', category: 'Events & Activities' },
  { src: '/images/gallery/events/tem.png', title: 'TEM', category: 'Events & Activities' },
  { src: '/images/gallery/events/WID.png', title: 'WID', category: 'Events & Activities' },
  { src: '/images/gallery/hod-games/HOD.jpg', title: 'HOD Games', category: 'HOD Games' },
  ...Array.from({ length: 18 }, (_, index) => {
    const number = String(index + 2).padStart(2, '0')
    return {
      src: `/images/gallery/press-conference/pc${number}.jpg`,
      title: `Press Conference ${index + 1}`,
      category: 'Press Conference',
    }
  }),
]

const categories = ['All Photos', 'Events & Activities', 'HOD Games', 'Press Conference']

export default function Gallery() {
  const [category, setCategory] = useState('All Photos')
  const [activePhoto, setActivePhoto] = useState(null)
  const visiblePhotos = category === 'All Photos'
    ? photos
    : photos.filter(photo => photo.category === category)

  useEffect(() => {
    if (!activePhoto) return
    const closeOnEscape = event => {
      if (event.key === 'Escape') setActivePhoto(null)
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [activePhoto])

  usePageTitle('Gallery — NAMSSN UNILAG')

  return (
    <div className="min-h-screen pt-16" style={{ background: '#0D1B2A', color: '#fff' }}>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-16 pb-12 text-center">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(#00CCFF 1px,transparent 1px),linear-gradient(90deg,#00CCFF 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="relative max-w-xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-orange mb-3">NAMSSN UNILAG</p>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">Photo Gallery</h1>
          <p className="text-gray-400 text-sm">Photos from completed NAMSSN events, competitions, and activities.</p>
        </div>
      </section>

      {/* Completed-event archive */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filter gallery photos">
          {categories.map(option => (
            <button
              key={option}
              type="button"
              onClick={() => setCategory(option)}
              aria-pressed={category === option}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                category === option
                  ? 'bg-brand-orange text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <p className="text-gray-400 text-sm mb-5">{visiblePhotos.length} photos</p>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
          {visiblePhotos.map((photo, index) => (
            <button
              key={photo.src}
              type="button"
              onClick={() => setActivePhoto(photo)}
              className="group text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-orange rounded-lg"
              aria-label={`View ${photo.title}`}
            >
              <div className="aspect-[4/3] overflow-hidden rounded-lg bg-white/5">
                <img
                  src={photo.src}
                  alt={photo.title}
                  loading={index < 8 ? 'eager' : 'lazy'}
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <span className="block text-sm font-semibold text-white mt-2">{photo.title}</span>
              <span className="block text-xs text-gray-400 mt-0.5">{photo.category}</span>
            </button>
          ))}
        </div>
      </section>

      {activePhoto && (
        <div
          className="fixed inset-0 z-[70] bg-black/90 p-4 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label={activePhoto.title}
          onClick={event => {
            if (event.target === event.currentTarget) setActivePhoto(null)
          }}
        >
          <button
            type="button"
            onClick={() => setActivePhoto(null)}
            className="absolute top-4 right-4 p-2 text-white hover:text-brand-orange"
            aria-label="Close photo"
          >
            <X size={24} />
          </button>
          <figure className="max-w-6xl max-h-full">
            <img
              src={activePhoto.src}
              alt={activePhoto.title}
              className="max-h-[82vh] max-w-full object-contain mx-auto"
            />
            <figcaption className="text-center text-white text-sm mt-3">{activePhoto.title}</figcaption>
          </figure>
        </div>
      )}

    </div>
  )
}
