"use client"
import { useState } from "react"
import Image from "next/image"
import { Menu } from "@/types"
import { usecart } from "@/lib/cart/useCart"

export default function MenuItemCard({ item }: { item: Menu }) {
  const [quantity, setQuantity] = useState(1)
  const { addItem } = usecart()

  return (
    <div className={`border-2 border-red-700 rounded-2xl p-4 flex flex-col h-110 relative ${!item.is_available ? 'opacity-60' : 'hover:shadow-lg hover:shadow-red-700/20'}`}>
      {!item.is_available && (
        <span className="absolute top-4 left-4 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full">
          Out of Stock
        </span>
      )}

        <Image
          src={item.image_url}
          alt={item.name}
          width={200}
          height={200}
          loading="eager"
          className="rounded-2xl object-cover h-50"
        />

      <div>
        <h1 className="text-red-700 text-4xl font-bold my-2">{item.name}</h1>
        <p className="text-lg font-semibold mb-2">${item.price}</p>
        <div className="flex items-center border-2 border-red-700 rounded-xl overflow-hidden w-fit">
          <button
            onClick={() => setQuantity(q => Math.min(10, q + 1))}
            disabled={!item.is_available}
            className="px-3 py-1 text-red-700 font-bold hover:bg-red-700 hover:text-white transition-colors disabled:cursor-not-allowed"
          >
            +
          </button>
          <input
            type="number"
            value={quantity}
            min={1}
            max={10}
            onChange={(e) => setQuantity(Math.min(10, Math.max(1, Number(e.target.value))))}
            disabled={!item.is_available}
            className="w-10 text-center bg-transparent text-white outline-none disabled:cursor-not-allowed"
          />
          <button
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            disabled={!item.is_available}
            className="px-3 py-1 text-red-700 font-bold hover:bg-red-700 hover:text-white transition-colors disabled:cursor-not-allowed"
          >
            -
          </button>
        </div>
      </div>
      
      <button
        disabled={!item.is_available}
        onClick={() => addItem({ ...item, quantity })}
        className="bg-red-700 text-white py-2 rounded-xl font-semibold
            hover:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6 cursor-pointer active:scale-95"
      >
        Add to Cart
      </button>
    </div>
  )
}