export function generateSlots(
  openTime: string,
  closeTime: string,
  intervalMin: number,
  blockDurationMin: number,
  timeZone: string,
  leadTimeMin: number,
  reservationDate?: string,
): string[] {
  const slots: string[] = []
  const [openH, openM] = openTime.split(':').map(Number)
  const [closeH, closeM] = closeTime.split(':').map(Number)

  const openMinutes = openH * 60 + openM
  const closeMinutes = closeH * 60 + closeM
  let startMinutes = openMinutes

  if (reservationDate) {
    const nowInZone = new Date(new Date().toLocaleString('en-US', { timeZone }))

    const todayIso = `${nowInZone.getFullYear().toString().padStart(4, '0')}-${(nowInZone.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${nowInZone.getDate().toString().padStart(2, '0')}`

    if (reservationDate === todayIso) {
      const currentMinutes = nowInZone.getHours() * 60 + nowInZone.getMinutes() + leadTimeMin
      startMinutes = Math.max(openMinutes, currentMinutes)

      const remainder = (startMinutes - openMinutes) % intervalMin
      if (remainder !== 0) {
        startMinutes += intervalMin - remainder
      }
    }
  }

  for (let t = startMinutes; t + blockDurationMin <= closeMinutes; t += intervalMin) {
    const h = Math.floor(t / 60).toString().padStart(2, '0')
    const m = (t % 60).toString().padStart(2, '0')
    slots.push(`${h}:${m}`)
  }

  return slots
}

export function getSeatsInUse(
  slot: string,
  blockDurationMin: number,
  reservations: { start_time: string; end_time: string; party_size: number }[]
): number {
  const toMin = (t: string) => {
    const [h, m] = t.split(':').map(Number)
    return h * 60 + m
  }

  const slotStart = toMin(slot)
  const slotEnd = slotStart + blockDurationMin

  return reservations.reduce((sum, r) => {
    const rStart = toMin(r.start_time)
    const rEnd = toMin(r.end_time)
    if (rStart < slotEnd && rEnd > slotStart) {
      return sum + r.party_size
    }
    return sum
  }, 0)
}