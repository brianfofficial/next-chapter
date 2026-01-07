import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { stage_id, position_title, salary_range, priority, rating, notes } = body

  // Get current candidate to check stage change
  const { data: currentCandidate } = await supabase
    .from('pipeline_candidates')
    .select('stage_id')
    .eq('id', params.id)
    .eq('employer_id', user.id)
    .single()

  if (!currentCandidate) {
    return NextResponse.json({ error: 'Candidate not found' }, { status: 404 })
  }

  // Update candidate
  const updateData: any = {}
  if (position_title !== undefined) updateData.position_title = position_title
  if (salary_range !== undefined) updateData.salary_range = salary_range
  if (priority !== undefined) updateData.priority = priority
  if (rating !== undefined) updateData.rating = rating
  if (notes !== undefined) updateData.notes = notes

  // If stage changed, update last_stage_change
  if (stage_id && stage_id !== currentCandidate.stage_id) {
    updateData.stage_id = stage_id
    updateData.last_stage_change = new Date().toISOString()

    // Record stage change in history
    await supabase
      .from('pipeline_history')
      .insert({
        candidate_id: params.id,
        from_stage_id: currentCandidate.stage_id,
        to_stage_id: stage_id,
        changed_by: user.id,
      })
  }

  const { data: candidate, error } = await supabase
    .from('pipeline_candidates')
    .update(updateData)
    .eq('id', params.id)
    .eq('employer_id', user.id)
    .select(`
      *,
      athlete:athletes(id, full_name, sport, position, school, graduation_year, gpa, major, translated_summary),
      stage:pipeline_stages(id, name, color, order_index)
    `)
    .single()

  if (error) {
    console.error('Error updating candidate:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ candidate })
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { error } = await supabase
    .from('pipeline_candidates')
    .delete()
    .eq('id', params.id)
    .eq('employer_id', user.id)

  if (error) {
    console.error('Error deleting candidate:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
