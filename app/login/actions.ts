'use server'

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const email = process.env.email as string


export async function login(formData: FormData) {
  const supabase = createClient(await cookies())

  const { error } = await supabase.auth.signInWithPassword({
    email: email,
    password: formData.get("password") as string,
  })

  if (error) redirect(error.message)
  redirect("/dashboard/live-orders")
}

export async function logout() {
  const supabase = createClient(await cookies())

  const { error } = await supabase.auth.signOut()
  if (error) console.error('Error signing out:', error)

  redirect('/login')
}