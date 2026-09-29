import adesivos1 from '../assets/products/adesivos-1.webp'
import adesivos2 from '../assets/products/adesivos-2.webp'
import adesivos3 from '../assets/products/adesivos-3.webp'
import boneVerde1 from '../assets/products/bone-verde-1.webp'
import boneVerde2 from '../assets/products/bone-verde-2.webp'
import boneVerde3 from '../assets/products/bone-verde-3.webp'
import casaco1 from '../assets/products/casaco-1.webp'
import casaco2 from '../assets/products/casaco-2.webp'
import casaco3 from '../assets/products/casaco-3.webp'
import meia1 from '../assets/products/meia-1.webp'
import meia2 from '../assets/products/meia-2.webp'
import meia3 from '../assets/products/meia-3.webp'

// Fotos: vault "17,5 RASTA/000,1produtos" (convertidas para webp em src/assets/products).
// Preços: Google Forms/posts da Rasta (28/09/2026). Sem preço confirmado => "Consulte" (não inventar).
export type ProductOption = { label: string; values: readonly string[] }

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
}

export const CATEGORIES = ['Bonés', 'Casacos', 'Camisas', 'Acessórios'] as const
export type Category = (typeof CATEGORIES)[number]

const TAMANHOS_ADULTO = ['P', 'M', 'G', 'GG', 'XG', '3G', '4G'] as const

export const PRODUCTS: readonly Product[] = [
  {
    slug: 'bone-rasta-verde-papagaio',
    name: 'Boné Rasta Verde Papagaio',
    category: 'Bonés',
    unit: 'por unidade',
    badge: 'Novo',
    description: 'Boné verde do Gama com o papagaio rasta e o escrito RASTA na frente.',
    features: ['Verde do Gama', 'Arte RASTA com o papagaio rasta', 'Regulagem traseira com fivela'],
    options: [],
    images: [boneVerde1, boneVerde3, boneVerde2],
  },
  {
    slug: 'casaco-corta-vento-rasta',
    name: 'Casaco Corta-vento Rasta',
    category: 'Casacos',
    price: '230,00',
    unit: 'por unidade',
    badge: '2ª remessa',
    description: 'Corta-vento verde com capuz, escudo na frente e a arte RASTA nas costas.',
    features: ['Capuz e zíper frontal', 'Bolsos laterais', 'Arte RASTA nas costas'],
    options: [
      { label: 'Modelo', values: ['Masculino', 'Feminino', 'Infantil'] },
      { label: 'Tamanho', values: TAMANHOS_ADULTO },
    ],
    images: [casaco2, casaco3, casaco1],
  },
  {
    slug: 'adesivos-rasta',
    name: 'Adesivos Rasta',
    category: 'Acessórios',
    unit: 'por pacote',
    description: 'Adesivos com as artes do movimento: Gama e o papagaio rasta, "Igualdade · Paz · Unidade", Rasta do Gama e Movimento Rasta.',
    features: ['4 artes diferentes', 'Papagaio rasta e escudo do Gama', 'Para garrafa, notebook, carro…'],
    options: [],
    images: [adesivos1, adesivos2, adesivos3],
  },
  {
    slug: 'camisa-rasta',
    name: 'Camisa Rasta do Gama',
    category: 'Camisas',
    price: '80,00',
    unit: 'por unidade',
    badge: 'Pré-venda',
    description: 'Camisa oficial do Movimento Rasta do Gama, em manga ou regata.',
    features: ['Manga ou regata', 'Corte normal ou BabyLook', 'Também em tamanho infantil'],
    options: [
      { label: 'Modelo', values: ['Manga', 'Regata'] },
      { label: 'Corte', values: ['Normal', 'BabyLook'] },
      { label: 'Tamanho', values: [...TAMANHOS_ADULTO, 'Infantil'] },
    ],
    images: [],
  },
  {
    slug: 'bone-five-panel-rasta',
    name: 'Boné Five Panel Rasta',
    category: 'Bonés',
    price: '80,00',
    unit: 'por unidade',
    badge: 'Reserva',
    description: 'Boné modelo five panel com estilo rasta.',
    features: ['Modelo five panel', 'Estilo rasta'],
    options: [],
    images: [],
  },
  {
    slug: 'meia-rasta',
    name: 'Meia Rasta',
    category: 'Acessórios',
    price: '25,00',
    unit: 'por par',
    badge: 'Lançamento',
    description: 'Meia branca de cano alto com listras verdes, a arte RASTA de um lado e o escudo do Gama do outro.',
    features: ['100% algodão', 'Do 35 ao 43', 'Arte RASTA e escudo do Gama'],
    options: [],
    images: [meia1, meia3, meia2],
  },
]

export function findProduct(slug: string) {
  return PRODUCTS.find((product) => product.slug === slug)
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
