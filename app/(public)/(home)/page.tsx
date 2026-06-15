import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import BestSellers from "./_components/BestSellers";
import Hero from "./_components/Hero";


export default async function Home() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: bestSellers, error } = await supabase
  .from('menu_items')
  .select('*')
  .in('name', ['Americano', 'Cortado', 'Creamy latte'])
  if (error) return  console.error(error)
  return (
    <main>
      <Hero />
      <BestSellers items={bestSellers ?? []} />
    </main>
  );
}
