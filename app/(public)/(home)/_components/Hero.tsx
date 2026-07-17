'use client'

import { useRef } from "react"
import { ArrowRight } from "lucide-react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import NavLink from "@/app/components/NavLink"

gsap.registerPlugin(useGSAP)

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLSpanElement>(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()

    const tl = gsap.timeline({ defaults: { ease: "power4.out" } })

    tl.fromTo(
      ".reveal-line",
      { yPercent: 100 },
      { yPercent: 0, duration: 1.2, stagger: 0.1 }
    )
      .fromTo(
        ".hero-title",
        { autoAlpha: 0, y: 60 },
        { autoAlpha: 1, y: 0, duration: 1.4 },
        "-=1.0"
      )
      .fromTo(
        ".hero-cta",
        { autoAlpha: 0, y: 15 },
        { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.15 },
        "-=0.9"
      )
      .call(() => {
        mm.add("(min-width: 768px)", () => {
          gsap.to(dotRef.current, {
            autoAlpha: 0,
            duration: 1,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          })
        })
      })
  }, { scope: containerRef })

  return (
    <section
      ref={containerRef}
      className="min-h-[90vh] relative text-[#8D7E73] px-4 md:px-10 lg:px-25 pt-5 md:pt-20"
    >
      <div className="text-[0.625rem] md:text-xs tracking-[0.25em] uppercase">
        <div className="overflow-hidden">
          <p className="reveal-line mb-1">Discover freshly roasted coffee</p>
        </div>
        <div className="overflow-hidden">
          <p className="reveal-line">from the finest farms around the world</p>
        </div>
      </div>

      <h1 className="hero-title text-[clamp(2rem,22vw,9rem)] text-[#A32D1C]">The Ritual</h1>

      <div className="text-[0.625rem] md:text-xs tracking-[0.25em] uppercase">
        <div className="overflow-hidden">
          <p className="reveal-line mb-1">crafted with intention</p>
        </div>
        <div className="overflow-hidden">
          <p className="reveal-line">every cup is brewed to awaken your senses</p>
        </div>
      </div>

      <div className="uppercase flex flex-wrap justify-center md:justify-start gap-4 mt-10 mb-10">
        <NavLink
          href="/reservation"
          data-cursor-hover
          className="hero-cta w-[80vw] md:w-60 h-10 bg-[#9a2d1e] text-white rounded-xs uppercase font-light tracking-[0.25em] text-[0.625rem] md:text-xs hover:bg-[#8d2414] transition-colors duration-300 flex justify-center items-center"
        >
          secure a table <ArrowRight size={12} className="ml-6" />
        </NavLink>
        <NavLink
          href="/menu"
          data-cursor-hover
          className="hero-cta w-[80vw] md:w-60 h-10 bg-transparent border border-[#A32D1C] text-white rounded-xs uppercase font-light tracking-[0.25em] text-[0.625rem] md:text-xs hover:bg-[#1b1816] transition-colors duration-300 flex justify-center items-center"
        >
          Explore Our Menu <ArrowRight size={12} className="ml-4" />
        </NavLink>
      </div>

      <div className="absolute hidden p-7 right-0 top-35 md:block">
        <span
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
          className="text-xs tracking-[0.3em] text-[#A32D1C] uppercase font-bold"
        >
          99.4 / 100 <span className="text-[#8D7E73]">SPECIALTY SCORE</span>
        </span>
      </div>

      <div className="absolute hidden p-7 left-0 top-30 lg:block">
        <span
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
          className="text-xs tracking-[0.3em] text-[#8D7E73] uppercase font-bold"
        >
          RESERVATIONS STRONGLY <span className="text-[#A32D1C]">ADVISED</span>
        </span>
      </div>

    </section>
  )
}

export default Hero