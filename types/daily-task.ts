export interface DailyTask {
  id: string
  title: string
  description: string
  goalId: string
  goalTitle: string
  stepIndex?: number
  priority: "high" | "medium" | "low"
  category: "research" | "planning" | "creation" | "communication" | "review"
  estimatedTime: number // in minutes
  completed: boolean
  createdAt: string
  completedAt?: string
  aiInsight?: string
}
