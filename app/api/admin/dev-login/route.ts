import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const ADMIN_EMAIL = "workwithbrianfarello@gmail.com"
const DEV_PASSWORD = "nextchapter2026"

export async function POST(request: Request) {
  const { email, password } = await request.json()

  // Only allow in development or with correct credentials
  if (email !== ADMIN_EMAIL || password !== DEV_PASSWORD) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const supabase = await createClient()

  // Try to sign in first
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (!signInError && signInData.user) {
    return NextResponse.json({
      success: true,
      user: signInData.user,
      message: 'Signed in successfully'
    })
  }

  // If sign in failed, try to create the account
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${request.headers.get('origin')}/auth/callback`,
      data: {
        is_admin: true,
      }
    },
  })

  if (signUpError) {
    return NextResponse.json({ error: signUpError.message }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    user: signUpData.user,
    message: 'Account created successfully'
  })
}
