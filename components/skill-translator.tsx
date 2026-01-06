"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { SPORTS, translateExperience, type AthleteInput } from "@/lib/translations"
import { Copy, Check, Share2, Save } from "lucide-react"
import { useAuth } from "@/lib/hooks/useAuth"

export function SkillTranslator() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [step, setStep] = useState<"sport" | "details" | "results">("sport")
  const [copied, setCopied] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [athleteData, setAthleteData] = useState<Partial<AthleteInput>>({
    leadership: [],
    achievements: [],
    yearsPlayed: 4
  })
  const [results, setResults] = useState<{ summary: string; bulletPoints: string[] } | null>(null)

  const handleSportSelect = (sportId: string) => {
    setAthleteData({ ...athleteData, sport: sportId })
    setStep("details")
  }

  const handleGenerateTranslation = () => {
    if (!athleteData.sport) return

    const input: AthleteInput = {
      sport: athleteData.sport,
      position: athleteData.position,
      yearsPlayed: athleteData.yearsPlayed || 4,
      leadership: athleteData.leadership || [],
      achievements: athleteData.achievements || [],
      stats: athleteData.stats,
      gpa: athleteData.gpa,
      major: athleteData.major
    }

    const translation = translateExperience(input)
    setResults(translation)
    setStep("results")
  }

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const copyAllBullets = () => {
    if (!results) return
    const allText = results.bulletPoints.map((bullet, i) => `• ${bullet}`).join("\n\n")
    copyToClipboard(allText)
  }

  const handleSaveTranslation = async () => {
    // If not authenticated, redirect to login
    if (!user) {
      // Store translation data in sessionStorage to auto-save after login
      sessionStorage.setItem('pendingTranslation', JSON.stringify({
        athleteData,
        results
      }))
      router.push('/login')
      return
    }

    // Save to database
    setSaving(true)
    try {
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

      if (!response.ok) {
        throw new Error('Failed to save translation')
      }

      setSaveSuccess(true)
      setTimeout(() => {
        router.push('/profile')
      }, 1500)
    } catch (error) {
      console.error('Error saving translation:', error)
      alert('Failed to save translation. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const selectedSport = SPORTS.find(s => s.id === athleteData.sport)

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12">
      <AnimatePresence mode="wait">
        {step === "sport" && (
          <motion.div
            key="sport"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 gradient-text">
                Choose Your Sport
              </h2>
              <p className="text-gray-400 text-lg">
                Let's translate your athletic experience into corporate language
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {SPORTS.map((sport) => (
                <motion.div
                  key={sport.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card
                    className="cursor-pointer hover:border-gold transition-all"
                    onClick={() => handleSportSelect(sport.id)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="text-6xl mb-4">{sport.icon}</div>
                      <div className="font-semibold text-lg">{sport.name}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {step === "details" && (
          <motion.div
            key="details"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                Tell Us About Your {selectedSport?.name} Experience
              </h2>
              <p className="text-gray-400 text-lg">
                The more details you provide, the better your translation
              </p>
            </div>

            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-8 space-y-6">
                {selectedSport?.positions && (
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gold">
                      Position
                    </label>
                    <select
                      className="w-full h-12 rounded-md border border-gray-700 bg-gray-900/50 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-gold transition-all"
                      value={athleteData.position || ""}
                      onChange={(e) => setAthleteData({ ...athleteData, position: e.target.value })}
                    >
                      <option value="">Select position</option>
                      {selectedSport.positions.map(pos => (
                        <option key={pos} value={pos}>{pos}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2 text-gold">
                    Years Played
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="5"
                    value={athleteData.yearsPlayed}
                    onChange={(e) => setAthleteData({ ...athleteData, yearsPlayed: parseInt(e.target.value) })}
                    placeholder="4"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gold">
                    Leadership Roles
                  </label>
                  <Input
                    placeholder="e.g., Team Captain, Student-Athlete Advisory Committee"
                    onChange={(e) => setAthleteData({
                      ...athleteData,
                      leadership: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                    })}
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate multiple roles with commas</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gold">
                    Key Achievements
                  </label>
                  <Textarea
                    placeholder="e.g., All-Conference selection, Team MVP, Championship finalist"
                    onChange={(e) => setAthleteData({
                      ...athleteData,
                      achievements: e.target.value.split('\n').filter(Boolean)
                    })}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gold">
                      GPA
                    </label>
                    <Input
                      placeholder="3.5"
                      onChange={(e) => setAthleteData({ ...athleteData, gpa: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gold">
                      Major
                    </label>
                    <Input
                      placeholder="Business Administration"
                      onChange={(e) => setAthleteData({ ...athleteData, major: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    variant="secondary"
                    onClick={() => setStep("sport")}
                    className="w-full"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleGenerateTranslation}
                    className="w-full"
                  >
                    Generate Translation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === "results" && results && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-12">
              <motion.h2
                className="text-4xl font-bold mb-4 gradient-text"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                Your Translation is Ready
              </motion.h2>
              <p className="text-gray-400 text-lg">
                Copy these to your resume or LinkedIn profile
              </p>
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gold">Professional Summary</h3>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(results.summary)}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{results.summary}</p>
                </CardContent>
              </Card>

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
                    {results.bulletPoints.map((bullet, index) => (
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

              <div className="flex flex-col gap-4 pt-4">
                {/* Save Success Message */}
                {saveSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gold/20 border border-gold text-gold px-6 py-3 rounded-lg text-center"
                  >
                    ✓ Translation saved! Redirecting to your profile...
                  </motion.div>
                )}

                <div className="flex gap-4 justify-center">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setStep("sport")
                      setResults(null)
                      setAthleteData({ leadership: [], achievements: [], yearsPlayed: 4 })
                      setSaveSuccess(false)
                    }}
                  >
                    Start Over
                  </Button>
                  <Button
                    onClick={handleSaveTranslation}
                    disabled={saving || saveSuccess}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? 'Saving...' : saveSuccess ? 'Saved!' : user ? 'Save to Profile' : 'Save & Sign In'}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
