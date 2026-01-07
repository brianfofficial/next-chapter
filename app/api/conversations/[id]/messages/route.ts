import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// GET /api/conversations/[id]/messages - Get all messages for a conversation
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = user.id

    // Verify user is part of this conversation
    const { data: conversation, error: convError } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", id)
      .or(`employer_id.eq.${userId},athlete_id.eq.${userId}`)
      .single()

    if (convError || !conversation) {
      return NextResponse.json(
        { error: "Conversation not found or access denied" },
        { status: 404 }
      )
    }

    // Get all messages for this conversation
    const { data: messages, error: messagesError } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", id)
      .order("created_at", { ascending: true })

    if (messagesError) {
      console.error("Error fetching messages:", messagesError)
      return NextResponse.json(
        { error: "Failed to fetch messages" },
        { status: 500 }
      )
    }

    return NextResponse.json({ messages })
  } catch (error) {
    console.error("Messages GET error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST /api/conversations/[id]/messages - Send a message
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = user.id
    const { content } = await request.json()

    if (!content || content.trim() === "") {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 }
      )
    }

    // Verify user is part of this conversation
    const { data: conversation, error: convError } = await supabase
      .from("conversations")
      .select("employer_id, athlete_id")
      .eq("id", id)
      .single()

    if (convError || !conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      )
    }

    // Determine sender type
    const isEmployer = conversation.employer_id === userId
    const isAthlete = conversation.athlete_id === userId

    if (!isEmployer && !isAthlete) {
      return NextResponse.json(
        { error: "You are not part of this conversation" },
        { status: 403 }
      )
    }

    const senderType = isEmployer ? "employer" : "athlete"

    // Create the message
    const { data: message, error: messageError } = await supabase
      .from("messages")
      .insert({
        conversation_id: id,
        sender_id: userId,
        sender_type: senderType,
        content: content.trim(),
      })
      .select()
      .single()

    if (messageError) {
      console.error("Error creating message:", messageError)
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 500 }
      )
    }

    return NextResponse.json({ message }, { status: 201 })
  } catch (error) {
    console.error("Messages POST error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
