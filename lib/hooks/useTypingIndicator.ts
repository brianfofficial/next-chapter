import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from './useAuth'

export function useTypingIndicator(conversationId: string) {
  const { user } = useAuth()
  const supabase = createClient()
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false)
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!user || !conversationId) return

    // Subscribe to typing indicators for this conversation
    const channel = supabase
      .channel(`typing:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'typing_indicators',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          // Check if it's not the current user typing
          if (payload.new && 'user_id' in payload.new && payload.new.user_id !== user.id) {
            setIsOtherUserTyping((payload.new as any).is_typing)

            // Auto-clear typing indicator after 3 seconds
            setTimeout(() => {
              setIsOtherUserTyping(false)
            }, 3000)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, conversationId])

  async function setTyping(isTyping: boolean) {
    if (!user || !conversationId) return

    const userType = await getUserType()

    if (isTyping) {
      // Clear existing timeout
      if (typingTimeout) {
        clearTimeout(typingTimeout)
      }

      // Set new typing indicator
      await supabase
        .from('typing_indicators')
        .upsert({
          conversation_id: conversationId,
          user_id: user.id,
          user_type: userType,
          is_typing: true,
          updated_at: new Date().toISOString(),
        })

      // Auto-clear after 2 seconds
      const timeout = setTimeout(async () => {
        await supabase
          .from('typing_indicators')
          .delete()
          .eq('conversation_id', conversationId)
          .eq('user_id', user.id)
      }, 2000)

      setTypingTimeout(timeout)
    } else {
      // Clear typing indicator
      await supabase
        .from('typing_indicators')
        .delete()
        .eq('conversation_id', conversationId)
        .eq('user_id', user.id)

      if (typingTimeout) {
        clearTimeout(typingTimeout)
        setTypingTimeout(null)
      }
    }
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

  return {
    setTyping,
    isOtherUserTyping,
  }
}
