import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const departmentId = params.id

    // Get all department admins (coaches) for this department
    const { data: admins, error } = await supabase
      .from("department_admins")
      .select(`
        id,
        user_id,
        role,
        team_id,
        created_at,
        teams (
          name
        )
      `)
      .eq("department_id", departmentId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching coaches:", error)
      return NextResponse.json({ coaches: [] })
    }

    // Get user details for each admin
    const coaches = await Promise.all(
      (admins || []).map(async (admin) => {
        const { data: user } = await supabase.auth.admin.getUserById(admin.user_id)

        return {
          id: admin.id,
          email: user?.user?.email || "Unknown",
          name: user?.user?.user_metadata?.full_name || user?.user?.user_metadata?.name || "Unknown",
          role: admin.role,
          team_name: admin.teams?.name || null,
          status: "accepted", // If they're in the table, they've accepted
          invited_at: admin.created_at
        }
      })
    )

    // TODO: Also get pending invitations from a separate invitations table

    return NextResponse.json({
      success: true,
      coaches
    })
  } catch (error: any) {
    console.error("Error fetching coaches:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
