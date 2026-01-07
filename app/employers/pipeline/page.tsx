'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { Database } from '@/lib/database.types'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { PipelineStage } from '@/components/pipeline/PipelineStage'
import { CandidateCard } from '@/components/pipeline/CandidateCard'

type PipelineCandidate = Database['public']['Tables']['pipeline_candidates']['Row'] & {
  athlete: Database['public']['Tables']['athletes']['Row']
  stage: Database['public']['Tables']['pipeline_stages']['Row']
}

type Stage = Database['public']['Tables']['pipeline_stages']['Row']

export default function PipelinePage() {
  const { user } = useAuth()
  const [stages, setStages] = useState<Stage[]>([])
  const [candidates, setCandidates] = useState<PipelineCandidate[]>([])
  const [activeCandidate, setActiveCandidate] = useState<PipelineCandidate | null>(null)
  const [loading, setLoading] = useState(true)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  useEffect(() => {
    if (user) {
      loadPipelineData()
    }
  }, [user])

  async function loadPipelineData() {
    setLoading(true)
    try {
      // Load stages
      const stagesRes = await fetch('/api/pipeline/stages')
      const stagesData = await stagesRes.json()
      setStages(stagesData.stages || [])

      // Load candidates
      const candidatesRes = await fetch('/api/pipeline/candidates')
      const candidatesData = await candidatesRes.json()
      setCandidates(candidatesData.candidates || [])
    } catch (error) {
      console.error('Error loading pipeline data:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleDragStart(event: DragStartEvent) {
    const candidate = candidates.find(c => c.id === event.active.id)
    setActiveCandidate(candidate || null)
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveCandidate(null)

    if (!over || active.id === over.id) return

    const candidateId = active.id as string
    const newStageId = over.id as string

    // Find the candidate
    const candidate = candidates.find(c => c.id === candidateId)
    if (!candidate) return

    // Don't update if dropped on same stage
    if (candidate.stage_id === newStageId) return

    // Optimistic update
    setCandidates(prev =>
      prev.map(c =>
        c.id === candidateId
          ? { ...c, stage_id: newStageId, stage: stages.find(s => s.id === newStageId)! }
          : c
      )
    )

    // Update on server
    try {
      const res = await fetch(`/api/pipeline/candidates/${candidateId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage_id: newStageId }),
      })

      if (!res.ok) {
        // Revert on error
        await loadPipelineData()
      }
    } catch (error) {
      console.error('Error moving candidate:', error)
      await loadPipelineData()
    }
  }

  function getCandidatesForStage(stageId: string) {
    return candidates.filter(c => c.stage_id === stageId)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading pipeline...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Hiring Pipeline</h1>
          <p className="text-gray-600 mt-2">
            Track candidates through your hiring process
          </p>
        </div>

        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 overflow-x-auto pb-4">
            {stages.map(stage => (
              <PipelineStage
                key={stage.id}
                stage={stage}
                candidates={getCandidatesForStage(stage.id)}
                onRefresh={loadPipelineData}
              />
            ))}
          </div>

          <DragOverlay>
            {activeCandidate ? (
              <div className="rotate-3 opacity-80">
                <CandidateCard candidate={activeCandidate} isDragging />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {candidates.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 text-lg">
              No candidates in your pipeline yet
            </div>
            <p className="text-gray-500 mt-2">
              Start adding athletes from the Browse page
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
