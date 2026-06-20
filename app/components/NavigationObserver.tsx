'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useNavigationStore } from '@/lib/store/useNavigationStore'

const MAX_NAV_WAIT_MS = 5000

export default function NavigationObserver() {
  const pathname = usePathname()
  const setNavigating = useNavigationStore(s => s.setNavigating)
  const isFirst = useRef(true)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false
      return
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setNavigating(false)
  }, [pathname, setNavigating])

  useEffect(() => {
    const isNavigating = useNavigationStore.getState().isNavigating
    if (isNavigating) {
      timeoutRef.current = setTimeout(() => setNavigating(false), MAX_NAV_WAIT_MS)
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [pathname, setNavigating])

  return null
}