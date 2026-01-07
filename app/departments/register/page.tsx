"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Building2, Users, Award, TrendingUp } from "lucide-react"

const divisions = ["NCAA D1", "NCAA D2", "NCAA D3", "NAIA", "NJCAA", "Other"]

const conferences = [
  "ACC", "Big Ten", "Big 12", "SEC", "Pac-12",
  "Big East", "American", "Conference USA", "MAC", "Mountain West",
  "Sun Belt", "Independent", "Other"
]

export default function DepartmentRegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    school_name: "",
    department_name: "",
    division: "",
    conference: "",
    athletic_director_name: "",
    contact_email: "",
    contact_phone: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    website_url: "",
    estimated_athletes: "",
    estimated_teams: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/departments/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Registration failed")
      }

      const data = await response.json()
      router.push(`/departments/${data.department.id}/dashboard`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <nav className="border-b border-gray-800 bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a href="/" className="text-2xl font-bold gradient-text">
              Next Chapter
            </a>
            <a href="/login" className="text-gray-300 hover:text-gold transition-colors">
              Sign In
            </a>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4">
            <span className="gradient-text">Athletic Department</span> Portal
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Empower your entire athletic program to help student-athletes transition
            to professional careers
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {[
            {
              icon: <Building2 className="h-8 w-8 text-gold" />,
              title: "Centralized Platform",
              description: "Manage all teams and coaches in one place"
            },
            {
              icon: <Users className="h-8 w-8 text-gold" />,
              title: "Team Collaboration",
              description: "Coaches can help their athletes build profiles"
            },
            {
              icon: <Award className="h-8 w-8 text-gold" />,
              title: "Alumni Success",
              description: "Track career outcomes and placement rates"
            },
            {
              icon: <TrendingUp className="h-8 w-8 text-gold" />,
              title: "Analytics Dashboard",
              description: "Monitor engagement and success metrics"
            }
          ].map((benefit, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full bg-gray-900/50 border-gray-800">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">{benefit.icon}</div>
                  <h3 className="font-semibold text-white mb-2">{benefit.title}</h3>
                  <p className="text-sm text-gray-400">{benefit.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Registration Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="max-w-4xl mx-auto bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl text-gold">Register Your Athletic Department</CardTitle>
              <CardDescription>
                Start your free 30-day trial - no credit card required
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* School Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">School Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="school_name">School Name *</Label>
                      <Input
                        id="school_name"
                        name="school_name"
                        value={formData.school_name}
                        onChange={handleChange}
                        placeholder="University of..."
                        required
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="department_name">Department Name *</Label>
                      <Input
                        id="department_name"
                        name="department_name"
                        value={formData.department_name}
                        onChange={handleChange}
                        placeholder="Athletics, Sports, etc."
                        required
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="division">Division *</Label>
                      <select
                        id="division"
                        name="division"
                        value={formData.division}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                      >
                        <option value="">Select Division</option>
                        {divisions.map(div => (
                          <option key={div} value={div}>{div}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="conference">Conference</Label>
                      <select
                        id="conference"
                        name="conference"
                        value={formData.conference}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                      >
                        <option value="">Select Conference</option>
                        {conferences.map(conf => (
                          <option key={conf} value={conf}>{conf}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Contact Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="athletic_director_name">Athletic Director Name *</Label>
                      <Input
                        id="athletic_director_name"
                        name="athletic_director_name"
                        value={formData.athletic_director_name}
                        onChange={handleChange}
                        required
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact_email">Contact Email *</Label>
                      <Input
                        type="email"
                        id="contact_email"
                        name="contact_email"
                        value={formData.contact_email}
                        onChange={handleChange}
                        required
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact_phone">Contact Phone</Label>
                      <Input
                        type="tel"
                        id="contact_phone"
                        name="contact_phone"
                        value={formData.contact_phone}
                        onChange={handleChange}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="website_url">Website URL</Label>
                      <Input
                        type="url"
                        id="website_url"
                        name="website_url"
                        value={formData.website_url}
                        onChange={handleChange}
                        placeholder="https://..."
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Address</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="address">Street Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="CA"
                        maxLength={2}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="zip_code">ZIP Code</Label>
                      <Input
                        id="zip_code"
                        name="zip_code"
                        value={formData.zip_code}
                        onChange={handleChange}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Program Size */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Program Size (Estimates)</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="estimated_athletes">Number of Student-Athletes</Label>
                      <Input
                        type="number"
                        id="estimated_athletes"
                        name="estimated_athletes"
                        value={formData.estimated_athletes}
                        onChange={handleChange}
                        placeholder="e.g. 350"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="estimated_teams">Number of Teams</Label>
                      <Input
                        type="number"
                        id="estimated_teams"
                        name="estimated_teams"
                        value={formData.estimated_teams}
                        onChange={handleChange}
                        placeholder="e.g. 18"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gold hover:bg-gold/90 text-black font-semibold text-lg py-6"
                >
                  {loading ? "Creating Your Account..." : "Start Free 30-Day Trial"}
                </Button>

                <p className="text-center text-sm text-gray-400">
                  By registering, you agree to our Terms of Service and Privacy Policy
                </p>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-gray-400 mb-4">
            Questions? Contact us at{" "}
            <a href="mailto:support@nextchapter.com" className="text-gold hover:underline">
              support@nextchapter.com
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
