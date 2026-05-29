import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type StoreStatus = { id: string; isopen: boolean }

export function useStoreStatus() {
  const [status, setStatus] = useState<StoreStatus>({ id: '', isopen: true })
  const supabase = createClient()

  useEffect(() => {
    const fetchStatus = async () => {
      const { data, error } = await supabase
        .from('restaurant_settings')
        .select('id, isopen')
        .single()

      if (error) { console.error('Error fetching store status:', error); return }
      if (data) setStatus(data)
    }

    fetchStatus()

    const channel = supabase
      .channel('store-status')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'restaurant_settings'
      }, (payload) => { setStatus({ id: payload.new.id, isopen: payload.new.isopen }) })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const toggle = async () => {
    if (!status) return
    const { error } = await supabase
      .from('restaurant_settings')
      .update({ isopen: !status.isopen })
      .eq('id', status.id)
    if (error) console.error('Error toggling store status:', error)
  }

  return { isOpen: status.isopen, toggle }
}