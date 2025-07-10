export interface Goal {
  id: string
  title: string
  description: string
  month: string
  year: number
  progress: number
  roadmap?: RoadmapStep[]
  createdAt: string
  updatedAt: string
  category?: string
  priority?: string
  targetDate?: string
}

export interface RoadmapStep {
  id: string
  title: string
  step?: string
  description: string
  completed: boolean
  dueDate?: string
  order?: number
  notes?: string
}

// Legacy type alias for backward compatibility
export type Step = RoadmapStep
