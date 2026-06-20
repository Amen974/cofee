import CartButton from "../components/CartButton"
import IsOpen from "../components/IsOpen"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <IsOpen />
      <CartButton />
      <main className="relative">
        {children}
      </main>
    </>
  )
}