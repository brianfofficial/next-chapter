"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, TrendingUp, Users, FileText, Award } from "lucide-react"

interface AnalyticsData {
  overview: {
    total_athletes: number
    profiles_completed: number
    profiles_in_progress: number
    avg_completion_rate: number
  }
  teams: Array<{
    name: string
    athlete_count: number
    profiles_completed: number
    completion_rate: number
  }>
  engagement: {
    active_this_week: number
    active_this_month: number
    logins_this_week: number
  }
}

export default function DepartmentAnalyticsPage() {
  const params = useParams()
  const router = useRouter()
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [params.id])

  async function loadAnalytics() {
    try {
      const response = await fetch(`/api/departments/${params.id}/analytics`)
      if (response.ok) {
        const result = await response.json()
        setData(result.data)
      }
    } catch (error) {
      console.error("Error loading analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="text-gold text-xl">Loading analytics...</div>
      </div>
    )
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
                Analytics
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold mb-2">
            <span className="gradient-text">Program Analytics</span>
          </h1>
          <p className="text-gray-400">
            Track engagement, profile completion, and career outcomes
          </p>
        </motion.div>

        {/* Overview Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {[
            {
              icon: <Users className="h-8 w-8" />,
              label: "Total Athletes",
              value: data?.overview.total_athletes || 0,
              color: "text-blue-400"
            },
            {
              icon: <FileText className="h-8 w-8" />,
              label: "Completed Profiles",
              value: data?.overview.profiles_completed || 0,
              color: "text-green-400"
            },
            {
              icon: <TrendingUp className="h-8 w-8" />,
              label: "In Progress",
              value: data?.overview.profiles_in_progress || 0,
              color: "text-yellow-400"
            },
            {
              icon: <Award className="h-8 w-8" />,
              label: "Avg Completion",
              value: `${Math.round(data?.overview.avg_completion_rate || 0)}%`,
              color: "text-gold"
            }
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
                    <div className={stat.color}>{stat.icon}</div>
                    <div className="text-3xl font-bold text-white">{stat.value}</div>
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Team Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-gold">Team Performance</CardTitle>
            </CardHeader>
            <CardContent>
              {data?.teams && data.teams.length > 0 ? (
                <div className="space-y-4">
                  {data.teams.map((team, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                      <div>
                        <div className="font-semibold text-white">{team.name}</div>
                        <div className="text-sm text-gray-400">
                          {team.athlete_count} athletes • {team.profiles_completed} profiles completed
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gold">{team.completion_rate}%</div>
                        <div className="text-xs text-gray-400">completion rate</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  No team data available yet. Create teams to see analytics.
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Engagement Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-gold">Engagement Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gray-800/50 rounded-lg">
                  <div className="text-3xl font-bold text-white mb-2">
                    {data?.engagement.active_this_week || 0}
                  </div>
                  <div className="text-sm text-gray-400">Active This Week</div>
                </div>
                <div className="text-center p-6 bg-gray-800/50 rounded-lg">
                  <div className="text-3xl font-bold text-white mb-2">
                    {data?.engagement.active_this_month || 0}
                  </div>
                  <div className="text-sm text-gray-400">Active This Month</div>
                </div>
                <div className="text-center p-6 bg-gray-800/50 rounded-lg">
                  <div className="text-3xl font-bold text-white mb-2">
                    {data?.engagement.logins_this_week || 0}
                  </div>
                  <div className="text-sm text-gray-400">Logins This Week</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
