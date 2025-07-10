export interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  createdAt: string
  updatedAt: string
  isPinned: boolean
  color?: string
  aiSummary?: string
  aiInsights?: string[]
}

export interface NoteFormData {
  title: string
  content: string
  tags: string[]
  color?: string
}
