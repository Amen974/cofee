import { create } from 'zustand'

interface NavigationStore {
  isNavigating: boolean
  setNavigating: (value: boolean) => void
}

export const useNavigationStore = create<NavigationStore>((set) => ({
  isNavigating: false,
  setNavigating: (value) => set({ isNavigating: value }),
}))