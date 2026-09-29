import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, ShoppingBag, X } from 'lucide-react'
import { useCart } from '../lib/cart'
import { Link } from '../lib/Link'
import { MAIN_LINKS } from '../lib/nav'
import { Wordmark } from './Wordmark'

// Cabeçalho no estilo do Instituto Galo: transparente sobre as fotos da home e verde sólido ao rolar
// ou nas páginas internas. A loja continua acessível, mas o destaque (botão amarelo) é "Apoie a Rasta".
export function Header({ overHero }: { overHero: boolean }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { count, open: openCart } = useCart()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const solid = !overHero || scrolled || menuOpen
  const close = () => setMenuOpen(false)

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[1000] text-white transition-[background-color,box-shadow] duration-300 ${
        solid ? 'bg-[var(--color-black)] shadow-[0_6px_24px_rgba(0,0,0,0.18)]' : 'bg-gradient-to-b from-black/55 to-transparent'
      }`}
    >
      <div className="mx-auto grid h-[84px] max-w-[1280px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 md:px-10">
        <nav aria-label="Navegação principal" className="hidden items-center gap-7 lg:flex">
          {MAIN_LINKS.map((link) => (
            <Link key={link.href} to={link.href} className="menu-label text-white/90 transition-colors hover:text-[var(--color-sun)]">
              {link.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="menu-mobile"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          className="flex h-11 w-11 items-center justify-center lg:hidden"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        <Link to="/" onClick={close} className="justify-self-center">
          <Wordmark logoClassName="h-[56px] md:h-[64px]" hideTextOnMobile />
        </Link>

        <div className="flex items-center justify-end gap-2 md:gap-5">
          <Link to="/produtos" className="menu-label hidden items-center gap-2 text-white/90 hover:text-[var(--color-sun)] md:flex">
            Loja
          </Link>
          <button type="button" onClick={openCart} aria-label={`Abrir sacola (${count} itens)`} className="relative flex h-11 w-11 items-center justify-center">
            <ShoppingBag size={22} />
            {count > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-sun)] px-1 text-[0.7rem] font-bold text-[var(--color-black)]">
                {count}
              </span>
            )}
          </button>
          <Link to="/#apoie" className="btn-sun hidden min-h-11 items-center rounded px-5 text-xs sm:flex">
            Apoie a Rasta
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="menu-mobile"
            aria-label="Menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="h-[calc(100dvh-84px)] overflow-y-auto bg-[var(--color-black)] px-6 pb-10 lg:hidden"
          >
            <ul className="divide-y divide-white/10 border-t border-white/10">
              {[...MAIN_LINKS, { label: 'Loja', href: '/produtos' }].map((link) => (
                <li key={link.href}>
                  <Link to={link.href} onClick={close} className="heading block py-5 text-3xl">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link to="/#apoie" onClick={close} className="btn-sun mt-8 flex min-h-12 items-center justify-center rounded text-sm">
              Apoie a Rasta
            </Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
