import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from './useAuth'

export function usePresence() {
  const { user } = useAuth()
  const supabase = createClient()
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])

  useEffect(() => {
    if (!user) return

    // Update own presence to online
    updatePresence('online')

    // Set up interval to keep presence fresh
    const interval = setInterval(() => {
      updatePresence('online')
    }, 30000) // Update every 30 seconds

    // Clean up on unmount
    return () => {
      clearInterval(interval)
      updatePresence('offline')
    }
  }, [user])

  async function updatePresence(status: 'online' | 'away' | 'offline') {
    if (!user) return

    const userType = await getUserType()

    await supabase
      .from('user_presence')
      .upsert({
        user_id: user.id,
        user_type: userType,
        status,
        last_seen: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
  }

  async function getUserType(): Promise<'employer' | 'athlete'> {
    if (!user) return 'employer'

    const { data: employer } = await supabase
      .from('employers')
      .select('id')
      .eq('id', user.id)
      .single()

    return employer ? 'employer' : 'athlete'
  }

  async function getUserStatus(userId: string): Promise<'online' | 'away' | 'offline'> {
    const { data } = await supabase
      .from('user_presence')
      .select('status, last_seen')
      .eq('user_id', userId)
      .single()

    if (!data) return 'offline'

    // Consider user offline if last_seen is older than 2 minutes
    const lastSeen = new Date(data.last_seen)
    const now = new Date()
    const diffMinutes = (now.getTime() - lastSeen.getTime()) / 1000 / 60

    if (diffMinutes > 2) return 'offline'

    return data.status
  }

  return {
    updatePresence,
    getUserStatus,
    onlineUsers,
  }
}
