"use server"

import type { ApiSettings } from "@/types/goal"
import { GoogleGenerativeAI } from "@google/generative-ai"
import OpenAI from "openai"

async function generateWithGemini(
  content: string,
  apiKey: string,
  type: "summary" | "insights" | "improve",
): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" })

  let prompt = ""

  switch (type) {
    case "summary":
      prompt = `Please provide a concise summary of the following note content in 2-3 sentences:

${content}

Summary:`
      break
    case "insights":
      prompt = `Analyze the following note content and provide 3-5 key insights, actionable items, or important points:

${content}

Provide insights as a JSON array of strings:
["insight 1", "insight 2", "insight 3"]`
      break
    case "improve":
      prompt = `Please improve and enhance the following note content while maintaining its original meaning. Make it clearer, more organized, and better structured:

${content}

Improved version:`
      break
  }

  const result = await model.generateContent(prompt)
  const response = await result.response
  return response.text()
}

async function generateWithOpenAI(
  content: string,
  apiKey: string,
  type: "summary" | "insights" | "improve",
): Promise<string> {
  const openai = new OpenAI({ apiKey })

  let prompt = ""
  let systemPrompt = ""

  switch (type) {
    case "summary":
      systemPrompt = "You are a helpful assistant that creates concise summaries."
      prompt = `Please provide a concise summary of the following note content in 2-3 sentences:\n\n${content}`
      break
    case "insights":
      systemPrompt = "You are a helpful assistant that extracts key insights from text. Always respond with valid JSON."
      prompt = `Analyze the following note content and provide 3-5 key insights, actionable items, or important points as a JSON array of strings:\n\n${content}`
      break
    case "improve":
      systemPrompt = "You are a helpful assistant that improves and enhances written content."
      prompt = `Please improve and enhance the following note content while maintaining its original meaning. Make it clearer, more organized, and better structured:\n\n${content}`
      break
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 1000,
  })

  return completion.choices[0]?.message?.content || ""
}

export async function generateNoteSummary(content: string, apiSettings?: ApiSettings): Promise<string> {
  if (!apiSettings || !apiSettings.apiKey) {
    throw new Error("NO_API_KEY")
  }

  try {
    if (apiSettings.provider === "gemini") {
      return await generateWithGemini(content, apiSettings.apiKey, "summary")
    } else if (apiSettings.provider === "openai") {
      return await generateWithOpenAI(content, apiSettings.apiKey, "summary")
    } else {
      throw new Error("UNSUPPORTED_PROVIDER")
    }
  } catch (error) {
    console.error("Error generating note summary:", error)
    throw error
  }
}

export async function generateNoteInsights(content: string, apiSettings?: ApiSettings): Promise<string[]> {
  if (!apiSettings || !apiSettings.apiKey) {
    throw new Error("NO_API_KEY")
  }

  try {
    let result: string

    if (apiSettings.provider === "gemini") {
      result = await generateWithGemini(content, apiSettings.apiKey, "insights")
    } else if (apiSettings.provider === "openai") {
      result = await generateWithOpenAI(content, apiSettings.apiKey, "insights")
    } else {
      throw new Error("UNSUPPORTED_PROVIDER")
    }

    // Try to parse JSON response
    try {
      const jsonMatch = result.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
    } catch (parseError) {
      // If JSON parsing fails, split by lines and clean up
      return result
        .split("\n")
        .filter((line) => line.trim().length > 0)
        .map((line) => line.replace(/^[-•*]\s*/, "").trim())
        .slice(0, 5)
    }

    return []
  } catch (error) {
    console.error("Error generating note insights:", error)
    throw error
  }
}

export async function improveNoteContent(content: string, apiSettings?: ApiSettings): Promise<string> {
  if (!apiSettings || !apiSettings.apiKey) {
    throw new Error("NO_API_KEY")
  }

  try {
    if (apiSettings.provider === "gemini") {
      return await generateWithGemini(content, apiSettings.apiKey, "improve")
    } else if (apiSettings.provider === "openai") {
      return await generateWithOpenAI(content, apiSettings.apiKey, "improve")
    } else {
      throw new Error("UNSUPPORTED_PROVIDER")
    }
  } catch (error) {
    console.error("Error improving note content:", error)
    throw error
  }
}
