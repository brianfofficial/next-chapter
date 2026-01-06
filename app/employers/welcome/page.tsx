"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/hooks/useAuth"
import { motion } from "framer-motion"

export default function EmployerWelcomePage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const saveEmployerProfile = async () => {
      if (loading || !user) return

      const pendingData = sessionStorage.getItem('pendingEmployerSignup')
      if (!pendingData) {
        // No pending signup, redirect to browse
        router.push('/employers/browse')
        return
      }

      setSaving(true)
      try {
        const employerData = JSON.parse(pendingData)

        const response = await fetch('/api/employers/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(employerData),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to create profile')
        }

        // Clear sessionStorage
        sessionStorage.removeItem('pendingEmployerSignup')

        // Redirect to browse page
        setTimeout(() => {
          router.push('/employers/browse')
        }, 1500)
      } catch (err) {
        console.error('Error saving employer profile:', err)
        setError(err instanceof Error ? err.message : 'Failed to create profile')
        setSaving(false)
      }
    }

    saveEmployerProfile()
  }, [user, loading, router])

  if (loading || saving) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-employer-blue/20 rounded-full mb-6">
            <div className="w-10 h-10 border-4 border-employer-blue border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold text-employer-blue mb-2">
            {saving ? "Setting up your account..." : "Welcome!"}
          </h2>
          <p className="text-gray-400">
            {saving ? "We're creating your employer profile" : "Just a moment"}
          </p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="text-6xl mb-6">⚠️</div>
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="text-gray-400 mb-8">{error}</p>
          <button
            onClick={() => router.push('/employers/signup')}
            className="bg-employer-blue hover:bg-employer-blue-dark text-white px-6 py-3 rounded-lg font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return null
}
