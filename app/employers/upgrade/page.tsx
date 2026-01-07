"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Loader2 } from "lucide-react"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { loadStripe } from "@stripe/stripe-js"
import { useEmployer } from "@/lib/hooks/useEmployer"

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

function UpgradeContent() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const { profile: employer, loading: isLoading } = useEmployer()

  const canceled = searchParams.get("canceled")

  useEffect(() => {
    if (canceled) {
      setError("Payment was canceled. Please try again.")
    }
  }, [canceled])

  // Redirect if already on Pro plan
  useEffect(() => {
    if (employer && employer.subscription_tier === "pro") {
      router.push("/employers/browse")
    }
  }, [employer, router])

  const handleUpgrade = async () => {
    try {
      setLoading(true)
      setError("")

      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create checkout session")
      }

      const { url } = await response.json()

      // Redirect to Stripe Checkout
      window.location.href = url
    } catch (err) {
      console.error("Checkout error:", err)
      setError(err instanceof Error ? err.message : "Something went wrong")
      setLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-employer-blue" />
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

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            Upgrade to{" "}
            <span className="gradient-text-employer">Pro</span>
          </h1>
          <p className="text-xl text-gray-400">
            Get unlimited access to contact athletes and start hiring
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500 rounded-lg text-center">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        <Card className="border-employer-blue ring-2 ring-employer-blue/50 mb-8">
          <CardContent className="p-12">
            <div className="text-center mb-8">
              <div className="text-6xl font-bold mb-2">
                $299<span className="text-2xl text-gray-400">/month</span>
              </div>
              <p className="text-gray-400">Billed monthly, cancel anytime</p>
            </div>

            <ul className="space-y-4 mb-8">
              {[
                "Unlimited contact info access",
                "Direct athlete messaging",
                "Advanced analytics & insights",
                "Priority customer support",
                "Early access to new features",
                "Dedicated account manager",
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-lg">
                  <Check className="h-6 w-6 text-employer-blue" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              className="w-full h-14 text-lg bg-employer-blue hover:bg-employer-blue-dark"
              onClick={handleUpgrade}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Redirecting to checkout...
                </>
              ) : (
                "Upgrade to Pro - $299/month"
              )}
            </Button>

            <p className="text-center text-sm text-gray-500 mt-4">
              Secure payment powered by Stripe • Cancel anytime
            </p>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-gray-400 mb-4">
            Need more than Pro? Contact our sales team for Enterprise pricing
          </p>
          <a href="mailto:sales@nextchapter.com">
            <Button variant="secondary">Contact Sales</Button>
          </a>
        </div>
      </div>
    </div>
  )
}

export default function UpgradePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-employer-blue" />
      </div>
    }>
      <UpgradeContent />
    </Suspense>
  )
}
