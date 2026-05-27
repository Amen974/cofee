'use client'

import Link from 'next/link'
import { ShoppingCart, Loader2, XCircle, CheckCircle } from 'lucide-react'
import { useCartIndicator } from '../../lib/store/useCartIndicator'

export default function CartButton() {
  const { cartStatus, cartMessage } = useCartIndicator()
  const isIdle = cartStatus === 'idle'

  const icons = {
    idle: <ShoppingCart className="w-4 h-4" />,
    loading: <Loader2 className="w-4 h-4 animate-spin" />,
    error: <XCircle className="w-4 h-4" />,
    success: <CheckCircle className="w-4 h-4" />,
    itemAdded: <CheckCircle className="w-4 h-4" />,
  }

  const colors = {
    idle: 'bg-black text-white border-gray-900',
    loading: 'bg-yellow-500 text-white border-yellow-600',
    error: 'bg-red-600 text-white border-red-700',
    success: 'bg-green-600 text-white border-green-700',
    itemAdded: 'bg-blue-600 text-white border-blue-700',
  }

  const button = (
    <div className={`fixed bottom-4 left-4 p-3 rounded-full z-50 border-3 transition-all duration-300 flex items-center gap-2 ${colors[cartStatus]}`}>
      {icons[cartStatus]}
      {!isIdle && cartMessage && <span className="text-xs pr-1">{cartMessage}</span>}
    </div>
  )

  if (!isIdle) return button

  return (
    <Link href="/cart" className="cursor-pointer fixed bottom-4 left-4 bg-black text-white p-3 rounded-full z-50 border-3 border-gray-900 hover:scale-95">
      <ShoppingCart className="w-4 h-4" />
    </Link>
  )
}