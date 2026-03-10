import { useState } from 'react'
import { ShoppingBag, ShoppingCart, MessageCircle } from 'lucide-react'
import { merchandise } from '../data/merchandise'

function MerchCard({ item }) {
  const [imgFailed, setImgFailed] = useState(false)

  const orderMessage = `Hi NAMSSN UNILAG! I'm interested in ordering:\n*${item.name}* — ${item.price}${item.sizes?.length ? '\nSize: ___' : ''}\n\nPlease let me know availability. Thanks!`
  const whatsappLink = `https://wa.me/2349082595866?text=${encodeURIComponent(orderMessage)}`
  const mailLink    = `mailto:namsnunilag9@gmail.com?subject=Merchandise Order — ${item.name}&body=${encodeURIComponent(orderMessage)}`

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border transition-all duration-200 flex flex-col ${
      item.available
        ? 'border-gray-100 dark:border-gray-700 hover:shadow-md hover:-translate-y-1'
        : 'border-gray-100 dark:border-gray-700 opacity-60'
    }`}>
      {/* Image */}
      <div className="h-48 sm:h-72 bg-brand-blue/10 overflow-hidden relative">
        {!imgFailed && item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag size={48} className="text-brand-blue/20" />
          </div>
        )}
        {!item.available && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="bg-gray-700 text-white text-xs font-bold px-3 py-1 rounded-full">Sold Out</span>
          </div>
        )}
        {item.category && (
          <span className="absolute top-3 left-3 bg-white/90 text-brand-blueDark text-xs font-semibold px-2.5 py-1 rounded-full">
            {item.category}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3 sm:p-5 flex flex-col flex-grow">
        <h3 className="font-bold text-brand-blueDark dark:text-white text-sm sm:text-lg mb-1 leading-snug">{item.name}</h3>
        <p className="text-brand-orange font-black text-xl mb-2">{item.price}</p>
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed flex-grow">{item.description}</p>

        {item.sizes?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {item.sizes.map(s => (
              <span key={s} className="text-xs border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-md font-medium">
                {s}
              </span>
            ))}
          </div>
        )}

        {item.available && (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2 rounded-xl transition-colors"
          >
            <MessageCircle size={14} /> Order Now
          </a>
        )}
      </div>
    </div>
  )
}

export default function Merchandise() {
  const [filter, setFilter] = useState('all')

  const categories = ['all', ...new Set(merchandise.map(m => m.category).filter(Boolean))]

  const filtered = filter === 'all'
    ? merchandise
    : merchandise.filter(m => m.category === filter)

  return (
    <div className="pt-16">

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-blueDark to-brand-blue text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-black mb-4">Merchandise</h1>
        <p className="text-blue-100 max-w-xl mx-auto">
          Rep NAMSSN UNILAG in style. Order your official branded gear today.
        </p>
      </section>

      {/* How to order banner */}
      <div className="bg-brand-orange/10 border-b border-brand-orange/20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center gap-2 text-sm text-brand-blueDark dark:text-gray-200">
          <ShoppingCart size={16} className="text-brand-orange shrink-0" />
          <span><strong>How to order:</strong> Click WhatsApp or Email on any item, and we'll respond with availability and payment details.</span>
        </div>
      </div>

      {/* Content */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900 min-h-[60vh]">
        <div className="max-w-6xl mx-auto px-4">

          {/* Category filter */}
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors capitalize ${
                    filter === cat
                      ? 'bg-brand-orange text-white'
                      : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-brand-orange'
                  }`}
                >
                  {cat === 'all' ? 'All Items' : cat}
                </button>
              ))}
            </div>
          )}

          {merchandise.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 rounded-full bg-brand-blue/10 flex items-center justify-center mb-4">
                <ShoppingBag size={36} className="text-brand-blue/40" />
              </div>
              <h3 className="text-xl font-bold text-gray-400 mb-2">Coming Soon</h3>
              <p className="text-gray-400 text-sm max-w-sm">
                NAMSSN merchandise is on the way. Check back soon to get your official gear!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filtered.map(item => (
                <MerchCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
