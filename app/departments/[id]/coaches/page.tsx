"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, UserPlus, ArrowLeft, Check, Clock, XCircle } from "lucide-react"

interface Coach {
  id: string
  email: string
  name: string
  role: string
  team_name?: string
  status: "pending" | "accepted" | "expired"
  invited_at: string
}

const roles = [
  "athletic_director",
  "head_coach",
  "assistant_coach"
]

export default function CoachesPage() {
  const params = useParams()
  const router = useRouter()
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [teams, setTeams] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showInviteForm, setShowInviteForm] = useState(false)
  const [inviting, setInviting] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    role: "head_coach",
    team_id: ""
  })

  useEffect(() => {
    loadCoaches()
    loadTeams()
  }, [params.id])

  async function loadCoaches() {
    try {
      const response = await fetch(`/api/departments/${params.id}/coaches`)
      if (response.ok) {
        const data = await response.json()
        setCoaches(data.coaches || [])
      }
    } catch (error) {
      console.error("Error loading coaches:", error)
    } finally {
      setLoading(false)
    }
  }

  async function loadTeams() {
    try {
      const response = await fetch(`/api/departments/${params.id}/teams`)
      if (response.ok) {
        const data = await response.json()
        setTeams(data.teams || [])
      }
    } catch (error) {
      console.error("Error loading teams:", error)
    }
  }

  async function handleSendInvite(e: React.FormEvent) {
    e.preventDefault()
    setInviting(true)

    try {
      const response = await fetch(`/api/departments/${params.id}/coaches/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          department_id: params.id
        })
      })

      if (response.ok) {
        setFormData({ email: "", name: "", role: "head_coach", team_id: "" })
        setShowInviteForm(false)
        loadCoaches()
      } else {
        const data = await response.json()
        alert(data.error || "Failed to send invite")
      }
    } catch (error) {
      console.error("Error sending invite:", error)
      alert("Failed to send invite")
    } finally {
      setInviting(false)
    }
  }

  function getRoleLabel(role: string) {
    return role
      .split("_")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case "accepted":
        return <Check className="h-5 w-5 text-green-500" />
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "expired":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return null
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
                Coach Management
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
              <span className="gradient-text">Coaches</span>
            </h1>
            <p className="text-gray-400">
              Invite and manage coaching staff
            </p>
          </div>
          <Button
            onClick={() => setShowInviteForm(!showInviteForm)}
            className="bg-gold hover:bg-gold/90 text-black"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Coach
          </Button>
        </div>

        {/* Invite Form */}
        {showInviteForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-gold">Invite New Coach</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSendInvite} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Coach Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="John Smith"
                        required
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="coach@university.edu"
                        required
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="role">Role *</Label>
                      <select
                        id="role"
                        value={formData.role}
                        onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                        required
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                      >
                        {roles.map(role => (
                          <option key={role} value={role}>{getRoleLabel(role)}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="team_id">Assign to Team (Optional)</Label>
                      <select
                        id="team_id"
                        value={formData.team_id}
                        onChange={(e) => setFormData(prev => ({ ...prev, team_id: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                      >
                        <option value="">No specific team</option>
                        {teams.map(team => (
                          <option key={team.id} value={team.id}>{team.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4">
                    <p className="text-sm text-blue-300">
                      <Mail className="h-4 w-4 inline mr-2" />
                      An email invitation will be sent to <strong>{formData.email || "[email]"}</strong> with
                      instructions to create their account and access the platform.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      disabled={inviting}
                      className="bg-gold hover:bg-gold/90 text-black"
                    >
                      {inviting ? "Sending..." : "Send Invitation"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowInviteForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Coaches List */}
        {loading ? (
          <div className="text-center text-gray-400 py-12">Loading coaches...</div>
        ) : coaches.length === 0 ? (
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-12 text-center">
              <UserPlus className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Coaches Yet</h3>
              <p className="text-gray-400 mb-6">
                Send your first coach invitation to get started
              </p>
              <Button
                onClick={() => setShowInviteForm(true)}
                className="bg-gold hover:bg-gold/90 text-black"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Coach
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {coaches.map((coach, index) => (
              <motion.div
                key={coach.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-gold/20 rounded-full p-3">
                          <UserPlus className="h-6 w-6 text-gold" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{coach.name}</h3>
                          <p className="text-sm text-gray-400">{coach.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-sm font-medium text-white">{getRoleLabel(coach.role)}</div>
                          {coach.team_name && (
                            <div className="text-xs text-gray-400">{coach.team_name}</div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(coach.status)}
                          <span className="text-sm text-gray-400 capitalize">{coach.status}</span>
                        </div>
                      </div>
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
