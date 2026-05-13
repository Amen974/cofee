import SideBar from "./_components/SideBar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-full flex">
      <SideBar />
      <main className="flex-1 bg-[#141313]">{children}</main>
    </div>
  )
}