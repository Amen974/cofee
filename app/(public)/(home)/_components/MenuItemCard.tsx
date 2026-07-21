"use client"
import { useState, useRef } from "react"
import Image from "next/image"
import { MinusIcon, PlusIcon } from "@phosphor-icons/react"
import { Item } from "@/types"
import { usecart } from "@/lib/store/useCart"
import { useCartIndicator } from "@/lib/store/useCartIndicator"

export default function MenuItemCard({ item }: { item: Item }) {
  const [quantity, setQuantity] = useState(1)
  const { addItem } = usecart()
  const { setCartState, reset } = useCartIndicator()
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleAddToCart() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    addItem({ ...item, quantity })
    setCartState('Adding')

    timeoutRef.current = setTimeout(() => {
      reset()
      timeoutRef.current = null
    }, 500)
  }

  return (
    <div className="group relative w-72 m-3 rounded-2xl border border-[#8D7E73]/20 bg-[#211c19] p-4 text-[#8D7E73] transition-colors duration-300">
      <div className="relative overflow-hidden rounded-xl">
        <Image
          src={item.image_url || '/placeholder-coffee.png'}
          alt={item.name}
          width={250}
          height={200}
          loading="eager"
          className="h-44 w-full rounded-xl object-cover transition-transform duration-500"
        />
        {!item.is_available && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#1b1816]/70">
            <span className="text-[0.625rem] tracking-[0.25em] uppercase text-white">
              out of stock
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <h1 className="text-3xl leading-tight text-[#A32D1C]">{item.name}</h1>
        <p className="mt-1 shrink-0 text-sm tracking-widest text-[#8D7E73]">
          ${item.price.toFixed(2)}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex items-center rounded-xs border border-[#8D7E73]/30">
          <button
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            disabled={!item.is_available}
            aria-label="Decrease quantity"
            className="flex h-8 w-8 items-center justify-center text-[#8D7E73] transition-colors duration-300 hover:text-[#A32D1C] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <MinusIcon size={12} />
          </button>

          <input
            type="number"
            value={quantity}
            min={1}
            max={10}
            onChange={(e) => setQuantity(Math.min(10, Math.max(1, Number(e.target.value))))}
            disabled={!item.is_available}
            className="h-8 w-9 bg-transparent text-center text-xs text-white outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none disabled:opacity-40"
          />

          <button
            onClick={() => setQuantity(q => Math.min(10, q + 1))}
            disabled={!item.is_available}
            aria-label="Increase quantity"
            className="flex h-8 w-8 items-center justify-center text-[#8D7E73] transition-colors duration-300 hover:text-[#A32D1C] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <PlusIcon size={12} />
          </button>
        </div>

        <button
          disabled={!item.is_available}
          onClick={handleAddToCart}
          data-cursor-hover
          className="flex-1 h-8 rounded-xs bg-[#9a2d1e] text-[0.625rem] uppercase tracking-[0.25em] text-white transition-colors duration-300 hover:bg-[#8d2414] disabled:cursor-not-allowed disabled:bg-[#8D7E73]/20 disabled:text-[#8D7E73]"
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}