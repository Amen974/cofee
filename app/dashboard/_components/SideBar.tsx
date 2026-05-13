'use client'

import { useIsOpen } from "@/lib/store/useIsOpen"
import Link from "next/link"
import { ScrollText, CalendarCheck, BookOpen } from "lucide-react";
import { usePathname } from "next/navigation";

const SideBar = () => {
  const { setIsOpen, isOpen } = useIsOpen()
  const pathname = usePathname()
  return (
    <aside className="flex flex-col h-screen text-sm transition-all duration-300 w-70 py-10 px-4 bg-[#201f1f] text-white border-r border-r-gray-700 relative">
      <div className={`flex gap-1 py-4 pl-2 rounded-lg active:scale-95 cursor-pointer ${pathname === '/dashboard/live-orders' ? 'bg-red-700 border border-white' : 'hover:text-red-700'}`}>
        <ScrollText size={18} />
        <Link href="/dashboard/live-orders">Live Orders</Link>
      </div>

      <div className={`flex gap-1 py-4 pl-2 rounded-lg active:scale-95 cursor-pointer ${pathname === '/dashboard/live-reservations' ? 'bg-red-700 border border-white' : 'hover:text-red-700'}`}>
        <CalendarCheck size={18} />
        <Link href="/dashboard/live-reservations">Live Reservations</Link>
      </div>

      <div className={`flex gap-1 py-4 pl-2 rounded-lg active:scale-95 cursor-pointer ${pathname === '/dashboard/menu' ? 'bg-red-700 border border-white' : 'hover:text-red-700'}`}>
        <BookOpen size={18} />
        <Link href="/dashboard/menu">Menu</Link>
      </div>

      <div className="flex border border-gray-600 p-2 rounded-xl items-center absolute bottom-5 w-[90%]">
        <div className="flex flex-col flex-1">
          <span className="uppercase">Store Status</span>
          <span>{isOpen ? 'Open' : 'Close'}</span>
        </div>
        <button
          onClick={setIsOpen}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${isOpen ? 'bg-red-700' : 'bg-gray-600'
            }`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isOpen ? 'translate-x-6' : 'translate-x-1'
            }`} />
        </button>
      </div>
    </aside>
  )
}

export default SideBar