import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function POST(request: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const body = await request.json()
  const { event_type, event_name, properties = {}, page_url } = body

  // Get request metadata
  const headersList = headers()
  const userAgent = headersList.get('user-agent') || ''
  const referer = headersList.get('referer') || ''
  const forwarded = headersList.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : headersList.get('x-real-ip')

  // Determine user type from the auth tables
  let userType: 'employer' | 'athlete' | 'department_admin' | 'anonymous' = 'anonymous'

  if (user) {
    // Check if user is an employer
    const { data: employer } = await supabase
      .from('employers')
      .select('id')
      .eq('id', user.id)
      .single()

    if (employer) {
      userType = 'employer'
    } else {
      // Check if user is an athlete
      const { data: athlete } = await supabase
        .from('athletes')
        .select('id')
        .eq('id', user.id)
        .single()

      if (athlete) {
        userType = 'athlete'
      }
    }
  }

  // Track the event
  const { error } = await supabase
    .from('analytics_events')
    .insert({
      user_id: user?.id || null,
      user_type: userType,
      event_type,
      event_name,
      properties,
      page_url,
      referrer: referer,
      user_agent: userAgent,
      ip_address: ip,
      session_id: request.headers.get('x-session-id') || null,
    })

  if (error) {
    console.error('Error tracking analytics event:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
