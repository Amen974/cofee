"use client"

import { Item } from "@/types"
import MenuDashboardItemCard from "./MenuDashboardItemCard"
import AddMenuItem from "./AddMenuItem"

const MenuDashboardClient = ({ items }: { items: Item[] }) => {
  return (
    <main className="min-h-screen flex flex-col p-6 gap-12 md:gap-10 text-[#8D7E73]">
      <div className="text-center">
        <h1 className="text-[#A32D1C] text-6xl">
          Manage Menu
        </h1>
        <p className="text-[0.625rem] tracking-[0.25em] uppercase mt-2 text-[#8D7E73]/70">
          Add, update, and toggle availability
        </p>
      </div>
      <div className="flex flex-wrap gap-4 md:gap-10 justify-center">
        {items.map((item) => (
          <MenuDashboardItemCard key={item.id} item={item} />
        ))}
        <AddMenuItem />
      </div>
    </main>
  )
}

export default MenuDashboardClient