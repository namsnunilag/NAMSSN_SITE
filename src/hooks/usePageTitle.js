import { useEffect } from 'react'

export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | NAMSSN UNILAG` : 'NAMSSN UNILAG | Mathematical Sciences Students Association'
    return () => {
      document.title = 'NAMSSN UNILAG | Mathematical Sciences Students Association'
    }
  }, [title])
}
