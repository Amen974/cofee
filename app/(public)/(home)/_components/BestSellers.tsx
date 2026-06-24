'use client'
import { useRef } from "react"
import { Item } from "@/types"
import Image from "next/image"
import { usecart } from "@/lib/store/useCart"
import { useCartIndicator } from "@/lib/store/useCartIndicator"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(useGSAP, ScrollTrigger)

const BEANS = ["/coffee-beans-left.png", "/coffee-beans-right.png", "/coffee-beans-left.png"]
const BEAN_SIDES = ["object-left", "object-right", "object-left"] as const
const LAYOUTS = ["flex-row", "flex-row-reverse", "flex-row"] as const

interface BestSellersProps { items: Item[] }

const BestSellers = ({ items }: BestSellersProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { addItem } = usecart()
  const { setCartState, reset } = useCartIndicator()
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useGSAP(() => {
    gsap.timeline({ scrollTrigger: { trigger: '.bs-header', start: 'top 75%' } })
      .fromTo('.bs-header-beans',
        { x: 220, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, duration: 1.2, ease: 'power3.out' })
      .fromTo('.bs-header-title',
        { autoAlpha: 0, y: 50 },
        { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.7')

    gsap.utils.toArray<HTMLElement>('.bs-item').forEach((section, i) => {
      const xDir = i % 2 === 0 ? -1 : 1
      gsap.timeline({ scrollTrigger: { trigger: section, start: 'top 72%' } })
        .fromTo(section.querySelector('.bs-beans'),
          { x: xDir * 220, autoAlpha: 0 },
          { x: 0, autoAlpha: 1, duration: 1.2, ease: 'power3.out' })
        .fromTo(section.querySelector('.bs-img'),
          { autoAlpha: 0, scale: 0.82 },
          { autoAlpha: 1, scale: 1, duration: 0.85, ease: 'back.out(1.5)' }, '-=0.75')
        .fromTo(section.querySelectorAll('.bs-text'),
          { autoAlpha: 0, y: 22 },
          { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.13, ease: 'power3.out' }, '-=0.55')
    })
  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="relative text-[#8D7E73] overflow-hidden">
      <div className="bs-header relative h-[26vh] md:h-[45vh] flex justify-center items-center">
        <Image src="/coffee-beans-right.png" alt="right-beans" fill loading="eager"
          className="bs-header-beans object-contain object-right" />
        <h1 className="bs-header-title text-[#A32D1C] text-[clamp(2rem,22vw,9rem)] font-bold z-10">
          Best Sell
        </h1>
      </div>

      {items.map((item, i) => (
        <div key={item.id} className="bs-item relative h-[45vh] max-sm:h-[30vh] flex items-center justify-center">
          <Image src={BEANS[i % BEANS.length]} alt="beans" fill loading="eager"
            className={`bs-beans object-contain ${BEAN_SIDES[i % BEAN_SIDES.length]}`} />
          <div className={`relative z-10 flex ${LAYOUTS[i % LAYOUTS.length]} items-center gap-5 md:gap-11`}>
            <Image src={item.image_url ?? ""} alt={item.name} height={190} width={190}
              className="bs-img rounded-full w-35 h-35 md:h-45 md:w-45" />
            <div>
              <h2 className="bs-text text-[#A32D1C] text-[2.5rem] md:text-[4rem] font-bold md:-mb-2">
                {item.name}
              </h2>
              <p className="bs-text hidden md:block w-90 mb-4">{item.description}</p>
              <button
                data-cursor-hover
                disabled={!item.is_available}
                onClick={() => {
                  if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current)
                  }

                  addItem({ ...item })
                  setCartState('Adding')

                  timeoutRef.current = setTimeout(() => {
                    reset()
                    timeoutRef.current = null
                  }, 500)
                }}
                className="bs-text flex items-center gap-2 w-fit text-[0.625rem] tracking-[0.25em] uppercase text-white bg-[#9a2d1e] px-5 py-2.5 rounded-xs hover:bg-[#8d2414] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {item.is_available ? "Add to cart" : "Out of stock"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </section>
  )
}

export default BestSellers