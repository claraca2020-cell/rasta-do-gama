import { PageBanner } from '../components/PageBanner'
import { ProductCard } from '../components/ProductCard'
import { CATEGORIES, PRODUCTS, categoryFromSlug, categoryHref, searchProducts } from '../data/products'
import { Link } from '../lib/Link'

export function ProductsPage({ search }: { search: string }) {
  const params = new URLSearchParams(search)
  const category = categoryFromSlug(params.get('c'))
  const query = params.get('q') ?? ''
  const base = query ? searchProducts(query) : PRODUCTS
  const visible = category ? base.filter((p) => p.category === category) : base
  const title = query ? `Busca: "${query}"` : (category ?? 'Todos os produtos')

  const chip = (active: boolean) =>
    `flex min-h-11 shrink-0 items-center border-2 px-5 text-sm font-bold uppercase tracking-[0.04em] transition-colors ${
      active ? 'border-[var(--color-black)] bg-[var(--color-black)] text-white' : 'border-[var(--color-black)] hover:bg-[var(--color-bg-soft)]'
    }`

  return (
    <>
      <PageBanner kicker="Loja oficial" title="Ver produtos" />
      <section className="mx-auto max-w-[1200px] section-y px-5 md:px-10">
        <nav aria-label="Categorias" className="flex gap-2 overflow-x-auto pb-2">
          <Link to="/produtos" className={chip(!category && !query)} aria-current={!category && !query ? 'page' : undefined}>
            Todos
          </Link>
          {CATEGORIES.filter((c) => PRODUCTS.some((p) => p.category === c)).map((c) => (
            <Link key={c} to={categoryHref(c)} className={chip(category === c)} aria-current={category === c ? 'page' : undefined}>
              {c}
            </Link>
          ))}
        </nav>

        <div className="mt-8 flex items-baseline justify-between gap-4">
          <h2 className="heading text-xl md:text-2xl">{title}</h2>
          <p className="text-sm text-[var(--color-text-muted)]">
            {visible.length} {visible.length === 1 ? 'produto' : 'produtos'}
          </p>
        </div>

        {visible.length === 0 ? (
          <div className="mt-8 border-2 border-dashed border-[var(--color-border)] p-10 text-center">
            <p className="heading text-lg">Nenhum produto encontrado</p>
            <Link to="/produtos" className="btn-black mt-5 inline-flex min-h-12 items-center px-7 text-sm">
              Ver todos os produtos
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-4">
            {visible.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
