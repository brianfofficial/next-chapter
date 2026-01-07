import { useEffect, useState, useCallback } from "react"
import { Database } from "@/lib/database.types"

type Message = Database["public"]["Tables"]["messages"]["Row"]

export function useMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (!conversationId) {
      setLoading(false)
      return
    }

    async function fetchMessages() {
      try {
        setLoading(true)
        const res = await fetch(`/api/conversations/${conversationId}/messages`)

        if (!res.ok) {
          throw new Error("Failed to fetch messages")
        }

        const data = await res.json()
        setMessages(data.messages || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [conversationId])

  const sendMessage = useCallback(
    async (content: string) => {
      if (!conversationId || !content.trim()) return

      try {
        setSending(true)
        const res = await fetch(`/api/conversations/${conversationId}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: content.trim() }),
        })

        if (!res.ok) {
          throw new Error("Failed to send message")
        }

        const { message } = await res.json()
        setMessages((prev) => [...prev, message])
        return message
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to send message")
        throw err
      } finally {
        setSending(false)
      }
    },
    [conversationId]
  )

  const markAsRead = useCallback(async () => {
    if (!conversationId) return

    try {
      await fetch(`/api/conversations/${conversationId}/read`, {
        method: "PATCH",
      })
    } catch (err) {
      console.error("Failed to mark messages as read:", err)
    }
  }, [conversationId])

  return {
    messages,
    loading,
    error,
    sending,
    sendMessage,
    markAsRead,
  }
}
