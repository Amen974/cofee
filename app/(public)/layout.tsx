import CartButton from "../components/CartButton"
import IsOpen from "../components/IsOpen"
import Navbar from "../components/Navbar"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <Navbar />
      <IsOpen />
      <CartButton />
      <main>{children}</main>
    </div>
  )
}