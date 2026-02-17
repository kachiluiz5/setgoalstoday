"use server"

import type { RoadmapStep } from "@/types/goal"
import type { ApiSettings } from "@/lib/storage"

export async function generateAdvancedRoadmap(
  goalTitle: string,
  goalDescription: string,
  apiSettings: ApiSettings,
): Promise<RoadmapStep[]> {
  const prompt = `Create a detailed roadmap for achieving this goal:

Title: ${goalTitle}
Description: ${goalDescription}

Please provide 5-8 actionable steps that are:
1. Specific and measurable
2. Realistic and achievable
3. Time-bound when appropriate
4. Progressive (building on each other)

Return ONLY a valid JSON array with this exact structure:
[
  {
    "step": "Step title (brief, actionable)",
    "description": "Detailed explanation of what needs to be done, why it's important, and how to approach it"
  }
]

Do not include any other text, explanations, or formatting. Just the JSON array.`

  let response = ""

  try {
    if (apiSettings.openaiKey) {
      const apiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiSettings.openaiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "You are an expert goal-setting coach. Return only valid JSON arrays as requested.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 1500,
        }),
      })

        if (!apiResponse.ok) {
          const errorText = await apiResponse.text()
          console.warn(`OpenAI API error: ${apiResponse.status} - ${errorText}`)
          throw new Error(`OpenAI API error: ${apiResponse.status} - ${errorText}`)
      }

      const data = await apiResponse.json()
      response = data.choices[0]?.message?.content || ""
    } else if (apiSettings.geminiKey) {
      const apiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiSettings.geminiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1500,
            },
          }),
        },
      )

        if (!apiResponse.ok) {
          const errorText = await apiResponse.text()
          console.warn(`Gemini API error: ${apiResponse.status} - ${errorText}`)
          throw new Error(`Gemini API error: ${apiResponse.status} - ${errorText}`)
      }

      const data = await apiResponse.json()
      response = data.candidates?.[0]?.content?.parts?.[0]?.text || ""
    } else if (apiSettings.anthropicKey) {
      const apiResponse = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiSettings.anthropicKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-sonnet-20240229",
          max_tokens: 1500,
          messages: [{ role: "user", content: prompt }],
        }),
      })

        if (!apiResponse.ok) {
          const errorText = await apiResponse.text()
          console.warn(`Anthropic API error: ${apiResponse.status} - ${errorText}`)
          throw new Error(`Anthropic API error: ${apiResponse.status} - ${errorText}`)
      }

      const data = await apiResponse.json()
      response = data.content?.[0]?.text || ""
    } else {
      throw new Error("UNSUPPORTED_PROVIDER")
    }

    if (!response.trim()) {
      throw new Error("Empty response from AI")
    }

    // Clean the response to extract JSON
    let cleanedResponse = response.trim()

    // Remove any markdown code blocks
    cleanedResponse = cleanedResponse.replace(/```json\s*/g, "").replace(/```\s*/g, "")

    // Find the JSON array in the response
    const jsonStart = cleanedResponse.indexOf("[")
    const jsonEnd = cleanedResponse.lastIndexOf("]")

    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("No JSON array found in response")
    }

    cleanedResponse = cleanedResponse.substring(jsonStart, jsonEnd + 1)

    let parsedSteps: Array<{ step: string; description: string }>
    try {
      parsedSteps = JSON.parse(cleanedResponse)
    } catch (parseError) {
      console.error("JSON parse error:", parseError)
      console.error("Response was:", cleanedResponse)
      throw new Error(`Advanced AI roadmap generation failed: ${parseError}`)
    }

    if (!Array.isArray(parsedSteps)) {
      throw new Error("Response is not an array")
    }

    // Convert to our roadmap format
    const roadmap: RoadmapStep[] = parsedSteps.map((step, index) => ({
      id: crypto.randomUUID(),
      title: step.step || `Step ${index + 1}`,
      step: step.step || `Step ${index + 1}`,
      description: step.description || "No description provided",
      completed: false,
      notes: "",
    }))

    if (roadmap.length === 0) {
      throw new Error("No valid steps generated")
    }

    return roadmap
  } catch (error) {
      console.warn("Advanced AI roadmap generation failed:", error)

    // Fallback: return a minimal, safe roadmap so goal creation can continue
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
