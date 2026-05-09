'use client'

import Link from "next/link"
import { ShoppingCart, Menu, X } from "lucide-react";
import { useState } from "react";
import { User } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  return (
    <>
      <nav className="flex items-center py-3 px-3 relative">
        <span className="dancing font-bold text-red-700 text-[20px] mr-16 uppercase">Amen</span>

        <div className="md:flex justify-between flex-1 hidden mr-35">
          <Link href="/" className="px-2 py-1.5 hover:text-white hover:bg-red-700 duration-200 rounded-[10px]" >Home</Link>
          <Link href="" className="px-2 py-1.5 hover:text-white hover:bg-red-700 duration-200 rounded-[10px]" >Menu</Link>
          <Link href="" className="px-2 py-1.5 hover:text-white hover:bg-red-700 duration-200 rounded-[10px]" >Reservation</Link>
          <Link href="" className="px-2 py-1.5 hover:text-white hover:bg-red-700 duration-200 rounded-[10px]" >Contact</Link>
        </div>

        <div className="flex absolute right-0 gap-10 px-4">
          <Link href="" className=" cursor-pointer">
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute top-3 right-35 md:right-19 text-xs bg-red-700 text-white rounded-full px-1 cursor-pointer">0</span>
          </Link>

          <Link href='/login'><User className="w-6 h-6" /></Link>

          <button onClick={() => setIsOpen(!isOpen)} className="cursor-pointer md:hidden">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {isOpen && (
        <div className="flex flex-col text-center">
          <Link href="/" className="py-4 hover:text-white hover:bg-red-700 duration-200" onClick={() => setIsOpen(false)}>Home</Link>
          <Link href="" className="py-4 hover:text-white hover:bg-red-700 duration-200" onClick={() => setIsOpen(false)}>Menu</Link>
          <Link href="" className="py-4 hover:text-white hover:bg-red-700 duration-200" onClick={() => setIsOpen(false)}>Reservation</Link>
          <Link href="" className="py-4 hover:text-white hover:bg-red-700 duration-200" onClick={() => setIsOpen(false)}>Contact</Link>
        </div>
      )}
    </>
  )
}

export default Navbar