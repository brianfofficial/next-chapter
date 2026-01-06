"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/hooks/useAuth"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AthleteCard } from "@/components/employers/AthleteCard"
import { motion } from "framer-motion"
import { Heart, ArrowRight } from "lucide-react"

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

export default function SavedAthletesPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch saved athletes
  useEffect(() => {
    const fetchSavedAthletes = async () => {
      if (!user) return

      setLoading(true)
      try {
        const response = await fetch('/api/employers/saved-athletes')
        if (!response.ok) {
          throw new Error('Failed to fetch saved athletes')
        }

        const data = await response.json()
        setAthletes(data.athletes || [])
      } catch (err) {
        console.error('Error fetching saved athletes:', err)
        setError('Failed to load saved athletes')
      } finally {
        setLoading(false)
      }
    }

    fetchSavedAthletes()
  }, [user])

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/employers/signup')
    }
  }, [user, authLoading, router])

  const handleRemoveSaved = async (athleteId: string) => {
    try {
      const response = await fetch(`/api/employers/saved-athletes?athlete_id=${athleteId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to remove saved athlete')

      // Remove from local state
      setAthletes(athletes.filter(a => a.id !== athleteId))
    } catch (error) {
      console.error('Error removing saved athlete:', error)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="text-employer-blue text-xl">Loading saved athletes...</div>
      </div>
    )
  }

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
                className="text-employer-blue font-semibold"
              >
                Saved
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header with Count */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold mb-3">
                <span className="gradient-text-employer">Saved Athletes</span>
              </h1>
              <p className="text-xl text-gray-400">
                {athletes.length === 0
                  ? 'No saved athletes yet'
                  : `${athletes.length} ${athletes.length === 1 ? 'athlete' : 'athletes'} saved`}
              </p>
            </div>
            {athletes.length > 0 && (
              <Button
                onClick={() => router.push('/employers/browse')}
                className="bg-employer-blue hover:bg-employer-blue-dark"
              >
                Browse More Talent
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </motion.div>

        {error && (
          <div className="text-center text-red-400 mb-8">
            {error}
          </div>
        )}

        {/* Empty State */}
        {athletes.length === 0 && !error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-12 text-center">
                <div className="text-6xl mb-6">
                  <Heart className="h-20 w-20 mx-auto text-gray-700" />
                </div>
                <h2 className="text-3xl font-bold mb-4">No saved athletes yet</h2>
                <p className="text-gray-400 mb-8 text-lg">
                  Browse talent to start building your list of potential hires.
                  Save athletes you're interested in to easily access them later.
                </p>
                <Button
                  onClick={() => router.push('/employers/browse')}
                  className="bg-employer-blue hover:bg-employer-blue-dark text-lg px-8 py-6"
                  size="lg"
                >
                  Browse Athletes
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Saved Athletes Grid */}
        {athletes.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {athletes.map((athlete, index) => (
              <motion.div
                key={athlete.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <AthleteCard
                  athlete={{ ...athlete, isSaved: true }}
                  onSaveToggle={handleRemoveSaved}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
