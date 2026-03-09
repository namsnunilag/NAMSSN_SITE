import { useState } from 'react'
import { BookOpen, ArrowRight, X, ExternalLink } from 'lucide-react'
import { articles } from '../data/community'

function ArticleCard({ article, onClick }) {
  return (
    <button
      onClick={() => onClick(article)}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 hover:border-brand-blue/20 transition-all duration-200 hover:-translate-y-1 text-left flex flex-col"
    >
      {article.image && (
        <div className="h-48 bg-brand-blue/10 overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={e => { e.currentTarget.style.display = 'none' }}
          />
        </div>
      )}
      <div className="p-5 flex flex-col flex-grow">
        {article.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {article.tags.map(t => (
              <span key={t} className="text-xs bg-brand-orange/10 text-brand-orange font-semibold px-2 py-0.5 rounded-full">
                {t}
              </span>
            ))}
          </div>
        )}
        <h3 className="font-bold text-brand-blueDark text-lg group-hover:text-brand-blue transition-colors mb-1 leading-snug">
          {article.title}
        </h3>
        <p className="text-xs text-gray-400 mb-3">By {article.author} · {article.date}</p>
        <p className="text-gray-500 text-sm leading-relaxed flex-grow">{article.excerpt}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-brand-orange text-sm font-semibold group-hover:gap-2 transition-all">
          Read More <ArrowRight size={13} />
        </span>
      </div>
    </button>
  )
}

function ArticleModal({ article, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full my-8 overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {article.image && (
          <div className="h-64 overflow-hidden">
            <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="p-8">
          {article.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {article.tags.map(t => (
                <span key={t} className="text-xs bg-brand-orange/10 text-brand-orange font-semibold px-2 py-0.5 rounded-full">
                  {t}
                </span>
              ))}
            </div>
          )}
          <h2 className="text-2xl font-black text-brand-blueDark mb-2">{article.title}</h2>
          <p className="text-sm text-gray-400 mb-6">By {article.author} · {article.date}</p>
          <div className="text-gray-600 leading-relaxed whitespace-pre-line text-sm">{article.content}</div>

          {article.references?.length > 0 && (
            <div className="mt-8 border-t border-gray-100 pt-6">
              <h4 className="text-sm font-bold text-brand-blueDark mb-3">Further Reading & References</h4>
              <ul className="space-y-2">
                {article.references.map((ref, i) => (
                  <li key={i}>
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-brand-orange hover:text-brand-blue text-sm font-medium transition-colors hover:underline"
                    >
                      <ExternalLink size={13} className="shrink-0" />
                      {ref.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={onClose}
            className="mt-8 inline-flex items-center gap-2 bg-brand-blueDark hover:bg-brand-blue text-white font-semibold px-5 py-2.5 rounded-full transition-colors text-sm"
          >
            <X size={14} /> Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Community() {
  const [openArticle, setOpenArticle] = useState(null)

  return (
    <div className="pt-16">

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-blueDark to-brand-blue text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-black mb-4">Community</h1>
        <p className="text-blue-100 max-w-xl mx-auto">
          Read articles and write-ups from NAMSSN members. Stay connected with the NAMSSN family.
        </p>
      </section>

      <section className="py-12 bg-gray-50 min-h-[60vh]">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-brand-blueDark mb-6">Articles & Blog</h2>

          {articles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 rounded-full bg-brand-blue/10 flex items-center justify-center mb-4">
                <BookOpen size={36} className="text-brand-blue/40" />
              </div>
              <p className="text-gray-400 text-sm max-w-sm">
                No articles yet. Members can submit articles to be featured here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map(a => (
                <ArticleCard key={a.id} article={a} onClick={setOpenArticle} />
              ))}
            </div>
          )}
        </div>
      </section>

      {openArticle && (
        <ArticleModal article={openArticle} onClose={() => setOpenArticle(null)} />
      )}
    </div>
  )
}
