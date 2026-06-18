'use client'

import { useRef } from "react"
import { ArrowRight, Coffee, Gem, Star, Leaf } from "lucide-react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import NavLink from "@/app/components/NavLink"

gsap.registerPlugin(useGSAP)

type HeroStat = Readonly<{ value: string; label: string; icon: React.ElementType }>

const heroStats: readonly HeroStat[] = [
  { value: "99.4 / 100", label: "EXCEPTIONAL CLASS", icon: Gem },
  { value: "24/7", label: "BREWED FOR EVERY MOMENT", icon: Coffee },
  { value: "100% ARABICA", label: "SMOOTH AND BALANCED", icon: Star },
  { value: "LOCALLY SOURCED", label: "FRESH FROM FARM TO CUP", icon: Leaf },
]

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
      .fromTo(
        ".hero-tagline",
        { autoAlpha: 0, y: 10 },
        { autoAlpha: 1, y: 0, duration: 0.7 },
        "-=0.4"
      )
      .fromTo(
        ".hero-stat",
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.1 },
        "-=0.3"
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

      <p className="hero-tagline text-[0.625rem] md:text-xs tracking-[0.25em] uppercase text-[#8D7E73] mb-10 flex gap-2 justify-center md:justify-start">
        <span ref={dotRef} className="rounded-full border border-[#9a2d1e]/70 flex items-center justify-center w-4 h-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#9a2d1e]" />
        </span>
        The evening awaits.
      </p>

      <div className='flex flex-col md:flex-row gap-4 w-full p-4'>
        {heroStats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className='hero-stat flex-1 flex items-center'>
              <Icon className="w-5 h-5 text-yellow-800 mr-2.5" />
              <div className="flex flex-col">
                <span className="text-[0.625rem] tracking-[0.25em] text-white uppercase font-semibold">
                  {stat.value}
                </span>
                <span className="text-[0.625rem] tracking-[0.2em] text-[#8D7E73] uppercase mt-1">
                  {stat.label}
                </span>
              </div>
            </div>
          )
        })}
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