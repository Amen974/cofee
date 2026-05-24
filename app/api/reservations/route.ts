import { NextRequest, NextResponse } from 'next/server'
import { generateSlots, getSeatsInUse } from '@/lib/availability'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const body = await req.json()
  const { date, start_time, party_size, guest_name, guest_phone } = body

  if (!date || !start_time || !party_size || !guest_name || !guest_phone)
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 })

  // 1. Load settings
  const { data: settings, error: sErr } = await supabase
    .from('restaurant_settings')
    .select('*')
    .single()

  if (sErr || !settings)
    return NextResponse.json({ error: 'Could not load settings' }, { status: 500 })

  const { open_time, close_time, slot_interval, total_capacity,
          session_duration, cleaning_buffer, max_party_size } = settings

  if (party_size > max_party_size)
    return NextResponse.json({ error: `Max party size is ${max_party_size}` }, { status: 400 })

  const blockDuration = session_duration + parseInt(cleaning_buffer)

  // 2. Validate the requested slot exists in the valid grid
  const validSlots = generateSlots(open_time, close_time, slot_interval, blockDuration)
  if (!validSlots.includes(start_time))
    return NextResponse.json({ error: 'Invalid time slot' }, { status: 400 })

  // 3. Re-check availability (race condition guard)
  const { data: reservations, error: rErr } = await supabase
    .from('reservations')
    .select('start_time, end_time, party_size')
    .eq('reservation_date', date)
    .eq('status', 'confirmed')

  if (rErr)
    return NextResponse.json({ error: 'Could not validate availability' }, { status: 500 })

  const seatsUsed = getSeatsInUse(start_time, blockDuration, reservations ?? [])
  if ((total_capacity - seatsUsed) < party_size)
    return NextResponse.json({ error: 'Slot no longer available' }, { status: 409 })

  // 4. Compute end_time
  const [h, m] = start_time.split(':').map(Number)
  const endMin = h * 60 + m + blockDuration
  const end_time = `${Math.floor(endMin / 60).toString().padStart(2, '0')}:${(endMin % 60).toString().padStart(2, '0')}`

  // 5. Insert
  const { data, error: iErr } = await supabase
    .from('reservations')
    .insert({ reservation_date: date, start_time, end_time, party_size, guest_name, guest_phone })
    .select()
    .single()

  if (iErr)
    return NextResponse.json({ error: 'Failed to create reservation' }, { status: 500 })

  return NextResponse.json({ reservation: data }, { status: 201 })
}