"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

const ADMIN_EMAIL = "workwithbrianfarello@gmail.com"
const DEV_PASSWORD = "nextchapter2026"

export function AdminDevLogin() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()

  const handleAdminLogin = async () => {
    setLoading(true)
    setMessage("Checking account...")

    try {
      const supabase = createClient()

      // First, try to sign in
      setMessage("Attempting sign in...")
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: ADMIN_EMAIL,
        password: DEV_PASSWORD,
      })

      if (!signInError && signInData.user) {
        setMessage("Success! Redirecting...")
        setTimeout(() => {
          router.push('/profile')
          router.refresh()
        }, 1000)
        return
      }

      // If sign in failed, create the account
      setMessage("Creating admin account...")
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: ADMIN_EMAIL,
        password: DEV_PASSWORD,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      })

      if (signUpError) {
        throw new Error(signUpError.message)
      }

      // Try to sign in again immediately
      setMessage("Account created! Signing in...")
      const { error: signInError2 } = await supabase.auth.signInWithPassword({
        email: ADMIN_EMAIL,
        password: DEV_PASSWORD,
      })

      if (signInError2) {
        setMessage("Account created! Check your email to confirm, then sign in with email/password below.")
        setLoading(false)
        return
      }

      setMessage("Success! Redirecting...")
      setTimeout(() => {
        router.push('/profile')
        router.refresh()
      }, 1000)

    } catch (err: any) {
      setMessage(`Error: ${err.message}`)
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4">
        <p className="text-yellow-400 text-sm mb-3">
          <strong>Admin Quick Login</strong>
        </p>
        <p className="text-gray-400 text-xs mb-3">
          Click below to automatically create and sign in as admin
        </p>
        <Button
          onClick={handleAdminLogin}
          disabled={loading}
          className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-semibold"
        >
          {loading ? message : "🔑 Admin Login (Auto)"}
        </Button>
        {message && !loading && (
          <p className="text-sm text-gray-400 mt-2">{message}</p>
        )}
      </div>
    </div>
  )
}
