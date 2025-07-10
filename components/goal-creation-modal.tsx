"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { generateGoalRoadmap } from "@/lib/ai-utils"
import { saveGoal, loadApiSettings } from "@/lib/storage"
import { ApiSettingsModal } from "@/components/api-settings-modal"
import type { Goal } from "@/types/goal"
import { ExternalLink, Settings } from "lucide-react"
import Link from "next/link"

interface GoalCreationModalProps {
  isOpen: boolean
  onClose: () => void
  onGoalCreated: (goal: Goal) => void
}

export function GoalCreationModal({ isOpen, onClose, onGoalCreated }: GoalCreationModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [month, setMonth] = useState("")
  const [year, setYear] = useState(new Date().getFullYear().toString())
  const [category, setCategory] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [showApiSettings, setShowApiSettings] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !month) return

    // Check if API is configured
    const apiSettings = loadApiSettings()
    if (!apiSettings?.apiKey && !apiSettings?.geminiKey) {
      toast({
        title: "API Configuration Required",
        description: "Please configure your AI API key to generate goal roadmaps.",
        variant: "destructive",
      })
      setShowApiSettings(true)
      return
    }

    setIsGenerating(true)

    try {
      const roadmap = await generateGoalRoadmap(title, description)

      const newGoal: Goal = {
        id: crypto.randomUUID(),
        title: title.trim(),
        description: description.trim(),
        month,
        year,
        category: category || "Personal",
        roadmap,
        progress: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      saveGoal(newGoal)
      onGoalCreated(newGoal)

      // Reset form
      setTitle("")
      setDescription("")
      setMonth("")
      setYear(new Date().getFullYear().toString())
      setCategory("")

      onClose()

      toast({
        title: "Goal created!",
        description: "Your goal has been created with an AI-generated roadmap.",
      })
    } catch (error) {
      console.error("Error creating goal:", error)
      toast({
        title: "Error",
        description: "Failed to create goal. Please check your API settings and try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ]

  const categories = ["Personal", "Professional", "Health", "Learning", "Financial", "Creative", "Other"]

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Goal</DialogTitle>
          </DialogHeader>

          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-primary rounded-full animate-bounce delay-100"></div>
                <div className="w-3 h-3 bg-primary rounded-full animate-bounce delay-200"></div>
              </div>
              <p className="text-sm text-muted-foreground">Creating roadmap...</p>
              <p className="text-xs text-muted-foreground text-center">
                AI is generating a personalized roadmap for your goal. This may take a moment.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="text-sm font-medium">
                  Goal Title *
                </label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Learn Spanish, Run a marathon"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your goal in more detail..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Target Month *</label>
                  <Select value={month} onValueChange={setMonth} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((m) => (
                        <SelectItem key={m.value} value={m.value}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Year</label>
                  <Input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    min={new Date().getFullYear()}
                    max={new Date().getFullYear() + 10}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Category</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!title.trim() || !month}>
                  Create Goal
                </Button>
              </div>

              {/* API Configuration Help */}
              <div className="border-t pt-4 space-y-2">
                <p className="text-xs text-muted-foreground">Need to configure AI?</p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowApiSettings(true)}
                    className="gap-1"
                  >
                    <Settings className="h-3 w-3" />
                    Configure API
                  </Button>
                  <Link href="/settings" target="_blank">
                    <Button type="button" variant="outline" size="sm" className="gap-1 bg-transparent">
                      <ExternalLink className="h-3 w-3" />
                      Settings Page
                    </Button>
                  </Link>
                </div>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <ApiSettingsModal
        open={showApiSettings}
        onClose={() => setShowApiSettings(false)}
        onSave={() => setShowApiSettings(false)}
      />
    </>
  )
}
