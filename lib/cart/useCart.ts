import { Menu } from "@/types"
import { create } from "zustand"

type CartItems = {
  items: Menu[]
  addItem: (item: Menu) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  totalPrice: () => number
}

export const usecart = create<CartItems>((set, get) => ({
  items: [],

  addItem: (itemToAdd) => set((currentCart) => {
    const existing = currentCart.items.find((i) => i.id === itemToAdd.id)
    if (existing) return currentCart
    return {items: [...currentCart.items, itemToAdd]}
  }),

  removeItem: (id) => set((currentCart) => ({
    items: currentCart.items.filter((i) => i.id !== id)
  })),

  updateQuantity: (id, quantity) => set((currentCart) => ({
    items: currentCart.items.map((i) => i.id === id ? {...i, quantity} : i)
  })),

  clearCart: () => set({items: []}),

  totalPrice: () => {
    const { items } = get()
     return items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  },
}))