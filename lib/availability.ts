export function generateSlots(
  openTime: string,
  closeTime: string,
  intervalMin: number,
  blockDurationMin: number
): string[] {
  const slots: string[] = []
  const [openH, openM] = openTime.split(':').map(Number)
  const [closeH, closeM] = closeTime.split(':').map(Number)

  const openMinutes = openH * 60 + openM
  const closeMinutes = closeH * 60 + closeM

  for (let t = openMinutes; t + blockDurationMin <= closeMinutes; t += intervalMin) {
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
    // overlaps if rStart < slotEnd AND rEnd > slotStart
    if (rStart < slotEnd && rEnd > slotStart) {
      return sum + r.party_size
    }
    return sum
  }, 0)
}