'use client'

import { useIsOpen } from "@/lib/store/useIsOpen"
import Link from "next/link"
import { ScrollText, CalendarCheck, BookOpen } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const SideBar = () => {
  const { setIsOpen, isOpen } = useIsOpen()
  const pathname = usePathname()

  const supabase = createClient()

  const [pendingCount, setPendingCount] = useState<number>(0)
  const [confirmedReservationsCount, setConfirmedReservationsCount] = useState<number>(0)

  useEffect(() => {
    const fetch = async () => {
      try {
        const { count } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending')
        setPendingCount(count ?? 0)
      } catch (error) {
        console.error(error)
        setPendingCount(0)
      }
    }
    fetch()

    const channel = supabase
      .channel('pending-count')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetch)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [supabase])

  useEffect(() => {
    const fetch = async () => {
      try {
        const { count } = await supabase
          .from('reservations')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'confirmed')
        setConfirmedReservationsCount(count ?? 0)
      } catch (error) {
        console.error(error)
        setConfirmedReservationsCount(0)
      }
    }
    fetch()

    const channel = supabase
      .channel('confirmed-reservations-count')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reservations' }, fetch)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [supabase])

  return (
    <aside className="flex-col h-screen text-sm transition-all duration-300 w-70 py-10 px-4 bg-black text-white border-r border-neutral-800 relative hidden md:flex">
      <Link href="/dashboard/live-orders" className={`flex gap-1 py-4 pl-2 rounded-lg active:scale-95 cursor-pointer relative ${pathname === '/dashboard/live-orders' ? 'bg-red-700 border border-neutral-800' : 'hover:text-red-700'}`}>
        <ScrollText size={18} />
        <span>Live Orders</span>
        <span className={`px-1.5 absolute right-4 rounded-full text-sm ${pathname === '/dashboard/live-orders' ? 'bg-white text-red-700' : 'text-white'}`}>{pendingCount}</span>
      </Link>

      <Link href="/dashboard/live-reservations" className={`flex gap-1 py-4 pl-2 rounded-lg active:scale-95 cursor-pointer relative ${pathname === '/dashboard/live-reservations' ? 'bg-red-700 border border-neutral-800' : 'hover:text-red-700'}`}>
        <CalendarCheck size={18} />
        <span>Live Reservations</span>
        <span className={`px-1.5 absolute right-4 rounded-full text-sm ${pathname === '/dashboard/live-reservations' ? 'bg-white text-red-700' : 'text-white'}`}>{confirmedReservationsCount}</span>
      </Link>

      <Link href="/dashboard/menu" className={`flex gap-1 py-4 pl-2 rounded-lg active:scale-95 cursor-pointer ${pathname === '/dashboard/menu' ? 'bg-red-700 border border-neutral-800' : 'hover:text-red-700'}`}>
        <BookOpen size={18} />
        <span>Menu</span>
      </Link>

      <div className="flex border border-neutral-800 p-2 rounded-xl items-center absolute bottom-5 w-[90%]">
        <div className="flex flex-col flex-1">
          <span className="uppercase">Store Status</span>
          <span>{isOpen ? 'Open' : 'Close'}</span>
        </div>
        <button
          onClick={setIsOpen}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${isOpen ? 'bg-red-700' : 'bg-neutral-800'
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