"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Plus, CheckSquare, Target, Calendar, Trash2, Settings } from "lucide-react"
import type { DailyTask } from "@/lib/daily-tasks-service"
import { loadDailyTasks, saveDailyTasks, generateDailyTasks } from "@/lib/daily-tasks-service"
import { loadGoals } from "@/lib/storage"
import Link from "next/link"

export default function DailyTasksPage() {
  const [tasks, setTasks] = useState<DailyTask[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const today = new Date().toDateString()
  const { today: todayTasks } = loadDailyTasks()
  const completedTasks = todayTasks.filter((task) => task.completed)
  const pendingTasks = todayTasks.filter((task) => !task.completed)

  useEffect(() => {
    const { today: savedTasks } = loadDailyTasks()
    setTasks(savedTasks || [])
  }, [])

  const handleGenerateTasks = async () => {
    console.log("Generate tasks button clicked")

    const goals = loadGoals()
    console.log("Goals loaded:", goals.length)

    if (goals.length === 0) {
      toast({
        title: "No Goals Found",
        description: "Create some goals first to generate relevant daily tasks.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    console.log("Starting task generation...")

    try {
      const generatedTasks = await generateDailyTasks(goals)
      console.log("Generated tasks:", generatedTasks)

      // Get existing tasks and add new ones
      const { today: existingTasks, previous: previousTasks } = loadDailyTasks()
      const allTasks = [...existingTasks, ...previousTasks, ...generatedTasks]

      // Update state and save
      setTasks([...tasks, ...generatedTasks])
      saveDailyTasks(allTasks)

      toast({
        title: "Tasks Generated",
        description: `Generated ${generatedTasks.length} tasks for today.`,
      })
    } catch (error) {
      console.error("Error generating tasks:", error)
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate tasks. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAddCustomTask = () => {
    console.log("Add custom task clicked")

    if (!newTaskTitle.trim()) return

    const newTask: DailyTask = {
      id: crypto.randomUUID(),
      title: newTaskTitle.trim(),
      description: "",
      goalId: "",
      goalTitle: "Custom Task",
      priority: "medium",
      category: "creation",
      estimatedTime: 30,
      completed: false,
      createdAt: new Date().toISOString(),
    }

    const updatedTasks = [...tasks, newTask]
    setTasks(updatedTasks)

    const { previous: previousTasks } = loadDailyTasks()
    const allTasks = [...updatedTasks, ...previousTasks]
    saveDailyTasks(allTasks)

    setNewTaskTitle("")

    toast({
      title: "Task Added",
      description: "Your custom task has been added.",
    })
  }

  const handleToggleTask = (taskId: string) => {
    console.log("Toggle task:", taskId)

    const updatedTasks = tasks.map((task) =>
      task.id === taskId
        ? { ...task, completed: !task.completed, completedAt: !task.completed ? new Date().toISOString() : undefined }
        : task,
    )
    setTasks(updatedTasks)

    const { previous: previousTasks } = loadDailyTasks()
    const allTasks = [...updatedTasks, ...previousTasks]
    saveDailyTasks(allTasks)
  }

  const handleDeleteTask = (taskId: string) => {
    console.log("Delete task:", taskId)

    const updatedTasks = tasks.filter((task) => task.id !== taskId)
    setTasks(updatedTasks)

    const { previous: previousTasks } = loadDailyTasks()
    const allTasks = [...updatedTasks, ...previousTasks]
    saveDailyTasks(allTasks)

    toast({
      title: "Task Deleted",
      description: "Task has been removed.",
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container py-4 sm:py-6 max-w-4xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <CheckSquare className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-bold">Daily Tasks</h1>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground">
            Stay focused with daily tasks aligned to your goals.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg w-fit">
                  <Target className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-lg sm:text-2xl font-bold">{tasks.length}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-green-100 dark:bg-green-900/20 rounded-lg w-fit">
                  <CheckSquare className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-lg sm:text-2xl font-bold">{completedTasks.length}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Done</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg w-fit">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-lg sm:text-2xl font-bold">{pendingTasks.length}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Left</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button
              onClick={handleGenerateTasks}
              disabled={isGenerating}
              className="gap-2 w-full sm:w-auto"
              type="button"
            >
              <Target className="h-4 w-4" />
              {isGenerating ? "Generating..." : "Generate AI Tasks"}
            </Button>

            <Link href="/settings" className="w-full sm:w-auto">
              <Button variant="outline" className="gap-2 w-full bg-transparent">
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </Link>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Add a custom task..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddCustomTask()}
              className="flex-1"
            />
            <Button onClick={handleAddCustomTask} size="icon" className="shrink-0" type="button">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Tasks List */}
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
              Today's Tasks
            </CardTitle>
            <CardDescription className="text-sm">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {tasks.length === 0 ? (
              <div className="text-center py-6 sm:py-8">
                <CheckSquare className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-base sm:text-lg font-medium mb-2">No tasks for today</h3>
                <p className="text-sm text-muted-foreground mb-3 sm:mb-4">
                  Generate AI tasks or add custom ones to get started
                </p>
                <Button onClick={handleGenerateTasks} disabled={isGenerating} className="gap-2" type="button">
                  <Target className="h-4 w-4" />
                  Generate Tasks
                </Button>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-start gap-3 p-3 sm:p-4 rounded-lg border transition-colors ${
                      task.completed ? "bg-muted/50" : "bg-background"
                    }`}
                  >
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => handleToggleTask(task.id)}
                      className="mt-0.5 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-medium text-sm sm:text-base ${task.completed ? "line-through text-muted-foreground" : ""}`}
                      >
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
                      )}
                      {task.aiInsight && (
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 italic line-clamp-2">
                          💡 {task.aiInsight}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <Badge className={`${getPriorityColor(task.priority)} text-xs`} variant="secondary">
                          {task.priority}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{task.estimatedTime}min</span>
                        {task.goalTitle && task.goalTitle !== "Custom Task" && (
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                            {task.goalTitle}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-muted-foreground hover:text-destructive shrink-0 p-2"
                      type="button"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
