"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { LockIcon  } from "@phosphor-icons/react"
import Image from "next/image"
import { login } from "./actions"
import { useCartIndicator } from "@/lib/store/useCartIndicator"

gsap.registerPlugin(useGSAP)

export default function Page() {
  const containerRef = useRef<HTMLDivElement>(null)
  const beanRef = useRef<HTMLDivElement>(null)
  const { setCartState, reset } = useCartIndicator()

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } })

    tl.fromTo(beanRef.current,
      { autoAlpha: 0, scale: 0.82, rotate: -8 },
      { autoAlpha: 1, scale: 1, rotate: 0, duration: 1, ease: "power3.out" })
      .fromTo(".login-title",
        { autoAlpha: 0, y: 40 },
        { autoAlpha: 1, y: 0, duration: 1.1 },
        "-=0.6")
      .fromTo(".reveal-line",
        { yPercent: 100 },
        { yPercent: 0, duration: 1, stagger: 0.1 },
        "-=0.8")
      .fromTo(".login-field",
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.7 },
        "-=0.5")
      .fromTo(".login-button",
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.6 },
        "-=0.4")
  }, { scope: containerRef })

  const handleSubmit = async (formData: FormData) => {
    setCartState('Confirming')
    try {
      await login(formData)
    } finally {
      reset()
    }
  }

  return (
    <main
      ref={containerRef}
      className="relative flex h-[70vh] w-full flex-col items-center justify-center overflow-hidden px-6 text-[#8D7E73] mt-20"
    >
      <div
        ref={beanRef}
        className="pointer-events-none fixed -bottom-15 -right-10 h-56 w-56 opacity-90 md:h-80 md:w-80"
      >
        <Image
          src="/coffee-beans-bottom-right.png"
          alt=""
          fill
          loading="eager"
          className="object-contain"
        />
      </div>

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center text-center">
        <h1 className="login-title text-[clamp(2rem,9vw,3.5rem)] text-[#A32D1C]">
          Staff Access
        </h1>

        <div className="-mt-2 mb-8 text-[0.625rem] tracking-[0.25em] uppercase md:text-xs">
          <div className="overflow-hidden">
            <p className="reveal-line">Restricted entry</p>
          </div>
          <div className="overflow-hidden">
            <p className="reveal-line">workers only</p>
          </div>
        </div>

        <form
          action={handleSubmit}
          className="flex w-full flex-col gap-4"
        >
          <div className="login-field relative w-full">
            <LockIcon
              size={14}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8D7E73]"
            />
            <input
              type="password"
              name="password"
              autoFocus
              placeholder="Password"
              className="h-11 w-full rounded-xs border border-[#8D7E73]/30 bg-[#211c19] pl-10 pr-4 text-xs tracking-widest text-white placeholder:text-[#8D7E73]/60 outline-none transition-colors duration-300 focus:border-[#A32D1C]/60"
            />
          </div>

          <button
            type="submit"
            className="login-button h-11 w-full rounded-xs bg-[#9a2d1e] text-[0.625rem] uppercase tracking-[0.25em] text-white transition-colors duration-300 hover:bg-[#8d2414] disabled:cursor-not-allowed disabled:opacity-60"
            data-cursor-hover
          >
            Log In
          </button>
        </form>
      </div>
    </main>
  )
}