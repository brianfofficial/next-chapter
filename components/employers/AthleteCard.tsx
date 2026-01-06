"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Heart, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { SPORTS } from "@/lib/translations"

interface AthleteCardProps {
  athlete: {
    id: string
    sport: string | null
    position: string | null
    school: string | null
    graduation_year: number | null
    translated_summary: string | null
    gpa: string | null
    isSaved?: boolean
  }
  onSaveToggle?: (athleteId: string, currentlySaved: boolean) => void
}

export function AthleteCard({ athlete, onSaveToggle }: AthleteCardProps) {
  const router = useRouter()
  const [isSaved, setIsSaved] = useState(athlete.isSaved || false)
  const [saving, setSaving] = useState(false)

  const sport = SPORTS.find(s => s.id === athlete.sport)
  const summaryPreview = athlete.translated_summary
    ? athlete.translated_summary.slice(0, 150) + (athlete.translated_summary.length > 150 ? '...' : '')
    : 'No summary available'

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (saving) return

    setSaving(true)
    try {
      if (onSaveToggle) {
        await onSaveToggle(athlete.id, isSaved)
      }
      setIsSaved(!isSaved)
    } catch (error) {
      console.error('Error toggling save:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleCardClick = () => {
    router.push(`/employers/athletes/${athlete.id}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className="cursor-pointer hover:border-employer-blue transition-all h-full"
        onClick={handleCardClick}
      >
        <CardContent className="p-6">
          {/* Header with sport icon and save button */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="text-4xl">{sport?.icon || '🏆'}</div>
              <div>
                <div className="font-semibold text-lg capitalize">
                  {athlete.sport || 'Athlete'}
                </div>
                <div className="text-sm text-gray-400">
                  {athlete.position || 'Position not specified'}
                </div>
              </div>
            </div>
            <button
              onClick={handleSaveToggle}
              className={`p-2 rounded-full transition-all ${
                isSaved
                  ? 'bg-employer-blue text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
              disabled={saving}
            >
              <Heart
                className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`}
              />
            </button>
          </div>

          {/* School and Grad Year */}
          <div className="flex gap-4 mb-4 text-sm">
            {athlete.school && (
              <div>
                <span className="text-gray-500">School: </span>
                <span className="text-gray-300">{athlete.school}</span>
              </div>
            )}
            {athlete.graduation_year && (
              <div>
                <span className="text-gray-500">Grad: </span>
                <span className="text-gray-300">{athlete.graduation_year}</span>
              </div>
            )}
          </div>

          {/* GPA Badge */}
          {athlete.gpa && (
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-gold/20 text-gold text-sm mb-4">
              GPA: {athlete.gpa}
            </div>
          )}

          {/* Summary Preview */}
          <p className="text-gray-400 text-sm mb-4 line-clamp-3">
            {summaryPreview}
          </p>

          {/* View Profile Button */}
          <div className="flex items-center text-employer-blue text-sm font-semibold group">
            View Full Profile
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
