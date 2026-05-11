'use server'

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";


export async function login (fromData: FormData) {
  const supabase = createClient(await cookies())

  const { error } = await supabase.auth.signInWithPassword({
    email: 'aamenallah593@gmail.com',
    password: fromData.get("password") as string,
  })

  if (error) redirect("/login?error=Invalid%20credentials")
  else redirect("/dashboard")
}