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
    const { data: teams } = await supabase
      .from("teams")
      .select("id, name")
      .eq("department_id", departmentId)

    const teamIds = teams?.map(t => t.id) || []

    // Get all athletes across all teams
    const { data: rosters } = await supabase
      .from("team_rosters")
      .select("athlete_id")
      .in("team_id", teamIds)
      .eq("status", "active")

    const athleteIds = Array.from(new Set(rosters?.map(r => r.athlete_id) || []))

    // Get profile completion data
    const { data: athletes } = await supabase
      .from("athletes")
      .select("id, translated_summary, translated_bullets")
      .in("id", athleteIds)

    const profilesCompleted = athletes?.filter(a => a.translated_summary && a.translated_bullets).length || 0
    const profilesInProgress = athletes?.filter(a => !a.translated_summary || !a.translated_bullets).length || 0

    // Calculate team-level stats
    const teamStats = await Promise.all(
      (teams || []).map(async (team) => {
        const { data: teamRoster } = await supabase
          .from("team_rosters")
          .select("athlete_id")
          .eq("team_id", team.id)
          .eq("status", "active")

        const teamAthleteIds = teamRoster?.map(r => r.athlete_id) || []

        const { data: teamAthletes } = await supabase
          .from("athletes")
          .select("id, translated_summary")
          .in("id", teamAthleteIds)

        const completed = teamAthletes?.filter(a => a.translated_summary).length || 0
        const total = teamAthletes?.length || 0

        return {
          name: team.name,
          athlete_count: total,
          profiles_completed: completed,
          completion_rate: total > 0 ? Math.round((completed / total) * 100) : 0
        }
      })
    )

    const data = {
      overview: {
        total_athletes: athleteIds.length,
        profiles_completed: profilesCompleted,
        profiles_in_progress: profilesInProgress,
        avg_completion_rate: athleteIds.length > 0
          ? Math.round((profilesCompleted / athleteIds.length) * 100)
          : 0
      },
      teams: teamStats,
      engagement: {
        active_this_week: 0, // TODO: Implement with analytics_events
        active_this_month: 0,
        logins_this_week: 0
      }
    }

    return NextResponse.json({
      success: true,
      data
    })
  } catch (error: any) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
