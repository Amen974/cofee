import CartButton from "../components/CartButton"
import IsOpen from "../components/IsOpen"
import Navbar from "../components/Navbar"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <IsOpen />
      <CartButton />
      <main className="bg-[#0E0D0B] relative">
        <Navbar />
        {children}
      </main>
    </>
  )
}