'use client'
import { Filter, useOrders } from "./useOrders"
import { Phone, Clock, ShoppingBag } from 'lucide-react'

const statusStyles: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/20',
  confirmed: 'bg-green-500/10 text-green-400 border border-green-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border border-red-500/20',
}

const statusDot: Record<string, string> = {
  pending: 'bg-yellow-500',
  confirmed: 'bg-green-400',
  cancelled: 'bg-red-400',
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
    <div className="flex items-center justify-center h-64 text-neutral-500">
      <ShoppingBag className="animate-pulse w-8 h-8 mr-2" />
      Loading orders...
    </div>
  )

  if (!orders.length) return (
    <div className="flex flex-col items-center justify-center h-64 text-neutral-500 gap-2">
      <ShoppingBag className="w-10 h-10 opacity-30" />
      <p className="text-sm">No orders yet</p>
    </div>
  )

  return (
    <div className="p-4">
      <div className="flex mb-4  ">
        <div className="flex flex-1 gap-2">
          {STATUSES.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3.5 py-1.5 rounded-full border transition-all
              ${filter === f
                ? 'bg-red-700 text-white border-transparent'
                : 'border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'
              }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        </div>
        

        <div>
        <input
          type="text"
          placeholder="Search orders..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-neutral-800 border border-neutral-700 rounded-lg text-xs text-neutral-300 placeholder:text-neutral-500 focus:ring-1 focus:ring-blue-500 outline-none h-8"
        />
      </div>
      </div>

      <div className="flex flex-wrap gap-4 justify-center md:justify-start">
        {filteredOrders.map(o => (
          <div
            key={o.id}
            className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 w-72 flex flex-col gap-3 hover:border-neutral-700 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-white font-semibold text-xl leading-tight">{o.customer_name}</h2>
              <span className={`text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 shrink-0 ${statusStyles[o.status]}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusDot[o.status]}`} />
                {o.status}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-neutral-400 text-sm">
              <Phone className="w-3.5 h-3.5" />
              {o.phone}
            </div>

            {o.lat && o.lng && (
              <button
                onClick={() => navigator.clipboard.writeText(`${o.lat},${o.lng}`)}
                className="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-xs text-neutral-300 hover:bg-neutral-700 hover:border-neutral-600 transition-colors cursor-pointer"
              >
                Copy Location
              </button>
            )}

            {o.address && (
              <div className="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-xs text-neutral-300">
                {o.address}
              </div>
            )}

            <div className="border-t border-neutral-800" />

            <div className="flex flex-col gap-1">
              {o.items.map(i => (
                <div key={i.id} className="flex justify-between text-sm text-neutral-300">
                  <span>{i.name}</span>
                  <span className="text-neutral-500">× {i.quantity}</span>
                </div>
              ))}
            </div>

            <textarea
              className="w-full h-20 p-2 bg-neutral-800 border border-neutral-700 rounded-lg text-xs text-neutral-300 resize-none focus:ring-1 focus:ring-neutral-600 outline-none"
              value={o.notes || ''}
              maxLength={400}
              disabled
            />

            <div className="border-t border-neutral-800" />

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-xs text-neutral-500">
                <Clock className="w-3 h-3" />
                {timeAgo(o.created_at)}
              </span>
              <span className="text-green-500 font-medium text-sm">
                {parseFloat(String(o.total_price)).toFixed(2)} $
              </span>
            </div>

            <select
              value={o.status}
              onChange={e => updateStatus(o.id, e.target.value as Filter)}
              className="bg-neutral-800 border border-neutral-700 rounded-lg text-xs text-neutral-300 px-3 py-2 outline-none cursor-pointer hover:border-neutral-600 transition-colors"
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