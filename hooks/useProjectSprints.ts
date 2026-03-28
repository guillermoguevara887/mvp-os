import { useState, useCallback } from "react"

type SprintTask = {
  id: string
  title: string
  description: string | null
  task_type: string | null
  priority: string | null
  status: string
  estimated_hours: number | null
  acceptance_criteria: string | null
  order_index: number
}

type Sprint = {
  id: string
  sprint_number: number
  title: string
  goal: string | null
  summary: string | null
  estimated_days: number | null
  status: string
  order_index: number
  tasks: SprintTask[]
}

export function useProjectSprints(projectId: string) {
  const [sprints, setSprints] = useState<Sprint[]>([])
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateSprints = useCallback(async () => {
    if (!projectId) return

    setGenerating(true)
    setError(null)

    try {
      const res = await fetch(
        `/api/projects/${projectId}/generate-sprints`,
        {
          method: "POST",
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate sprints")
      }

      setSprints(data.data.sprints)
    } catch (err: any) {
      console.error(err)
      setError(err.message)
    } finally {
      setGenerating(false)
    }
  }, [projectId])

  return {
    sprints,
    loading,
    generating,
    error,
    generateSprints,
  }
}