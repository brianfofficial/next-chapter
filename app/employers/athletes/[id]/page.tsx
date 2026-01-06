"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/lib/hooks/useAuth"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ContactPaywall } from "@/components/employers/ContactPaywall"
import { motion } from "framer-motion"
import { ArrowLeft, Heart, Copy, Check } from "lucide-react"
import { SPORTS } from "@/lib/translations"

interface Athlete {
  id: string
  email: string | null
  sport: string | null
  position: string | null
  school: string | null
  graduation_year: number | null
  gpa: string | null
  major: string | null
  translated_summary: string | null
  translated_bullets: string[] | null
  isSaved: boolean
}

export default function AthleteProfilePage() {
  const router = useRouter()
  const params = useParams()
  const { user, loading: authLoading } = useAuth()

  const [athlete, setAthlete] = useState<Athlete | null>(null)
  const [canViewContact, setCanViewContact] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSaved, setIsSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)

  // Fetch athlete profile
  useEffect(() => {
    const fetchAthlete = async () => {
      if (!user) return

      setLoading(true)
      try {
        const response = await fetch(`/api/athletes/${params.id}`)
        if (!response.ok) {
          if (response.status === 404) {
            setError('Athlete not found')
          } else {
            setError('Failed to load athlete profile')
          }
          return
        }

        const data = await response.json()
        setAthlete(data.athlete)
        setCanViewContact(data.canViewContact)
        setIsSaved(data.athlete.isSaved)
      } catch (err) {
        console.error('Error fetching athlete:', err)
        setError('Failed to load athlete profile')
      } finally {
        setLoading(false)
      }
    }

    fetchAthlete()
  }, [user, params.id])

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/employers/signup')
    }
  }, [user, authLoading, router])

  const handleSaveToggle = async () => {
    if (saving || !athlete) return

    setSaving(true)
    try {
      const endpoint = isSaved
        ? `/api/employers/saved-athletes?athlete_id=${athlete.id}`
        : '/api/employers/saved-athletes'

      const response = await fetch(endpoint, {
        method: isSaved ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: isSaved ? undefined : JSON.stringify({ athlete_id: athlete.id }),
      })

      if (!response.ok) throw new Error('Failed to toggle save')

      setIsSaved(!isSaved)
    } catch (error) {
      console.error('Error toggling save:', error)
    } finally {
      setSaving(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const copyAllBullets = () => {
    if (!athlete?.translated_bullets) return
    const bullets = Array.isArray(athlete.translated_bullets)
      ? (athlete.translated_bullets as string[])
      : []
    const allText = bullets.map((bullet) => `• ${bullet}`).join("\n\n")
    copyToClipboard(allText)
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="text-employer-blue text-xl">Loading athlete profile...</div>
      </div>
    )
  }

  if (error || !athlete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-4">{error || 'Athlete not found'}</h2>
          <Button onClick={() => router.push('/employers/browse')}>
            Back to Browse
          </Button>
        </div>
      </div>
    )
  }

  const sport = SPORTS.find(s => s.id === athlete.sport)
  const bullets = athlete.translated_bullets
    ? (Array.isArray(athlete.translated_bullets)
        ? (athlete.translated_bullets as string[])
        : [])
    : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-gray-800 bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a href="/employers" className="text-2xl font-bold gradient-text">
              Next Chapter
            </a>
            <div className="flex items-center gap-6">
              <a
                href="/employers/browse"
                className="text-gray-300 hover:text-employer-blue transition-colors"
              >
                Browse
              </a>
              <a
                href="/employers/saved"
                className="text-gray-300 hover:text-employer-blue transition-colors"
              >
                Saved
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push('/employers/browse')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Browse
        </Button>

        {/* Athlete Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-8">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-6">
                  <div className="text-6xl">{sport?.icon || '🏆'}</div>
                  <div>
                    <h1 className="text-3xl font-bold mb-2 capitalize">
                      {athlete.sport || 'Athlete'} - {athlete.position || 'Position'}
                    </h1>
                    <div className="flex gap-6 text-sm text-gray-400">
                      {athlete.school && (
                        <div>
                          <span className="text-gray-500">School: </span>
                          <span className="text-gray-300">{athlete.school}</span>
                        </div>
                      )}
                      {athlete.graduation_year && (
                        <div>
                          <span className="text-gray-500">Graduating: </span>
                          <span className="text-gray-300">{athlete.graduation_year}</span>
                        </div>
                      )}
                      {athlete.gpa && (
                        <div>
                          <span className="text-gray-500">GPA: </span>
                          <span className="text-gold font-semibold">{athlete.gpa}</span>
                        </div>
                      )}
                      {athlete.major && (
                        <div>
                          <span className="text-gray-500">Major: </span>
                          <span className="text-gray-300">{athlete.major}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleSaveToggle}
                  disabled={saving}
                  className={`${
                    isSaved
                      ? 'bg-employer-blue text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  <Heart className={`h-5 w-5 mr-2 ${isSaved ? 'fill-current' : ''}`} />
                  {isSaved ? 'Saved' : 'Save to List'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Professional Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardContent className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-employer-blue">
                      Professional Summary
                    </h3>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        copyToClipboard(athlete.translated_summary || '')
                      }
                    >
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    {athlete.translated_summary ||
                      'No professional summary available'}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Key Skills & Achievements */}
            {bullets.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardContent className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <h3 className="text-xl font-semibold text-employer-blue">
                        Key Skills & Achievements
                      </h3>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={copyAllBullets}
                      >
                        {copied ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
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
                          <span className="text-employer-blue mt-1">•</span>
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
              </motion.div>
            )}
          </div>

          {/* Sidebar with Contact Info (Paywalled) */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="sticky top-24"
            >
              <ContactPaywall
                email={athlete.email}
                canViewContact={canViewContact}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
