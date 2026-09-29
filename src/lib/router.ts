import { useEffect, useState } from 'react'

// Roteador mínimo (sem dependência nova): "/", "/produtos[?c=&q=]", "/produtos/:slug", "/quem-somos", "/duvidas", "/contato".
// Na Vercel, o vercel.json reescreve todas as rotas para o index.html.
export function navigate(to: string) {
  const url = new URL(to, window.location.origin)
  const sameDocument = url.pathname === window.location.pathname && url.search === window.location.search

  window.history.pushState(null, '', url.pathname + url.search + url.hash)
  if (sameDocument && url.hash) {
    document.getElementById(url.hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
    return
  }
  window.dispatchEvent(new PopStateEvent('popstate'))
}

function readLocation() {
  return { path: window.location.pathname, search: window.location.search }
}

export function useLocation() {
  const [location, setLocation] = useState(readLocation)

  useEffect(() => {
    const onChange = () => setLocation(readLocation())
    window.addEventListener('popstate', onChange)
    return () => window.removeEventListener('popstate', onChange)
  }, [])

  return location
}
