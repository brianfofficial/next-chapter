"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { validateCompanyEmail } from "@/lib/utils/validateEmail"
import { createClient } from "@/lib/supabase/client"
import { ArrowRight, ArrowLeft, Building2, Mail, Users, Briefcase } from "lucide-react"

const INDUSTRIES = [
  "Technology",
  "Finance",
  "Consulting",
  "Healthcare",
  "Retail",
  "Manufacturing",
  "Media & Entertainment",
  "Education",
  "Real Estate",
  "Other",
]

const COMPANY_SIZES = [
  "1-10 employees",
  "11-50 employees",
  "51-200 employees",
  "201-500 employees",
  "501-1000 employees",
  "1000+ employees",
]

export default function EmployerSignupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    company_name: "",
    industry: "",
    company_size: "",
    contact_email: "",
    roles_hiring_for: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
    setError(null)
  }

  const handleNext = () => {
    // Validate current step
    if (step === 1) {
      if (!formData.company_name.trim()) {
        setError("Company name is required")
        return
      }
      if (!formData.industry) {
        setError("Please select an industry")
        return
      }
      if (!formData.company_size) {
        setError("Please select company size")
        return
      }
    }

    if (step === 2) {
      const validation = validateCompanyEmail(formData.contact_email)
      if (!validation.valid) {
        setError(validation.error || "Invalid email")
        return
      }
    }

    if (step === 3) {
      if (!formData.roles_hiring_for.trim()) {
        setError("Please tell us what roles you're hiring for")
        return
      }
    }

    setError(null)
    setStep(step + 1)
  }

  const handleBack = () => {
    setError(null)
    setStep(step - 1)
  }

  const handleGoogleSignup = async () => {
    setLoading(true)
    try {
      // Store employer data in sessionStorage for after OAuth
      sessionStorage.setItem('pendingEmployerSignup', JSON.stringify(formData))

      const supabase = createClient()
      const redirectUrl = `${window.location.origin}/auth/callback?next=/employers/welcome`

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        },
      })

      if (error) throw error
    } catch (err) {
      console.error('Error signing up:', err)
      setError('Failed to sign up. Please try again.')
      setLoading(false)
    }
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
            <div className="text-sm text-gray-400">
              Already have an account?{" "}
              <a href="/login" className="text-employer-blue hover:underline">
                Sign in
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Progress indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-md mx-auto">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    s < step
                      ? "bg-employer-blue text-white"
                      : s === step
                      ? "bg-employer-blue text-white ring-4 ring-employer-blue/30"
                      : "bg-gray-800 text-gray-500"
                  }`}
                >
                  {s < step ? "✓" : s}
                </div>
                {s < 4 && (
                  <div
                    className={`w-16 h-1 mx-2 transition-all ${
                      s < step ? "bg-employer-blue" : "bg-gray-800"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Company Info */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-employer-blue/20 rounded-full mb-4">
                      <Building2 className="h-8 w-8 text-employer-blue" />
                    </div>
                    <h2 className="text-3xl font-bold mb-2">Company Information</h2>
                    <p className="text-gray-400">Tell us about your company</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-employer-blue">
                        Company Name *
                      </label>
                      <Input
                        placeholder="Acme Corp"
                        value={formData.company_name}
                        onChange={(e) => handleInputChange("company_name", e.target.value)}
                        className="h-12"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-employer-blue">
                        Industry *
                      </label>
                      <select
                        className="w-full h-12 rounded-md border border-gray-700 bg-gray-900/50 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-employer-blue transition-all"
                        value={formData.industry}
                        onChange={(e) => handleInputChange("industry", e.target.value)}
                      >
                        <option value="">Select industry</option>
                        {INDUSTRIES.map((industry) => (
                          <option key={industry} value={industry}>
                            {industry}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-employer-blue">
                        Company Size *
                      </label>
                      <select
                        className="w-full h-12 rounded-md border border-gray-700 bg-gray-900/50 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-employer-blue transition-all"
                        value={formData.company_size}
                        onChange={(e) => handleInputChange("company_size", e.target.value)}
                      >
                        <option value="">Select company size</option>
                        {COMPANY_SIZES.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </div>

                    {error && (
                      <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded">
                        {error}
                      </div>
                    )}

                    <Button
                      onClick={handleNext}
                      className="w-full h-12 bg-employer-blue hover:bg-employer-blue-dark"
                    >
                      Next
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Work Email */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-employer-blue/20 rounded-full mb-4">
                      <Mail className="h-8 w-8 text-employer-blue" />
                    </div>
                    <h2 className="text-3xl font-bold mb-2">Work Email</h2>
                    <p className="text-gray-400">Use your company email address</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-employer-blue">
                        Company Email *
                      </label>
                      <Input
                        type="email"
                        placeholder="you@company.com"
                        value={formData.contact_email}
                        onChange={(e) => handleInputChange("contact_email", e.target.value)}
                        className="h-12"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        We don't accept Gmail, Yahoo, or other personal email addresses
                      </p>
                    </div>

                    {error && (
                      <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded">
                        {error}
                      </div>
                    )}

                    <div className="flex gap-4">
                      <Button
                        onClick={handleBack}
                        variant="secondary"
                        className="w-full h-12"
                      >
                        <ArrowLeft className="mr-2 h-5 w-5" />
                        Back
                      </Button>
                      <Button
                        onClick={handleNext}
                        className="w-full h-12 bg-employer-blue hover:bg-employer-blue-dark"
                      >
                        Next
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Hiring Needs */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-employer-blue/20 rounded-full mb-4">
                      <Briefcase className="h-8 w-8 text-employer-blue" />
                    </div>
                    <h2 className="text-3xl font-bold mb-2">Hiring Needs</h2>
                    <p className="text-gray-400">What roles are you looking to fill?</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-employer-blue">
                        Roles You're Hiring For *
                      </label>
                      <Input
                        placeholder="e.g., Sales Associates, Marketing Coordinators, Account Managers"
                        value={formData.roles_hiring_for}
                        onChange={(e) => handleInputChange("roles_hiring_for", e.target.value)}
                        className="h-12"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        This helps us recommend the best athlete profiles for your needs
                      </p>
                    </div>

                    {error && (
                      <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded">
                        {error}
                      </div>
                    )}

                    <div className="flex gap-4">
                      <Button
                        onClick={handleBack}
                        variant="secondary"
                        className="w-full h-12"
                      >
                        <ArrowLeft className="mr-2 h-5 w-5" />
                        Back
                      </Button>
                      <Button
                        onClick={handleNext}
                        className="w-full h-12 bg-employer-blue hover:bg-employer-blue-dark"
                      >
                        Next
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 4: OAuth Signup */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-employer-blue/20 rounded-full mb-4">
                      <Users className="h-8 w-8 text-employer-blue" />
                    </div>
                    <h2 className="text-3xl font-bold mb-2">Create Your Account</h2>
                    <p className="text-gray-400">Sign up securely with Google</p>
                  </div>

                  <div className="space-y-6">
                    {/* OAuth Explanation */}
                    <div className="p-3 bg-employer-blue/5 border border-employer-blue/20 rounded-lg">
                      <div className="flex items-start gap-2">
                        <svg
                          className="w-5 h-5 text-employer-blue flex-shrink-0 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                        <div>
                          <p className="text-sm text-gray-300 leading-relaxed">
                            <span className="font-semibold text-employer-blue">Secure Sign-Up:</span> We use Google OAuth for enterprise-grade security. Your account is protected by Google's authentication, with no passwords to manage.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                      <h3 className="font-semibold mb-4">Your Information:</h3>
                      <div className="space-y-2 text-sm text-gray-400">
                        <div className="flex justify-between">
                          <span>Company:</span>
                          <span className="text-gray-200">{formData.company_name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Industry:</span>
                          <span className="text-gray-200">{formData.industry}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Size:</span>
                          <span className="text-gray-200">{formData.company_size}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Email:</span>
                          <span className="text-gray-200">{formData.contact_email}</span>
                        </div>
                      </div>
                    </div>

                    {error && (
                      <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded">
                        {error}
                      </div>
                    )}

                    <Button
                      onClick={handleGoogleSignup}
                      disabled={loading}
                      className="w-full h-12 bg-white text-gray-900 hover:bg-gray-100 flex items-center justify-center gap-3"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      {loading ? "Creating account..." : "Continue with Google"}
                    </Button>

                    <Button
                      onClick={handleBack}
                      variant="ghost"
                      className="w-full"
                      disabled={loading}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                      By signing up, you agree to our{" "}
                      <a href="#" className="text-employer-blue hover:underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-employer-blue hover:underline">
                        Privacy Policy
                      </a>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
