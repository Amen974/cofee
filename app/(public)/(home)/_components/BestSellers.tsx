'use client'
import { Item } from "@/types";
import Image from "next/image";
import { usecart } from "@/lib/store/useCart"
import { useCartIndicator } from "@/lib/store/useCartIndicator"

const BEANS = ["/coffee-beans-left.png", "/coffee-beans-right.png", "/coffee-beans-left.png"]
const BEAN_SIDES = ["object-left", "object-right", "object-left"] as const
const LAYOUTS = ["flex-row", "flex-row-reverse", "flex-row"] as const

interface BestSellersProps {
  items: Item[]
}

const BestSellers = ({ items }: BestSellersProps) => {
  const { addItem } = usecart()
  const { setCartStatus, resetCartStatus } = useCartIndicator()
  return (
    <section className="relative text-[#8D7E73]">
      <div className="relative h-[26vh] md:h-[45vh] flex justify-center items-center">
        <Image
          src="/coffee-beans-right.png"
          alt="right-beans"
          fill
          loading="eager"
          className="object-contain object-right"
        />

        <h1 className="text-[#A32D1C] text-[clamp(2rem,22vw,9rem)] font-bold z-10">
          Best Sell
        </h1>
      </div>

      {items.map((item, i) => (
        <div key={item.id} className="relative h-[45vh] max-sm:h-[30vh] md:h-[45vh] flex items-center justify-center">
          <Image
            src={BEANS[i]}
            alt="beans"
            fill
            loading="eager"
            className={`object-contain ${BEAN_SIDES[i]}`}
          />

          <div className={`relative z-10 flex ${LAYOUTS[i]} items-center gap-5 md:gap-11`}>
            <Image
              src={item.image_url ?? ""}
              alt={item.name}
              height={190}
              width={190}
              className='rounded-full w-35 h-35 md:h-45 md:w-45'
            />

            <div>
              <h2 className="text-[#A32D1C] text-[clamp(3rem,4vw,4rem)] font-bold md:-mb-2">{item.name}</h2>
              <p className="hidden md:block w-90 mb-4">{item.description}</p>
              <button
                data-cursor-hover
                disabled={!item.is_available}
                onClick={() => {
                  addItem({ ...item, quantity: 1 })
                  setCartStatus("itemAdded", "Item added")
                  setTimeout(() => resetCartStatus(), 500)
                }}
                className="flex items-center gap-2 w-fit text-[0.625rem] tracking-[0.25em] uppercase text-white bg-[#9a2d1e] px-5 py-2.5 rounded-xs hover:bg-[#8d2414] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {item.is_available ? "Add to cart" : "Out of stock"}
                {item.is_available}
              </button>
            </div>
          </div>
        </div>
      ))}
    </section>
  )
}

export default BestSellers