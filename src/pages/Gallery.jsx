import { ExternalLink, Images } from 'lucide-react'
import usePageTitle from '../hooks/usePageTitle'

// ── Albums ────────────────────────────────────────────────────────────────────
// To add a new album: copy one object, fill in the fields, set googleLink.
// Leave googleLink as '' to show "Coming Soon" instead of a button.

const albums = [
  {
    id: 1,
    title: "Dean's Games 2026",
    date: 'June 2026',
    thumbnail: '/images/gallery/events/deans.jpg',
    googleLink: '',
  },
  {
    id: 2,
    title: 'Decagon 5.0 — Grand Finale',
    date: 'June 2026',
    thumbnail: '/images/gallery/events/dec.jpg',
    googleLink: '',
  },
  {
    id: 3,
    title: 'Decagon 5.0 — Press Conference',
    date: 'April 2026',
    thumbnail: '/images/gallery/press-conference/pc01.jpg',
    googleLink: '',
  },
  {
    id: 4,
    title: 'HOD Games',
    date: '2025/2026',
    thumbnail: '/images/gallery/hod-games/HOD.jpg',
    googleLink: '',
  },
  {
    id: 5,
    title: 'Executives 2025/2026',
    date: '2025',
    thumbnail: '/images/gallery/executives/excos.jpg',
    googleLink: '',
  },
  {
    id: 6,
    title: 'Freshers Orientation',
    date: '2025',
    thumbnail: '/images/gallery/freshers/fo1.jpg',
    googleLink: '',
  },
  {
    id: 7,
    title: 'Symposium',
    date: '2025',
    thumbnail: '/images/gallery/events/SYM.jpg',
    googleLink: '',
  },
  {
    id: 8,
    title: 'Sign Out',
    date: '2025',
    thumbnail: '/images/gallery/events/signout.jpg',
    googleLink: '',
  },
]

function AlbumCard({ album }) {
  const [imgFailed, setImgFailed] = useState(false)

  return (
    <div className="group bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-200">
      {/* Thumbnail */}
      <div className="aspect-video w-full overflow-hidden bg-white/5 relative">
        {!imgFailed ? (
          <img
            src={album.thumbnail}
            alt={album.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Images size={32} className="text-white/20" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-5 py-4 flex flex-col gap-3">
        <div>
          <p className="text-xs text-gray-500">{album.date}</p>
          <h3 className="text-sm font-black text-white mt-0.5">{album.title}</h3>
        </div>

        {album.googleLink ? (
          <a
            href={album.googleLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-brand-orange hover:bg-orange-500 text-white text-xs font-bold transition-colors"
          >
            <ExternalLink size={13} />
            View Album
          </a>
        ) : (
          <div className="flex items-center justify-center w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-600 text-xs font-bold cursor-not-allowed">
            Coming Soon
          </div>
        )}
      </div>
    </div>
  )
}

import { useState } from 'react'

export default function Gallery() {
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
          <p className="text-gray-400 text-sm">Relive the memories from our events, competitions, and activities.</p>
        </div>
      </section>

      {/* Albums grid */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {albums.map(album => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
        <p className="text-center text-gray-600 text-xs mt-12">
          More albums coming soon · Follow us on Instagram @namssn_unilag
        </p>
      </section>

    </div>
  )
}
