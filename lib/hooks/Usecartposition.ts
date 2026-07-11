import { Corner } from '@/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartPositionStore {
  corner: Corner
  setCorner: (corner: Corner) => void
}

export const useCartPosition = create<CartPositionStore>()(
  persist(
    (set) => ({
      corner: 'bottom-left',
      setCorner: (corner) => set({ corner }),
    }),
    { name: 'cart-position' },
  ),
)