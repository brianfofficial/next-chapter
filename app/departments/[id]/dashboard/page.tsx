"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Trophy, TrendingUp, Mail, Plus, Settings } from "lucide-react"

interface Department {
  id: string
  school_name: string
  name: string
  division: string
  subscription_tier: string
}

export default function DepartmentDashboardPage() {
  const params = useParams()
  const router = useRouter()
  const [department, setDepartment] = useState<Department | null>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total_athletes: 0,
    total_teams: 0,
    total_coaches: 0,
    profiles_created: 0
  })

  useEffect(() => {
    async function loadDepartment() {
      try {
        const response = await fetch(`/api/departments/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setDepartment(data.department)
          setStats(data.stats || stats)
        }
      } catch (error) {
        console.error("Error loading department:", error)
      } finally {
        setLoading(false)
      }
    }

    loadDepartment()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="text-gold text-xl">Loading...</div>
      </div>
    )
  }

  if (!department) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Department Not Found</h2>
            <Button onClick={() => router.push("/departments/register")}>
              Register Your Department
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <a href="/" className="text-2xl font-bold gradient-text">
                Next Chapter
              </a>
              <div className="text-gray-400 text-sm">
                {department.school_name} - {department.name}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(`/departments/${department.id}/settings`)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold mb-2">
            Welcome to <span className="gradient-text">{department.school_name}</span>
          </h1>
          <p className="text-gray-400">
            {department.division} • {department.subscription_tier.charAt(0).toUpperCase() + department.subscription_tier.slice(1)} Plan
          </p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {[
            { icon: <Users className="h-8 w-8" />, label: "Student-Athletes", value: stats.total_athletes },
            { icon: <Trophy className="h-8 w-8" />, label: "Teams", value: stats.total_teams },
            { icon: <Mail className="h-8 w-8" />, label: "Coaches", value: stats.total_coaches },
            { icon: <TrendingUp className="h-8 w-8" />, label: "Profiles Created", value: stats.profiles_created }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-gray-900/50 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-gold">{stat.icon}</div>
                    <div className="text-3xl font-bold text-white">{stat.value}</div>
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-gray-900/50 border-gray-800 hover:border-gold transition-colors cursor-pointer"
                  onClick={() => router.push(`/departments/${department.id}/teams`)}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gold">
                  <Trophy className="h-5 w-5" />
                  Manage Teams
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm mb-4">
                  Create teams, manage rosters, and track team performance
                </p>
                <Button className="w-full bg-gold hover:bg-gold/90 text-black">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Team
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800 hover:border-gold transition-colors cursor-pointer"
                  onClick={() => router.push(`/departments/${department.id}/coaches`)}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gold">
                  <Users className="h-5 w-5" />
                  Invite Coaches
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm mb-4">
                  Send invitations to coaches to join your department
                </p>
                <Button className="w-full bg-gold hover:bg-gold/90 text-black">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Invites
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800 hover:border-gold transition-colors cursor-pointer"
                  onClick={() => router.push(`/departments/${department.id}/analytics`)}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gold">
                  <TrendingUp className="h-5 w-5" />
                  View Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm mb-4">
                  Track engagement, profile completion, and placement metrics
                </p>
                <Button className="w-full bg-gold hover:bg-gold/90 text-black">
                  View Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Getting Started */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-gradient-to-r from-gold/10 to-gold/5 border-gold/30">
            <CardHeader>
              <CardTitle className="text-gold">🎉 Getting Started</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-gold text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Create Your Teams</h3>
                    <p className="text-gray-400 text-sm">
                      Set up teams for each sport in your athletic program
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-gold text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Invite Your Coaches</h3>
                    <p className="text-gray-400 text-sm">
                      Send email invitations to head coaches and assistants
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-gold text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Build Athlete Profiles</h3>
                    <p className="text-gray-400 text-sm">
                      Coaches can help their athletes create professional profiles
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
