import { useEffect } from 'react'

const SITE        = 'https://namssn-unilag.vercel.app'
const SITE_NAME   = 'NAMSSN UNILAG'
const DEFAULT_TITLE = 'NAMSSN UNILAG | Mathematical Sciences Students Association'
const DEFAULT_DESC  = 'Official website of NAMSSN University of Lagos Chapter — empowering mathematical sciences students through academics, competitions, networking, and community.'
const DEFAULT_IMAGE = `${SITE}/og-image.png`

function setMeta(selector, attr, value) {
  let el = document.querySelector(selector)
  if (el) el.setAttribute(attr, value)
}

export default function usePageTitle(title, description, image) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE
    const desc      = description || DEFAULT_DESC
    const img       = image || DEFAULT_IMAGE
    const url       = `${SITE}${window.location.pathname}`

    // Primary
    document.title = fullTitle
    setMeta('meta[name="description"]',          'content', desc)

    // Open Graph
    setMeta('meta[property="og:title"]',         'content', fullTitle)
    setMeta('meta[property="og:description"]',   'content', desc)
    setMeta('meta[property="og:image"]',         'content', img)
    setMeta('meta[property="og:url"]',           'content', url)

    // Twitter / X
    setMeta('meta[name="twitter:title"]',        'content', fullTitle)
    setMeta('meta[name="twitter:description"]',  'content', desc)
    setMeta('meta[name="twitter:image"]',        'content', img)

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]')
    if (canonical) canonical.setAttribute('href', url)

    return () => {
      document.title = DEFAULT_TITLE
      setMeta('meta[name="description"]',          'content', DEFAULT_DESC)
      setMeta('meta[property="og:title"]',         'content', DEFAULT_TITLE)
      setMeta('meta[property="og:description"]',   'content', DEFAULT_DESC)
      setMeta('meta[property="og:image"]',         'content', DEFAULT_IMAGE)
      setMeta('meta[property="og:url"]',           'content', SITE)
      setMeta('meta[name="twitter:title"]',        'content', DEFAULT_TITLE)
      setMeta('meta[name="twitter:description"]',  'content', DEFAULT_DESC)
      setMeta('meta[name="twitter:image"]',        'content', DEFAULT_IMAGE)
    }
  }, [title, description, image])
}
