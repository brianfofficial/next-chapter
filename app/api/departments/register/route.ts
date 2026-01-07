import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const {
      school_name,
      department_name,
      division,
      conference,
      athletic_director_name,
      contact_email,
      contact_phone,
      address,
      city,
      state,
      zip_code,
      website_url,
      estimated_athletes,
      estimated_teams
    } = body

    // Validate required fields
    if (!school_name || !department_name || !division || !athletic_director_name || !contact_email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check if department already exists
    const { data: existing } = await supabase
      .from("athletic_departments")
      .select("id")
      .eq("contact_email", contact_email)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: "A department with this email already exists" },
        { status: 400 }
      )
    }

    // Create the athletic department
    const { data: department, error: deptError } = await supabase
      .from("athletic_departments")
      .insert({
        name: department_name,
        school_name,
        division,
        conference: conference || null,
        athletic_director_name,
        contact_email,
        contact_phone: contact_phone || null,
        address: address || null,
        city: city || null,
        state: state || null,
        zip_code: zip_code || null,
        website_url: website_url || null,
        subscription_tier: "trial",
        metadata: {
          estimated_athletes: estimated_athletes ? parseInt(estimated_athletes) : null,
          estimated_teams: estimated_teams ? parseInt(estimated_teams) : null,
          registration_date: new Date().toISOString()
        }
      })
      .select()
      .single()

    if (deptError) {
      console.error("Department creation error:", deptError)
      return NextResponse.json(
        { error: "Failed to create department" },
        { status: 500 }
      )
    }

    // TODO: Send welcome email with setup instructions
    // TODO: Create initial admin user account

    return NextResponse.json({
      success: true,
      department,
      message: "Department registered successfully. Check your email for setup instructions."
    })
  } catch (error: any) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
