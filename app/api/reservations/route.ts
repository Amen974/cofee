import { NextRequest, NextResponse } from 'next/server'
import { generateSlots, getSeatsInUse } from '@/lib/availability'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'


export async function GET(req: NextRequest) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

  const { searchParams } = new URL(req.url)
  const date = searchParams.get('date')         // YYYY-MM-DD
  const partySizeRaw = searchParams.get('party_size')

  if (!date || !partySizeRaw)
    return NextResponse.json({ error: 'date and party_size are required' }, { status: 400 })

  const partySize = parseInt(partySizeRaw)
  if (isNaN(partySize) || partySize < 1)
    return NextResponse.json({ error: 'Invalid party_size' }, { status: 400 })

  // 1. Load settings
  const { data: settings, error: sErr } = await supabase
    .from('restaurant_settings')
    .select('*')
    .single()

  if (sErr || !settings)
    return NextResponse.json({ error: 'Could not load settings' }, { status: 500 })

  const { open_time, close_time, slot_interval, total_capacity,
          session_duration, cleaning_buffer, max_party_size } = settings

  if (partySize > max_party_size)
    return NextResponse.json({ error: `Max party size is ${max_party_size}` }, { status: 400 })

  const blockDuration = session_duration + cleaning_buffer

  // 2. Load confirmed reservations for that date
  const { data: reservations, error: rErr } = await supabase
    .from('reservations')
    .select('start_time, end_time, party_size')
    .eq('reservation_date', date)
    .eq('status', 'confirmed')

  if (rErr)
    return NextResponse.json({ error: 'Could not load reservations' }, { status: 500 })

  // 3. Generate slots and filter available ones
  const slots = generateSlots(open_time, close_time, slot_interval, blockDuration)

  const available = slots.filter(slot => {
    const seatsUsed = getSeatsInUse(slot, blockDuration, reservations ?? [])
    return (total_capacity - seatsUsed) >= partySize
  })

  return NextResponse.json({ date, party_size: partySize, available_slots: available })
}