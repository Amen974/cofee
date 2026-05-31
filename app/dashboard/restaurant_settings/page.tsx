'use client'

import { createClient } from "@/lib/supabase/client"
import { SettingsForm } from "@/types"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

const supabase = createClient()

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle")

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<SettingsForm>()

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("restaurant_settings")
        .select("*")
        .single()

      if (error) {
        console.error("[SettingsPage] Failed to load settings:", error)
        setIsLoading(false)
        return
      }

      if (data) reset(data)
      setIsLoading(false)
    }

    load()
  }, [])

  async function onSubmit(values: SettingsForm) {
    setSaveStatus("idle")

    const { id, ...payload } = values as SettingsForm & { id?: string }

    const { error } = await supabase
      .from("restaurant_settings")
      .update(payload)
      .eq("id", id)

    if (error) {
      console.error("[SettingsPage] Failed to update settings:", error)
      setSaveStatus("error")
      return
    }

    reset(values)
    setSaveStatus("success")
  }

  if (isLoading) return <p>Loading settings...</p>

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='text-white flex flex-col gap-4'>
      <label>
        Open time
        <input type="time" {...register("open_time")} />
      </label>

      <label>
        Close time
        <input type="time" {...register("close_time")} />
      </label>

      <label>
        Slot interval (minutes)
        <input type="number" {...register("slot_interval", { valueAsNumber: true })} />
      </label>

      <label>
        Total capacity
        <input type="number" {...register("total_capacity", { valueAsNumber: true })} />
      </label>

      <label>
        Session duration (minutes)
        <input type="number" {...register("session_duration", { valueAsNumber: true })} />
      </label>

      <label>
        Cleaning buffer (minutes)
        <input type="number" {...register("cleaning_buffer", { valueAsNumber: true })} />
      </label>

      <label>
        Max party size
        <input type="number" {...register("max_party_size", { valueAsNumber: true })} />
      </label>

      <label>
        Min party size
        <input type="number" {...register("min_party_size", { valueAsNumber: true })} />
      </label>

      <label>
        Max booking days
        <input type="number" {...register("max_booking_days", { valueAsNumber: true })} />
      </label>

      <label>
        Tax rate (%)
        <input step="0.01" type="number" {...register("tax_rate", { valueAsNumber: true })} />
      </label>

      <label>
        Delivery fee
        <input step="0.01" type="number" {...register("delivery_fee", { valueAsNumber: true })} />
      </label>

      {saveStatus === "success" && <p>Settings saved.</p>}
      {saveStatus === "error" && <p>Failed to save. Try again.</p>}

      <button type="submit" disabled={isSubmitting || isLoading}>
        {isSubmitting ? "Saving..." : "Save"}
      </button>
    </form>
  )
}