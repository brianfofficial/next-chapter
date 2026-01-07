'use client'

import { useDroppable } from '@dnd-kit/core'
import { Database } from '@/lib/database.types'
import { CandidateCard } from './CandidateCard'

type PipelineCandidate = Database['public']['Tables']['pipeline_candidates']['Row'] & {
  athlete: Database['public']['Tables']['athletes']['Row']
  stage: Database['public']['Tables']['pipeline_stages']['Row']
}

type Stage = Database['public']['Tables']['pipeline_stages']['Row']

interface PipelineStageProps {
  stage: Stage
  candidates: PipelineCandidate[]
  onRefresh: () => void
}

export function PipelineStage({ stage, candidates, onRefresh }: PipelineStageProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage.id,
  })

  return (
    <div className="flex-shrink-0 w-80">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Stage Header */}
        <div
          className="p-4 border-b border-gray-200"
          style={{
            backgroundColor: `${stage.color}10`,
            borderBottomColor: stage.color,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: stage.color }}
              />
              <h3 className="font-semibold text-gray-900">{stage.name}</h3>
            </div>
            <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded-full">
              {candidates.length}
            </span>
          </div>
          {stage.description && (
            <p className="text-xs text-gray-600 mt-1">{stage.description}</p>
          )}
        </div>

        {/* Droppable Area */}
        <div
          ref={setNodeRef}
          className={`p-3 min-h-[400px] max-h-[calc(100vh-300px)] overflow-y-auto space-y-3 transition-colors ${
            isOver ? 'bg-blue-50' : 'bg-gray-50'
          }`}
        >
          {candidates.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              Drop candidates here
            </div>
          ) : (
            candidates.map(candidate => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                onRefresh={onRefresh}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
