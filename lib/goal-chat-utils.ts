"use server"

import type { Goal } from "@/types/goal"

export interface ApiSettings {
  apiKey: string
  provider?: "openai" | "gemini"
  model?: string
}

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

function buildSystemPrompt(goal: Goal): string {
  return [
    "You are an encouraging, practical goal-achievement coach.",
    `The current goal is: "${goal.title}".`,
    goal.description ? `Details: ${goal.description}.` : "",
    goal.targetDate ? `Target date: ${new Date(goal.targetDate).toLocaleDateString()}.` : "",
    "Give concise, actionable advice (2-3 sentences).",
  ]
    .filter(Boolean)
    .join(" ")
}

export async function generateConversationalResponse(
  goal: Goal,
  userMessage: string,
  chatHistory: Message[],
  apiSettings: ApiSettings,
): Promise<string> {
  if (!apiSettings?.apiKey?.trim()) throw new Error("NO_API_KEY")

  const provider = apiSettings.provider || "gemini"

  if (provider === "openai") {
    const systemPrompt = buildSystemPrompt(goal)
    const messages = [
      { role: "system", content: systemPrompt },
      ...chatHistory.map(({ role, content }) => ({ role, content })),
      { role: "user", content: userMessage },
    ]

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiSettings.apiKey}`,
      },
      body: JSON.stringify({
        model: apiSettings.model || "gpt-3.5-turbo",
        messages,
        temperature: 0.7,
        max_tokens: 400,
      }),
    })

    if (!res.ok) throw new Error(`API_${res.status}`)
    const data = await res.json()
    return data.choices?.[0]?.message?.content?.trim() ?? "Hmm… I'm not sure."
  }

  if (provider === "gemini") {
    const contextPrompt = buildSystemPrompt(goal)
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiSettings.apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { parts: [{ text: contextPrompt }], role: "user" },
            { parts: [{ text: userMessage }], role: "user" },
          ],
        }),
      },
    )

    if (!res.ok) throw new Error(`API_${res.status}`)
    const data = await res.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "Got it — let's keep going!"
  }

  throw new Error("UNSUPPORTED_PROVIDER")
}

export async function generateGoalChatResponse(
  goal: Goal,
  userMessage: string,
  chatHistory: Message[],
  apiSettings: ApiSettings,
) {
  return generateConversationalResponse(goal, userMessage, chatHistory, apiSettings)
}

export async function chatWithStep(
  goal: Goal,
  _step: unknown,
  userMessage: string,
  chatHistory: Message[],
  apiSettings: ApiSettings,
) {
  return generateConversationalResponse(goal, userMessage, chatHistory, apiSettings)
}
