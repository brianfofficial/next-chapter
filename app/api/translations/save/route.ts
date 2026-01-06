import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get request body
    const body = await request.json()
    const {
      sport,
      position,
      school,
      graduation_year,
      gpa,
      major,
      experiences,
      translated_summary,
      translated_bullets,
    } = body

    // Upsert athlete profile
    const { data, error } = await supabase
      .from('athletes')
      .upsert({
        id: user.id,
        email: user.email!,
        full_name: user.user_metadata.full_name || user.user_metadata.name || null,
        sport,
        position,
        school,
        graduation_year,
        gpa,
        major,
        experiences,
        translated_summary,
        translated_bullets,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to save translation' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
