'use client'

import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'
type Slot = string

const MAX_BOOKING_DAYS = 30

const getDateString = (date: Date): string => {
  return date.toISOString().split('T')[0]
}

const getMaxBookingDate = (): string => {
  const maxDate = new Date()
  maxDate.setDate(maxDate.getDate() + MAX_BOOKING_DAYS)
  return getDateString(maxDate)
}

export default function BookingPage() {
  const [date, setDate] = useState(getDateString(new Date()))
  const [partySize, setPartySize] = useState(2)
  const [slots, setSlots] = useState<Slot[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [guestName, setGuestName] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!date || !partySize) return
    const fetchSlots = async () => {
      setError('')
      setSelected(null)
      const res = await fetch(`/api/availability?date=${date}&party_size=${partySize}`)
      const data = await res.json()
      if (!res.ok) return setError(data.error)
      setSlots(data.available_slots)
    }
    fetchSlots()
  }, [date, partySize])

  const book = async () => {
    setError('')
    setSuccess('')
    const res = await fetch('/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date,
        start_time: selected,
        party_size: partySize,
        guest_name: guestName,
        guest_phone: guestPhone,
      }),
    })
    console.log(res)
    console.log(res.status)
    console.log(res.headers.get('Content-Type'))
    const data = await res.json()
    if (!res.ok) return setError(data.error)
    setSuccess(`Reservation confirmed for ${selected}`)
    setSlots([])
    setSelected(null)
    setGuestName('')
    setGuestPhone('')
  }

  return (
    <main className="bg-black min-h-screen flex flex-col items-center py-12 px-4 text-white font-serif">
      <div className="w-full max-w-2xl flex flex-col gap-8">

        
        <p className="text-[11px] tracking-[0.18em] uppercase text-neutral-600">
          Reserve a table
        </p>

        
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-50 border border-neutral-800 rounded-2xl p-5 bg-neutral-950">
            <p className="text-[11px] tracking-[0.15em] uppercase text-neutral-600 mb-4">When</p>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              min={getDateString(new Date())}
              max={getMaxBookingDate()}
              className="w-full bg-transparent border border-neutral-800 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-neutral-500 hover:border-neutral-600 transition-colors scheme-dark"
            />
          </div>

          <div className="flex-1 min-w-50 border border-neutral-800 rounded-2xl p-5 bg-neutral-950">
            <p className="text-[11px] tracking-[0.15em] uppercase text-neutral-600 mb-4">Guests</p>
            <div className="grid grid-cols-5 gap-2">
              {[1,2,3,4,5,6,7,8,9,10].map(n => (
                <button
                  key={n}
                  onClick={() => setPartySize(n)}
                  className={`border rounded-xl py-2 text-sm transition-all ${
                    partySize === n
                      ? 'border-red-700 bg-red-900/20 text-red-400'
                      : 'border-neutral-800 text-neutral-500 hover:border-neutral-600 hover:text-neutral-300'
                  }`}
                >
                  {n}
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
            {slots.length === 0 ? (
              <p className="text-neutral-600 text-sm italic">No available times for this selection</p>
            ) : (
              slots.map(slot => (
                <button
                  key={slot}
                  onClick={() => setSelected(slot)}
                  className={`border rounded-xl px-5 py-2.5 text-sm tracking-wide transition-all ${
                    selected === slot
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

        
        {selected && (
          <div className="border border-neutral-800 rounded-2xl p-6 bg-neutral-950 flex flex-col gap-5">
            <div className="inline-flex items-center gap-2 bg-red-900/15 border border-red-800 rounded-lg px-3 py-1.5 text-red-400 text-sm w-fit">
              <Clock size={16} />
              {selected}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] tracking-[0.14em] uppercase text-neutral-600">Name</label>
              <input
                type="text"
                placeholder="Your full name"
                value={guestName}
                onChange={e => setGuestName(e.target.value)}
                className="bg-transparent border border-neutral-800 rounded-xl px-3 py-2.5 text-sm text-white placeholder-neutral-700 outline-none focus:border-neutral-500 hover:border-neutral-600 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] tracking-[0.14em] uppercase text-neutral-600">Phone</label>
              <input
                type="tel"
                placeholder="+1 234 567 8900"
                value={guestPhone}
                onChange={e => setGuestPhone(e.target.value)}
                className="bg-transparent border border-neutral-800 rounded-xl px-3 py-2.5 text-sm text-white placeholder-neutral-700 outline-none focus:border-neutral-500 hover:border-neutral-600 transition-colors"
              />
            </div>

            <button
              onClick={book}
              className="bg-red-700 hover:bg-red-800 transition-colors rounded-xl py-3 text-sm tracking-widest uppercase mt-1 active:scale-95"
            >
              Confirm reservation
            </button>

            {error && (
              <p className="text-red-400 text-sm border border-red-900 bg-red-900/10 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
            {success && (
              <p className="text-green-400 text-sm border border-green-900 bg-green-900/10 rounded-lg px-3 py-2">
                {success}
              </p>
            )}
          </div>
        )}

      </div>
    </main>
  )
}