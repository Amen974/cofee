import { CartState } from '@/types'
import { create } from 'zustand'

interface CartIndicatorStore {
  cartState: CartState
  setCartState: (state: CartState) => void
  reset: () => void
}

export const useCartIndicator = create<CartIndicatorStore>((set) => ({
  cartState: 'idle',
  setCartState: (cartState) => set({ cartState }),
  reset: () => set({ cartState:'idle' }),
}))