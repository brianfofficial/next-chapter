import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// PATCH /api/conversations/[id]/read - Mark all messages in conversation as read
export async function PATCH(
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
      .select("employer_id, athlete_id")
      .eq("id", id)
      .single()

    if (convError || !conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      )
    }

    const isEmployer = conversation.employer_id === userId
    const isAthlete = conversation.athlete_id === userId

    if (!isEmployer && !isAthlete) {
      return NextResponse.json(
        { error: "You are not part of this conversation" },
        { status: 403 }
      )
    }

    // Mark all unread messages from the OTHER person as read
    const otherSenderType = isEmployer ? "athlete" : "employer"

    const { data, error } = await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("conversation_id", id)
      .eq("sender_type", otherSenderType)
      .eq("is_read", false)
      .select()

    if (error) {
      console.error("Error marking messages as read:", error)
      return NextResponse.json(
        { error: "Failed to mark messages as read" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      updated_count: data?.length || 0,
    })
  } catch (error) {
    console.error("Mark as read error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
