import { useEffect } from 'react'
import { MotionConfig } from 'framer-motion'
import { CartDrawer } from './components/CartDrawer'
import { CartProvider } from './components/CartProvider'
import { Footer, WhatsAppFloat } from './components/Footer'
import { Header } from './components/Header'
import { findProduct } from './data/products'
import { useLocation } from './lib/router'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { FaqPage } from './pages/FaqPage'
import { HomePage } from './pages/HomePage'
import { ProductPage } from './pages/ProductPage'
import { ProductsPage } from './pages/ProductsPage'

const SITE_NAME = 'Movimento Rasta do Gama'

function resolveRoute(path: string, search: string) {
  const clean = path.replace(/\/+$/, '') || '/'
  const slug = clean.match(/^\/produtos\/([^/]+)$/)?.[1]
  if (slug) {
    const product = findProduct(slug)
    if (product) return { page: <ProductPage key={product.slug} product={product} />, title: `${product.name} — ${SITE_NAME}` }
  }
  if (clean === '/produtos') return { page: <ProductsPage search={search} />, title: `Produtos — ${SITE_NAME}` }
  if (clean === '/quem-somos') return { page: <AboutPage />, title: `Quem somos — ${SITE_NAME}` }
  if (clean === '/duvidas') return { page: <FaqPage />, title: `Dúvidas — ${SITE_NAME}` }
  if (clean === '/contato') return { page: <ContactPage />, title: `Fale conosco — ${SITE_NAME}` }
  return { page: <HomePage />, title: `${SITE_NAME} — Igualdade, paz e amizade` }
}

function App() {
  const { path, search } = useLocation()
  const { page, title } = resolveRoute(path, search)
  const isHome = (path.replace(/\/+$/, '') || '/') === '/'

  useEffect(() => {
    document.title = title
    const hash = window.location.hash.slice(1)
    if (hash) {
      requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView())
    } else {
      window.scrollTo(0, 0)
    }
  }, [path, search, title])

  return (
    <MotionConfig reducedMotion="user">
      <CartProvider>
        <a className="skip-link" href="#main-content">
          Pular para o conteúdo
        </a>
        <Header overHero={isHome} />
        <main id="main-content" tabIndex={-1} className={isHome ? '' : 'pt-[var(--header-h)]'}>
          {page}
        </main>
        <Footer />
        <WhatsAppFloat />
        <CartDrawer />
      </CartProvider>
    </MotionConfig>
  )
}

export default App
