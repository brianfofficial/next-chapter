import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const departmentId = params.id

    const { email, name, role, team_id } = body

    if (!email || !name || !role) {
      return NextResponse.json(
        { error: "Email, name, and role are required" },
        { status: 400 }
      )
    }

    // Check if coach already exists
    const { data: existingUser } = await supabase.auth.admin.listUsers()
    const userExists = existingUser.users.find(u => u.email === email)

    if (userExists) {
      // Check if they're already part of this department
      const { data: existingAdmin } = await supabase
        .from("department_admins")
        .select("id")
        .eq("department_id", departmentId)
        .eq("user_id", userExists.id)
        .single()

      if (existingAdmin) {
        return NextResponse.json(
          { error: "This coach is already part of your department" },
          { status: 400 }
        )
      }
    }

    // Get department details for the email
    const { data: department } = await supabase
      .from("athletic_departments")
      .select("school_name, name")
      .eq("id", departmentId)
      .single()

    // Create invitation record (we'll store in a new table or use metadata)
    // For now, we'll simulate sending an email

    // TODO: Implement actual email sending with invitation link
    // The invitation should:
    // 1. Create a unique token
    // 2. Send email with link to /departments/invite/[token]
    // 3. When clicked, create user account and add to department_admins

    // For demo purposes, we'll return success
    console.log(`
      📧 INVITATION EMAIL (Demo):
      To: ${email}
      Subject: You've been invited to join ${department?.school_name} on Next Chapter

      Hi ${name},

      You've been invited to join ${department?.school_name} - ${department?.name} as a ${role.replace("_", " ")}.

      Click here to accept: [INVITATION_LINK]

      Best regards,
      Next Chapter Team
    `)

    return NextResponse.json({
      success: true,
      message: "Invitation sent successfully",
      demo_note: "In production, an actual email would be sent"
    })
  } catch (error: any) {
    console.error("Error sending invitation:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
