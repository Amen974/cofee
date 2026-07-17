'use client'
import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(useGSAP, ScrollTrigger)

interface Review {
  name: string
  context: string
  text: string
  rating: number
}

const REVIEWS: Review[] = [
  {
    name: 'Amara Okafor',
    context: 'Regular guest',
    text: 'Best espresso in the city, hands down. The staff remembers my order every time.',
    rating: 5,
  },
  {
    name: 'Daniel Cruz',
    context: 'First visit',
    text: 'Booked a table through the site in under a minute. Food came out fast and hot.',
    rating: 5,
  },
  {
    name: 'Priya Sharma',
    context: 'Weekend regular',
    text: 'Cozy atmosphere, great playlist, and the cold brew is consistently excellent.',
    rating: 4,
  },
  {
    name: 'Tomas Weber',
    context: 'Business meetings',
    text: 'I bring clients here every week. Quiet enough to talk, quick enough to not run late.',
    rating: 5,
  },
]

const STACK_OFFSET_Y = 16
const STACK_SCALE_STEP = 0.04

const ReviewStack = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const cards = gsap.utils.toArray<HTMLElement>('.review-card')

    gsap.set(cards, { yPercent: 120, scale: 1, autoAlpha: 0 })
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: `+=${cards.length * 100}%`,
        scrub: 1,
        pin: true,
      }
    })

    tl.to(cards[0], { yPercent: 0, autoAlpha: 1, duration: 0.5, ease: 'power2.out' }, 'card-0')

    cards.forEach((card, i) => {
      if (i === 0) return

      const settledCards = cards.slice(0, i)
      tl.to(settledCards, {
        y: `-=${STACK_OFFSET_Y}`,
        scale: `-=${STACK_SCALE_STEP}`,
        duration: 0.5,
      }, `card-${i}`)
        .to(card, {
          yPercent: 0,
          autoAlpha: 1,
          duration: 0.5,
          ease: 'power2.out',
        }, `card-${i}`)
    })
  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="relative h-screen overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[70vw] max-w-3xl h-[50vh] md:h-[40vh]">
          {REVIEWS.map((review) => (
            <div
              key={review.name}
              className="review-card absolute inset-0 rounded-3xl border-3 border-[#2A1F1C] bg-[#141110]"
            >
              <div className="flex flex-col justify-between h-full p-8 md:p-10 text-[#8D7E73]">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={i < review.rating ? 'text-[#A32D1C]' : 'text-[#2A1F1C]'}
                    >
                      ★
                    </span>
                  ))}
                </div>

                <p className="font-serif text-lg md:text-2xl text-[#E8E0D8] leading-relaxed">
                  &ldquo;{review.text}&rdquo;
                </p>

                <div className="flex flex-col">
                  <span className="text-sm tracking-widest text-[#E8E0D8]">
                    {review.name}
                  </span>
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[#6B6360] mt-1">
                    {review.context}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ReviewStack