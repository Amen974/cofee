'use client'
import { ShoppingCart } from 'lucide-react'
import { useCartIndicator } from '../../lib/store/useCartIndicator'
import { useNavigationStore } from '@/lib/store/useNavigationStore'
import NavLink from './NavLink'
import {
  getCornerStyle,
  resolveDisplay,
  useCartButtonBehavior,
} from './cart-button-logic'

export default function CartButton() {
  const { cartState } = useCartIndicator()
  const isNavigating = useNavigationStore(s => s.isNavigating)
  const display = resolveDisplay(isNavigating, cartState)
  const { corner, elRef, positionStyle, handlePointerDown, handlePointerMove, handlePointerUp } =
    useCartButtonBehavior()

  if (display.visible) {
    return (
      <div
        style={getCornerStyle(corner)}
        className="p-3 rounded-full z-50 transition-all duration-300 flex items-center bg-[#0E0D0B] text-white border-3 border-[#1b1b1b]"
      >
        <div className="flex justify-center items-center gap-1.5 text-xs">
          <span className="bg-green-500 w-2 h-2 rounded-full block"></span>
          {display.message}
          <span className="loading-dots" />
        </div>
      </div>
    )
  }

  return (
    <div
      ref={elRef}
      className='z-50 rounded-full border-3 border-[#1b1b1b] p-3 text-white cursor-pointer flex justify-center items-center w-11 h-11 bg-[#0E0D0B]'
      style={positionStyle}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <NavLink
        href="/cart"
        onDragStart={(e) => e.preventDefault()}
        className='p-3'
      >
        <ShoppingCart className="w-4 h-4" />
      </NavLink>
    </div>
  )
}