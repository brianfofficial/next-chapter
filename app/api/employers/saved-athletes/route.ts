import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// POST - Save an athlete
export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get request body
    const body = await request.json()
    const { athlete_id, notes } = body

    if (!athlete_id) {
      return NextResponse.json({ error: 'Athlete ID is required' }, { status: 400 })
    }

    // Insert saved athlete
    const { data, error } = await supabase
      .from('saved_athletes')
      .insert({
        employer_id: user.id,
        athlete_id,
        notes: notes || null,
      })
      .select()
      .single()

    if (error) {
      // Check if already saved
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Athlete already saved' }, { status: 409 })
      }
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to save athlete' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Unsave an athlete
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get athlete_id from query params
    const { searchParams } = new URL(request.url)
    const athlete_id = searchParams.get('athlete_id')

    if (!athlete_id) {
      return NextResponse.json({ error: 'Athlete ID is required' }, { status: 400 })
    }

    // Delete saved athlete
    const { error } = await supabase
      .from('saved_athletes')
      .delete()
      .eq('employer_id', user.id)
      .eq('athlete_id', athlete_id)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to unsave athlete' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET - Get all saved athletes for employer
export async function GET() {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get saved athletes with athlete data
    const { data, error } = await supabase
      .from('saved_athletes')
      .select(`
        *,
        athletes (*)
      `)
      .eq('employer_id', user.id)
      .order('saved_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch saved athletes' }, { status: 500 })
    }

    // Flatten the response to return just athlete data with isSaved flag
    const athletes = (data || []).map((saved: any) => ({
      ...saved.athletes,
      isSaved: true,
    }))

    return NextResponse.json({ athletes })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
