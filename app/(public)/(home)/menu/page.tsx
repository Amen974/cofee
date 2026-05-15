import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import MenuClient from "../_components/MenuClient"

export default async function MenuPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  
  const { data: items } = await supabase
    .from("menu_items")
    .select("*")

  return <MenuClient items={items ?? []} />
}