"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { GoogleButton } from "@/components/auth/GoogleButton"
import { LinkedInButton } from "@/components/auth/LinkedInButton"
import { useAuth } from "@/lib/hooks/useAuth"

export default function LoginPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && !loading) {
      // Redirect to profile if already logged in
      router.push('/profile')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gold text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent"></div>

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gold/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-2xl shadow-2xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold gradient-text mb-2">Next Chapter</h1>
            <p className="text-gray-400">Sign in to save your translations</p>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-4">
            <GoogleButton />
            <LinkedInButton />
          </div>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-900/80 text-gray-500">or</span>
            </div>
          </div>

          {/* Back to home link */}
          <div className="text-center">
            <a
              href="/"
              className="text-gray-400 hover:text-gold transition-colors text-sm"
            >
              ← Back to Home
            </a>
          </div>

          {/* Terms */}
          <p className="text-xs text-gray-500 text-center mt-6">
            By continuing, you agree to our{" "}
            <a href="#" className="text-gold hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-gold hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-400 text-sm mb-4">What you'll get:</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-center gap-2 text-gray-300">
              <span className="text-gold">✓</span>
              Save unlimited translations
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-300">
              <span className="text-gold">✓</span>
              Access from anywhere
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-300">
              <span className="text-gold">✓</span>
              Share with employers
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
