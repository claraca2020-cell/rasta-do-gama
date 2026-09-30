import { ImageIcon } from 'lucide-react'
import { formatPrice, type Product } from '../data/products'
import { Link } from '../lib/Link'

export function ProductImage({ src, alt, className = '' }: { src?: string; alt: string; className?: string }) {
  if (!src) {
    return (
      <div className={`product-photo flex flex-col items-center justify-center gap-2 text-[var(--color-text-muted)] ${className}`}>
        <ImageIcon size={24} strokeWidth={1.5} />
        <span className="text-[0.6rem] font-semibold uppercase tracking-[0.15em]">Foto em breve</span>
      </div>
    )
  }
  return (
    <div className={`product-photo-light ${className}`}>
      <img src={src} alt={alt} loading="lazy" decoding="async" className="h-full w-full object-contain" />
    </div>
  )
}

// Card limpo: foto, nome e preço em verde.
export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to={`/produtos/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-[var(--color-border)] bg-white text-[var(--color-card-ink)] transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(8,61,33,0.09)]"
    >
      <div className="relative overflow-hidden">
        <ProductImage src={product.images[0]} alt={product.name} className="aspect-square transition-transform duration-500 group-hover:scale-[1.04]" />
        {product.images[1] && (
          // segunda foto aparece ao passar o mouse
          <img
            src={product.images[1]}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="absolute inset-0 h-full w-full bg-white object-contain opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}
        {product.badge && (
          <span className="absolute left-2 top-2 bg-[var(--color-alert)] px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.1em] text-[var(--color-black)]">
            {product.badge}
          </span>
        )}
      </div>
      <h3 className="mt-4 px-4 text-[0.95rem] font-semibold leading-tight md:text-base">{product.name}</h3>
      <p className="mt-auto px-4 pt-4 pb-4 text-lg font-bold text-[var(--color-brand)] md:text-xl">{formatPrice(product)}</p>
    </Link>
  )
}
