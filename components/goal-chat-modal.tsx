"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { Goal } from "@/types/goal"
import { loadApiSettings } from "@/lib/storage"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface GoalChatModalProps {
  goal: Goal | null
  isOpen: boolean
  onClose: () => void
  onUpdateGoal: (goal: Goal) => void
}

export function GoalChatModal({ goal, isOpen, onClose, onUpdateGoal }: GoalChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Initialize chat when goal becomes available
  useEffect(() => {
    if (goal && !isInitialized) {
      const welcomeMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: `Hi! I'm your AI goal coach for "${goal.title}". I'm here to help you stay motivated, overcome challenges, and achieve your goal. How can I assist you today?`,
        timestamp: new Date(),
      }
      setMessages([welcomeMessage])
      setIsInitialized(true)
    }
  }, [goal, isInitialized])

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !goal) return

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
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiSettings.apiKey}`,
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

  // Don't render anything if modal is closed or goal is null
  if (!isOpen || !goal) {
    return null
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-[60]" onClick={onClose} />

      {/* Sidebar Modal - Higher z-index than FAB */}
      <div className="fixed inset-y-0 right-0 w-[90%] max-w-2xl bg-background border-l shadow-xl z-[70] rounded-l-xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b rounded-tl-xl bg-background">
          <div className="flex items-center gap-2 mb-2">
            <Bot className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">AI Goal Coach</h2>
          </div>
          <p className="text-sm text-muted-foreground">Get personalized advice for: {goal.title}</p>
        </div>

        {/* Messages */}
        <div className="flex-1 flex flex-col min-h-0">
          <ScrollArea ref={scrollAreaRef} className="flex-1 px-6">
            <div className="space-y-4 py-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="bg-primary/10">
                        <Bot className="h-4 w-4 text-primary" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground ml-auto"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {message.role === "user" && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="bg-secondary">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className="bg-primary/10">
                      <Bot className="h-4 w-4 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg px-3 py-2 text-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input - Made wider with better spacing */}
          <div className="border-t p-6 rounded-bl-xl bg-background">
            <div className="flex gap-3">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask your AI coach anything..."
                disabled={isLoading}
                className="flex-1 min-w-0"
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                size="icon"
                className="flex-shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Press Enter to send, Shift+Enter for new line</p>
          </div>
        </div>
      </div>
    </>
  )
}
