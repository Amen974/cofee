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

export async function deleteItem(id: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: item, error: fetchError } = await supabase
    .from("menu_items")
    .select("image_url")
    .eq("id", id)
    .single();

  if (fetchError) return { success: false, error: fetchError.message };

  if (item.image_url) {
    const path = item.image_url.split("/cofee_imgs/")[1];
    await supabase.storage.from("cofee_imgs").remove([decodeURIComponent(path)]);
  }

  const { error } = await supabase
    .from("menu_items")
    .delete()
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard/menu");
  return { success: true };
}

export async function updateItem(id: string, formData: ItemForm) {
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

export async function toggleAvailability(id: string, isAvailable: boolean) {
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

  const fileName = `${file.name}`;

  const { error } = await supabase.storage
    .from("cofee_imgs")
    .upload(fileName, file);

  if (error) return { success: false, error: error.message };

  const { data } = supabase.storage
    .from("cofee_imgs")
    .getPublicUrl(fileName);

  return { success: true, url: data.publicUrl };
}

export async function updateIsAvailable(id: string, isAvailable: boolean) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase
    .from("menu_items")
    .update({ is_available: isAvailable })
    .eq("id", id)

  if (error) return { success: false, error: error.message };

  return { success: true };
}

export async function deleteImage(fileUrl: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const fileName = fileUrl.split("/cofee_imgs/")[1];

  const { error } = await supabase.storage.from("cofee_imgs").remove([decodeURIComponent(fileName)]);

  if (error) return { success: false, error: error.message };

  return { success: true };
}