import { AnimatePresence, motion } from 'framer-motion'
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { useEffect } from 'react'
import { findProduct } from '../data/products'
import { trackEvent } from '../lib/analytics'
import { cartMessage, cartTotal, formatMoney, useCart } from '../lib/cart'
import { whatsappLink } from '../lib/contact'
import { Link } from '../lib/Link'
import { ProductImage } from './ProductCard'

export function CartDrawer() {
  const { items, isOpen, close, setQuantity, remove, count } = useCart()
  const total = cartTotal(items)

  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen, close])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1200]">
          <motion.button
            type="button"
            aria-label="Fechar sacola"
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50"
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Minha sacola"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white text-[var(--color-ink)]"
          >
            <div className="flex items-center justify-between bg-[var(--color-black)] px-5 py-4 text-white">
              <p className="heading text-lg">Minha sacola ({count})</p>
              <button type="button" onClick={close} aria-label="Fechar sacola" className="flex h-11 w-11 items-center justify-center">
                <X size={24} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <ShoppingBag size={48} strokeWidth={1.3} />
                <p className="heading text-xl">Sua sacola está vazia</p>
                <p className="text-[var(--color-text-muted)]">Você pode voltar para a loja e escolher seus produtos da Rasta.</p>
                <Link to="/produtos" onClick={close} className="btn-black mt-2 flex min-h-12 items-center px-8 text-sm">
                  Ver produtos
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-[var(--color-border)] overflow-y-auto px-5">
                  {items.map((item) => {
                    const product = findProduct(item.slug)
                    const options = Object.entries(item.options)
                    return (
                      <li key={item.id} className="flex gap-4 py-5">
                        <ProductImage src={product?.images[0]} alt="" className="h-20 w-20 shrink-0 border border-[var(--color-border)]" />
                        <div className="min-w-0 flex-1">
                          <p className="font-bold leading-tight">{item.name}</p>
                          {options.length > 0 && (
                            <p className="mt-1 text-sm text-[var(--color-text-muted)]">{options.map(([k, v]) => `${k}: ${v}`).join(' · ')}</p>
                          )}
                          <p className="mt-1 text-sm font-bold">{item.price ? `R$ ${item.price}` : 'Preço a consultar'}</p>
                          <div className="mt-2 flex items-center gap-3">
                            <div className="inline-flex items-center rounded border border-[var(--color-border)]">
                              <button type="button" aria-label="Diminuir" onClick={() => setQuantity(item.id, item.quantity - 1)} className="flex h-9 w-9 items-center justify-center">
                                <Minus size={14} />
                              </button>
                              <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                              <button type="button" aria-label="Aumentar" onClick={() => setQuantity(item.id, item.quantity + 1)} className="flex h-9 w-9 items-center justify-center">
                                <Plus size={14} />
                              </button>
                            </div>
                            <button type="button" onClick={() => remove(item.id)} aria-label={`Remover ${item.name}`} className="flex h-9 w-9 items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-sun)]">
                              <Trash2 size={17} />
                            </button>
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
                <div className="border-t border-[var(--color-border)] px-5 py-5">
                  <div className="flex items-center justify-between">
                    <p className="heading">Total</p>
                    <p className="heading text-xl">{total > 0 ? formatMoney(total) : 'A consultar'}</p>
                  </div>
                  {items.some((i) => !i.price) && total > 0 && (
                    <p className="mt-1 text-xs text-[var(--color-text-muted)]">+ itens com preço a consultar no WhatsApp</p>
                  )}
                  <a
                    href={whatsappLink(cartMessage(items))}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => trackEvent('whatsapp_click', { source: 'sacola', items: count })}
                    className="btn-brand mt-4 flex min-h-12 w-full items-center justify-center text-sm"
                  >
                    Finalizar pedido no WhatsApp
                  </a>
                  <p className="mt-3 text-center text-xs text-[var(--color-text-muted)]">
                    Pagamento: Pix · Débito presencial · Crédito presencial (+ taxa da maquininha)
                  </p>
                </div>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}
