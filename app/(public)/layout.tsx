import IsOpen from "../components/IsOpen"
import Navbar from "../components/Navbar"
import Link from "next/link"
import { ShoppingCart } from "lucide-react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <Navbar />
      <IsOpen />
      <Link href="/cart" className=" cursor-pointer fixed bottom-4 left-4 bg-black text-white p-3 rounded-full z-50 border-3 border-gray-900 hover:scale-95">
        <ShoppingCart className="w-4 h-4" />
      </Link>
      <main>{children}</main>
    </div>
  )
}