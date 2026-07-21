'use client'
import { CoffeeBeanIcon, CoffeeIcon, MapPinIcon, ArrowRightIcon } from "@phosphor-icons/react"
import NavLink from "@/app/components/NavLink"
import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(useGSAP)

const features = [
  {
    icon: CoffeeBeanIcon,
    title: "Single Origin",
    desc: "Ethically sourced",
  },
  {
    icon: CoffeeIcon,
    title: "Premium",
    desc: "Crafted daily",
  },
  {
    icon: MapPinIcon,
    title: "Cozy",
    desc: "Feel at home",
  },
]

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })

    tl.fromTo('.hero-title',
      { autoAlpha: 0, y: 60 },
      { autoAlpha: 1, y: 0, duration: 1.2 })
      .fromTo('.reveal-line',
        { yPercent: 100 },
        { yPercent: 0, duration: 1, stagger: 0.1 },
        '-=0.7')
      .fromTo('.hero-divider',
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, transformOrigin: 'left' },
        '-=0.6')
      .fromTo('.hero-desc',
        { autoAlpha: 0, y: 15 },
        { autoAlpha: 1, y: 0, duration: 0.7 },
        '-=0.5')
      .fromTo('.hero-cta',
        { autoAlpha: 0, y: 15 },
        { autoAlpha: 1, y: 0, duration: 0.7 },
        '-=0.5')
      .fromTo('.hero-feature',
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.12 },
        '-=0.4')
  }, { scope: containerRef })

  return (
    <section
      ref={containerRef}
      className="h-screen flex flex-col md:justify-center  relative text-[#8D7E73] px-4 md:px-10 lg:px-25 pt-20 md:pt-5 hero-bg"
    >

      <h1 className="hero-title text-[clamp(2rem,22vw,10rem)] text-[#A32D1C] leading-none">
        Coffee
      </h1>

      <div className="overflow-hidden mt-5">
        <p className="reveal-line uppercase tracking-[0.25em] text-[clamp(1rem,15vw,1.5rem)]">
          As it should be.
        </p>
      </div>

      <div className="hero-divider w-16 h-px bg-[#A32D1C] my-10" />

      <p className="hero-desc w-40 md:w-86 text-sm md:text-base leading-relaxed">
        Obsidian Coffee Lounge is more than a place.
        It&apos;s a ritual of taste, craft, and atmosphere.
      </p>

      <div className="hero-cta uppercase md:justify-start gap-4 mt-5 mb-15">
        <NavLink
          href="/menu"
          data-cursor-hover
          className="w-50 md:w-60 h-10 bg-[#A32D1C] text-white rounded-xs uppercase font-light tracking-[0.25em] text-[0.625rem] md:text-xs hover:bg-[#8d2414] transition-colors duration-300 flex justify-center items-center"
        >
          Explore Our Menu <ArrowRightIcon size={12} className="ml-6" />
        </NavLink>
      </div>

      <div className="grid grid-cols-3 max-w-xl mt-30 md:mt-0">
        {features.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="hero-feature flex flex-col justify-center md:justify-start md:flex-row items-center gap-2">
            <Icon size={22} className="text-[#e9b28b]" weight="thin" />
            <div className='flex flex-col justify-center items-center md:justify-start md:items-start'>
              <p className="uppercase text-[0.625rem] md:text-xs tracking-[0.15em] text-[#ddd1c7]">
                {title}
              </p>
              <p className="text-xs md:text-sm text-[#8D7E73]/70">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Hero