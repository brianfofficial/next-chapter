import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// GET /api/conversations - Get all conversations for current user
export async function GET() {
  try {
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

    // Check if user is employer or athlete
    const { data: employer } = await supabase
      .from("employers")
      .select("id")
      .eq("id", userId)
      .single()

    const isEmployer = !!employer

    // Get conversations with last message preview
    let query = supabase
      .from("conversations")
      .select(
        `
        *,
        employer:employers!conversations_employer_id_fkey(id, company_name, contact_email),
        athlete:athletes!conversations_athlete_id_fkey(id, full_name, sport, email),
        messages(content, created_at, sender_type)
      `
      )
      .order("last_message_at", { ascending: false })

    if (isEmployer) {
      query = query.eq("employer_id", userId)
    } else {
      query = query.eq("athlete_id", userId)
    }

    const { data: conversations, error } = await query

    if (error) {
      console.error("Error fetching conversations:", error)
      return NextResponse.json(
        { error: "Failed to fetch conversations" },
        { status: 500 }
      )
    }

    // Get unread message counts for each conversation
    const conversationsWithUnread = await Promise.all(
      conversations.map(async (conv) => {
        const { count } = await supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .eq("conversation_id", conv.id)
          .eq("is_read", false)
          .neq("sender_id", userId)

        return {
          ...conv,
          unread_count: count || 0,
          last_message: conv.messages?.[0] || null,
        }
      })
    )

    return NextResponse.json({ conversations: conversationsWithUnread })
  } catch (error) {
    console.error("Conversations API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST /api/conversations - Create or get existing conversation
export async function POST(request: Request) {
  try {
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
    const { athlete_id } = await request.json()

    if (!athlete_id) {
      return NextResponse.json(
        { error: "athlete_id is required" },
        { status: 400 }
      )
    }

    // Verify user is an employer
    const { data: employer } = await supabase
      .from("employers")
      .select("id, subscription_tier")
      .eq("id", userId)
      .single()

    if (!employer) {
      return NextResponse.json(
        { error: "Only employers can initiate conversations" },
        { status: 403 }
      )
    }

    // Check subscription tier (Pro required for messaging)
    if (employer.subscription_tier !== "pro") {
      return NextResponse.json(
        {
          error: "Pro subscription required",
          upgrade_required: true,
        },
        { status: 403 }
      )
    }

    // Check if conversation already exists
    const { data: existingConversation } = await supabase
      .from("conversations")
      .select("*")
      .eq("employer_id", userId)
      .eq("athlete_id", athlete_id)
      .single()

    if (existingConversation) {
      return NextResponse.json({ conversation: existingConversation })
    }

    // Create new conversation
    const { data: newConversation, error } = await supabase
      .from("conversations")
      .insert({
        employer_id: userId,
        athlete_id,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating conversation:", error)
      return NextResponse.json(
        { error: "Failed to create conversation" },
        { status: 500 }
      )
    }

    return NextResponse.json({ conversation: newConversation }, { status: 201 })
  } catch (error) {
    console.error("Conversations POST error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
