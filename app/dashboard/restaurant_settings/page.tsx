'use client'

import { useCartIndicator } from "@/lib/store/useCartIndicator"
import { createClient } from "@/lib/supabase/client"
import { SettingsForm } from "@/types"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

const supabase = createClient()

const inputClasses = "rounded-xs border border-[#8D7E73]/30 bg-[#1b1816] px-3 py-2 text-sm tracking-normal text-white outline-none transition-colors duration-300 focus:border-[#A32D1C]/60 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
const labelClasses = "flex flex-col gap-2 text-xs tracking-[0.15em] uppercase text-[#8D7E73]"

export default function SettingsPage() {
  const { setCartState, reset: resetCartState } = useCartIndicator()
  const [saveStatus, setSaveStatus] = useState<"idle" | "error">("idle")

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<SettingsForm>()

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("restaurant_settings")
        .select("*")
        .single()

      if (error) {
        console.error("[SettingsPage] Failed to load settings:", error)
        return
      }

      if (data) reset(data)
    }

    load()
  }, [reset])

  async function onSubmit(values: SettingsForm) {
    setCartState('Saving')
    setSaveStatus("idle")

    const { id, ...payload } = values as SettingsForm & { id?: string }

    const { error } = await supabase
      .from("restaurant_settings")
      .update(payload)
      .eq("id", id)

    if (error) {
      console.error("[SettingsPage] Failed to update settings:", error)
      resetCartState()
      setSaveStatus("error")
      return
    }

    reset(values)
    resetCartState()
    setSaveStatus("idle")
  }

  return (
    <div className="p-6 text-[#8D7E73] flex flex-col items-center">
      <h1 className="text-3xl text-[#A32D1C] mb-6">Restaurant Settings</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl rounded-3xl border-3 border-[#2A1F1C] bg-[#141110] p-6 flex flex-col gap-4">
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
            <input type="number" {...register("session_duration_min", { valueAsNumber: true })} className={inputClasses} />
          </label>

          <label className={labelClasses}>
            Cleaning buffer (minutes)
            <input type="number" {...register("cleaning_buffer_min", { valueAsNumber: true })} className={inputClasses} />
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

        {saveStatus === "error" && <span className='bg-[#A32D1C]/10 border border-[#A32D1C]/30 text-[#A32D1C] text-xs tracking-wide px-3 py-2 rounded-xs'>Failed to save. Try again.</span>}

        <button
          type="submit"
          data-cursor-hover
          disabled={isSubmitting}
          className="self-start rounded-xs bg-[#9a2d1e] px-4 py-2 text-[0.625rem] tracking-[0.2em] uppercase text-white transition-colors duration-300 hover:bg-[#8d2414] disabled:cursor-not-allowed disabled:opacity-60"
        >
          Save
        </button>
      </form>
    </div>
  )
}