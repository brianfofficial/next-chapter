"use client"

import { useConversations } from "@/lib/hooks/useConversations"
import { Badge } from "@/components/ui/badge"
import { Loader2, MessageCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useEmployer } from "@/lib/hooks/useEmployer"

interface ConversationsListProps {
  selectedConversationId?: string
  onSelectConversation: (conversationId: string, otherPerson: any) => void
}

export function ConversationsList({
  selectedConversationId,
  onSelectConversation,
}: ConversationsListProps) {
  const { profile: employer } = useEmployer()
  const { conversations, loading, error } = useConversations()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-6 w-6 animate-spin text-employer-blue" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-400">Failed to load conversations</p>
        <p className="text-sm text-gray-500 mt-1">{error}</p>
      </div>
    )
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <MessageCircle className="h-12 w-12 text-gray-600 mb-4" />
        <p className="text-gray-400 mb-2">No conversations yet</p>
        <p className="text-sm text-gray-500">
          Start a conversation by messaging an athlete from their profile
        </p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-800">
      {conversations.map((conversation) => {
        const isEmployer = employer?.id === conversation.employer_id
        const otherPerson = isEmployer
          ? conversation.athlete
          : conversation.employer
        const isSelected = selectedConversationId === conversation.id

        // Type-safe property access
        const name = isEmployer
          ? (otherPerson as typeof conversation.athlete).full_name
          : (otherPerson as typeof conversation.employer).company_name

        const subtitle = isEmployer
          ? (otherPerson as typeof conversation.athlete).sport
          : (otherPerson as typeof conversation.employer).contact_email

        return (
          <button
            key={conversation.id}
            onClick={() => onSelectConversation(conversation.id, otherPerson)}
            className={`w-full p-4 text-left hover:bg-gray-900/50 transition-colors ${
              isSelected ? "bg-gray-900 border-l-4 border-employer-blue" : ""
            }`}
          >
            <div className="flex items-start justify-between mb-1">
              <h3 className="font-semibold">{name}</h3>
              {conversation.unread_count > 0 && (
                <Badge className="bg-employer-blue ml-2">
                  {conversation.unread_count}
                </Badge>
              )}
            </div>

            <p className="text-sm text-gray-400 mb-1">{subtitle}</p>

            {conversation.last_message && (
              <>
                <p className="text-sm text-gray-500 truncate">
                  {conversation.last_message.sender_type ===
                  (isEmployer ? "employer" : "athlete")
                    ? "You: "
                    : ""}
                  {conversation.last_message.content}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {formatDistanceToNow(
                    new Date(conversation.last_message.created_at),
                    { addSuffix: true }
                  )}
                </p>
              </>
            )}
          </button>
        )
      })}
    </div>
  )
}
