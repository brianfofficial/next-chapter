"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Users, Trash2, Edit, ArrowLeft } from "lucide-react"

interface Team {
  id: string
  sport: string
  name: string
  created_at: string
  athlete_count: number
}

const sports = [
  "Football", "Basketball", "Baseball", "Softball", "Soccer",
  "Volleyball", "Track & Field", "Cross Country", "Swimming & Diving",
  "Tennis", "Golf", "Lacrosse", "Wrestling", "Gymnastics",
  "Field Hockey", "Ice Hockey", "Rowing", "Other"
]

export default function TeamsPage() {
  const params = useParams()
  const router = useRouter()
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    sport: "",
    name: ""
  })

  useEffect(() => {
    loadTeams()
  }, [params.id])

  async function loadTeams() {
    try {
      const response = await fetch(`/api/departments/${params.id}/teams`)
      if (response.ok) {
        const data = await response.json()
        setTeams(data.teams || [])
      }
    } catch (error) {
      console.error("Error loading teams:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateTeam(e: React.FormEvent) {
    e.preventDefault()

    try {
      const response = await fetch(`/api/departments/${params.id}/teams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          department_id: params.id
        })
      })

      if (response.ok) {
        setFormData({ sport: "", name: "" })
        setShowCreateForm(false)
        loadTeams()
      }
    } catch (error) {
      console.error("Error creating team:", error)
    }
  }

  async function handleDeleteTeam(teamId: string) {
    if (!confirm("Are you sure you want to delete this team? All roster data will be removed.")) {
      return
    }

    try {
      const response = await fetch(`/api/departments/${params.id}/teams/${teamId}`, {
        method: "DELETE"
      })

      if (response.ok) {
        loadTeams()
      }
    } catch (error) {
      console.error("Error deleting team:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(`/departments/${params.id}/dashboard`)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="text-2xl font-bold gradient-text">
                Team Management
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="gradient-text">Teams</span>
            </h1>
            <p className="text-gray-400">
              Manage your athletic teams and rosters
            </p>
          </div>
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-gold hover:bg-gold/90 text-black"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Team
          </Button>
        </div>

        {/* Create Team Form */}
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-gold">Create New Team</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateTeam} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="sport">Sport *</Label>
                      <select
                        id="sport"
                        value={formData.sport}
                        onChange={(e) => setFormData(prev => ({ ...prev, sport: e.target.value }))}
                        required
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                      >
                        <option value="">Select Sport</option>
                        {sports.map(sport => (
                          <option key={sport} value={sport}>{sport}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="name">Team Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Men's Basketball, Women's Soccer"
                        required
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="bg-gold hover:bg-gold/90 text-black">
                      Create Team
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowCreateForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Teams Grid */}
        {loading ? (
          <div className="text-center text-gray-400 py-12">Loading teams...</div>
        ) : teams.length === 0 ? (
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-12 text-center">
              <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Teams Yet</h3>
              <p className="text-gray-400 mb-6">
                Create your first team to get started
              </p>
              <Button
                onClick={() => setShowCreateForm(true)}
                className="bg-gold hover:bg-gold/90 text-black"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Team
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team, index) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-gray-900/50 border-gray-800 hover:border-gold transition-colors">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-gold">{team.sport}</span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => router.push(`/departments/${params.id}/teams/${team.id}/roster`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteTeam(team.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-semibold text-white mb-4">{team.name}</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Users className="h-4 w-4" />
                        <span className="text-sm">{team.athlete_count || 0} athletes</span>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => router.push(`/departments/${params.id}/teams/${team.id}/roster`)}
                        className="bg-gold/20 hover:bg-gold/30 text-gold border-gold/30"
                      >
                        Manage Roster
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
