import { CartState } from '@/types'
import { create } from 'zustand'

interface CartIndicatorStore {
  cartState: CartState
  setCartState: (state: CartState) => void
  reset: () => void
}

export const useCartIndicator = create<CartIndicatorStore>((set) => ({
  cartState: 'Idle',
  setCartState: (cartState) => set({ cartState }),
  reset: () => set({ cartState:'Idle' }),
}))