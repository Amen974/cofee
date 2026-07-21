'use client'

import { usecart } from '@/lib/store/useCart'
import CartItem from '../_components/CartItem'
import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ArrowRightIcon, ShoppingBagOpenIcon } from '@phosphor-icons/react'
import NavLink from '@/app/components/NavLink'
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(useGSAP)

type Settings = {
  tax_rate: number
  delivery_fee: number
}

const Page = () => {
  const { items, totalPrice } = usecart()
  const [mounted, setMounted] = useState(false)
  const [settings, setSettings] = useState<Settings>({ tax_rate: 0, delivery_fee: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

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

  useGSAP(() => {
    if (!mounted) return

    gsap.fromTo('.cart-fade-in',
      { autoAlpha: 0, y: 20 },
      { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' })
  }, { scope: containerRef, dependencies: [mounted], revertOnUpdate: true })

  if (!mounted) return null

  const subtotal = totalPrice()
  const tax = subtotal * (settings.tax_rate / 100)
  const total = subtotal + tax + settings.delivery_fee

  const isEmpty = items.length === 0

  return (
    <div ref={containerRef} className="px-4 md:px-10 lg:px-16 text-[#8D7E73]">
      {isEmpty ? (
        <div className="cart-fade-in min-h-screen flex flex-col items-center justify-center py-32 gap-4">
          <ShoppingBagOpenIcon size={56} strokeWidth={1} className="text-[#8D7E73]/40" />
          <p className="text-[0.625rem] md:text-xs tracking-[0.25em] uppercase text-[#8D7E73]/60">
            Your cart is empty
          </p>
          <NavLink
            href="/menu"
            className="mt-2 text-[0.625rem] md:text-xs tracking-[0.25em] uppercase text-[#A32D1C] hover:text-[#9a2d1e] underline underline-offset-4 transition-colors duration-300"
          >
            Browse the menu
          </NavLink>
        </div>
      ) : (
        <div className="cart-fade-in max-w-6xl mx-auto">
          <div className="w-full flex flex-col lg:flex-row lg:gap-16 min-h-screen">
            <div className="flex-1 flex items-center">
              <CartItem items={items} />
            </div>

            <div className="lg:w-88 mb-5">
              <div className="lg:sticky lg:top-1/2 lg:transform lg:-translate-y-1/2 rounded-3xl border-3 border-[#2A1F1C] bg-[#141110] p-6 md:p-7 flex flex-col gap-5">
                <h2 className="text-[0.625rem] md:text-xs tracking-[0.25em] uppercase text-[#A32D1C] font-semibold">
                  Order Summary
                </h2>

                <div className="flex flex-col gap-3 text-xs tracking-wide">
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

                <div className="border-t border-[#8D7E73]/20 pt-4 flex justify-between items-baseline">
                  <span className="text-[0.625rem] tracking-[0.25em] uppercase">Total</span>
                  <span className="text-[#A32D1C] text-2xl font-bold">${total.toFixed(2)}</span>
                </div>

                <NavLink
                  href='/cart/checkout'
                  data-cursor-hover
                  className="w-full h-11 bg-[#9a2d1e] hover:bg-[#8d2414] active:scale-95 transition-all duration-300 text-white text-[0.625rem] tracking-[0.25em] uppercase rounded-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  Continue with order
                  <ArrowRightIcon size={14} />
                </NavLink>
              </div>
            </div>
          </div>
        </div>  
      )}
    </div>
  )
}

export default Page