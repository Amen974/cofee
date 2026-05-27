import { create } from 'zustand'
import { Status } from '@/types'

interface CartIndicatorStore {
  cartStatus: Status
  cartMessage: string
  setCartStatus: (cartStatus: Status, cartMessage?: string) => void
  resetCartStatus: () => void
}

export const useCartIndicator = create<CartIndicatorStore>((set) => ({
  cartStatus: 'idle',
  cartMessage: '',
  setCartStatus: (cartStatus, cartMessage = '') => set({ cartStatus, cartMessage }),
  resetCartStatus: () => set({ cartStatus: 'idle', cartMessage: '' }),
}))