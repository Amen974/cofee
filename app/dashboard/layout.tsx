import SideBar from "./_components/SideBar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">
      <SideBar />
      <main className="flex-1 bg-black">{children}</main>
    </div>
  )
}