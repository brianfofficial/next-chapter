"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Database } from "@/lib/database.types"

type AthleteProfile = Database['public']['Tables']['athletes']['Row']

export function useUser() {
  const [profile, setProfile] = useState<AthleteProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          setProfile(null)
          setLoading(false)
          return
        }

        const { data, error: fetchError } = await supabase
          .from('athletes')
          .select('*')
          .eq('id', user.id)
          .single()

        if (fetchError) {
          // Profile doesn't exist yet - this is OK
          if (fetchError.code === 'PGRST116') {
            setProfile(null)
          } else {
            setError(fetchError)
          }
        } else {
          setProfile(data)
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [supabase])

  const refreshProfile = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }

    const { data } = await supabase
      .from('athletes')
      .select('*')
      .eq('id', user.id)
      .single()

    setProfile(data)
    setLoading(false)
  }

  return { profile, loading, error, refreshProfile }
}
