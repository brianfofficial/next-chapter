'use client'

import { useDraggable } from '@dnd-kit/core'
import { Database } from '@/lib/database.types'
import { useState } from 'react'
import { MessageCircle, Star, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'

type PipelineCandidate = Database['public']['Tables']['pipeline_candidates']['Row'] & {
  athlete: Database['public']['Tables']['athletes']['Row']
  stage: Database['public']['Tables']['pipeline_stages']['Row']
}

interface CandidateCardProps {
  candidate: PipelineCandidate
  isDragging?: boolean
  onRefresh?: () => void
}

const priorityColors = {
  low: 'bg-gray-100 text-gray-700',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700',
}

export function CandidateCard({ candidate, isDragging = false, onRefresh }: CandidateCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: candidate.id,
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  async function handleDelete() {
    if (!confirm('Remove this candidate from your pipeline?')) return

    setDeleting(true)
    try {
      const res = await fetch(`/api/pipeline/candidates/${candidate.id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        onRefresh?.()
      }
    } catch (error) {
      console.error('Error deleting candidate:', error)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing ${
        isDragging ? 'shadow-lg' : ''
      } ${deleting ? 'opacity-50' : ''}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 truncate">
            {candidate.athlete.full_name}
          </h4>
          <p className="text-sm text-gray-600">
            {candidate.athlete.sport} • {candidate.athlete.school}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleDelete()
          }}
          className="text-gray-400 hover:text-red-600 transition-colors p-1"
          disabled={deleting}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Position & Priority */}
      <div className="flex items-center gap-2 mb-2">
        {candidate.position_title && (
          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
            {candidate.position_title}
          </span>
        )}
        <span className={`text-xs px-2 py-1 rounded-full capitalize ${priorityColors[candidate.priority]}`}>
          {candidate.priority}
        </span>
      </div>

      {/* Rating */}
      {candidate.rating && (
        <div className="flex items-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map(star => (
            <Star
              key={star}
              className={`w-3 h-3 ${
                star <= candidate.rating!
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
      )}

      {/* Expandable Details */}
      {(candidate.notes || candidate.salary_range) && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            setExpanded(!expanded)
          }}
          className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 transition-colors mt-2"
        >
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {expanded ? 'Hide' : 'Show'} details
        </button>
      )}

      {expanded && (
        <div className="mt-2 pt-2 border-t border-gray-100 space-y-2">
          {candidate.salary_range && (
            <div>
              <span className="text-xs text-gray-500">Salary:</span>
              <p className="text-xs text-gray-900">{candidate.salary_range}</p>
            </div>
          )}
          {candidate.notes && (
            <div>
              <span className="text-xs text-gray-500">Notes:</span>
              <p className="text-xs text-gray-900">{candidate.notes}</p>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
        <Link
          href={`/employers/messages?athlete=${candidate.athlete_id}`}
          className="flex-1 flex items-center justify-center gap-1 text-xs text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-1.5 rounded transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <MessageCircle className="w-3 h-3" />
          Message
        </Link>
        <Link
          href={`/employers/browse?id=${candidate.athlete_id}`}
          className="flex-1 text-xs text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 px-2 py-1.5 rounded text-center transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          View Profile
        </Link>
      </div>
    </div>
  )
}
