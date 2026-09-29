import { createContext, useContext } from 'react'

// Sacola simples: guarda os itens no navegador e fecha o pedido pelo WhatsApp (sem pagamento online).
export type CartItem = {
  id: string
  slug: string
  name: string
  price?: string
  options: Record<string, string>
  quantity: number
}

export type CartApi = {
  items: CartItem[]
  count: number
  isOpen: boolean
  open: () => void
  close: () => void
  add: (item: Omit<CartItem, 'id'>) => void
  setQuantity: (id: string, quantity: number) => void
  remove: (id: string) => void
  clear: () => void
}

export const CartContext = createContext<CartApi | null>(null)

export function useCart() {
  const cart = useContext(CartContext)
  if (!cart) throw new Error('useCart precisa estar dentro de <CartProvider>')
  return cart
}

export function itemId(slug: string, options: Record<string, string>) {
  return [slug, ...Object.entries(options).map(([k, v]) => `${k}:${v}`)].join('|')
}

function toNumber(price?: string) {
  return price ? Number(price.replace('.', '').replace(',', '.')) : 0
}

export function formatMoney(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function cartTotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + toNumber(item.price) * item.quantity, 0)
}

export function cartMessage(items: CartItem[]) {
  const lines = items.map((item) => {
    const options = Object.entries(item.options)
      .map(([label, value]) => `${label}: ${value}`)
      .join(', ')
    const price = item.price ? `R$ ${item.price}` : 'preço a consultar'
    return `• ${item.quantity}x ${item.name}${options ? ` (${options})` : ''} — ${price}`
  })
  const total = cartTotal(items)
  const hasUnpriced = items.some((item) => !item.price)
  return [
    'Olá, Rasta! Vim pelo site e quero fazer este pedido:',
    ...lines,
    total > 0 ? `Total: ${formatMoney(total)}${hasUnpriced ? ' + itens a consultar' : ''}` : '',
  ]
    .filter(Boolean)
    .join('\n')
}
