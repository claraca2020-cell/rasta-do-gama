import { useState } from 'react'
import { Check, ChevronRight, Minus, Plus, ShoppingBag } from 'lucide-react'
import { ProductRail } from '../components/HomeSections'
import { ProductGallery } from '../components/ProductGallery'
import { PRODUCTS, categoryHref, formatPrice, type Product } from '../data/products'
import { trackEvent } from '../lib/analytics'
import { cartMessage, useCart } from '../lib/cart'
import { whatsappLink } from '../lib/contact'
import { Link } from '../lib/Link'

export function ProductPage({ product }: { product: Product }) {
  const [selected, setSelected] = useState<Record<string, string>>({})
  const [quantity, setQuantity] = useState(1)
  const [showError, setShowError] = useState(false)
  const { add } = useCart()
  const missing = product.options.filter((option) => !selected[option.label])
  const related = PRODUCTS.filter((p) => p.slug !== product.slug)

  const orderItem = { slug: product.slug, name: product.name, price: product.price, options: selected, quantity }

  const addToBag = () => {
    if (missing.length > 0) {
      setShowError(true)
      return
    }
    add(orderItem)
    trackEvent('add_to_cart', { product: product.name, quantity })
  }

  return (
    <>
      <section className="mx-auto max-w-[1200px] px-5 pt-8 pb-12 md:px-10 md:pt-12">
        <nav aria-label="Você está em" className="flex flex-wrap items-center gap-1 text-sm text-[var(--color-text-muted)]">
          <Link to="/" className="hover:text-[var(--color-brand)]">Início</Link>
          <ChevronRight size={14} />
          <Link to={categoryHref(product.category)} className="hover:text-[var(--color-brand)]">{product.category}</Link>
          <ChevronRight size={14} />
          <span className="text-[var(--color-ink)]">{product.name}</span>
        </nav>

        <div className="mt-6 grid gap-8 md:grid-cols-2 md:gap-14">
          <ProductGallery key={product.slug} images={product.images} name={product.name} />

          <div>
            {product.badge && (
              <span className="bg-[var(--color-alert)] px-3 py-1 text-xs font-bold uppercase tracking-[0.1em] text-[var(--color-black)]">{product.badge}</span>
            )}
            <h1 className="heading mt-4 text-3xl leading-tight md:text-4xl">{product.name}</h1>
            <p className="mt-4 text-3xl font-bold">{formatPrice(product)}</p>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              {product.price ? product.unit : 'Preço e disponibilidade pelo WhatsApp'}
            </p>

            <p className="mt-6 leading-relaxed text-[var(--color-text-muted)]">{product.description}</p>
            <ul className="mt-4 space-y-2">
              {product.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <Check size={18} className="mt-0.5 shrink-0 text-[var(--color-brand)]" />
                  {feature}
                </li>
              ))}
            </ul>

            {product.options.map((option) => (
              <fieldset key={option.label} className="mt-6">
                <legend className="heading text-sm">
                  {option.label}
                  {selected[option.label] && <span className="ml-2 font-medium normal-case text-[var(--color-text-muted)]">{selected[option.label]}</span>}
                </legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {option.values.map((value) => {
                    const active = selected[option.label] === value
                    return (
                      <button
                        key={value}
                        type="button"
                        aria-pressed={active}
                        onClick={() => {
                          setSelected((s) => ({ ...s, [option.label]: value }))
                          setShowError(false)
                        }}
                        className={`min-h-11 min-w-11 border-2 px-4 text-sm font-bold uppercase ${
                          active ? 'border-[var(--color-black)] bg-[var(--color-black)] text-white' : 'border-[var(--color-border)] hover:border-[var(--color-black)]'
                        }`}
                      >
                        {value}
                      </button>
                    )
                  })}
                </div>
              </fieldset>
            ))}

            <div className="mt-6">
              <p className="heading text-sm">Quantidade</p>
              <div className="mt-3 inline-flex items-center border-2 border-[var(--color-black)]">
                <button type="button" aria-label="Diminuir quantidade" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="flex h-11 w-11 items-center justify-center">
                  <Minus size={16} />
                </button>
                <span aria-live="polite" className="w-10 text-center font-bold">{quantity}</span>
                <button type="button" aria-label="Aumentar quantidade" onClick={() => setQuantity((q) => Math.min(20, q + 1))} className="flex h-11 w-11 items-center justify-center">
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <button type="button" onClick={addToBag} className="btn-black mt-8 flex min-h-12 w-full items-center justify-center gap-2 py-4 text-sm">
              <ShoppingBag size={18} /> Adicionar à sacola
            </button>
            {showError && (
              <p role="alert" className="mt-2 text-sm font-semibold text-[var(--color-alert)]">
                Escolha {missing.map((o) => o.label.toLowerCase()).join(' e ')} antes de adicionar.
              </p>
            )}
            <a
              href={whatsappLink(cartMessage([{ ...orderItem, id: product.slug }]))}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent('whatsapp_click', { product: product.name, quantity })}
              className="btn-line mt-3 flex min-h-12 w-full items-center justify-center text-sm"
            >
              Comprar agora pelo WhatsApp
            </a>
            <p className="mt-4 text-center text-xs text-[var(--color-text-muted)]">Pix · Débito presencial · Crédito presencial (+ taxa da maquininha)</p>
          </div>
        </div>
      </section>

      <ProductRail title="Veja também" watermark="Vista a Rasta" products={related} />
    </>
  )
}
