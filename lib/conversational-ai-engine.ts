"use server"

/**
 * Lightweight implementation that fulfils Goal-Chat’s needs.
 * – No browser APIs are touched at import-time, so it’s safe for SSR.
 * – The real AI logic can be expanded later; for now we return a short canned reply
 *   so the app builds and runs without breaking other features.
 */

import type { Goal } from "@/types/goal"

export interface ApiSettings {
  apiKey: string
  provider: "openai" | "gemini"
  model?: string
}

export interface ChatMessage {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

/**
 * Generate a conversational response for the Goal Chat modal.
 * This **stub** returns a friendly acknowledgment so the UI keeps working.
 * Replace with real AI call (OpenAI, Gemini, etc.) once the deployment stabilises.
 */
export async function generateConversationalResponse(
  goal: Goal,
  userMessage: string,
  history: ChatMessage[],
  _settings: ApiSettings,
): Promise<string> {
  // Very simple echo implementation
  const latest = userMessage.trim()

  // Demo reply – you can hook your AI provider here later
  return `Got it! You said: "${latest}". Let's keep working toward "${goal.title}".`
}
