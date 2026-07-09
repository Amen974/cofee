import { create } from 'zustand'

interface ReservationPanelState {
  isOpen: boolean
  open: () => void
  close: () => void
}

export const useReservationPanel = create<ReservationPanelState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}))