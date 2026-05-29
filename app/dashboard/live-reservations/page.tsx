'use client'

import { Clock, Phone, Users } from 'lucide-react'
import { ReservationFilter, useReservations } from './useReservations'

const statusStyles: Record<ReservationFilter, string> = {
  confirmed: 'bg-green-500/10 text-green-400 border border-green-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border border-red-500/20',
  no_show: 'bg-neutral-800/10 text-neutral-300 border border-neutral-700/20',
  completed: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
}

const statusDot: Record<ReservationFilter, string> = {
  confirmed: 'bg-green-400',
  cancelled: 'bg-red-400',
  no_show: 'bg-neutral-400',
  completed: 'bg-blue-400',
}

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (diff < 1) return 'just now'
  if (diff === 1) return '1 min ago'
  if (diff < 60) return `${diff} mins ago`
  const hours = Math.floor(diff / 60)
  const minutes = diff % 60
  if (hours === 1 && minutes === 0) return '1h ago'
  if (hours === 1) return `1h ${minutes}m ago`
  if (minutes === 0) return `${hours}h ago`
  return `${hours}h ${minutes}m ago`
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
  } = useReservations()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-neutral-500">
        <Users className="animate-pulse w-8 h-8 mr-2" />
        Loading reservations...
      </div>
    )
  }

  if (!reservations.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-neutral-500 gap-2">
        <Users className="w-10 h-10 opacity-30" />
        <p className="text-sm">No reservations yet</p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="flex mb-4 gap-4">
        <div className="flex flex-1 gap-2 flex-wrap">
          {RESERVATION_STATUSES.map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`text-xs px-3.5 py-1.5 rounded-full border transition-all ${
                filter === status
                  ? 'bg-red-700 text-white border-transparent'
                  : 'border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'
              }`}
            >
              {status.replace('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
            </button>
          ))}
        </div>
        <div>
          <input
            type="text"
            placeholder="Search reservations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-neutral-800 border border-neutral-700 rounded-lg text-xs text-neutral-300 placeholder:text-neutral-500 focus:ring-1 focus:ring-blue-500 outline-none h-8"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 justify-center md:justify-start">
        {filteredReservations.map((reservation) => (
          <div
            key={reservation.id}
            className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 w-72 flex flex-col gap-3 hover:border-neutral-700 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="text-white font-semibold text-xl leading-tight">{reservation.guest_name}</h2>
                <p className="text-xs text-neutral-500">
                  {reservation.reservation_date} · {reservation.start_time} – {reservation.end_time}
                </p>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 shrink-0 ${statusStyles[reservation.status]}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusDot[reservation.status]}`} />
                {reservation.status.replace('_', ' ')}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-neutral-400 text-sm">
              <Phone className="w-3.5 h-3.5" />
              {reservation.guest_phone}
            </div>

            <div className="flex items-center gap-1.5 text-neutral-400 text-sm">
              <Users className="w-3.5 h-3.5" />
              Party of {reservation.party_size}
            </div>

            <div className="border-t border-neutral-800" />

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-xs text-neutral-500">
                <Clock className="w-3 h-3" />
                {timeAgo(reservation.created_at)}
              </span>
              <span className="text-xs text-neutral-400">Created</span>
            </div>

            <select
              value={reservation.status}
              onChange={(event) => updateStatus(reservation.id, event.target.value as ReservationFilter)}
              className="bg-neutral-800 border border-neutral-700 rounded-lg text-xs text-neutral-300 px-3 py-2 outline-none cursor-pointer hover:border-neutral-600 transition-colors"
            >
              {RESERVATION_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status.replace('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}
