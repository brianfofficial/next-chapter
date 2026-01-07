import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const departmentId = params.id

    // Get all teams for this department
    const { data: teams, error } = await supabase
      .from("teams")
      .select(`
        id,
        sport,
        name,
        created_at
      `)
      .eq("department_id", departmentId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching teams:", error)
      return NextResponse.json({ teams: [] })
    }

    // Get athlete counts for each team
    const teamsWithCounts = await Promise.all(
      (teams || []).map(async (team) => {
        const { count } = await supabase
          .from("team_rosters")
          .select("*", { count: "exact", head: true })
          .eq("team_id", team.id)
          .eq("status", "active")

        return {
          ...team,
          athlete_count: count || 0
        }
      })
    )

    return NextResponse.json({
      success: true,
      teams: teamsWithCounts
    })
  } catch (error: any) {
    console.error("Error fetching teams:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const departmentId = params.id

    const { sport, name } = body

    if (!sport || !name) {
      return NextResponse.json(
        { error: "Sport and name are required" },
        { status: 400 }
      )
    }

    const { data: team, error } = await supabase
      .from("teams")
      .insert({
        department_id: departmentId,
        sport,
        name
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating team:", error)
      return NextResponse.json(
        { error: "Failed to create team" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      team
    })
  } catch (error: any) {
    console.error("Error creating team:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
