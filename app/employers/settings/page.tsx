"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, CreditCard, Building2, Mail, Users } from "lucide-react"
import { useEmployer } from "@/lib/hooks/useEmployer"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const { profile: employer, loading: isLoading } = useEmployer()
  const [loadingPortal, setLoadingPortal] = useState(false)
  const router = useRouter()

  const handleManageBilling = async () => {
    try {
      setLoadingPortal(true)

      const response = await fetch("/api/stripe/portal", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to create billing portal session")
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error("Billing portal error:", error)
      alert("Failed to open billing portal. Please try again.")
      setLoadingPortal(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-employer-blue" />
      </div>
    )
  }

  if (!employer) {
    return null
  }

  const isPro = employer.subscription_tier === "pro"

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a href="/employers" className="text-2xl font-bold gradient-text">
              Next Chapter
            </a>
            <div className="flex gap-4">
              <a href="/employers/browse">
                <Button variant="ghost">Browse</Button>
              </a>
              <a href="/employers/saved">
                <Button variant="ghost">Saved</Button>
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2">Account Settings</h1>
        <p className="text-gray-400 mb-8">
          Manage your company profile and subscription
        </p>

        {/* Company Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-gray-400">Company Name</label>
              <p className="text-lg">{employer.company_name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400">Industry</label>
                <p className="text-lg">{employer.industry || "Not specified"}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Company Size</label>
                <p className="text-lg">
                  {employer.company_size || "Not specified"}
                </p>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-400">Contact Email</label>
              <p className="text-lg flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {employer.contact_email}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-400">Hiring For</label>
              <p className="text-lg">
                {employer.roles_hiring_for || "Not specified"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Subscription */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Subscription
            </CardTitle>
            <CardDescription>
              Manage your Next Chapter subscription and billing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm text-gray-400">Current Plan</label>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-2xl font-bold">
                    {employer.subscription_tier === "pro" ? "Pro" : "Free Trial"}
                  </p>
                  {isPro ? (
                    <Badge className="bg-employer-blue">Active</Badge>
                  ) : (
                    <Badge variant="outline">Limited Access</Badge>
                  )}
                </div>
              </div>
              {isPro && (
                <div className="text-right">
                  <p className="text-3xl font-bold text-employer-blue">
                    $299<span className="text-sm text-gray-400">/mo</span>
                  </p>
                </div>
              )}
            </div>

            {employer.subscription_status && isPro && (
              <div>
                <label className="text-sm text-gray-400">Status</label>
                <p className="text-lg capitalize">{employer.subscription_status}</p>
              </div>
            )}

            {employer.subscription_end_date && isPro && (
              <div>
                <label className="text-sm text-gray-400">Next Billing Date</label>
                <p className="text-lg">
                  {new Date(employer.subscription_end_date).toLocaleDateString()}
                </p>
              </div>
            )}

            <div className="pt-4 border-t border-gray-700 space-y-3">
              {isPro && employer.stripe_customer_id ? (
                <Button
                  onClick={handleManageBilling}
                  disabled={loadingPortal}
                  className="w-full bg-employer-blue hover:bg-employer-blue-dark"
                >
                  {loadingPortal ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Opening billing portal...
                    </>
                  ) : (
                    "Manage Billing & Subscription"
                  )}
                </Button>
              ) : (
                <Button
                  onClick={() => router.push("/employers/upgrade")}
                  className="w-full bg-employer-blue hover:bg-employer-blue-dark"
                >
                  Upgrade to Pro
                </Button>
              )}

              {!isPro && (
                <p className="text-sm text-gray-400 text-center">
                  Upgrade to unlock unlimited contact info access
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Your Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {isPro ? (
                <>
                  <div className="flex items-center justify-between">
                    <span>Contact Info Access</span>
                    <Badge className="bg-green-500">Unlimited</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Athlete Messaging</span>
                    <Badge className="bg-green-500">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Advanced Analytics</span>
                    <Badge className="bg-green-500">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Priority Support</span>
                    <Badge className="bg-green-500">Enabled</Badge>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <span>Browse Athletes</span>
                    <Badge variant="outline">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Contact Info Access</span>
                    <Badge variant="outline">Locked</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Advanced Features</span>
                    <Badge variant="outline">Locked</Badge>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
