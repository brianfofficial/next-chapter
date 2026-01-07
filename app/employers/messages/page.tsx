"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { ConversationsList } from "@/components/messaging/ConversationsList"
import { ChatInterface } from "@/components/messaging/ChatInterface"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"

export default function EmployerMessagesPage() {
  const searchParams = useSearchParams()
  const conversationParam = searchParams.get("conversation")

  const [selectedConversation, setSelectedConversation] = useState<{
    id: string
    otherPerson: {
      full_name?: string
      company_name?: string
      sport?: string
      contact_email?: string
    }
  } | null>(null)

  // Auto-select conversation from URL parameter
  useEffect(() => {
    if (conversationParam && !selectedConversation) {
      setSelectedConversation({
        id: conversationParam,
        otherPerson: {}, // Will be populated when conversation loads
      })
    }
  }, [conversationParam, selectedConversation])

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a href="/employers" className="text-2xl font-bold gradient-text">
              Next Chapter
            </a>
            <div className="flex gap-4">
              <a href="/employers/browse">
                <Button variant="ghost">Browse</Button>
              </a>
              <a href="/employers/saved">
                <Button variant="ghost">Saved</Button>
              </a>
              <a href="/employers/messages">
                <Button variant="ghost" className="border-b-2 border-employer-blue">
                  Messages
                </Button>
              </a>
              <a href="/employers/settings">
                <Button variant="ghost">Settings</Button>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Messages Layout */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <MessageCircle className="h-8 w-8 text-employer-blue" />
          <h1 className="text-4xl font-bold">Messages</h1>
        </div>

        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-16rem)]">
          {/* Conversations List */}
          <div className="col-span-4 bg-gray-950 border border-gray-800 rounded-lg overflow-hidden">
            <div className="border-b border-gray-800 p-4 bg-black/80">
              <h2 className="font-semibold">Conversations</h2>
            </div>
            <div className="overflow-y-auto h-[calc(100%-4rem)]">
              <ConversationsList
                selectedConversationId={selectedConversation?.id}
                onSelectConversation={(id, otherPerson) =>
                  setSelectedConversation({ id, otherPerson })
                }
              />
            </div>
          </div>

          {/* Chat Area */}
          <div className="col-span-8 bg-gray-950 border border-gray-800 rounded-lg overflow-hidden">
            {selectedConversation ? (
              <ChatInterface
                conversationId={selectedConversation.id}
                otherPersonName={
                  selectedConversation.otherPerson.full_name ||
                  selectedConversation.otherPerson.company_name ||
                  "Unknown"
                }
                otherPersonRole={
                  selectedConversation.otherPerson.sport ||
                  selectedConversation.otherPerson.contact_email ||
                  ""
                }
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <MessageCircle className="h-16 w-16 text-gray-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
                <p className="text-gray-400">
                  Choose a conversation from the list to start messaging
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
