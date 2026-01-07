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
    setMessage("Creating admin account...")

    try {
      // First, try API route to create/verify account
      const res = await fetch('/api/admin/dev-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: ADMIN_EMAIL, password: DEV_PASSWORD }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to login')
      }

      setMessage(data.message)

      // Now sign in with Supabase
      const supabase = createClient()
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: ADMIN_EMAIL,
        password: DEV_PASSWORD,
      })

      if (signInError) {
        // Account might not be confirmed yet, try signing up
        const { error: signUpError } = await supabase.auth.signUp({
          email: ADMIN_EMAIL,
          password: DEV_PASSWORD,
        })

        if (!signUpError) {
          setMessage("Account created! Signing in...")
          // Try signing in again
          await supabase.auth.signInWithPassword({
            email: ADMIN_EMAIL,
            password: DEV_PASSWORD,
          })
        }
      }

      setMessage("Success! Redirecting...")
      setTimeout(() => {
        router.push('/profile')
        router.refresh()
      }, 1000)

    } catch (err: any) {
      setMessage(`Error: ${err.message}`)
    } finally {
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
