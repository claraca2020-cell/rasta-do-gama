import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { CartContext, itemId, type CartApi, type CartItem } from '../lib/cart'

const STORAGE_KEY = 'rasta-sacola-v1'

function loadItems(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CartItem[]) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadItems)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // armazenamento indisponível (modo privado): a sacola funciona só nesta visita
    }
  }, [items])

  const add = useCallback<CartApi['add']>((item) => {
    const id = itemId(item.slug, item.options)
    setItems((current) => {
      const existing = current.find((i) => i.id === id)
      if (existing) return current.map((i) => (i.id === id ? { ...i, quantity: Math.min(20, i.quantity + item.quantity) } : i))
      return [...current, { ...item, id }]
    })
    setIsOpen(true)
  }, [])

  const api = useMemo<CartApi>(
    () => ({
      items,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      add,
      setQuantity: (id, quantity) =>
        setItems((current) => current.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, Math.min(20, quantity)) } : i))),
      remove: (id) => setItems((current) => current.filter((i) => i.id !== id)),
      clear: () => setItems([]),
    }),
    [items, isOpen, add],
  )

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>
}
