'use client'

import { usecart } from "@/lib/store/useCart"
import { Menu } from "@/types"

import Image from "next/image"

export default function CartItem({ items }: { items: Menu[] }) {
  const { updateQuantity, removeItem } = usecart()

  return (
    <>
      {items.map((item) => (
        <div key={item.id} className="flex items-center p-6 gap-4 mb-5 relative">
          <Image
            src={item.image_url}
            alt={item.name}
            width={100}
            height={100}
            loading="eager"
            className="rounded-2xl object-cover md:hidden"
          />

          <Image
            src={item.image_url}
            alt={item.name}
            width={150}
            height={150}
            loading="eager"
            className="rounded-2xl object-cover hidden md:block"
          />

          <div className="flex flex-col gap-6 ">
            <h1 className="text-4xl text-red-700">{item.name}</h1>

            <div className="flex gap-2">
              <div className="flex items-center border-2 border-red-700 rounded-xl overflow-hidden w-fit">
                <button
                  onClick={() => {
                    if (item.quantity <= 1) removeItem(item.id)
                    else updateQuantity(item.id, item.quantity - 1)
                  }}
                  className="px-3 py-1 text-red-700 font-bold hover:bg-red-700 hover:text-white transition-colors"
                >
                  -
                </button>

                <input
                  type="number"
                  value={item.quantity}
                  min={1}
                  max={10}
                  onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                  className="w-10 text-center bg-transparent text-white outline-none"
                />

                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  disabled={item.quantity >= 10}
                  className="px-3 py-1 text-red-700 font-bold hover:bg-red-700 hover:text-white transition-colors disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>

              <button onClick={() => removeItem(item.id)} className="cursor-pointer hover:text-red-700 active:scale-95 text-xs">Remove</button>
            </div>
            <span className="absolute right-6 top-4">${item.price}</span>
          </div>
        </div>
      ))}
    </>
  )
}