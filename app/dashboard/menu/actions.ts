"use server"

import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { ItemForm } from "@/types";

export async function addItem(formData: ItemForm) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase
    .from("menu_items")
    .insert(formData)

  if (error) return { success: false, error: error.message };
  
  revalidatePath("/dashboard/menu");
  return { success: true };
}

export async function deleteItem(id: number) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase
    .from("menu_items")
    .delete()
    .eq("id", id)

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/menu");
  return { success: true };
}

export async function updateItem(id: number, formData: ItemForm) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase
    .from("menu_items")
    .update(formData)
    .eq("id", id)

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/menu");
  return { success: true };
}

export async function toggleAvailability(id: number, isAvailable: boolean) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase
    .from("menu_items")
    .update({ is_available: isAvailable })
    .eq("id", id)

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/menu");
  return { success: true };
}

export async function uploadImage(file: File) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const fileName = `${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from("cofee_imgs")
    .upload(fileName, file);

  if (error) return { success: false, error: error.message };

  const { data } = supabase.storage
    .from("cofee_imgs")
    .getPublicUrl(fileName);

  return { success: true, url: data.publicUrl };
}