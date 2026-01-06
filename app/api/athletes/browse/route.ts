import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    // Check if user is authenticated employer
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is an employer
    const { data: employer } = await supabase
      .from('employers')
      .select('id')
      .eq('id', user.id)
      .single()

    if (!employer) {
      return NextResponse.json({ error: 'Not an employer account' }, { status: 403 })
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const sport = searchParams.get('sport') || ''
    const graduationYear = searchParams.get('graduation_year') || ''
    const school = searchParams.get('school') || ''
    const minGpa = searchParams.get('min_gpa') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const offset = (page - 1) * limit

    // Build query
    let query = supabase
      .from('athletes')
      .select('*', { count: 'exact' })
      .eq('is_public', true)

    // Apply filters
    if (sport) {
      query = query.eq('sport', sport)
    }

    if (graduationYear) {
      query = query.eq('graduation_year', parseInt(graduationYear))
    }

    if (school) {
      query = query.ilike('school', `%${school}%`)
    }

    if (minGpa) {
      // GPA is stored as string, so we'll filter client-side or convert
      // For now, we'll do a simple string comparison
      query = query.gte('gpa', minGpa)
    }

    // Search across multiple fields
    if (search) {
      query = query.or(`translated_summary.ilike.%${search}%,sport.ilike.%${search}%,position.ilike.%${search}%,school.ilike.%${search}%`)
    }

    // Apply pagination
    query = query
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false })

    const { data: athletes, error, count } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch athletes' }, { status: 500 })
    }

    // Get saved athlete IDs for this employer
    const { data: savedAthletes } = await supabase
      .from('saved_athletes')
      .select('athlete_id')
      .eq('employer_id', user.id)

    const savedIds = new Set(savedAthletes?.map(s => s.athlete_id) || [])

    // Add isSaved flag to each athlete
    const athletesWithSavedFlag = athletes?.map(athlete => ({
      ...athlete,
      isSaved: savedIds.has(athlete.id),
      // Don't send email for free trial users (will handle in profile view)
    })) || []

    return NextResponse.json({
      athletes: athletesWithSavedFlag,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
