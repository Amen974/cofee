"use client"

import { useRef, useState } from "react"
import { Search } from "lucide-react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import MenuItemCard from "./MenuItemCard"
import { Item } from "@/types"

gsap.registerPlugin(useGSAP)

export default function MenuClient({ items }: { items: Item[] }) {
  const [search, setSearch] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)

  const filtered = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  )

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } })

    tl.fromTo(
      ".reveal-line",
      { yPercent: 100 },
      { yPercent: 0, duration: 1.2, stagger: 0.1 }
    )
      .fromTo(
        ".menu-title",
        { autoAlpha: 0, y: 40 },
        { autoAlpha: 1, y: 0, duration: 1.2 },
        "-=0.9"
      )
      .fromTo(
        ".menu-search",
        { autoAlpha: 0, y: 15 },
        { autoAlpha: 1, y: 0, duration: 0.7 },
        "-=0.6"
      )
  }, { scope: containerRef })

  useGSAP(() => {
    gsap.fromTo(
      ".menu-card",
      { autoAlpha: 0, y: 24 },
      { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power3.out" }
    )
  }, { scope: containerRef, dependencies: [search], revertOnUpdate: true })

  return (
    <main ref={containerRef} className="text-[#8D7E73] relative">
      <div className="text-center mb-10 md:mb-14">
        <h1 className="menu-title text-[clamp(2rem,12vw,6rem)] text-[#A32D1C]">
          The Menu
        </h1>

        <div className="text-[0.625rem] md:text-xs tracking-[0.25em] uppercase -mt-4">
          <div className="overflow-hidden">
            <p className="reveal-line mb-1">Every cup, every plate</p>
          </div>
          <div className="overflow-hidden">
            <p className="reveal-line">crafted with intention, served with care</p>
          </div>
        </div>

        <div className="menu-search mt-5 flex justify-center">
          <div className="relative w-[80vw] md:w-[40vw]">
            <Search
              size={14}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8D7E73]"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search the menu"
              className="w-full h-11 rounded-xs border border-[#8D7E73]/30 bg-[#211c19] pl-10 pr-4 text-xs tracking-widest text-white placeholder:text-[#8D7E73]/60 outline-none transition-colors duration-300 focus:border-[#A32D1C]/60"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center">
        {filtered.map((item) => (
          <div key={item.id} className="menu-card">
            <MenuItemCard item={item} />
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="menu-card text-center text-xs tracking-[0.2em] uppercase mt-10">
          No items match your search.
        </p>
      )}
    </main>
  )
}