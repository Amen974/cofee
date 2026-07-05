import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import BookingClient from './BookingClient'
import { ReservationSettings } from '@/types'

const isValidSettings = (settings: ReservationSettings): boolean =>
  Number.isInteger(settings.min_party_size) &&
  Number.isInteger(settings.max_party_size) &&
  Number.isInteger(settings.max_booking_days) &&
  typeof settings.timezone === 'string' &&
  Number.isInteger(settings.lead_time_min) &&
  settings.min_party_size >= 1 &&
  settings.max_party_size >= settings.min_party_size &&
  settings.max_booking_days >= 1

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase
    .from('restaurant_settings')
    .select('min_party_size, max_party_size, max_booking_days, timezone, lead_time_min')
    .maybeSingle()

  const isValid = isValidSettings(data as ReservationSettings)
  const reservationSettings = isValid ? (data as ReservationSettings) : {
    min_party_size: 1,
    max_party_size: 10,
    max_booking_days: 30,
    timezone: 'America/New_York',
    lead_time_min: 15
  }

  if (error) {
    console.error('[Reservation Page] Failed to load restaurant settings', error)
  }

  return <BookingClient settings={reservationSettings} />
}