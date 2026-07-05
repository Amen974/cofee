'use client'

import { createClient } from "@/lib/supabase/client"
import { SettingsForm } from "@/types"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

const supabase = createClient()

const inputClasses = "rounded-xs border border-[#8D7E73]/30 bg-[#1b1816] px-3 py-2 text-sm tracking-normal text-white outline-none transition-colors duration-300 focus:border-[#A32D1C]/60"
const labelClasses = "flex flex-col gap-2 text-xs tracking-[0.15em] uppercase text-[#8D7E73]"

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

  if (isLoading) return (
    <div className="flex items-center justify-center h-64 text-[#8D7E73] text-xs tracking-[0.2em] uppercase">
      Loading settings...
    </div>
  )

  return (
    <div className="p-6 min-h-screen text-[#8D7E73] flex flex-col items-center">
      <h1 className="text-3xl text-[#A32D1C] mb-6">Restaurant Settings</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl bg-[#211c19] border border-[#8D7E73]/20 rounded-2xl p-6 flex flex-col gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className={labelClasses}>
            Open time
            <input type="time" {...register("open_time")} className={inputClasses} />
          </label>

          <label className={labelClasses}>
            Close time
            <input type="time" {...register("close_time")} className={inputClasses} />
          </label>

          <label className={labelClasses}>
            Slot interval (minutes)
            <input type="number" {...register("slot_interval", { valueAsNumber: true })} className={inputClasses} />
          </label>

          <label className={labelClasses}>
            Total capacity
            <input type="number" {...register("total_capacity", { valueAsNumber: true })} className={inputClasses} />
          </label>

          <label className={labelClasses}>
            Session duration (minutes)
            <input type="number" {...register("session_duration", { valueAsNumber: true })} className={inputClasses} />
          </label>

          <label className={labelClasses}>
            Cleaning buffer (minutes)
            <input type="number" {...register("cleaning_buffer", { valueAsNumber: true })} className={inputClasses} />
          </label>

          <label className={labelClasses}>
            Max party size
            <input type="number" {...register("max_party_size", { valueAsNumber: true })} className={inputClasses} />
          </label>

          <label className={labelClasses}>
            Min party size
            <input type="number" {...register("min_party_size", { valueAsNumber: true })} className={inputClasses} />
          </label>

          <label className={labelClasses}>
            Max booking days
            <input type="number" {...register("max_booking_days", { valueAsNumber: true })} className={inputClasses} />
          </label>

          <label className={labelClasses}>
            Tax rate (%)
            <input step="0.01" type="number" {...register("tax_rate", { valueAsNumber: true })} className={inputClasses} />
          </label>

          <label className={labelClasses}>
            Delivery fee
            <input step="0.01" type="number" {...register("delivery_fee", { valueAsNumber: true })} className={inputClasses} />
          </label>
        </div>

        {saveStatus === "success" && <p className="text-xs tracking-widest text-[#A32D1C]">Settings saved.</p>}
        {saveStatus === "error" && <p className="text-xs tracking-widest text-[#8D7E73]">Failed to save. Try again.</p>}

        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="self-start rounded-xs bg-[#9a2d1e] px-4 py-2 text-[0.625rem] tracking-[0.2em] uppercase text-white transition-colors duration-300 hover:bg-[#8d2414] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  )
}