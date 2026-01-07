"use client"

import { useState, KeyboardEvent } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Loader2 } from "lucide-react"

interface MessageComposerProps {
  onSend: (content: string) => Promise<void>
  disabled?: boolean
  sending?: boolean
}

export function MessageComposer({
  onSend,
  disabled = false,
  sending = false,
}: MessageComposerProps) {
  const [message, setMessage] = useState("")

  const handleSend = async () => {
    if (!message.trim() || sending || disabled) return

    try {
      await onSend(message)
      setMessage("")
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t border-gray-800 p-4 bg-black/50">
      <div className="flex gap-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message... (Shift + Enter for new line)"
          className="min-h-[60px] resize-none bg-gray-900 border-gray-700 focus:border-employer-blue"
          disabled={disabled || sending}
        />
        <Button
          onClick={handleSend}
          disabled={!message.trim() || disabled || sending}
          className="bg-employer-blue hover:bg-employer-blue-dark h-auto px-6"
        >
          {sending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Press Enter to send, Shift + Enter for new line
      </p>
    </div>
  )
}
