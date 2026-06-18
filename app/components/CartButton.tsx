'use client'
import { ShoppingCart } from 'lucide-react'
import { useCartIndicator } from '../../lib/store/useCartIndicator'
import { useNavigationStore } from '@/lib/store/useNavigationStore'
import NavLink from './NavLink'

type DisplayState =
  | { kind: 'idle' }
  | { kind: 'navigating' }
  | { kind: 'cart'; message: string }

function resolveDisplay(isNavigating: boolean, cartStatus: string, cartMessage: string): DisplayState {
  if (isNavigating) return { kind: 'navigating' }
  if (cartStatus !== 'idle') return { kind: 'cart', message: cartMessage }
  return { kind: 'idle' }
}

export default function CartButton() {
  const { cartStatus, cartMessage } = useCartIndicator()
  const isNavigating = useNavigationStore(s => s.isNavigating)

  const display = resolveDisplay(isNavigating, cartStatus, cartMessage)

  if (display.kind !== 'idle') {
    return (
      <div className='fixed bottom-4 left-4 p-3 rounded-full z-50 transition-all duration-300 flex items-center bg-[#0E0D0B] text-white border-3 border-[#1b1b1b]'>
        {display.kind === 'navigating' &&
          <div className='flex justify-center items-center gap-1.5 text-xs'>
            <span className='bg-green-500 w-2 h-2 rounded-full block'></span>
            Rendering<span className="loading-dots" />
          </div>
        }

        {display.kind === 'cart' &&
          <div className='flex justify-center items-center gap-1.5 text-xs'>
            <span className='bg-green-500 w-2 h-2 rounded-full block'></span>
            {display.message}<span className="loading-dots" />
          </div>
        }
      </div>
    )
  }

  return (
    <NavLink href="/cart" className="cursor-pointer fixed bottom-4 left-4 bg-[#0E0D0B] text-white p-3 rounded-full z-50 border-3 border-[#1b1b1b] hover:scale-95">
      <ShoppingCart className="w-4 h-4" />
    </NavLink>
  )
}