"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export default function UpgradePage() {
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
              disabled
            >
              Coming Soon - Stripe Integration
            </Button>

            <p className="text-center text-sm text-gray-500 mt-4">
              Payment processing will be available in Milestone 4
            </p>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-gray-400 mb-4">
            Need more than Pro? Contact our sales team for Enterprise pricing
          </p>
          <Button variant="secondary" disabled>
            Contact Sales
          </Button>
        </div>
      </div>
    </div>
  )
}
