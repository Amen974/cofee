import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import BestSellers from "./_components/BestSellers";
import Hero from "./_components/Hero";
import { Item } from "@/types";
import ReviewStack from "./_components/Reviewstack";
import Footer from "./_components/Footer";


export default async function Home() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: bestSellers, error } = await supabase
  .from('menu_items')
  .select('*')
  .in('name', ['Americano', 'Cortado', 'Creamy latte'])
  if (error) throw new Error(error.message)

  const items: Item[] = bestSellers
  return (
    <main>
      <Hero />
      <BestSellers items={items ?? []} />
      <ReviewStack />
      <Footer />
    </main>
  );
}
