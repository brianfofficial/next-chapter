import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is an employer
    const { data: employer } = await supabase
      .from('employers')
      .select('subscription_tier')
      .eq('id', user.id)
      .single()

    if (!employer) {
      return NextResponse.json({ error: 'Not an employer account' }, { status: 403 })
    }

    // Get athlete profile
    const { data: athlete, error } = await supabase
      .from('athletes')
      .select('*')
      .eq('id', params.id)
      .eq('is_public', true)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Athlete not found' }, { status: 404 })
      }
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch athlete' }, { status: 500 })
    }

    // Check if athlete is saved by this employer
    const { data: savedAthlete } = await supabase
      .from('saved_athletes')
      .select('id')
      .eq('employer_id', user.id)
      .eq('athlete_id', params.id)
      .single()

    // Determine if contact info should be shown
    const canViewContact = employer.subscription_tier !== 'free_trial'

    // Return athlete data with contact info conditionally
    return NextResponse.json({
      athlete: {
        ...athlete,
        // Hide email for free trial users
        email: canViewContact ? athlete.email : null,
        isSaved: !!savedAthlete,
      },
      canViewContact,
      subscription_tier: employer.subscription_tier,
    })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
