import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get all stages for this employer, ordered by order_index
  const { data: stages, error } = await supabase
    .from('pipeline_stages')
    .select('*')
    .eq('employer_id', user.id)
    .order('order_index', { ascending: true })

  if (error) {
    console.error('Error fetching pipeline stages:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ stages })
}

export async function POST(request: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { name, description, color, order_index } = body

  // Insert new stage
  const { data: stage, error } = await supabase
    .from('pipeline_stages')
    .insert({
      employer_id: user.id,
      name,
      description,
      color: color || '#3b82f6',
      order_index: order_index ?? 999,
      is_default: false,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating pipeline stage:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ stage })
}
