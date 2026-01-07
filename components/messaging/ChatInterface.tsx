"use client"

import { useEffect, useRef } from "react"
import { useMessages } from "@/lib/hooks/useMessages"
import { MessageBubble } from "./MessageBubble"
import { MessageComposer } from "./MessageComposer"
import { Loader2 } from "lucide-react"
import { useEmployer } from "@/lib/hooks/useEmployer"

interface ChatInterfaceProps {
  conversationId: string
  otherPersonName: string
  otherPersonRole: string // e.g., "Software Engineer" or "Tech Startup"
}

export function ChatInterface({
  conversationId,
  otherPersonName,
  otherPersonRole,
}: ChatInterfaceProps) {
  const { profile: employer } = useEmployer()
  const { messages, loading, sending, sendMessage, markAsRead } =
    useMessages(conversationId)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Mark messages as read when conversation is opened
  useEffect(() => {
    if (conversationId) {
      markAsRead()
    }
  }, [conversationId, markAsRead])

  if (loading) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-employer-blue" />
        <p className="text-gray-400 mt-2">Loading messages...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="border-b border-gray-800 p-4 bg-black/80">
        <h2 className="text-xl font-semibold">{otherPersonName}</h2>
        <p className="text-sm text-gray-400">{otherPersonRole}</p>
      </div>

      {/* Messages Area */}
      <div
        ref={scrollAreaRef}
        className="flex-1 overflow-y-auto p-4 space-y-2"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-gray-400 mb-2">No messages yet</p>
            <p className="text-sm text-gray-500">
              Send a message to start the conversation!
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isCurrentUser={message.sender_id === employer?.id}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Composer */}
      <MessageComposer onSend={sendMessage} sending={sending} />
    </div>
  )
}
