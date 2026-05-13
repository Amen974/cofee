'use client'

import { createClient } from "@/lib/supabase/client"
import { Orders } from "@/types"

import { useEffect, useState } from "react"

const Page = () => {

  const supabase = createClient()

  const [orders, setOrders] = useState<Orders[]>([])

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase.from('orders').select('*')
      if (error) console.log(error)
      else setOrders(data)
    }
    fetchOrders()

    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setOrders((prev) => [...prev, payload.new as Orders])
          } else if (payload.eventType === 'UPDATE') {
            setOrders((prev) =>
              prev.map((o) => (o.id === payload.new.id ? (payload.new as Orders) : o))
            )
          } else if (payload.eventType === 'DELETE') {
            setOrders((prev) => prev.filter((o) => o.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <div className="py-10 px-4 flex">
      {orders.map((o) => (
        <div key={o.id} className="border border-gray-600 h-80 w-60 text-white p-4 rounded-xl">
          <div className="flex border-b border-b-gray-600">
            <h1 className="flex-1 text-2xl">{o.customer_name}</h1>
            <div className="flex flex-col">
              <span>{o.status}</span>
              <span>{new Date(o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>

          <div>

          </div>
        </div>
      ))}
    </div>
  )
}

export default Page