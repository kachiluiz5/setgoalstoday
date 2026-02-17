import { loadApiSettings } from "./storage"

export interface DailyTask {
  id: string
  title: string
  description: string
  goalId: string
  goalTitle: string
  stepIndex?: number
  priority: "high" | "medium" | "low"
  category: "research" | "planning" | "creation" | "communication" | "review"
  estimatedTime: number
  completed: boolean
  createdAt: string
  completedAt?: string
  aiInsight?: string
}

export function loadDailyTasks(): { today: DailyTask[]; previous: DailyTask[] } {
  if (typeof window === "undefined") return { today: [], previous: [] }

  try {
    const saved = localStorage.getItem("dailyTasks")
    if (!saved) return { today: [], previous: [] }

    const tasks = JSON.parse(saved) as DailyTask[]
    const today = new Date().toDateString()

    const todayTasks = tasks.filter((task) => new Date(task.createdAt).toDateString() === today)
    const previousTasks = tasks.filter((task) => new Date(task.createdAt).toDateString() !== today)

    return { today: todayTasks, previous: previousTasks }
  } catch {
    return { today: [], previous: [] }
  }
}

export function saveDailyTasks(tasks: DailyTask[]): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem("dailyTasks", JSON.stringify(tasks))
  } catch (error) {
    console.error("Failed to save daily tasks:", error)
  }
}

export async function generateDailyTasks(goals: any[]): Promise<DailyTask[]> {
  const apiSettings = loadApiSettings()

  if (!apiSettings?.apiKey) {
    throw new Error("Please configure your AI provider and API key in Settings.")
  }

  // Default to gemini if provider wasn't explicitly set
  const provider: "openai" | "gemini" = apiSettings.provider === "openai" ? "openai" : "gemini"
  const apiKey = apiSettings.apiKey

  const prompt = `Based on these goals, generate 3-5 specific, actionable daily tasks for TODAY.

${goals
  .map(
    (g) => `• Goal: ${g.title}
  Description: ${g.description || "No description"}
  Progress: ${g.progress || 0}%`,
  )
  .join("\n\n")}

Return ONLY a valid JSON array (no markdown) in this format:
[
  {
    "title": "Task title",
    "description": "Detailed description",
    "goalTitle": "Goal title",
    "priority": "high|medium|low",
    "category": "research|planning|creation|communication|review",
    "estimatedTime": 30,
    "aiInsight": "Why this task matters"
  }
]`

  let response: Response

  if (provider === "openai") {
    response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: apiSettings.model || "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    })
  } else {
    // Gemini
    response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
        }),
      },
    )
  }

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`API request failed (${response.status}): ${text}`)
  }

  const data = await response.json()
  const rawContent =
    provider === "openai"
      ? data.choices?.[0]?.message?.content || ""
      : data.candidates?.[0]?.content?.parts?.[0]?.text || ""

  if (!rawContent) throw new Error("AI returned an empty response.")

  // Remove possible \`\`\`json fences and extract array
  const cleaned = rawContent
    .replace(/```json\s*/g, "")
    .replace(/```/g, "")
    .trim()

  let tasksArr: any[]
  try {
    // Try direct parse first
    tasksArr = JSON.parse(cleaned)
  } catch {
    // Fallback to regex array extraction
    const arrMatch = cleaned.match(/\[[\s\S]*\]/)
    if (!arrMatch) {
      throw new Error("Could not find a JSON array in AI response.")
    }
    tasksArr = JSON.parse(arrMatch[0])
  }

  if (!Array.isArray(tasksArr)) {
    throw new Error("Parsed AI response is not an array.")
  }

  return tasksArr.map((t) => ({
    id: crypto.randomUUID(),
    title: t.title || "Untitled Task",
    description: t.description || "",
    goalId: goals.find((g) => g.title.toLowerCase() === (t.goalTitle || "").toLowerCase())?.id || goals[0]?.id || "",
    goalTitle: t.goalTitle || goals[0]?.title || "General",
    priority: t.priority || "medium",
    category: t.category || "creation",
    estimatedTime: t.estimatedTime || 30,
    completed: false,
    createdAt: new Date().toISOString(),
    aiInsight: t.aiInsight || "",
  })) as DailyTask[]
}
