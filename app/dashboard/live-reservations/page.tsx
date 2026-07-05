'use client'

import { Clock, Phone, Users } from 'lucide-react'
import { ReservationFilter, useReservations } from './useReservations'

const statusStyles: Record<ReservationFilter, string> = {
  confirmed: 'bg-[#A32D1C]/10 text-[#A32D1C] border border-[#A32D1C]/30',
  cancelled: 'bg-[#8D7E73]/10 text-[#8D7E73] border border-[#8D7E73]/30',
  no_show: 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30',
  completed: 'bg-[#8D7E73]/15 text-white border border-[#8D7E73]/30',
}

const statusDot: Record<ReservationFilter, string> = {
  confirmed: 'bg-[#A32D1C]',
  cancelled: 'bg-[#8D7E73]',
  no_show: 'bg-yellow-500',
  completed: 'bg-white',
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
    <div className="p-6 min-h-screen text-[#8D7E73]">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h1 className="text-3xl text-[#A32D1C] shrink-0">Live Reservations</h1>

        <div className="flex flex-1 gap-2 flex-wrap">
          {RESERVATION_STATUSES.map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`text-[0.625rem] tracking-[0.2em] uppercase px-3.5 py-1.5 rounded-full border transition-colors duration-300 ${
                filter === status
                  ? 'bg-[#9a2d1e] text-white border-transparent'
                  : 'border-[#8D7E73]/30 text-[#8D7E73] hover:bg-[#8D7E73]/10 hover:text-[#A32D1C]'
              }`}
            >
              {status.replace('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search reservations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-[#211c19] border border-[#8D7E73]/30 rounded-xs text-xs tracking-widest text-white placeholder:text-[#8D7E73]/60 outline-none h-9 px-3 transition-colors duration-300 focus:border-[#A32D1C]/60"
        />
      </div>

      <div className="flex flex-wrap gap-4 justify-center md:justify-start">
        {filteredReservations.map((reservation) => (
          <div
            key={reservation.id}
            className="bg-[#211c19] border border-[#8D7E73]/20 rounded-2xl p-4 w-72 flex flex-col gap-3 hover:border-[#8D7E73]/40 transition-colors duration-300"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="text-white text-xl leading-tight">{reservation.guest_name}</h2>
                <p className="text-xs text-[#8D7E73]/70">
                  {reservation.reservation_date} · {reservation.start_time} – {reservation.end_time}
                </p>
              </div>
              <span className={`text-[0.625rem] tracking-[0.15em] uppercase px-2.5 py-1 rounded-full flex items-center gap-1.5 shrink-0 ${statusStyles[reservation.status]}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusDot[reservation.status]}`} />
                {reservation.status.replace('_', ' ')}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-[#8D7E73] text-sm">
              <Phone className="w-3.5 h-3.5" />
              {reservation.guest_phone}
            </div>

            <div className="flex items-center gap-1.5 text-[#8D7E73] text-sm">
              <Users className="w-3.5 h-3.5" />
              Party of {reservation.party_size}
            </div>

            <div className="border-t border-[#8D7E73]/20" />

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-xs text-[#8D7E73]/70">
                <Clock className="w-3 h-3" />
                {timeAgo(reservation.created_at)}
              </span>
              <span className="text-xs text-[#8D7E73]/70">Created</span>
            </div>

            <select
              value={reservation.status}
              onChange={(event) => updateStatus(reservation.id, event.target.value as ReservationFilter)}
              className="bg-[#1b1816] border border-[#8D7E73]/30 rounded-xs text-xs tracking-widest text-[#8D7E73] px-3 py-2 outline-none cursor-pointer hover:border-[#A32D1C]/40 transition-colors duration-300"
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