"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchBar({ value, onChange, placeholder = "Search athletes..." }: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue)
    }, 500)

    return () => clearTimeout(timer)
  }, [localValue, onChange])

  // Sync with external value changes
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
      <Input
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="pl-12 pr-12 h-12 bg-gray-900/50"
      />
      {localValue && (
        <button
          onClick={() => {
            setLocalValue('')
            onChange('')
          }}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}
