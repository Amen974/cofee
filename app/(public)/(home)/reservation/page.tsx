'use client'

import { useState, useEffect } from 'react'

type Slot = string

export default function BookingPage() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
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
    const data = await res.json()
    if (!res.ok) return setError(data.error)
    setSuccess(`Reservation confirmed for ${selected}`)
    setSlots([])
    setSelected(null)
  }

  return (
    <>
      <h1>Book a Table</h1>

      <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      <input type="number" value={partySize} min={1} onChange={e => setPartySize(Number(e.target.value))} />

      {slots.length > 0 && (
        <>
          <p>Select a time:</p>
          {slots.map(slot => (
            <button
              key={slot}
              onClick={() => setSelected(slot)}
              style={{ fontWeight: selected === slot ? 'bold' : 'normal' }}
            >
              {slot}
            </button>
          ))}
        </>
      )}

      {selected && (
        <>
          <p>Selected: {selected}</p>
          <input placeholder="Name" value={guestName} onChange={e => setGuestName(e.target.value)} />
          <input placeholder="Phone" value={guestPhone} onChange={e => setGuestPhone(e.target.value)} />
          <button onClick={book}>Confirm Booking</button>
        </>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </>
  )
}