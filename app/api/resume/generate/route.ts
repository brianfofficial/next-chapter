import { NextResponse } from "next/server"
import { renderToStream } from "@react-pdf/renderer"
import { ResumeTemplate } from "@/components/pdf/ResumeTemplate"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { athleteId } = body

    if (!athleteId) {
      return NextResponse.json(
        { error: "Athlete ID is required" },
        { status: 400 }
      )
    }

    // Fetch athlete data
    const supabase = await createClient()
    const { data: athlete, error } = await supabase
      .from("athletes")
      .select("*")
      .eq("id", athleteId)
      .single()

    if (error || !athlete) {
      return NextResponse.json(
        { error: "Athlete not found" },
        { status: 404 }
      )
    }

    // Get user data for name and email
    const { data: authData } = await supabase.auth.admin.getUserById(athleteId)
    const user = authData?.user

    const athleteData = {
      name: user?.user_metadata?.full_name || user?.user_metadata?.name || "Student-Athlete",
      email: user?.email || athlete.email || "",
      sport: athlete.sport || undefined,
      position: athlete.position || undefined,
      school: athlete.school || undefined,
      graduation_year: athlete.graduation_year || undefined,
      gpa: athlete.gpa || undefined,
      major: athlete.major || undefined,
      translated_summary: athlete.translated_summary || undefined,
      translated_bullets: Array.isArray(athlete.translated_bullets)
        ? athlete.translated_bullets
        : []
    }

    // Generate PDF
    const stream = await renderToStream(<ResumeTemplate athleteData={athleteData} />)

    // Convert stream to buffer
    const chunks: Buffer[] = []
    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk))
    }
    const pdfBuffer = Buffer.concat(chunks)

    // Return PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${athleteData.name.replace(/\s+/g, "_")}_Resume.pdf"`,
      },
    })
  } catch (error: any) {
    console.error("PDF generation error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to generate PDF" },
      { status: 500 }
    )
  }
}
