'use client'

import { usecart } from '@/lib/store/useCart'
import CartItem from '../_components/CartItem'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ArrowRight, PackageOpen } from 'lucide-react'
import Link from "next/link"

type Settings = {
  tax_rate: number
  delivery_fee: number
}

const Page = () => {
  const { items, totalPrice } = usecart()
  const [mounted, setMounted] = useState(false)
  const [settings, setSettings] = useState<Settings>({ tax_rate: 0, delivery_fee: 0 })

  useEffect(() => {
    const setTrue = () => {
      setMounted(true)
    }
    setTrue()
    const fetchSettings = async () => {
      const { data } = await createClient()
        .from('restaurant_settings')
        .select('tax_rate, delivery_fee')
        .maybeSingle()
      if (data) setSettings(data)
    }
    fetchSettings()
  }, [])

  if (!mounted) return null

  const subtotal = totalPrice()
  const tax = subtotal * (settings.tax_rate / 100)
  const total = subtotal + tax + settings.delivery_fee

  const isEmpty = items.length === 0

  return (
    <div className="bg-black min-h-screen text-white py-10 px-6 flex justify-center items-center">
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4 text-white/40 w-screen">
          <PackageOpen size={64} strokeWidth={1} />
          <p className="text-xl font-medium">Your cart is empty</p>
          <a
            href="/menu"
            className="mt-2 text-red-600 hover:text-red-500 text-sm underline underline-offset-4"
          >
            Browse the menu
          </a>
        </div>
      ) : (
        <div className='w-full h-full flex flex-col md:flex-row'>
          <div className='flex-1 flex flex-col justify-center'>
            <CartItem items={items} />
          </div>

          <div className='flex-1 flex justify-center items-center'>
            <div className="sticky top-6 border border-white/10 rounded-2xl p-6 bg-white/5 backdrop-blur-sm flex flex-col gap-5 w-[50vh] md:w-85 lg:w-95">
                <h2 className="text-xl font-bold text-red-600 tracking-tight">Order Summary</h2>

                <div className="flex flex-col gap-3 text-sm text-white/70">
                  <div className="flex justify-between">
                    <span>Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
                    <span className="text-white">${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Tax ({settings.tax_rate}%)</span>
                    <span className="text-white">${tax.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Delivery fee</span>
                    <span className="text-white">
                      {settings.delivery_fee === 0 ? 'Free' : `$${settings.delivery_fee.toFixed(2)}`}
                    </span>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-red-500">${total.toFixed(2)}</span>
                </div>

                <Link
                  href= '/cart/checkout' 
                  className="w-full bg-red-700 hover:bg-red-600 active:scale-95 transition-all text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  Continue with order
                  <ArrowRight size={18} />
                </Link>
              </div>
          </div>
          
        </div>
      )}

    </div>
  )
}

export default Page