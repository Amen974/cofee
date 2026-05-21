'use client'

import { usecart } from '@/lib/store/useCart'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { ArrowRight, MapPin } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Settings = { tax_rate: number; delivery_fee: number }

const Page = () => {
  const supabase = createClient()
  const { items, totalPrice, clearCart } = usecart()
  const router = useRouter()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [address, setAddress] = useState('')
  const [lat, setLat] = useState<number | null>(null)
  const [lng, setLng] = useState<number | null>(null)
  const [settings, setSettings] = useState<Settings>({ tax_rate: 0, delivery_fee: 0 })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from('restaurant_settings')
        .select('tax_rate, delivery_fee')
        .maybeSingle()
      if (data) setSettings(data)
    }
    fetchSettings()
  }, [])

  const subtotal = totalPrice()
  const tax = subtotal * (settings.tax_rate / 100)
  const total = subtotal + tax + settings.delivery_fee

  const getLocation = async () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude)
        setLng(pos.coords.longitude)
        setAddress('')
      },
      (err) => console.error('Location error:', err)
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const fullNotes = address ? `Address: ${address}${notes ? ` | Notes: ${notes}` : ''}` : notes

    const { error } = await supabase.from('orders').insert({
      customer_name: name,
      phone,
      lat: lat ?? null,
      lng: lng ?? null,
      status: 'pending',
      notes: fullNotes,
      items: items,
      total_price: total,
    })

    setLoading(false)

    if (error) {
      console.error(error)
      return
    }

    clearCart()
    router.push('/')
  }

  return (
    <form onSubmit={handleSubmit} className='bg-black min-h-screen flex justify-center items-center text-white'>
      <div className='border border-gray-800 flex flex-col gap-4 rounded-xl shadow-2xl w-[90vw] max-w-130 p-7 bg-[#0a0a0a]'>
        <h1 className='text-red-700 text-3xl'>Your Details</h1>
        <div>
          <label className='uppercase text-xs text-gray-300'>Full name</label>
          <input
            required
            type='text'
            placeholder='Jane Doe'
            onChange={(e) => setName(e.target.value)}
            className="flex h-10 w-full rounded-xl border border-gray-800 bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:border-red-700 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          />
        </div>

        <div>
          <label className='uppercase text-xs text-gray-300'>Phone</label>
          <input
            required
            type='tel'
            placeholder='+1 555 000 000'
            onChange={(e) => setPhone(e.target.value)}
            className="flex h-10 w-full rounded-xl border border-gray-800 bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:border-red-700 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          />
        </div>

        <h1 className='text-red-700 text-3xl'>Delivery</h1>

        <div>
          <button type='button' onClick={ getLocation } className='text-red-400 bg-[#200101] border border-red-700 px-3 py-2 rounded-xl cursor-pointer hover:bg-[#360202] active:scale-95 flex justify-center gap-2 w-full'>
            <MapPin size={18} className='mt-0.5' />
            Use my current location
          </button>
          <span className='text-xs text-gray-300'>Or type your address manually below.</span>
        </div>


        <div>
          <label className='uppercase text-xs text-gray-300'>Address</label>
          <input
            placeholder='Street, city, apt #'
            onChange={(e) => setAddress(e.target.value)}
            className="flex h-10 w-full rounded-xl border border-gray-800 bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:border-red-700 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          />
        </div>

        <div>
          <label className='uppercase text-xs text-gray-300'>Order notes (optional)</label>
          <textarea
            placeholder='Leave at the door, oat milk only...'
            onChange={(e) => setNotes(e.target.value)}
            className="flex w-full border border-gray-800 bg-transparent px-3 py-2 text-base shadow-sm focus-visible:outline-none focus-visible:border-red-700 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-25 resize-none rounded-xl"
          />
        </div>

        <button
          type='submit'
          className="w-full bg-red-700 hover:bg-red-600 active:scale-95 transition-all text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
        >
          Place order
          <ArrowRight size={18} />
        </button>
      </div>
    </form>
  )
}

export default Page