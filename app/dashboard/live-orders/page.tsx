'use client'
import { Filter, useOrders } from "./useOrders"
import { Phone, Clock, ShoppingBag } from 'lucide-react'

const statusStyles: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30',
  confirmed: 'bg-[#A32D1C]/10 text-[#A32D1C] border border-[#A32D1C]/30',
  cancelled: 'bg-[#8D7E73]/10 text-[#8D7E73] border border-[#8D7E73]/30',
}

const statusDot: Record<string, string> = {
  pending: 'bg-yellow-500',
  confirmed: 'bg-[#A32D1C]',
  cancelled: 'bg-[#8D7E73]',
}

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (diff < 1) return 'just now'
  if (diff === 1) return '1 min ago'
  if (diff < 60) return `${diff} mins ago`
  const hours = Math.floor(diff / 60)
  const minutes = diff % 60
  if (hours === 1 && minutes === 0) return '1h ago'
  if (hours === 1) return `1h ${minutes}m ago`
  if (minutes === 0) return `${hours}h ago`
  return `${hours}h ${minutes}m ago`
}

export default function LiveOrdersPage() {
  const { STATUSES, orders, loading, filter, setFilter, search, setSearch, filteredOrders, updateStatus } = useOrders()

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-[#8D7E73] gap-2 text-xs tracking-[0.2em] uppercase">
      <ShoppingBag className="animate-pulse w-6 h-6" />
      Loading orders...
    </div>
  )

  if (!orders.length) return (
    <div className="flex flex-col items-center justify-center h-64 text-[#8D7E73] gap-2">
      <ShoppingBag className="w-10 h-10 opacity-30" />
      <p className="text-xs tracking-[0.2em] uppercase">No orders yet</p>
    </div>
  )

  return (
    <div className="p-6  min-h-screen text-[#8D7E73]">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h1 className="text-3xl text-[#A32D1C] shrink-0">Live Orders</h1>

        <div className="flex flex-1 gap-2 flex-wrap">
          {STATUSES.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-[0.625rem] tracking-[0.2em] uppercase px-3.5 py-1.5 rounded-full border transition-colors duration-300
                ${filter === f
                  ? 'bg-[#9a2d1e] text-white border-transparent'
                  : 'border-[#8D7E73]/30 text-[#8D7E73] hover:bg-[#8D7E73]/10 hover:text-[#A32D1C]'
                }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search orders..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-[#211c19] border border-[#8D7E73]/30 rounded-xs text-xs tracking-widest text-white placeholder:text-[#8D7E73]/60 outline-none h-9 px-3 transition-colors duration-300 focus:border-[#A32D1C]/60"
        />
      </div>

      <div className="flex flex-wrap gap-4 justify-center md:justify-start">
        {filteredOrders.map(o => (
          <div
            key={o.id}
            className="bg-[#211c19] border border-[#8D7E73]/20 rounded-2xl p-4 w-72 flex flex-col gap-3 hover:border-[#8D7E73]/40 transition-colors duration-300"
          >
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-white text-xl leading-tight">{o.customer_name}</h2>
              <span className={`text-[0.625rem] tracking-[0.15em] uppercase px-2.5 py-1 rounded-full flex items-center gap-1.5 shrink-0 ${statusStyles[o.status]}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusDot[o.status]}`} />
                {o.status}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-[#8D7E73] text-sm">
              <Phone className="w-3.5 h-3.5" />
              {o.phone}
            </div>

            {o.lat && o.lng && (
              <button
                onClick={() => navigator.clipboard.writeText(`${o.lat},${o.lng}`)}
                className="px-3 py-2 bg-[#1b1816] border border-[#8D7E73]/30 rounded-xs text-xs tracking-widest text-[#8D7E73] hover:text-[#A32D1C] hover:border-[#A32D1C]/40 transition-colors duration-300 cursor-pointer"
              >
                Copy Location
              </button>
            )}

            {o.address && (
              <div className="px-3 py-2 bg-[#1b1816] border border-[#8D7E73]/30 rounded-xs text-xs text-[#8D7E73]">
                {o.address}
              </div>
            )}

            <div className="border-t border-[#8D7E73]/20" />

            <div className="flex flex-col gap-1">
              {o.items.map(i => (
                <div key={i.id} className="flex justify-between text-sm text-[#8D7E73]">
                  <span className="text-white">{i.name}</span>
                  <span className="text-[#8D7E73]">× {i.quantity}</span>
                </div>
              ))}
            </div>

            <textarea
              className="w-full h-20 p-2 bg-[#1b1816] border border-[#8D7E73]/30 rounded-xs text-xs text-[#8D7E73] resize-none outline-none"
              value={o.notes || ''}
              maxLength={400}
              disabled
            />

            <div className="border-t border-[#8D7E73]/20" />

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-xs text-[#8D7E73]/70">
                <Clock className="w-3 h-3" />
                {timeAgo(o.created_at)}
              </span>
              <span className="text-[#A32D1C] text-sm tracking-widest">
                ${parseFloat(String(o.total_price)).toFixed(2)}
              </span>
            </div>

            <select
              value={o.status}
              onChange={e => updateStatus(o.id, e.target.value as Filter)}
              className="bg-[#1b1816] border border-[#8D7E73]/30 rounded-xs text-xs tracking-widest text-[#8D7E73] px-3 py-2 outline-none cursor-pointer hover:border-[#A32D1C]/40 transition-colors duration-300"
            >
              {STATUSES.map(s => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}