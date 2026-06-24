'use client'
import { ShoppingCart } from 'lucide-react'
import { useCartIndicator } from '../../lib/store/useCartIndicator'
import { useNavigationStore } from '@/lib/store/useNavigationStore'
import NavLink from './NavLink'
import { CartState } from '@/types'

type Display =
  | { visible: false }
  | { visible: true; message: string }

function resolveDisplay(
  isNavigating: boolean,
  cartState: CartState
): Display {
  if (isNavigating) {
    return {
      visible: true,
      message: 'Rendering',
    }
  }

  switch (cartState) {
    case 'Adding':
      return {
        visible: true,
        message: 'Adding',
      }

    case 'Placing':
      return {
        visible: true,
        message: 'Placing',
      }

    case 'Confirming':
      return {
        visible: true,
        message: 'Confirming',
      }

    case 'Locating':
      return {
        visible: true,
        message: 'Locating',
      }

    default:
      return {
        visible: false,
      }
  }
}

export default function CartButton() {
  const { cartState } = useCartIndicator()
  const isNavigating  = useNavigationStore(s => s.isNavigating)

  const display = resolveDisplay(isNavigating , cartState)

if (!display.visible) {
  return (
    <NavLink
      href="/cart"
      className="cursor-pointer fixed bottom-4 left-4 bg-[#0E0D0B] text-white p-3 rounded-full z-50 border-3 border-[#1b1b1b] hover:scale-95"
    >
      <ShoppingCart className="w-4 h-4" />
    </NavLink>
  )
}

return (
  <div className="fixed bottom-4 left-4 p-3 rounded-full z-50 transition-all duration-300 flex items-center bg-[#0E0D0B] text-white border-3 border-[#1b1b1b]">
    <div className="flex justify-center items-center gap-1.5 text-xs">
      <span className="bg-green-500 w-2 h-2 rounded-full block"></span>
      {display.message}
      <span className="loading-dots" />
    </div>
  </div>
)
}