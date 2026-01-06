"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/hooks/useAuth"
import { useEmployer } from "@/lib/hooks/useEmployer"
import { AthleteCard } from "@/components/employers/AthleteCard"
import { FilterSidebar } from "@/components/employers/FilterSidebar"
import { SearchBar } from "@/components/employers/SearchBar"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Heart } from "lucide-react"

interface Athlete {
  id: string
  sport: string | null
  position: string | null
  school: string | null
  graduation_year: number | null
  translated_summary: string | null
  gpa: string | null
  isSaved?: boolean
}

interface PaginationData {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function BrowseAthletesPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { profile: employer, loading: employerLoading } = useEmployer()

  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  })

  const [filters, setFilters] = useState({
    sport: '',
    graduation_year: '',
    school: '',
    min_gpa: '',
  })
  const [search, setSearch] = useState('')

  // Redirect if not authenticated or not an employer
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/employers/signup')
    }
  }, [user, authLoading, router])

  // Fetch athletes
  useEffect(() => {
    const fetchAthletes = async () => {
      if (!user) return

      setLoading(true)
      try {
        const params = new URLSearchParams({
          page: pagination.page.toString(),
          limit: pagination.limit.toString(),
          ...(search && { search }),
          ...(filters.sport && { sport: filters.sport }),
          ...(filters.graduation_year && { graduation_year: filters.graduation_year }),
          ...(filters.school && { school: filters.school }),
          ...(filters.min_gpa && { min_gpa: filters.min_gpa }),
        })

        const response = await fetch(`/api/athletes/browse?${params}`)
        if (!response.ok) throw new Error('Failed to fetch athletes')

        const data = await response.json()
        setAthletes(data.athletes)
        setPagination(data.pagination)
      } catch (error) {
        console.error('Error fetching athletes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAthletes()
  }, [user, pagination.page, search, filters])

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value })
    setPagination({ ...pagination, page: 1 }) // Reset to page 1 when filters change
  }

  const handleClearFilters = () => {
    setFilters({
      sport: '',
      graduation_year: '',
      school: '',
      min_gpa: '',
    })
    setSearch('')
    setPagination({ ...pagination, page: 1 })
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPagination({ ...pagination, page: 1 }) // Reset to page 1 when search changes
  }

  const handleSaveToggle = async (athleteId: string, currentlySaved: boolean) => {
    try {
      const endpoint = currentlySaved
        ? `/api/employers/saved-athletes?athlete_id=${athleteId}`
        : '/api/employers/saved-athletes'

      const response = await fetch(endpoint, {
        method: currentlySaved ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: currentlySaved ? undefined : JSON.stringify({ athlete_id: athleteId }),
      })

      if (!response.ok) throw new Error('Failed to toggle save')

      // Update local state
      setAthletes(
        athletes.map((a) =>
          a.id === athleteId ? { ...a, isSaved: !currentlySaved } : a
        )
      )
    } catch (error) {
      console.error('Error toggling save:', error)
      throw error
    }
  }

  const handlePageChange = (newPage: number) => {
    setPagination({ ...pagination, page: newPage })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (authLoading || employerLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="text-employer-blue text-xl">Loading...</div>
      </div>
    )
  }

  if (!user || !employer) {
    return null // Will redirect
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
                className="text-employer-blue font-semibold"
              >
                Browse
              </a>
              <a
                href="/employers/saved"
                className="text-gray-300 hover:text-employer-blue transition-colors flex items-center gap-2"
              >
                <Heart className="h-4 w-4" />
                Saved
              </a>
              <a
                href="/employers/settings"
                className="text-gray-300 hover:text-employer-blue transition-colors"
              >
                Settings
              </a>
              <div className="text-sm text-gray-500">
                {employer.company_name}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Browse{" "}
            <span className="gradient-text-employer">Elite Athletes</span>
          </h1>
          <p className="text-gray-400">
            {pagination.total.toLocaleString()} athletes available
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by sport, position, school, or skills..."
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Athletes Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-80 bg-gray-800/50 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ) : athletes.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold mb-2">No Athletes Found</h3>
                <p className="text-gray-400 mb-6">
                  Try adjusting your filters or search terms
                </p>
                <Button onClick={handleClearFilters}>Clear All Filters</Button>
              </motion.div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {athletes.map((athlete) => (
                    <AthleteCard
                      key={athlete.id}
                      athlete={athlete}
                      onSaveToggle={handleSaveToggle}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      variant="secondary"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>

                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      Page {pagination.page} of {pagination.totalPages}
                    </div>

                    <Button
                      variant="secondary"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
