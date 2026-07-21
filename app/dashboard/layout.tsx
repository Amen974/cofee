import SideBar from "./_components/SideBar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex mt-20">
      <SideBar />
      <main className="flex-1 md:pl-64 pb-16 md:pb-0">{children}</main>
    </div>
  )
}