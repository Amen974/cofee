export type Orders = {
  id: string;
  created_at: string;
  customer_name: string;
  phone: number;
  lat: number;
  lng: number;
  status: string;
  notes: string;
  items: Item[];
  total_price: number;
  address: string
}

export type Item = {
  id: string;
  name: string;
  quantity: number
  description: string;
  price: number;
  image_url: string;
  is_available: boolean;
  created_at: string;
}

export type FormAction =
  | { type: 'SET_NAME'; payload: string }
  | { type: 'SET_PHONE'; payload: string }
  | { type: 'SET_NOTES'; payload: string }
  | { type: 'RESET' }

export type DeliveryAction =
  | { type: 'SET_ADDRESS'; payload: string }
  | { type: 'SET_COORDINATES'; payload: { lat: number; lng: number } }
  | { type: 'RESET' }

export type SubmitAction =
  | { type: 'SUBMITTING' }
  | { type: 'SUCCESS' }
  | { type: 'ERROR'; payload: string }
  | { type: 'RESET' }

export type ReservationSettings = {
  readonly max_party_size: number
  readonly min_party_size: number
  readonly max_booking_days: number
}

export type Slot = string

export type BookingState = {
  readonly date: string
  readonly partySize: number
  readonly slots: Slot[]
  readonly selected: string | null
  readonly guestName: string
  readonly guestPhone: string
}

export type BookingAction =
  | { type: 'setDate'; payload: string }
  | { type: 'setPartySize'; payload: number }
  | { type: 'setSlots'; payload: Slot[] }
  | { type: 'setSelected'; payload: string | null }
  | { type: 'setGuestName'; payload: string }
  | { type: 'setGuestPhone'; payload: string }
  | { type: 'resetForm' }

export type BookingStatus = {
  readonly loading: boolean
  readonly error: string
  readonly success: string
}

export type UseBookingResult = {
  readonly state: BookingState
  readonly status: BookingStatus
  readonly minPartySize: number
  readonly maxPartySize: number
  readonly maxBookingDays: number
  readonly maxBookingDate: string
  readonly partySizeOptions: number[]
  readonly setDate: (date: string) => void
  readonly setPartySize: (size: number) => void
  readonly setSelected: (slot: string | null) => void
  readonly setGuestName: (name: string) => void
  readonly setGuestPhone: (phone: string) => void
  readonly book: () => Promise<void>
}