'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export const useTableCount = (tableName: string, statusValue: string): number => {
  const [count, setCount] = useState<number>(0)
  const supabase = createClient()

  useEffect(() => {
    const fetchCount = async (): Promise<void> => {
      const { count: fetchedCount, error } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true })
        .eq('status', statusValue)

      if (error) {
        console.error(`[useTableCount] Failed to fetch from ${tableName}:`, error)
      } else {
        setCount(fetchedCount ?? 0)
      }
    }

    fetchCount()

    const channel = supabase
      .channel(`${tableName}-count`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: tableName },
        fetchCount
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, tableName, statusValue])

  return count
}
