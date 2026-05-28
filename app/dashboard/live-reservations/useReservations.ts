import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Reservation, ReservationStatus } from '@/types'

const supabase = createClient()

export type ReservationFilter = ReservationStatus
export const RESERVATION_STATUSES: ReservationFilter[] = [
  'confirmed',
  'cancelled',
  'no_show',
  'completed',
]

export interface UseReservationsResult {
  readonly RESERVATION_STATUSES: ReservationFilter[];
  readonly reservations: Reservation[];
  readonly loading: boolean;
  readonly filter: ReservationFilter;
  readonly setFilter: React.Dispatch<React.SetStateAction<ReservationFilter>>;
  readonly filteredReservations: Reservation[];
  readonly updateStatus: (id: string, status: ReservationFilter) => Promise<void>;
}

export const useReservations = (): UseReservationsResult => {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [filter, setFilter] = useState<ReservationFilter>('confirmed')

  const updateStatus = async (id: string, status: ReservationFilter): Promise<void> => {
    let previousStatus: ReservationStatus | undefined

    setReservations((prev) => {
      previousStatus = prev.find((reservation) => reservation.id === id)?.status
      return prev.map((reservation) =>
        reservation.id === id ? { ...reservation, status } : reservation,
      )
    })

    try {
      const { error } = await supabase
        .from('reservations')
        .update({ status })
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('[useReservations] Failed to update reservation status', error)
      setReservations((prev) =>
        prev.map((reservation) =>
          reservation.id === id && previousStatus !== undefined
            ? { ...reservation, status: previousStatus }
            : reservation,
        ),
      )
    }
  }

  useEffect(() => {
    const fetchReservations = async (): Promise<void> => {
      try {
        const { data, error } = await supabase
          .from('reservations')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('[useReservations] Failed to fetch reservations', error)
          setReservations([])
          return
        }

        setReservations((data ?? []) as Reservation[])
      } catch (error) {
        console.error('[useReservations] Unexpected fetch error', error)
        setReservations([])
      } finally {
        setLoading(false)
      }
    }

    fetchReservations()

    const channel = supabase
      .channel('reservations-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reservations' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setReservations((prev) => [payload.new as Reservation, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setReservations((prev) =>
              prev.map((reservation) =>
                reservation.id === payload.new.id
                  ? (payload.new as Reservation)
                  : reservation,
              ),
            )
          } else if (payload.eventType === 'DELETE') {
            setReservations((prev) => prev.filter((reservation) => reservation.id !== payload.old.id))
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const filteredReservations = useMemo(
    () => reservations.filter((reservation) => reservation.status === filter),
    [reservations, filter],
  )

  return {
    RESERVATION_STATUSES,
    reservations,
    loading,
    filter,
    setFilter,
    filteredReservations,
    updateStatus,
  }
}
