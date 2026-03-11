import { useEffect } from 'react'

const DEFAULT_TITLE = 'NAMSSN UNILAG | Mathematical Sciences Students Association'
const DEFAULT_DESC  = 'Official website of NAMSSN University of Lagos Chapter — empowering mathematical sciences students through academics, competitions, networking, and community.'

export default function usePageTitle(title, description) {
  useEffect(() => {
    document.title = title ? `${title} | NAMSSN UNILAG` : DEFAULT_TITLE

    const descTag = document.querySelector('meta[name="description"]')
    if (descTag) descTag.setAttribute('content', description || DEFAULT_DESC)

    return () => {
      document.title = DEFAULT_TITLE
      if (descTag) descTag.setAttribute('content', DEFAULT_DESC)
    }
  }, [title, description])
}
