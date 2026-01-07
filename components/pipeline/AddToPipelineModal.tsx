'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Loader2, Plus } from 'lucide-react'
import { Database } from '@/lib/database.types'

type Stage = Database['public']['Tables']['pipeline_stages']['Row']

interface AddToPipelineModalProps {
  isOpen: boolean
  onClose: () => void
  athleteId: string
  athleteName: string
  onSuccess?: () => void
}

const priorities = [
  { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-700' },
  { value: 'medium', label: 'Medium', color: 'bg-blue-100 text-blue-700' },
  { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-700' },
  { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-700' },
]

export function AddToPipelineModal({
  isOpen,
  onClose,
  athleteId,
  athleteName,
  onSuccess,
}: AddToPipelineModalProps) {
  const [stages, setStages] = useState<Stage[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    stage_id: '',
    position_title: '',
    salary_range: '',
    priority: 'medium',
    rating: 0,
    notes: '',
  })

  useEffect(() => {
    if (isOpen) {
      loadStages()
      setError('')
      setFormData({
        stage_id: '',
        position_title: '',
        salary_range: '',
        priority: 'medium',
        rating: 0,
        notes: '',
      })
    }
  }, [isOpen])

  async function loadStages() {
    setLoading(true)
    try {
      const res = await fetch('/api/pipeline/stages')
      const data = await res.json()
      setStages(data.stages || [])

      // Auto-select Discovery stage
      const discoveryStage = data.stages?.find((s: Stage) => s.name === 'Discovery')
      if (discoveryStage) {
        setFormData(prev => ({ ...prev, stage_id: discoveryStage.id }))
      }
    } catch (error) {
      console.error('Error loading stages:', error)
      setError('Failed to load pipeline stages')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/pipeline/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          athlete_id: athleteId,
          ...formData,
          rating: formData.rating || null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 409) {
          setError('This athlete is already in your pipeline')
        } else {
          setError(data.error || 'Failed to add to pipeline')
        }
        return
      }

      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Error adding to pipeline:', error)
      setError('Failed to add to pipeline')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add {athleteName} to Pipeline</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <Label htmlFor="stage">Pipeline Stage *</Label>
              <select
                id="stage"
                required
                className="w-full mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                value={formData.stage_id}
                onChange={(e) => setFormData({ ...formData, stage_id: e.target.value })}
              >
                <option value="">Select a stage</option>
                {stages.map(stage => (
                  <option key={stage.id} value={stage.id}>
                    {stage.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="position">Position Title</Label>
              <Input
                id="position"
                placeholder="e.g., Sales Associate"
                value={formData.position_title}
                onChange={(e) => setFormData({ ...formData, position_title: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="salary">Salary Range</Label>
              <Input
                id="salary"
                placeholder="e.g., $50k - $65k"
                value={formData.salary_range}
                onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
              />
            </div>

            <div>
              <Label>Priority</Label>
              <div className="flex gap-2 mt-1">
                {priorities.map(p => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, priority: p.value })}
                    className={`flex-1 px-3 py-2 rounded-md text-sm transition-all ${
                      formData.priority === p.value
                        ? p.color + ' ring-2 ring-offset-1 ring-gray-400'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any notes about this candidate..."
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={submitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting || !formData.stage_id}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add to Pipeline
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
