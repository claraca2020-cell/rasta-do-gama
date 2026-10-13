import produtos from './produtos.json'

// Produtos, preços, fotos e estoque são editados pelo painel (/admin), que grava src/data/produtos.json.
// Origem dos dados iniciais: vault "17,5 RASTA/000,1produtos", fotos reais enviadas pela Rasta em 05/10/2026
// e preços dos posts da Rasta (28/09/2026), atualizados no WhatsApp em 05/10/2026.
// Sem preço => "Consulte" (não inventar). Produto marcado como oculto no painel não aparece no site.
export type ProductOption = { label: string; values: readonly string[] }

export type Stock = 'disponivel' | 'encomenda' | 'esgotado'

export type Product = {
  slug: string
  name: string
  category: Category
  price?: string
  unit: string
  badge?: string
  description: string
  features: readonly string[]
  options: readonly ProductOption[]
  images: readonly string[]
  stock: Stock
  quantity: number | null
  visible: boolean
}

export const CATEGORIES = ['Bonés', 'Casacos', 'Camisas', 'Acessórios'] as const
export type Category = (typeof CATEGORIES)[number]

export const PRODUCTS: readonly Product[] = (produtos as Product[])
  .filter((p) => p.visible)
  .map((p) => ({ ...p, price: p.price || undefined, badge: p.badge || undefined }))

export function findProduct(slug: string) {
  return PRODUCTS.find((product) => product.slug === slug)
}

/** Pode ir para a sacola? Esgotado não; sob encomenda sim (o prazo é combinado no WhatsApp). */
export const canOrder = (product: Product) => product.stock !== 'esgotado'

/** Aviso de estoque para o cliente (só com dado real informado no painel). */
export function stockLabel(product: Product) {
  if (product.stock === 'esgotado') return 'Esgotado'
  if (product.stock === 'encomenda') return 'Sob encomenda'
  if (product.quantity !== null && product.quantity > 0 && product.quantity <= 5)
    return product.quantity === 1 ? 'Última unidade' : `Últimas ${product.quantity} unidades`
  return null
}

export function formatPrice(product: Product) {
  return product.price ? `R$ ${product.price}` : 'Consulte'
}

export const CATEGORY_SLUGS: Record<Category, string> = {
  Bonés: 'bones',
  Casacos: 'casacos',
  Camisas: 'camisas',
  Acessórios: 'acessorios',
}

export function categoryFromSlug(slug: string | null) {
  return CATEGORIES.find((category) => CATEGORY_SLUGS[category] === slug)
}

export function categoryHref(category: Category) {
  return `/produtos?c=${CATEGORY_SLUGS[category]}`
}

function normalize(text: string) {
  return text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
}

export function searchProducts(query: string) {
  const q = normalize(query.trim())
  if (!q) return PRODUCTS
  return PRODUCTS.filter((p) => normalize(`${p.name} ${p.category} ${p.description}`).includes(q))
}
