
import IsOpen from "../components/IsOpen"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <IsOpen />
      <main className="relative">
        {children}
      </main>
    </>
  )
}