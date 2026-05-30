"use client"

import { Item } from "@/types"
import MenuDashboardItemCard from "./MenuDashboardItemCard"
import AddMenuItem from "./AddMenuItem"

const MenuDashboardClient = ({ items }: { items: Item[] }) => {
  return (
    <main className="bg-black min-h-screen flex flex-col p-6 gap-12 md:gap-4 text-white">
      <div className="text-center">
        <h1 className="text-red-700 font-bold dancing-script text-6xl">
          Manage Menu
        </h1>
      </div>
      <div className="flex flex-wrap gap-4 md:gap-12 justify-center">
        {items.map((item) => (
          <MenuDashboardItemCard key={item.id} item={item} />
        ))}
        <AddMenuItem />
      </div>
    </main>
  )
}

export default MenuDashboardClient