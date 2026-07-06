"use client"

import { useState } from "react"
import Image from "next/image"
import { Item } from "@/types"
import { deleteItem, updateIsAvailable } from "./actions"
import MenuItemForm from "./MenuItemForm"
import { useCartIndicator } from "@/lib/store/useCartIndicator"

export default function MenuDashboardItemCard({ item }: { item: Item }) {
  const [isAvailable, setIsAvailable] = useState<boolean>(item.is_available)
  const { setCartState, reset, cartState } = useCartIndicator()
  const [isUpdating, setIsUpdating] = useState<boolean>(false)
  const [isDeleting, setIsDeleting] = useState<boolean>(false)

  return (
    <div className="border border-[#8D7E73]/20 bg-[#211c19] rounded-2xl p-4 flex flex-col h-110 w-62 relative hover:border-[#8D7E73]/40 transition-colors duration-300">
      <button
        onClick={() => updateIsAvailable(item.id, !isAvailable).then(() => setIsAvailable(!isAvailable))}
        data-cursor-hover
        className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[0.625rem] tracking-[0.15em] uppercase transition-colors duration-300 ${isAvailable
          ? "bg-[#9a2d1e] text-white hover:bg-[#8d2414]"
          : "bg-[#8D7E73]/20 text-[#8D7E73] hover:bg-[#8D7E73]/30"
          }`}
      >
        {isAvailable ? "Available" : "Unavailable"}
      </button>

      <Image
        src={item.image_url}
        alt={item.name}
        width={200}
        height={200}
        loading="eager"
        className="rounded-xl object-cover h-50"
      />

      <div>
        <h1 className="text-[#A32D1C] text-4xl my-2">{item.name}</h1>
        <p className="text-sm tracking-widest mb-2 text-[#8D7E73]">${item.price}</p>
      </div>

      <div className="flex flex-col gap-2 mt-auto">
        <button
          onClick={() => setIsUpdating(true)}
          data-cursor-hover
          className="bg-[#8D7E73]/10 border border-[#8D7E73]/30 text-white py-2 rounded-xs text-[0.625rem] tracking-[0.2em] uppercase
            hover:bg-[#8D7E73]/20 transition-colors duration-300 active:scale-95 cursor-pointer"
        >
          Update Item
        </button>

        <button
          onClick={() => setIsDeleting(true)}
          data-cursor-hover
          className="bg-[#9a2d1e] text-white py-2 rounded-xs text-[0.625rem] tracking-[0.2em] uppercase
            hover:bg-[#8d2414] transition-colors duration-300 active:scale-95 cursor-pointer"
        >
          Delete Item
        </button>
      </div>

      
      {isUpdating && (
        <div className="fixed inset-0 z-40 overflow-hidden bg-black/70 p-4">
          <div className="flex min-h-full items-center justify-center">
            <MenuItemForm item={item} setIsUpdating={setIsUpdating} />
          </div>
        </div>
      )}

      {isDeleting && (
        <div className="fixed inset-0 z-40 overflow-hidden bg-black/70 p-4">
          <div className="flex min-h-full items-center justify-center">
            <div className="border border-[#8D7E73]/20 bg-[#211c19] rounded-2xl p-6 w-80 flex flex-col gap-4">
              <h2 className="text-[#A32D1C] text-2xl">Delete &quot;{item.name}&quot; ?</h2>
              <p className="text-sm text-[#8D7E73]">
                This will permanently delete this item from the database. This action cannot be undone.
              </p>

              <div className="flex flex-col gap-2 mt-2">
                <button
                  onClick={async () => {
                    setCartState('Deleting')
                    await deleteItem(item.id)
                    setIsDeleting(false)
                    reset()
                  }}
                  disabled={cartState === 'Deleting'}
                  data-cursor-hover
                  className="bg-[#9a2d1e] text-white py-2 rounded-xs text-[0.625rem] tracking-[0.2em] uppercase
                    hover:bg-[#8d2414] transition-colors duration-300 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  delete
                </button>
                <button
                  onClick={() => { setIsDeleting(false); reset() }}
                  disabled={cartState === 'Deleting'}
                  data-cursor-hover
                  className="bg-[#8D7E73]/10 border border-[#8D7E73]/30 text-white py-2 rounded-xs text-[0.625rem] tracking-[0.2em] uppercase
                    hover:bg-[#8D7E73]/20 transition-colors duration-300 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}