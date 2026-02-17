"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle, Sparkles } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { GoalChatModal } from "./goal-chat-modal"
import type { Goal } from "@/types/goal"
import { loadApiSettings } from "@/lib/storage"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface GoalChatFabProps {
  goal: Goal | null
  onUpdateGoal: (goal: Goal) => void
}

export function GoalChatFab({ goal, onUpdateGoal }: GoalChatFabProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hi! I'm your AI goal coach for "${goal?.title}". I'm here to help you stay motivated, overcome challenges, and achieve your goal. How can I assist you today?`,
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  if (!goal) return null

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const apiSettings = loadApiSettings()
    if (!apiSettings?.apiKey) {
      toast({
        title: "API Key Required",
        description: "Please configure your API key in settings to use the AI coach.",
        variant: "destructive",
      })
      return
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: inputMessage.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      // Create context about the goal
      const goalContext = `
Goal: ${goal.title}
Description: ${goal.description || "No description provided"}
Progress: ${goal.progress}%
Target: ${goal.month}/${goal.year}
Roadmap Steps:
${goal.roadmap?.map((step, index) => `${index + 1}. ${step.step} ${step.completed ? "(✓ Completed)" : "(Pending)"}`).join("\n") || "No roadmap available"}
`

      const systemPrompt = `You are an AI goal coach helping someone achieve their monthly goal. Be encouraging, practical, and specific in your advice.

Current Goal Context:
${goalContext}

Guidelines:
- Be supportive and motivational
- Provide specific, actionable advice
- Help break down challenges into manageable steps
- Celebrate progress and milestones
- Ask clarifying questions when needed
- Keep responses concise but helpful
- Focus on the current goal and related challenges`

      let response
      if (apiSettings.provider === "openai") {
        response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiSettings.apiKey}`,
          },
          body: JSON.stringify({
            model: apiSettings.model || "gpt-3.5-turbo",
            messages: [
              { role: "system", content: systemPrompt },
              ...messages.map((msg) => ({
                role: msg.role,
                content: msg.content,
              })),
              { role: "user", content: inputMessage.trim() },
            ],
            temperature: 0.7,
            max_tokens: 500,
          }),
        })
      } else if (apiSettings.provider === "gemini") {
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
                  parts: [
                    {
                      text: `${systemPrompt}\n\nConversation history:\n${messages
                        .map((msg) => `${msg.role}: ${msg.content}`)
                        .join("\n")}\n\nUser: ${inputMessage.trim()}`,
                    },
                  ],
                },
              ],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 500,
              },
            }),
          },
        )
      }

      if (!response?.ok) {
        throw new Error(`API request failed: ${response?.statusText}`)
      }

      const data = await response.json()
      let content = ""

      if (apiSettings.provider === "openai") {
        content = data.choices?.[0]?.message?.content || ""
      } else if (apiSettings.provider === "gemini") {
        content = data.candidates?.[0]?.content?.parts?.[0]?.text || ""
      }

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: content || "I apologize, but I couldn't generate a response. Please try again.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: "Failed to send message. Please check your API settings and try again.",
        variant: "destructive",
      })

      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "I'm sorry, I encountered an error. Please check your API settings and try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Floating Chat Button - Positioned to not obstruct input */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 group"
        >
          <div className="relative">
            <MessageCircle className="h-6 w-6 transition-transform group-hover:scale-110" />
            <Sparkles className="h-3 w-3 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
          </div>
        </Button>
      </div>

      {/* Chat Modal */}
      <GoalChatModal isOpen={isOpen} onClose={() => setIsOpen(false)} goal={goal} onUpdateGoal={onUpdateGoal} />

      {/* Sheet Component */}
      {/* Removed for simplicity as per updates */}
    </>
  )
}
