'use client'

import { useRef } from "react"
import { usecart } from "@/lib/store/useCart"
import { Item } from "@/types"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

import Image from "next/image"

gsap.registerPlugin(useGSAP)

export default function CartItem({ items }: { items: Item[] }) {
  const { updateQuantity, removeItem } = usecart()
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.fromTo(
      containerRef.current,
      { autoAlpha: 0, y: 20 },
      { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' }
    )
  }, { scope: containerRef, dependencies: [items.length], revertOnUpdate: true })

  return (
    <div ref={containerRef} className="flex flex-col flex-1">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-4 md:gap-6 py-6 border-b border-[#8D7E73]/20 relative"
        >
          <Image
            src={item.image_url}
            alt={item.name}
            width={90}
            height={90}
            loading="eager"
            className="rounded-xs object-cover w-20 h-20 md:w-28 md:h-28 shrink-0"
          />

          <div className="flex flex-col gap-3 md:gap-4 flex-1 min-w-0">
            <h1 className="text-xl md:text-2xl text-[#A32D1C] leading-tight truncate pr-16">
              {item.name}
            </h1>

            <div className="flex items-center gap-4">
              <div className="flex items-center rounded-xs border border-[#8D7E73]/30 w-fit">
                <button
                  onClick={() => {
                    if (item.quantity <= 1) removeItem(item.id)
                    else updateQuantity(item.id, item.quantity - 1)
                  }}
                  className="flex h-8 w-8 items-center justify-center text-[#8D7E73] hover:text-[#A32D1C] transition-colors duration-300"
                >
                  -
                </button>

                <input
                  type="number"
                  value={item.quantity}
                  min={1}
                  max={10}
                  onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                  className="h-8 w-9 bg-transparent text-center text-xs text-white outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />

                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  disabled={item.quantity >= 10}
                  className="flex h-8 w-8 items-center justify-center text-[#8D7E73] hover:text-[#A32D1C] transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => removeItem(item.id)}
                data-cursor-hover
                className="cursor-pointer text-[0.625rem] tracking-[0.25em] uppercase text-[#8D7E73]/60 hover:text-[#A32D1C] active:scale-95 transition-colors duration-300"
              >
                Remove
              </button>
            </div>
          </div>

          <span className="absolute right-0 top-6 text-sm md:text-base text-white tracking-wide">
            ${item.price.toFixed(2)}
          </span>
        </div>
      ))}
    </div>
  )
}