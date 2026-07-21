'use client'
import { Filter, useOrders } from "./useOrders"
import { PhoneIcon, ClockIcon, ShoppingBagIcon , MapPinIcon  } from '@phosphor-icons/react'

const statusStyles: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30',
  confirmed: 'bg-green-500/10 text-green-500 border border-green-500/30',
  cancelled: 'bg-gray-500/10 text-gray-400 border border-gray-500/30',
}

const statusDot: Record<string, string> = {
  pending: 'bg-yellow-500',
  confirmed: 'bg-green-500',
  cancelled: 'bg-gray-400',
}

export default function LiveOrdersPage() {
  const { STATUSES, orders, loading, filter, setFilter, search, setSearch, filteredOrders, updateStatus, timeAgo } = useOrders()

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-[#8D7E73] gap-2 text-xs tracking-[0.2em] uppercase">
      <ShoppingBagIcon className="animate-pulse w-6 h-6" />
      Loading orders...
    </div>
  )

  if (!orders.length) return (
    <div className="flex flex-col items-center justify-center h-64 text-[#8D7E73] gap-2">
      <ShoppingBagIcon className="w-10 h-10 opacity-30" />
      <p className="text-xs tracking-[0.2em] uppercase">No orders yet</p>
    </div>
  )

  return (
    <div className="p-6 text-[#8D7E73]">
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap sticky top-0 z-10 backdrop-blur-sm py-3 -mx-6 px-6">
        <h1 className="text-2xl font-semibold text-[#A32D1C] shrink-0">Live Orders</h1>

        <div className="flex gap-2 flex-wrap">
          {STATUSES.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-[0.625rem] font-medium tracking-[0.15em] uppercase px-3.5 py-1.5 rounded-md border transition-colors duration-150
                ${filter === f
                  ? 'bg-[#9a2d1e] text-white border-transparent'
                  : 'border-[#8D7E73]/30 text-[#8D7E73] hover:bg-[#8D7E73]/10 hover:text-[#A32D1C]'
                }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span className="ml-1.5 opacity-60">
                {orders.filter(o => o.status === f).length}
              </span>
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search name, phone, ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-[#211c19] border border-[#8D7E73]/30 rounded-md text-xs tracking-wide text-white placeholder:text-[#8D7E73]/60 outline-none h-9 px-3 w-56 transition-colors duration-150 focus:border-[#A32D1C]/60"
        />
      </div>

      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-[#8D7E73] gap-2">
          <p className="text-xs tracking-[0.2em] uppercase">No matching orders</p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
          {filteredOrders.map(o => (
            <div
              key={o.id}
              className="rounded-3xl border-3 border-[#2A1F1C] bg-[#141110] p-4 flex flex-col gap-3 hover:border-[#8D7E73]/40 transition-colors duration-150"
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-white text-lg font-medium leading-tight truncate">{o.customer_name}</h2>
                <span className={`text-[0.625rem] font-medium tracking-widest uppercase px-2.5 py-1 rounded-md flex items-center gap-1.5 shrink-0 ${statusStyles[o.status]}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusDot[o.status]}`} />
                  {o.status}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-sm">
                <PhoneIcon className="w-3.5 h-3.5 shrink-0" />
                {o.phone}
              </div>

              {o.lat && o.lng && (
                <button
                  onClick={() => navigator.clipboard.writeText(`${o.lat},${o.lng}`)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-[#1b1816] border border-[#8D7E73]/30 rounded-md text-xs tracking-wide text-[#8D7E73] hover:text-[#A32D1C] hover:border-[#A32D1C]/40 transition-colors duration-150 cursor-pointer"
                >
                  <MapPinIcon className="w-3.5 h-3.5 shrink-0" />
                  Copy Location
                </button>
              )}

              {o.address && (
                <div className="px-3 py-2 bg-[#1b1816] border border-[#8D7E73]/30 rounded-md text-xs">
                  {o.address}
                </div>
              )}

              <div className="border-t border-[#8D7E73]/20" />

              <div className="flex flex-col gap-1">
                {o.items.map(i => (
                  <div key={i.id} className="flex justify-between text-sm">
                    <span className="text-white">{i.name}</span>
                    <span>× {i.quantity}</span>
                  </div>
                ))}
              </div>

              {o.notes && (
                <textarea
                  className="w-full h-16 p-2 bg-[#1b1816] border border-[#8D7E73]/30 rounded-md text-xs resize-none outline-none"
                  value={o.notes}
                  maxLength={400}
                  disabled
                />
              )}

              <div className="border-t border-[#8D7E73]/20" />

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-xs text-[#8D7E73]/60">
                  <ClockIcon className="w-3 h-3" />
                  {timeAgo(o.created_at)}
                </span>
                <span className="text-[#A32D1C] font-medium text-sm tracking-wide">
                  ${parseFloat(String(o.total_price)).toFixed(2)}
                </span>
              </div>

              <select
                value={o.status}
                onChange={e => updateStatus(o.id, e.target.value as Filter)}
                className="bg-[#1b1816] border border-[#8D7E73]/30 rounded-md text-xs tracking-wide text-white px-3 py-2 outline-none cursor-pointer hover:border-[#A32D1C]/40 transition-colors duration-150"
              >
                {STATUSES.map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}