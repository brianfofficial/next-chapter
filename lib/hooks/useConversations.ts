import { useEffect, useState } from "react"
import { Database } from "@/lib/database.types"

type Conversation = Database["public"]["Tables"]["conversations"]["Row"] & {
  employer: {
    id: string
    company_name: string
    contact_email: string
  }
  athlete: {
    id: string
    full_name: string
    sport: string
    email: string
  }
  unread_count: number
  last_message: {
    content: string
    created_at: string
    sender_type: "employer" | "athlete"
  } | null
}

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchConversations() {
      try {
        const res = await fetch("/api/conversations")

        if (!res.ok) {
          throw new Error("Failed to fetch conversations")
        }

        const data = await res.json()
        setConversations(data.conversations || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchConversations()
  }, [])

  const createConversation = async (athleteId: string) => {
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ athlete_id: athleteId }),
      })

      if (!res.ok) {
        const data = await res.json()
        if (data.upgrade_required) {
          throw new Error("UPGRADE_REQUIRED")
        }
        throw new Error(data.error || "Failed to create conversation")
      }

      const { conversation } = await res.json()
      return conversation
    } catch (err) {
      throw err
    }
  }

  return {
    conversations,
    loading,
    error,
    createConversation,
  }
}
