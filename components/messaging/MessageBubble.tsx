import { Database } from "@/lib/database.types"
import { formatDistanceToNow } from "date-fns"

type Message = Database["public"]["Tables"]["messages"]["Row"]

interface MessageBubbleProps {
  message: Message
  isCurrentUser: boolean
}

export function MessageBubble({ message, isCurrentUser }: MessageBubbleProps) {
  return (
    <div
      className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`max-w-[70%] rounded-lg px-4 py-2 ${
          isCurrentUser
            ? "bg-employer-blue text-white"
            : "bg-gray-800 text-gray-100"
        }`}
      >
        <p className="text-sm whitespace-pre-wrap break-words">
          {message.content}
        </p>
        <p
          className={`text-xs mt-1 ${
            isCurrentUser ? "text-gray-200" : "text-gray-400"
          }`}
        >
          {formatDistanceToNow(new Date(message.created_at), {
            addSuffix: true,
          })}
        </p>
      </div>
    </div>
  )
}
