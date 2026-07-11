import {
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useCartPosition } from '@/lib/hooks/Usecartposition'
import type { CartState, Corner } from '@/types'

gsap.registerPlugin(useGSAP)

export const EDGE_OFFSET = 16
export const DRAG_THRESHOLD = 5

export type Display =
  | { visible: false }
  | { visible: true; message: string }

export function resolveDisplay(
  isNavigating: boolean,
  cartState: CartState
): Display {
  if (isNavigating) {
    return { visible: true, message: 'Rendering' }
  }

  if (cartState === 'Idle') {
    return { visible: false }
  }

  return { visible: true, message: cartState }
}

export function getCornerStyle(corner: Corner): CSSProperties {
  const base: CSSProperties = {
    position: 'fixed',
    top: 'auto',
    bottom: 'auto',
    left: 'auto',
    right: 'auto',
  }

  switch (corner) {
    case 'bottom-left':
      return { ...base, bottom: EDGE_OFFSET, left: EDGE_OFFSET }
    case 'bottom-right':
      return { ...base, bottom: EDGE_OFFSET, right: EDGE_OFFSET }
    case 'top-left':
      return { ...base, top: EDGE_OFFSET, left: EDGE_OFFSET }
    case 'top-right':
      return { ...base, top: EDGE_OFFSET, right: EDGE_OFFSET }
    default:
      return base
  }
}

export function getClosestCorner(centerX: number, centerY: number): Corner {
  const width = window.innerWidth
  const height = window.innerHeight

  const corners: { corner: Corner; x: number; y: number }[] = [
    { corner: 'top-left', x: 0, y: 0 },
    { corner: 'top-right', x: width, y: 0 },
    { corner: 'bottom-left', x: 0, y: height },
    { corner: 'bottom-right', x: width, y: height },
  ]

  return corners.reduce((closest, current) => {
    const currentDistance = (current.x - centerX) ** 2 + (current.y - centerY) ** 2
    const closestDistance = (closest.x - centerX) ** 2 + (closest.y - centerY) ** 2

    return currentDistance < closestDistance ? current : closest
  }).corner
}

export function getPositionStyle(
  corner: Corner,
  dragPos: { x: number; y: number } | null
): CSSProperties {
  if (dragPos) {
    return {
      position: 'fixed',
      left: dragPos.x,
      top: dragPos.y,
      bottom: 'auto',
      right: 'auto',
    }
  }

  return getCornerStyle(corner)
}

export function getTargetPosition(rect: DOMRect, corner: Corner): { x: number; y: number } {
  const targetX = corner.includes('left')
    ? EDGE_OFFSET
    : window.innerWidth - rect.width - EDGE_OFFSET
  const targetY = corner.includes('top')
    ? EDGE_OFFSET
    : window.innerHeight - rect.height - EDGE_OFFSET

  return { x: targetX, y: targetY }
}

export function shouldStartDrag(distance: number): boolean {
  return distance >= DRAG_THRESHOLD
}

export function getPointerEventTarget(
  event: ReactPointerEvent<Element>
): HTMLElement {
  return event.currentTarget as HTMLElement
}

interface DragPosition {
  x: number
  y: number
}

export interface CartButtonBehavior {
  corner: Corner
  elRef: React.RefObject<HTMLDivElement | null>
  positionStyle: CSSProperties
  handlePointerDown: (event: ReactPointerEvent<Element>) => void
  handlePointerMove: (event: ReactPointerEvent<Element>) => void
  handlePointerUp: (event: ReactPointerEvent<Element>) => void
}

export function useCartButtonBehavior(): CartButtonBehavior {
  const { corner, setCorner } = useCartPosition()
  const elRef = useRef<HTMLDivElement>(null)
  const startPointer = useRef({ x: 0, y: 0 })
  const startElementPos = useRef({ x: 0, y: 0 })
  const [dragPos, setDragPos] = useState<DragPosition | null>(null)
  const { contextSafe } = useGSAP({ scope: elRef })
  const hasMoved = useRef(false)
  const pointerIdRef = useRef<number | null>(null)

  const handlePointerDown = (event: ReactPointerEvent<Element>): void => {
    const rect = elRef.current?.getBoundingClientRect()
    if (!rect) {
      return
    }

    hasMoved.current = false
    pointerIdRef.current = event.pointerId
    startPointer.current = { x: event.clientX, y: event.clientY }
    startElementPos.current = { x: rect.x, y: rect.y }
  }

  const handlePointerMove = (event: ReactPointerEvent<Element>): void => {
    if (pointerIdRef.current !== event.pointerId) {
      return
    }

    const dx = event.clientX - startPointer.current.x
    const dy = event.clientY - startPointer.current.y

    if (!hasMoved.current) {
      if (!shouldStartDrag(Math.hypot(dx, dy))) {
        return
      }

      hasMoved.current = true
      getPointerEventTarget(event).setPointerCapture(event.pointerId)
    }

    event.preventDefault()
    setDragPos({
      x: startElementPos.current.x + dx,
      y: startElementPos.current.y + dy,
    })
  }

  const handlePointerUp = (event: ReactPointerEvent<Element>): void => {
    if (pointerIdRef.current !== event.pointerId) {
      return
    }

    pointerIdRef.current = null

    const target = getPointerEventTarget(event)
    if (target.hasPointerCapture(event.pointerId)) {
      target.releasePointerCapture(event.pointerId)
    }

    const rect = elRef.current?.getBoundingClientRect()
    if (!rect) {
      return
    }

    const centerX = rect.x + rect.width / 2
    const centerY = rect.y + rect.height / 2
    const closest = getClosestCorner(centerX, centerY)
    const targetPosition = getTargetPosition(rect, closest)

    const animateToCorner = contextSafe(() => {
      const proxy = { x: rect.x, y: rect.y }
      gsap.to(proxy, {
        x: targetPosition.x,
        y: targetPosition.y,
        duration: 0.35,
        ease: 'power3.out',
        onUpdate: () => setDragPos({ x: proxy.x, y: proxy.y }),
        onComplete: () => {
          setDragPos(null)
          setCorner(closest)
        },
      })
    })

    animateToCorner()
  }

  return {
    corner,
    elRef,
    positionStyle: getPositionStyle(corner, dragPos),
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  }
}
