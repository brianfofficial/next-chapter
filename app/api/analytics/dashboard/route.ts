import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const daysParam = searchParams.get('days') || '30'
  const days = parseInt(daysParam, 10)

  // Calculate date range
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  try {
    // Get overall stats from events
    const { data: events } = await supabase
      .from('analytics_events')
      .select('event_type, event_name, created_at, properties')
      .eq('user_id', user.id)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())

    if (!events) {
      return NextResponse.json({
        totalEvents: 0,
        pageViews: 0,
        profileViews: 0,
        messagesSent: 0,
        athletesSaved: 0,
        conversationRate: 0,
        chartData: [],
      })
    }

    // Calculate metrics
    const totalEvents = events.length
    const pageViews = events.filter(e => e.event_type === 'page_view').length
    const profileViews = events.filter(e => e.event_type === 'profile_view').length
    const messagesSent = events.filter(e => e.event_type === 'message_sent').length
    const athletesSaved = events.filter(e => e.event_type === 'athlete_saved').length

    // Calculate conversion rate (profiles viewed to athletes saved)
    const conversationRate = profileViews > 0
      ? Math.round((athletesSaved / profileViews) * 100)
      : 0

    // Group events by date for chart
    const eventsByDate: Record<string, { pageViews: number; profileViews: number; messagesSent: number }> = {}

    events.forEach(event => {
      const date = new Date(event.created_at).toISOString().split('T')[0]

      if (!eventsByDate[date]) {
        eventsByDate[date] = { pageViews: 0, profileViews: 0, messagesSent: 0 }
      }

      if (event.event_type === 'page_view') eventsByDate[date].pageViews++
      if (event.event_type === 'profile_view') eventsByDate[date].profileViews++
      if (event.event_type === 'message_sent') eventsByDate[date].messagesSent++
    })

    // Convert to chart data array
    const chartData = Object.entries(eventsByDate)
      .map(([date, data]) => ({
        date,
        ...data,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))

    // Get top viewed athletes
    const athleteViews: Record<string, number> = {}
    events
      .filter(e => e.event_type === 'profile_view' && e.properties?.athlete_id)
      .forEach(e => {
        const athleteId = (e.properties as any).athlete_id
        athleteViews[athleteId] = (athleteViews[athleteId] || 0) + 1
      })

    const topAthletes = Object.entries(athleteViews)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id, views]) => ({ athlete_id: id, views }))

    return NextResponse.json({
      totalEvents,
      pageViews,
      profileViews,
      messagesSent,
      athletesSaved,
      conversationRate,
      chartData,
      topAthletes,
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
