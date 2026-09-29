import { useState, type KeyboardEvent } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useSwipeNavigation } from '../hooks/useSwipeNavigation'
import { ProductImage } from './ProductCard'

// Galeria da página de produto: troca com fade, setas, arrastar no celular, setas do teclado e miniaturas.
export function ProductGallery({ images, name }: { images: readonly string[]; name: string }) {
  const [index, setIndex] = useState(0)
  const count = images.length
  const go = (dir: number) => setIndex((i) => (i + dir + count) % count)
  const swipe = useSwipeNavigation(go)

  if (count === 0) return <ProductImage alt={name} className="aspect-square rounded-xl border border-[var(--color-border)]" />

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowRight') go(1)
    if (event.key === 'ArrowLeft') go(-1)
  }

  return (
    <div>
      <div
        role="region"
        aria-roledescription="carrossel"
        aria-label={`Fotos de ${name}`}
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="relative aspect-square select-none overflow-hidden rounded-xl border border-[var(--color-border)] bg-white"
        {...swipe}
      >
        {images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`${name} — foto ${i + 1} de ${count}`}
            aria-hidden={i !== index}
            draggable={false}
            className={`gallery-slide absolute inset-0 h-full w-full object-contain p-3 ${i === index ? 'is-active' : ''}`}
          />
        ))}

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Foto anterior"
              className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[var(--color-ink)] shadow-md hover:bg-[var(--color-sun)]"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Próxima foto"
              className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[var(--color-ink)] shadow-md hover:bg-[var(--color-sun)]"
            >
              <ChevronRight size={22} />
            </button>
            <span aria-live="polite" className="absolute bottom-3 right-3 rounded-full bg-[var(--color-black)]/80 px-3 py-1 text-xs font-semibold text-white">
              {index + 1} / {count}
            </span>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-2">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Ver foto ${i + 1}`}
              aria-pressed={i === index}
              className={`overflow-hidden rounded-lg border-2 bg-white transition ${
                i === index ? 'border-[var(--color-brand)] opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={src} alt="" className="aspect-square w-full object-contain p-1" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
