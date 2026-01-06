import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { validateCompanyEmail } from '@/lib/utils/validateEmail'

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
    const {
      company_name,
      industry,
      company_size,
      contact_email,
      roles_hiring_for,
    } = body

    // Validate required fields
    if (!company_name || !contact_email) {
      return NextResponse.json(
        { error: 'Company name and email are required' },
        { status: 400 }
      )
    }

    // Validate email domain
    const emailValidation = validateCompanyEmail(contact_email)
    if (!emailValidation.valid) {
      return NextResponse.json(
        { error: emailValidation.error },
        { status: 400 }
      )
    }

    // Upsert employer profile
    const { data, error } = await supabase
      .from('employers')
      .upsert({
        id: user.id,
        company_name,
        industry,
        company_size,
        contact_email,
        roles_hiring_for,
        subscription_tier: 'free_trial',
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to create employer profile' },
        { status: 500 }
      )
    }

    // Update user metadata to tag as employer
    await supabase.auth.updateUser({
      data: {
        user_type: 'employer',
        company_name,
      },
    })

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
