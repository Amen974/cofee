import SideBar from "./_components/SideBar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex">
      <SideBar />
      <main className="flex-1 md:pl-64">{children}</main>
    </div>
  )
}