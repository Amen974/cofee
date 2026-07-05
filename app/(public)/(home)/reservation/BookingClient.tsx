'use client'

import { Clock } from 'lucide-react'
import { ReservationSettings } from '@/types'
import { useBooking } from './useBooking'

const BookingClient = ({ settings }: { settings: ReservationSettings }) => {
  const {
    state,
    status,
    maxBookingDate,
    partySizeOptions,
    setDate,
    setPartySize,
    setSelected,
    setGuestName,
    setGuestPhone,
    book,
  } = useBooking(settings)

  return (
    <main className="min-h-screen flex flex-col items-center py-12 px-4 text-white font-serif">
      <div className="w-full max-w-2xl flex flex-col gap-8">
        <p className="text-[11px] tracking-[0.18em] uppercase text-neutral-600">
          Reserve a table
        </p>
        
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-50 border border-neutral-800 rounded-2xl p-5 bg-neutral-950">
            <p className="text-[11px] tracking-[0.15em] uppercase text-neutral-600 mb-4">When</p>
            <input
              type="date"
              value={state.date}
              onChange={e => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              max={maxBookingDate}
              className="w-full bg-transparent border border-neutral-800 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-neutral-500 hover:border-neutral-600 transition-colors scheme-dark"
            />
          </div>

          <div className="flex-1 min-w-50 border border-neutral-800 rounded-2xl p-5 bg-neutral-950">
            <p className="text-[11px] tracking-[0.15em] uppercase text-neutral-600 mb-4">Guests</p>
            <div className="grid grid-cols-5 gap-2">
              {partySizeOptions.map(partySize => (
                <button
                  key={partySize}
                  type="button"
                  onClick={() => setPartySize(partySize)}
                  className={`border rounded-xl py-2 text-sm transition-all ${state.partySize === partySize
                    ? 'border-red-700 bg-red-900/20 text-red-400'
                    : 'border-neutral-800 text-neutral-500 hover:border-neutral-600 hover:text-neutral-300'
                    }`}
                >
                  {partySize}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <p className="text-[11px] tracking-[0.18em] uppercase text-neutral-600 mb-4">
            Available times
          </p>

          <div className="flex flex-wrap gap-2">
            {status.loading ? (
              <p className="text-neutral-400 text-sm italic">Loading availability...</p>
            ) : state.slots.length === 0 && !status.success ? (
              <p className="text-neutral-600 text-sm italic">No available times for this selection</p>
            ) : (
              state.slots.map(slot => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelected(slot)}
                  className={`border rounded-xl px-5 py-2.5 text-sm tracking-wide transition-all ${state.selected === slot
                    ? 'border-red-700 bg-red-900/15 text-red-400'
                    : 'border-neutral-800 text-neutral-400 hover:border-red-800 hover:text-red-400'
                    }`}
                >
                  {slot}
                </button>
              ))
            )}
          </div>
        </div>

        {state.selected && (
          <div className="border border-neutral-800 rounded-2xl p-6 bg-neutral-950 flex flex-col gap-5">
            <div className="inline-flex items-center gap-2 bg-red-900/15 border border-red-800 rounded-lg px-3 py-1.5 text-red-400 text-sm w-fit">
              <Clock size={16} />
              {state.selected}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] tracking-[0.14em] uppercase text-neutral-600">Name</label>
              <input
                type="text"
                placeholder="Your full name"
                value={state.guestName}
                onChange={e => setGuestName(e.target.value)}
                className="bg-transparent border border-neutral-800 rounded-xl px-3 py-2.5 text-sm text-white placeholder-neutral-700 outline-none focus:border-neutral-500 hover:border-neutral-600 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] tracking-[0.14em] uppercase text-neutral-600">Phone</label>
              <input
                type="tel"
                placeholder="+1 234 567 8900"
                value={state.guestPhone}
                onChange={e => setGuestPhone(e.target.value)}
                className="bg-transparent border border-neutral-800 rounded-xl px-3 py-2.5 text-sm text-white placeholder-neutral-700 outline-none focus:border-neutral-500 hover:border-neutral-600 transition-colors"
              />
            </div>

            <button
              type="button"
              onClick={book}
              disabled={status.loading}
              className="bg-red-700 hover:bg-red-800 transition-colors rounded-xl py-3 text-sm tracking-widest uppercase mt-1 active:scale-95 disabled:opacity-50"
            >
              Confirm reservation
            </button>
          </div>
        )}

      </div>
      {status.error && (
        <p className="text-red-400 text-sm border border-red-900 bg-red-900/10 rounded-lg px-3 py-2 mb-4">
          {status.error}
        </p>
      )}
    </main>
  )
}

export default BookingClient
