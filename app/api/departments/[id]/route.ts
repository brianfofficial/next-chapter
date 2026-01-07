import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const departmentId = params.id

    // Get department details
    const { data: department, error: deptError } = await supabase
      .from("athletic_departments")
      .select("*")
      .eq("id", departmentId)
      .single()

    if (deptError || !department) {
      return NextResponse.json(
        { error: "Department not found" },
        { status: 404 }
      )
    }

    // Get stats
    const { data: teams } = await supabase
      .from("teams")
      .select("id")
      .eq("department_id", departmentId)

    const { data: coaches } = await supabase
      .from("department_admins")
      .select("id")
      .eq("department_id", departmentId)

    const { data: athletes } = await supabase
      .from("team_rosters")
      .select("athlete_id")
      .in("team_id", teams?.map(t => t.id) || [])

    const { data: profiles } = await supabase
      .from("athletes")
      .select("id")
      .in("id", athletes?.map(a => a.athlete_id) || [])
      .not("translated_summary", "is", null)

    const stats = {
      total_teams: teams?.length || 0,
      total_coaches: coaches?.length || 0,
      total_athletes: new Set(athletes?.map(a => a.athlete_id) || []).size,
      profiles_created: profiles?.length || 0
    }

    return NextResponse.json({
      success: true,
      department,
      stats
    })
  } catch (error: any) {
    console.error("Error fetching department:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
