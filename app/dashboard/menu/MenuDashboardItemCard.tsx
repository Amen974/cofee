"use client"

import { useState } from "react"
import Image from "next/image"
import { Item } from "@/types"
import { updateIsAvailable } from "./actions"
import MenuItemForm from "./MenuItemForm"

export default function MenuDashboardItemCard({ item }: { item: Item }) {
  const [isAvailable, setIsAvailable] = useState<boolean>(item.is_available)
  const [isUpdating, setIsUpdating] = useState<boolean>(false)

  return (
    <div className="border-2 border-red-700 rounded-2xl p-4 flex flex-col h-110 relative hover:shadow-lg hover:shadow-red-700/20">
      <button
        onClick={() => updateIsAvailable(item.id, !isAvailable).then(() => setIsAvailable(!isAvailable))}
        className={`absolute top-4 right-4 px-3 py-1 rounded-full font-bold text-sm transition-colors ${
          isAvailable
            ? "bg-green-500 text-white hover:bg-green-600"
            : "bg-red-500 text-white hover:bg-red-600"
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
        className="rounded-2xl object-cover h-50"
      />

      <div>
        <h1 className="text-red-700 text-4xl font-bold my-2">{item.name}</h1>
        <p className="text-lg font-semibold mb-2 text-white">${item.price}</p>
      </div>

      <div className="flex flex-col gap-3 mt-auto">
        <button
          onClick={() => setIsUpdating(true)}
          className="bg-blue-600 text-white py-2 rounded-xl font-semibold
            hover:bg-blue-700 transition-colors active:scale-95 cursor-pointer"
        >
          Update Item
        </button>

        <button
          onClick={() => {}}
          className="bg-red-600 text-white py-2 rounded-xl font-semibold
            hover:bg-red-700 transition-colors active:scale-95 cursor-pointer"
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
      
    </div>
  )
}
