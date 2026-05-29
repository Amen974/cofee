import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import MenuClient from "../_components/MenuClient"

export default async function MenuPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  
  const { data: items, error } = await supabase
    .from("menu_items")
    .select("*")

  if (error) {
    console.error("Error fetching menu items:", error);
    return <div>Error fetching menu items.</div>;
  }

  return <MenuClient items={items ?? []} />
}