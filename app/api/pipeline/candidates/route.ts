import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get all candidates in the employer's pipeline with athlete and stage data
  const { data: candidates, error } = await supabase
    .from('pipeline_candidates')
    .select(`
      *,
      athlete:athletes(id, full_name, sport, position, school, graduation_year, gpa, major, translated_summary),
      stage:pipeline_stages(id, name, color, order_index)
    `)
    .eq('employer_id', user.id)
    .order('last_stage_change', { ascending: false })

  if (error) {
    console.error('Error fetching pipeline candidates:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ candidates })
}

export async function POST(request: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { athlete_id, stage_id, position_title, salary_range, priority, rating, notes } = body

  // Get the default "Discovery" stage if no stage provided
  let finalStageId = stage_id
  if (!finalStageId) {
    const { data: defaultStage } = await supabase
      .from('pipeline_stages')
      .select('id')
      .eq('employer_id', user.id)
      .eq('is_default', true)
      .eq('name', 'Discovery')
      .single()

    if (defaultStage) {
      finalStageId = defaultStage.id
    }
  }

  // Insert candidate into pipeline
  const { data: candidate, error } = await supabase
    .from('pipeline_candidates')
    .insert({
      employer_id: user.id,
      athlete_id,
      stage_id: finalStageId,
      position_title,
      salary_range,
      priority: priority || 'medium',
      rating,
      notes,
      added_by: user.id,
    })
    .select(`
      *,
      athlete:athletes(id, full_name, sport, position, school, graduation_year),
      stage:pipeline_stages(id, name, color, order_index)
    `)
    .single()

  if (error) {
    // Handle duplicate athlete error
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Athlete already in pipeline' }, { status: 409 })
    }
    console.error('Error adding candidate to pipeline:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Record initial stage in history
  await supabase
    .from('pipeline_history')
    .insert({
      candidate_id: candidate.id,
      to_stage_id: finalStageId,
      changed_by: user.id,
      notes: 'Added to pipeline',
    })

  return NextResponse.json({ candidate })
}
