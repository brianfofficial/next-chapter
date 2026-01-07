"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/lib/hooks/useAuth"
import { useUser } from "@/lib/hooks/useUser"
import { Copy, Check } from "lucide-react"
import { useState } from "react"

export default function ProfilePage() {
  const router = useRouter()
  const { user, loading: authLoading, signOut } = useAuth()
  const { profile, loading: profileLoading, refreshProfile } = useUser()
  const [copied, setCopied] = useState(false)

  // Check for pending translation in sessionStorage and auto-save
  useEffect(() => {
    const savePendingTranslation = async () => {
      if (!user || !authLoading) return

      const pendingData = sessionStorage.getItem('pendingTranslation')
      if (pendingData) {
        try {
          const { athleteData, results } = JSON.parse(pendingData)

          const response = await fetch('/api/translations/save', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              sport: athleteData.sport,
              position: athleteData.position,
              school: athleteData.school,
              graduation_year: athleteData.graduation_year,
              gpa: athleteData.gpa,
              major: athleteData.major,
              experiences: {
                leadership: athleteData.leadership || [],
                achievements: athleteData.achievements || [],
                stats: athleteData.stats,
              },
              translated_summary: results?.summary,
              translated_bullets: results?.bulletPoints,
            }),
          })

          if (response.ok) {
            sessionStorage.removeItem('pendingTranslation')
            refreshProfile()
          }
        } catch (error) {
          console.error('Error auto-saving pending translation:', error)
        }
      }
    }

    savePendingTranslation()
  }, [user, authLoading, refreshProfile])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const copyAllBullets = () => {
    if (!profile?.translated_bullets) return
    const bullets = Array.isArray(profile.translated_bullets)
      ? (profile.translated_bullets as string[])
      : []
    const allText = bullets.map((bullet) => `• ${bullet}`).join("\n\n")
    copyToClipboard(allText)
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="text-gold text-xl">Loading your profile...</div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  const bullets = profile?.translated_bullets
    ? (Array.isArray(profile.translated_bullets)
        ? (profile.translated_bullets as string[])
        : [])
    : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a href="/" className="text-2xl font-bold gradient-text">
              Next Chapter
            </a>
            <div className="flex items-center gap-4">
              <a href="/" className="text-gray-300 hover:text-gold transition-colors">
                Home
              </a>
              <a href="/profile/messages" className="text-gray-300 hover:text-gold transition-colors">
                Messages
              </a>
              <Button onClick={handleSignOut} variant="ghost" size="sm">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {user.user_metadata.full_name || user.user_metadata.name || 'Athlete'}!
          </h1>
          <p className="text-gray-400">{user.email}</p>
        </motion.div>

        {/* Athlete Info */}
        {profile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="mb-8">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gold mb-4">Your Athletic Profile</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {profile.sport && (
                    <div>
                      <div className="text-gray-500 mb-1">Sport</div>
                      <div className="text-gray-200 font-medium capitalize">{profile.sport}</div>
                    </div>
                  )}
                  {profile.position && (
                    <div>
                      <div className="text-gray-500 mb-1">Position</div>
                      <div className="text-gray-200 font-medium">{profile.position}</div>
                    </div>
                  )}
                  {profile.school && (
                    <div>
                      <div className="text-gray-500 mb-1">School</div>
                      <div className="text-gray-200 font-medium">{profile.school}</div>
                    </div>
                  )}
                  {profile.gpa && (
                    <div>
                      <div className="text-gray-500 mb-1">GPA</div>
                      <div className="text-gray-200 font-medium">{profile.gpa}</div>
                    </div>
                  )}
                  {profile.major && (
                    <div>
                      <div className="text-gray-500 mb-1">Major</div>
                      <div className="text-gray-200 font-medium">{profile.major}</div>
                    </div>
                  )}
                  {profile.graduation_year && (
                    <div>
                      <div className="text-gray-500 mb-1">Graduation Year</div>
                      <div className="text-gray-200 font-medium">{profile.graduation_year}</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Saved Translation */}
        {profile?.translated_summary ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold gradient-text">Your Professional Profile</h2>
              <div className="text-sm text-gray-500">
                Last updated: {new Date(profile.updated_at).toLocaleDateString()}
              </div>
            </div>

            {/* Professional Summary */}
            <Card>
              <CardContent className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gold">Professional Summary</h3>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(profile.translated_summary || '')}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-gray-300 leading-relaxed">{profile.translated_summary}</p>
              </CardContent>
            </Card>

            {/* Bullet Points */}
            {bullets.length > 0 && (
              <Card>
                <CardContent className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-xl font-semibold text-gold">Key Skills & Achievements</h3>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={copyAllBullets}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      <span className="ml-2">Copy All</span>
                    </Button>
                  </div>
                  <ul className="space-y-4">
                    {bullets.map((bullet: string, index: number) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex gap-4 group"
                      >
                        <span className="text-gold mt-1">•</span>
                        <span className="flex-1 text-gray-300">{bullet}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => copyToClipboard(bullet)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center pt-4">
              <Button
                variant="secondary"
                onClick={() => router.push('/#translator')}
              >
                Update My Profile
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-2xl font-bold mb-4">No Profile Yet</h3>
                <p className="text-gray-400 mb-8">
                  Create your professional profile to get started!
                </p>
                <Button onClick={() => router.push('/#translator')}>
                  Build My Profile
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
