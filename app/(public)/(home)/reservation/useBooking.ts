import { useEffect, useReducer, useState } from 'react'
import { ReservationSettings, BookingState , BookingAction, BookingStatus, UseBookingResult, } from '@/types'
import { useCartIndicator } from '@/lib/store/useCartIndicator'

const getDateString = (date: Date): string => date.toISOString().split('T')[0]

const getMaxBookingDate = (days: number): string => {
  const maxDate = new Date()
  maxDate.setDate(maxDate.getDate() + days)
  return getDateString(maxDate)
}

const initialState = (minPartySize: number): BookingState => ({
  date: getDateString(new Date()),
  partySize: minPartySize,
  slots: [],
  selected: null,
  guestName: '',
  guestPhone: '',
})

const initialStatus: BookingStatus = {
  loading: false,
  error: '',
  success: '',
}

const bookingReducer = (state: BookingState, action: BookingAction): BookingState => {
  switch (action.type) {
    case 'setDate':
      return { ...state, date: action.payload }
    case 'setPartySize':
      return { ...state, partySize: action.payload }
    case 'setSlots':
      return { ...state, slots: action.payload }
    case 'setSelected':
      return { ...state, selected: action.payload }
    case 'setGuestName':
      return { ...state, guestName: action.payload }
    case 'setGuestPhone':
      return { ...state, guestPhone: action.payload }
    case 'resetForm':
      return { ...state, selected: null, guestName: '', guestPhone: '' }
    default:
      return state
  }
}

const derivePartySizeOptions = (minPartySize: number, maxPartySize: number): number[] =>
  Array.from(
    { length: Math.max(maxPartySize - minPartySize + 1, 1) },
    (_, index) => minPartySize + index
  )

const validatePhone = (phone: string): boolean => {
  const numericPhone = phone.replace(/\D/g, '')
  return /^\+?[\d\s()\-]+$/.test(phone) && numericPhone.length >= 7 && numericPhone.length <= 15
}

const createStatus = (overrides: Partial<BookingStatus>): BookingStatus => ({
  ...initialStatus,
  ...overrides,
})

export const useBooking = (settings: ReservationSettings): UseBookingResult => {
  const [status, setStatus] = useState<BookingStatus>(initialStatus)
  const [state, dispatch] = useReducer(bookingReducer, settings.min_party_size, initialState)
  const { setCartStatus, resetCartStatus } = useCartIndicator()
  const minPartySize = settings.min_party_size
  const maxPartySize = settings.max_party_size
  const maxBookingDays = settings.max_booking_days
  const maxBookingDate = getMaxBookingDate(maxBookingDays)
  const partySizeOptions = derivePartySizeOptions(minPartySize, maxPartySize)

  useEffect(() => {
    const fetchAvailability = async (): Promise<void> => {
      setStatus(createStatus({ loading: true }))
      dispatch({ type: 'setSelected', payload: null })

      try {
        const response = await fetch(
          `/api/availability?date=${encodeURIComponent(state.date)}&party_size=${state.partySize}`
        )
        const data = await response.json()

        if (!response.ok) {
          setStatus(createStatus({ error: data.error ?? 'Unable to load availability.' }))
          return
        }

        dispatch({ type: 'setSlots', payload: data.available_slots ?? [] })
        setStatus(createStatus({}))
      } catch {
        setStatus(createStatus({ error: 'Unable to load availability. Please try again.' }))
      }
    }

    if (!state.date || !state.partySize) {
      return
    }

    fetchAvailability()
  }, [state.date, state.partySize, state.partySize])

  useEffect(() => {
    if (state.partySize < minPartySize) {
      dispatch({ type: 'setPartySize', payload: minPartySize })
    }

    if (state.partySize > maxPartySize) {
      dispatch({ type: 'setPartySize', payload: maxPartySize })
    }
  }, [minPartySize, maxPartySize, state.partySize])

  const setDate = (date: string): void => dispatch({ type: 'setDate', payload: date })
  const setPartySize = (size: number): void => dispatch({ type: 'setPartySize', payload: size })
  const setSelected = (slot: string | null): void => dispatch({ type: 'setSelected', payload: slot })
  const setGuestName = (name: string): void => dispatch({ type: 'setGuestName', payload: name })
  const setGuestPhone = (phone: string): void => dispatch({ type: 'setGuestPhone', payload: phone })

  const book = async (): Promise<void> => {
    const trimmedName = state.guestName.trim()
    const trimmedPhone = state.guestPhone.trim()

    if (!state.selected) {
      setStatus(createStatus({ error: 'Please choose a time slot.' }))
      return
    }

    if (!trimmedName) {
      setStatus(createStatus({ error: 'Guest name is required.' }))
      return
    }

    if (!trimmedPhone) {
      setStatus(createStatus({ error: 'Guest phone is required.' }))
      return
    }

    if (!validatePhone(trimmedPhone)) {
      setStatus(createStatus({ error: 'Please enter a valid phone number.' }))
      return
    }

    if (!state.partySize) {
      setStatus(createStatus({ error: 'Please select a valid guest count.' }))
      return
    }

    setStatus(createStatus({ loading: true }))
    setCartStatus('loading', 'Placing reservation...')

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: state.date,
          start_time: state.selected,
          party_size: state.partySize,
          guest_name: trimmedName,
          guest_phone: trimmedPhone,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setStatus(createStatus({ error: data.error ?? 'Reservation failed.' }))
        return
      }

      setStatus(createStatus({ success: `Reservation confirmed for ${state.selected}` }))
      setCartStatus('success', `Reservation confirmed for ${state.selected}`)
      setTimeout(() => resetCartStatus(), 3000)
      dispatch({ type: 'resetForm' })
      dispatch({ type: 'setSlots', payload: [] })
    } catch {
      setStatus(createStatus({ error: 'Unable to complete reservation. Please try again.' }))
    }
  }

  return {
    state,
    status,
    minPartySize,
    maxPartySize,
    maxBookingDays,
    maxBookingDate,
    partySizeOptions,
    setDate,
    setPartySize,
    setSelected,
    setGuestName,
    setGuestPhone,
    book,
  }
}
