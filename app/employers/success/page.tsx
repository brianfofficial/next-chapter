"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Loader2 } from "lucide-react"

export default function SuccessPage() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")

  useEffect(() => {
    if (!sessionId) {
      router.push("/employers/browse")
      return
    }

    // Wait a bit for webhook to process
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [sessionId, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-employer-blue mx-auto mb-4" />
          <p className="text-gray-400">Processing your subscription...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a href="/employers" className="text-2xl font-bold gradient-text">
              Next Chapter
            </a>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-16">
        <Card className="border-employer-blue ring-2 ring-employer-blue/50">
          <CardContent className="p-12 text-center">
            <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto mb-6" />

            <h1 className="text-4xl font-bold mb-4">
              Welcome to <span className="gradient-text-employer">Pro</span>!
            </h1>

            <p className="text-xl text-gray-400 mb-8">
              Your subscription has been activated. You now have unlimited
              access to contact athletes.
            </p>

            <div className="space-y-4">
              <Button
                onClick={() => router.push("/employers/browse")}
                className="w-full h-12 bg-employer-blue hover:bg-employer-blue-dark"
              >
                Start Browsing Athletes
              </Button>

              <Button
                onClick={() => router.push("/employers/settings")}
                variant="secondary"
                className="w-full h-12"
              >
                Manage Subscription
              </Button>
            </div>

            <p className="text-sm text-gray-500 mt-6">
              Receipt sent to your email • Billing managed through Stripe
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
