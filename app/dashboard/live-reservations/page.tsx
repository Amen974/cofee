'use client'

import { Clock, Phone, Users } from 'lucide-react'
import { ReservationFilter, useReservations } from './useReservations'

const statusLabels: Record<ReservationFilter, string> = {
  pending: 'Pending',
  cancelled: 'Cancelled',
  no_show: 'No Show',
  completed: 'Completed',
}

const statusStyles: Record<ReservationFilter, string> = {
  pending: 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30',
  cancelled: 'bg-gray-500/10 text-gray-400 border border-gray-500/30',
  no_show: 'bg-red-500/10 text-red-500 border border-red-500/30',
  completed: 'bg-green-500/10 text-green-500 border border-green-500/30',
}

const statusDot: Record<ReservationFilter, string> = {
  pending: 'bg-yellow-500',
  cancelled: 'bg-gray-400',
  no_show: 'bg-red-500',
  completed: 'bg-green-500',
}

export default function LiveReservationsPage() {
  const {
    RESERVATION_STATUSES,
    reservations,
    loading,
    filter,
    setFilter,
    search,
    setSearch,
    filteredReservations,
    updateStatus,
    timeAgo,
  } = useReservations()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-[#8D7E73] gap-2 text-xs tracking-[0.2em] uppercase">
        <Users className="animate-pulse w-6 h-6" />
        Loading reservations...
      </div>
    )
  }

  if (!reservations.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-[#8D7E73] gap-2">
        <Users className="w-10 h-10 opacity-30" />
        <p className="text-xs tracking-[0.2em] uppercase">No reservations yet</p>
      </div>
    )
  }

  return (
    <div className="p-6 text-[#8D7E73]">
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap sticky top-0 z-10  backdrop-blur-sm py-3 -mx-6 px-6">
        <h1 className="text-2xl font-semibold text-[#A32D1C] shrink-0">Live Reservations</h1>

        <div className="flex gap-2 flex-wrap">
          {RESERVATION_STATUSES.map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`text-[0.625rem] font-medium tracking-[0.15em] uppercase px-3.5 py-1.5 rounded-md border transition-colors duration-150 ${
                filter === status
                  ? 'bg-[#9a2d1e] text-white border-transparent'
                  : 'border-[#8D7E73]/30 text-[#8D7E73] hover:bg-[#8D7E73]/10 hover:text-[#A32D1C]'
              }`}
            >
              {statusLabels[status]}
              <span className="ml-1.5 opacity-60">
                {reservations.filter((r) => r.status === status).length}
              </span>
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search name, phone, ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-[#211c19] border border-[#8D7E73]/30 rounded-md text-xs tracking-wide text-white placeholder:text-[#8D7E73]/60 outline-none h-9 px-3 w-56 transition-colors duration-150 focus:border-[#A32D1C]/60"
        />
      </div>

      {filteredReservations.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-[#8D7E73] gap-2">
          <p className="text-xs tracking-[0.2em] uppercase">No matching reservations</p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
          {filteredReservations.map((reservation) => (
            <div
              key={reservation.id}
              className="rounded-3xl border-3 border-[#2A1F1C] bg-[#141110] p-4 flex flex-col gap-3 hover:border-[#8D7E73]/40 transition-colors duration-150"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h2 className="text-white text-lg font-medium leading-tight truncate">{reservation.guest_name}</h2>
                  <p className="text-xs text-[#8D7E73]/70 mt-0.5">
                    {reservation.reservation_date} · {reservation.start_time}–{reservation.end_time}
                  </p>
                </div>
                <span className={`text-[0.625rem] font-medium tracking-widest uppercase px-2.5 py-1 rounded-md flex items-center gap-1.5 shrink-0 ${statusStyles[reservation.status]}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusDot[reservation.status]}`} />
                  {statusLabels[reservation.status]}
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 shrink-0" />
                  {reservation.guest_phone}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 shrink-0" />
                  {reservation.party_size}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-[#8D7E73]/60 pt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {timeAgo(reservation.created_at)}
                </span>
              </div>

              <select
                value={reservation.status}
                onChange={(event) => updateStatus(reservation.id, event.target.value as ReservationFilter)}
                className="bg-[#1b1816] border border-[#8D7E73]/30 rounded-md text-xs tracking-wide text-white px-3 py-2 outline-none cursor-pointer hover:border-[#A32D1C]/40 transition-colors duration-150"
              >
                {RESERVATION_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {statusLabels[status]}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}