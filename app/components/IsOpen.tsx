'use client'

import { useRef } from "react"
import { useStoreStatus } from "@/lib/hooks/useStoreStatus"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(useGSAP)

const IsOpen = () => {
  const { isOpen } = useStoreStatus()
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (isOpen) return

    gsap.timeline()
      .fromTo('.closed-beans',
        { x: -180, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, duration: 1, ease: 'power3.out' })
      .fromTo('.closed-banner',
        { autoAlpha: 0, y: -20 },
        { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.7')
  }, { scope: containerRef, dependencies: [isOpen], revertOnUpdate: true })

  if (isOpen) return null

  return (
    <div
      ref={containerRef}
      className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-full px-6 flex justify-center pointer-events-none"
    >
      <div className="closed-banner relative flex items-center gap-3 border border-[#7C1515] bg-[#141110] rounded-sm px-6 py-3 md:px-8 md:py-4 overflow-hidden">
        <span className="relative w-1.5 h-1.5 rounded-full bg-[#A32D1C] shrink-0" />
        <p className="relative text-[10px] md:text-xs tracking-[0.25em] uppercase text-[#E8E0D8]">
          Closed for now
        </p>
      </div>
    </div>
  )
}

export default IsOpen