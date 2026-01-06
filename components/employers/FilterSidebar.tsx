"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SPORTS } from "@/lib/translations"
import { X } from "lucide-react"

interface FilterSidebarProps {
  filters: {
    sport: string
    graduation_year: string
    school: string
    min_gpa: string
  }
  onFilterChange: (key: string, value: string) => void
  onClearFilters: () => void
}

const GRADUATION_YEARS = [
  '2024',
  '2025',
  '2026',
  '2027',
  '2028',
]

export function FilterSidebar({ filters, onFilterChange, onClearFilters }: FilterSidebarProps) {
  const hasActiveFilters = Object.values(filters).some(v => v !== '')

  return (
    <Card className="sticky top-20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-employer-blue">Filters</h3>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
        </div>

        <div className="space-y-6">
          {/* Sport Filter */}
          <div>
            <label className="block text-sm font-medium mb-3 text-gray-300">
              Sport
            </label>
            <div className="space-y-2">
              {SPORTS.map((sport) => (
                <label
                  key={sport.id}
                  className="flex items-center gap-3 cursor-pointer hover:bg-gray-800/50 p-2 rounded transition-colors"
                >
                  <input
                    type="radio"
                    name="sport"
                    value={sport.id}
                    checked={filters.sport === sport.id}
                    onChange={(e) => onFilterChange('sport', e.target.value)}
                    className="w-4 h-4 text-employer-blue focus:ring-employer-blue"
                  />
                  <span className="text-xl">{sport.icon}</span>
                  <span className="text-sm text-gray-300">{sport.name}</span>
                </label>
              ))}
              {filters.sport && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onFilterChange('sport', '')}
                  className="w-full text-xs"
                >
                  Show All Sports
                </Button>
              )}
            </div>
          </div>

          {/* Graduation Year */}
          <div>
            <label className="block text-sm font-medium mb-3 text-gray-300">
              Graduation Year
            </label>
            <select
              className="w-full h-10 rounded-md border border-gray-700 bg-gray-900/50 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-employer-blue transition-all"
              value={filters.graduation_year}
              onChange={(e) => onFilterChange('graduation_year', e.target.value)}
            >
              <option value="">All Years</option>
              {GRADUATION_YEARS.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* School */}
          <div>
            <label className="block text-sm font-medium mb-3 text-gray-300">
              School
            </label>
            <Input
              placeholder="Search school..."
              value={filters.school}
              onChange={(e) => onFilterChange('school', e.target.value)}
              className="h-10"
            />
          </div>

          {/* Minimum GPA */}
          <div>
            <label className="block text-sm font-medium mb-3 text-gray-300">
              Minimum GPA
            </label>
            <select
              className="w-full h-10 rounded-md border border-gray-700 bg-gray-900/50 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-employer-blue transition-all"
              value={filters.min_gpa}
              onChange={(e) => onFilterChange('min_gpa', e.target.value)}
            >
              <option value="">Any GPA</option>
              <option value="3.5">3.5+</option>
              <option value="3.0">3.0+</option>
              <option value="2.5">2.5+</option>
              <option value="2.0">2.0+</option>
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
