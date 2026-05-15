"use client"

import { useState } from "react"
import MenuItemCard from "./MenuItemCard"
import { Menu } from "@/types"

export default function MenuClient({ items }: { items: Menu[] }) {
  const [search, setSearch] = useState("")

  const filtered = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <main className="bg-black min-h-screen flex flex-col p-6 gap-12 md:gap-4 text-white">
      <div className="h-20 w-full gap-6 text-center relative">
          <h1 className="text-red-700 font-bold dancing-script text-6xl inline">
            Menu:{" "}
          </h1>
          <input
            type="text"
            placeholder="Search coffee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-b-2 border-red-700 bg-transparent text-lg px-2 py-1 text-white placeholder-gray-400 focus:outline-none focus:ring-0 placeholder:text-center md:placeholder:text-left text-center md:text-left"
          />
        </div>
      <div className="flex flex-wrap gap-4 md:gap-12 justify-center">
        {filtered.map((item) => <MenuItemCard key={item.id} item={item} />)}
      </div>
    </main>
  )
}