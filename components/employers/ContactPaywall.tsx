"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Mail, Lock, Check, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

interface ContactPaywallProps {
  email?: string | null
  canViewContact: boolean
}

export function ContactPaywall({ email, canViewContact }: ContactPaywallProps) {
  const router = useRouter()
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  if (canViewContact && email) {
    // Show actual email for paid users
    return (
      <Card className="border-employer-blue/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <Mail className="h-5 w-5 text-employer-blue" />
            <h3 className="font-semibold text-employer-blue">Contact Information</h3>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Email</div>
            <a
              href={`mailto:${email}`}
              className="text-lg text-gray-200 hover:text-employer-blue transition-colors"
            >
              {email}
            </a>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Show blurred paywall for free trial users
  return (
    <>
      <Card className="border-gold/50 relative overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <Lock className="h-5 w-5 text-gold" />
            <h3 className="font-semibold text-gold">Contact Information</h3>
          </div>

          {/* Blurred email */}
          <div className="bg-gray-900/50 rounded-lg p-4 relative">
            <div className="text-sm text-gray-400 mb-1">Email</div>
            <div className="text-lg text-gray-200 blur-md select-none">
              athlete.example@university.edu
            </div>

            {/* Overlay with CTA */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/80 to-transparent">
              <Button
                onClick={() => setShowUpgradeModal(true)}
                className="bg-gold hover:bg-gold/90 text-black font-semibold"
              >
                <Lock className="h-4 w-4 mr-2" />
                Upgrade to Contact Athletes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="sm:max-w-2xl bg-gray-900 border-gray-800">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gold/20 rounded-full mb-4">
                <Mail className="h-8 w-8 text-gold" />
              </div>
              <h2 className="text-3xl font-bold mb-2">
                Upgrade to{" "}
                <span className="gradient-text-employer">Contact Athletes</span>
              </h2>
              <p className="text-gray-400">
                Get unlimited access to contact information and start hiring elite talent
              </p>
            </div>

            {/* Pricing Comparison */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Free Trial */}
              <Card className="border-gray-700">
                <CardContent className="p-6">
                  <div className="text-sm text-gray-500 mb-1">Current Plan</div>
                  <h3 className="text-2xl font-bold mb-4">Free Trial</h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-2 text-sm text-gray-400">
                      <Check className="h-4 w-4 text-gray-600 mt-0.5" />
                      Browse all athlete profiles
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-400">
                      <Check className="h-4 w-4 text-gray-600 mt-0.5" />
                      Search & filter unlimited
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-400">
                      <Check className="h-4 w-4 text-gray-600 mt-0.5" />
                      Save favorites
                    </div>
                    <div className="flex items-start gap-2 text-sm text-red-400">
                      <Lock className="h-4 w-4 mt-0.5" />
                      Contact info hidden
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pro Plan */}
              <Card className="border-employer-blue ring-2 ring-employer-blue/50">
                <CardContent className="p-6">
                  <div className="text-sm text-employer-blue mb-1">Recommended</div>
                  <h3 className="text-2xl font-bold mb-1">Pro</h3>
                  <div className="text-3xl font-bold mb-4">
                    $299<span className="text-lg text-gray-400">/month</span>
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-2 text-sm text-gray-300">
                      <Check className="h-4 w-4 text-employer-blue mt-0.5" />
                      Everything in Free
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-300">
                      <Check className="h-4 w-4 text-employer-blue mt-0.5" />
                      <strong>Unlimited contact info access</strong>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-300">
                      <Check className="h-4 w-4 text-employer-blue mt-0.5" />
                      Direct athlete messaging
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-300">
                      <Check className="h-4 w-4 text-employer-blue mt-0.5" />
                      Advanced analytics
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-300">
                      <Check className="h-4 w-4 text-employer-blue mt-0.5" />
                      Priority support
                    </div>
                  </div>
                  <Button
                    className="w-full bg-employer-blue hover:bg-employer-blue-dark"
                    onClick={() => router.push('/employers/upgrade')}
                  >
                    Upgrade to Pro
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                Need more than Pro?{" "}
                <button
                  onClick={() => router.push('/employers/contact-sales')}
                  className="text-employer-blue hover:underline"
                >
                  Contact sales for Enterprise
                </button>
              </p>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  )
}
