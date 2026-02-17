import type { RoadmapStep } from "@/types/goal"
import { loadApiSettings } from "./storage"

export async function generateRoadmap(goalTitle: string, goalDescription = ""): Promise<RoadmapStep[]> {
  try {
    const apiSettings = loadApiSettings()

    if (!apiSettings?.apiKey) {
      throw new Error("No API key configured. Please set up your AI provider in Settings.")
    }

    const prompt = `Create a detailed roadmap for achieving this goal:

Title: ${goalTitle}
Description: ${goalDescription}

Generate 6-8 specific, actionable steps that will lead to achieving this goal. Each step should be:
- Specific and actionable
- Measurable when possible
- Realistic and achievable
- Include detailed implementation guidance

For each step, provide:
1. A clear, actionable step title
2. A detailed description (3-4 sentences) explaining exactly how to implement this step

Respond in JSON format:
{
  "roadmap": [
    {
      "step": "Step title",
      "description": "Detailed 3-4 sentence description with specific implementation guidance"
    }
  ]
}`

    let response: Response

    if (apiSettings.provider === "gemini") {
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiSettings.apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 2500,
            },
          }),
        },
      )
    } else {
      response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiSettings.apiKey}`,
        },
        body: JSON.stringify({
          model: apiSettings.model || "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 2500,
        }),
      })
    }

    if (!response.ok) {
      console.warn(`AI provider returned status ${response.status}`)
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()

    let content: string
    if (apiSettings.provider === "gemini") {
      content = data.candidates?.[0]?.content?.parts?.[0]?.text || ""
    } else {
      content = data.choices?.[0]?.message?.content || ""
    }

    if (!content) {
      throw new Error("No content received from AI")
    }

    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("No JSON found in AI response")
    }

    const parsed = JSON.parse(jsonMatch[0])

    if (!parsed.roadmap || !Array.isArray(parsed.roadmap)) {
      throw new Error("Invalid roadmap format from AI")
    }

    return parsed.roadmap.map((item: any, index: number) => ({
      id: crypto.randomUUID(),
      title: item.step || `Step ${index + 1}`,
      step: item.step || `Step ${index + 1}`,
      description: item.description || "No description provided",
      completed: false,
      notes: "",
    }))
  } catch (error) {
    console.warn("generateRoadmap failed:", error)

    // Fallback roadmap so goal creation can continue even if AI fails
    const fallback: RoadmapStep[] = [
      {
        id: crypto.randomUUID(),
        title: "Define success criteria",
        step: "Define success criteria",
        description: `Clarify what success looks like for '${goalTitle}'. Include measurable outcomes and a target timeline.`,
        completed: false,
        notes: "",
      },
      {
        id: crypto.randomUUID(),
        title: "Break down into tasks",
        step: "Break down into tasks",
        description: "Split the goal into smaller, time-bound tasks that build on each other.",
        completed: false,
        notes: "",
      },
      {
        id: crypto.randomUUID(),
        title: "Start and iterate",
        step: "Start and iterate",
        description: "Begin with the first task, review progress weekly, and adjust the plan as needed.",
        completed: false,
        notes: "",
      },
    ]

    return fallback
  }
}

export const generateGoalRoadmap = generateRoadmap
