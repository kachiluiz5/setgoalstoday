import type { Goal } from "@/types/goal"
import type { Note } from "@/types/note"
import type { DailyTask } from "@/types/daily-task"

const GOALS_KEY = "daily-goals"
const NOTES_KEY = "daily-notes"
const TASKS_KEY = "daily-tasks"
const API_SETTINGS_KEY = "api-settings"
const NOTIFICATION_SETTINGS_KEY = "notification-settings"

export interface ApiSettings {
  apiKey: string
  provider: "openai" | "gemini" | "anthropic"
  model?: string
  baseUrl?: string
}

export interface NotificationSchedule {
  enabled: boolean
  times: string[]
  frequency: "daily" | "weekly" | "custom"
}

// Goals Storage
export function loadGoals(): Goal[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(GOALS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Error loading goals:", error)
    return []
  }
}

export function saveGoals(goals: Goal[]): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(GOALS_KEY, JSON.stringify(goals))
  } catch (error) {
    console.error("Error saving goals:", error)
  }
}

export function getGoals(): Goal[] {
  return loadGoals()
}

export function addGoal(goal: Goal): void {
  const goals = loadGoals()
  goals.push(goal)
  saveGoals(goals)
}

export function updateGoal(updatedGoal: Goal): void {
  const goals = loadGoals()
  const index = goals.findIndex((g) => g.id === updatedGoal.id)
  if (index !== -1) {
    goals[index] = updatedGoal
    saveGoals(goals)
  }
}

export function saveGoal(goal: Goal): void {
  const goals = loadGoals()
  const index = goals.findIndex((g) => g.id === goal.id)

  if (index !== -1) {
    goals[index] = goal
  } else {
    goals.push(goal)
  }

  saveGoals(goals)
}

export function deleteGoal(goalId: string): void {
  const goals = loadGoals()
  const filteredGoals = goals.filter((g) => g.id !== goalId)
  saveGoals(filteredGoals)
}

// Notes Storage
export function loadNotes(): Note[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(NOTES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Error loading notes:", error)
    return []
  }
}

export function saveNotes(notes: Note[]): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes))
  } catch (error) {
    console.error("Error saving notes:", error)
  }
}

export function getNotes(): Note[] {
  return loadNotes()
}

export function addNote(note: Note): void {
  const notes = loadNotes()
  notes.push(note)
  saveNotes(notes)
}

export function updateNote(updatedNote: Note): void {
  const notes = loadNotes()
  const index = notes.findIndex((n) => n.id === updatedNote.id)
  if (index !== -1) {
    notes[index] = updatedNote
    saveNotes(notes)
  }
}

export function deleteNote(noteId: string): void {
  const notes = loadNotes()
  const filteredNotes = notes.filter((n) => n.id !== noteId)
  saveNotes(filteredNotes)
}

// Tasks Storage
export function loadTasks(): DailyTask[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(TASKS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Error loading tasks:", error)
    return []
  }
}

export function saveTasks(tasks: DailyTask[]): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
  } catch (error) {
    console.error("Error saving tasks:", error)
  }
}

export function getTasks(): DailyTask[] {
  return loadTasks()
}

export function addTask(task: DailyTask): void {
  const tasks = loadTasks()
  tasks.push(task)
  saveTasks(tasks)
}

export function updateTask(updatedTask: DailyTask): void {
  const tasks = loadTasks()
  const index = tasks.findIndex((t) => t.id === updatedTask.id)
  if (index !== -1) {
    tasks[index] = updatedTask
    saveTasks(tasks)
  }
}

export function deleteTask(taskId: string): void {
  const tasks = loadTasks()
  const filteredTasks = tasks.filter((t) => t.id !== taskId)
  saveTasks(filteredTasks)
}

// API Settings Storage
export function loadApiSettings(): ApiSettings | null {
  if (typeof window === "undefined") return null
  try {
    // Check both possible keys for compatibility
    const stored = localStorage.getItem(API_SETTINGS_KEY) || localStorage.getItem("apiSettings")
    if (!stored) return null

    const settings = JSON.parse(stored)

    // Handle legacy format
    if (settings.geminiKey && !settings.apiKey) {
      return {
        apiKey: settings.geminiKey,
        provider: "gemini",
        model: settings.model || "gemini-3-flash-preview",
      }
    }

    // Validate current format
    if (settings.apiKey && settings.provider) {
      return {
        apiKey: settings.apiKey,
        provider: settings.provider,
        model: settings.model,
        baseUrl: settings.baseUrl,
      }
    }

    return null
  } catch (error) {
    console.error("Error loading API settings:", error)
    return null
  }
}

export function saveApiSettings(settings: ApiSettings): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(API_SETTINGS_KEY, JSON.stringify(settings))
    // Also save to legacy key for compatibility
    localStorage.setItem("apiSettings", JSON.stringify(settings))
  } catch (error) {
    console.error("Error saving API settings:", error)
  }
}

// Notification Settings Storage
export function getNotificationSettings(): NotificationSchedule {
  if (typeof window === "undefined") return { enabled: false, times: ["09:00", "18:00"], frequency: "daily" }
  try {
    const stored = localStorage.getItem(NOTIFICATION_SETTINGS_KEY)
    return stored ? JSON.parse(stored) : { enabled: false, times: ["09:00", "18:00"], frequency: "daily" }
  } catch (error) {
    console.error("Error loading notification settings:", error)
    return { enabled: false, times: ["09:00", "18:00"], frequency: "daily" }
  }
}

export function saveNotificationSettings(settings: NotificationSchedule): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(settings))
  } catch (error) {
    console.error("Error saving notification settings:", error)
  }
}

export function getNotificationSchedule(): NotificationSchedule {
  return getNotificationSettings()
}

export function saveNotificationSchedule(schedule: NotificationSchedule): void {
  saveNotificationSettings(schedule)
}
