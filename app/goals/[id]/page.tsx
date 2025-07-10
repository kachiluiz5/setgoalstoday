"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useToast } from "@/components/ui/use-toast"
import {
  ArrowLeft,
  Calendar,
  Target,
  TrendingUp,
  Download,
  FileText,
  ChevronDown,
  ChevronRight,
  GripVertical,
  Plus,
  Save,
  X,
} from "lucide-react"
import type { Goal, Step } from "@/types/goal"
import { loadGoals, saveGoals } from "@/lib/storage"
import { getMonthName } from "@/lib/date-utils"
import { GoalChatFab } from "@/components/goal-chat-fab"
import { downloadGoalAsText, downloadGoalAsPDF } from "@/lib/export-utils"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"

export default function GoalPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [goal, setGoal] = useState<Goal | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set())
  const [editingNotes, setEditingNotes] = useState<Set<string>>(new Set())
  const [noteValues, setNoteValues] = useState<Record<string, string>>({})
  const [isAddingStep, setIsAddingStep] = useState(false)
  const [newStepTitle, setNewStepTitle] = useState("")
  const [newStepDescription, setNewStepDescription] = useState("")

  useEffect(() => {
    const goalId = params.id as string
    if (!goalId) return

    const goals = loadGoals()
    const foundGoal = goals.find((g) => g.id === goalId)

    if (!foundGoal) {
      toast({
        title: "Goal not found",
        description: "The requested goal could not be found.",
        variant: "destructive",
      })
      router.push("/dashboard")
      return
    }

    setGoal(foundGoal)

    // Initialize note values
    const initialNotes: Record<string, string> = {}
    foundGoal.roadmap.forEach((step: Step, index) => {
      const stepId = step.id || index.toString()
      initialNotes[stepId] = step.notes || ""
    })
    setNoteValues(initialNotes)

    setLoading(false)
  }, [params.id, router, toast])

  const handleStepToggle = (stepIndex: number) => {
    if (!goal) return

    const updatedRoadmap = goal.roadmap.map((step: Step, index) =>
      index === stepIndex ? { ...step, completed: !step.completed } : step,
    )

    const completedSteps = updatedRoadmap.filter((step) => step.completed).length
    const totalSteps = updatedRoadmap.length
    const newProgress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0

    const updatedGoal = {
      ...goal,
      roadmap: updatedRoadmap,
      progress: newProgress,
      updatedAt: new Date().toISOString(),
    }

    setGoal(updatedGoal)

    // Save to storage
    const goals = loadGoals()
    const updatedGoals = goals.map((g) => (g.id === goal.id ? updatedGoal : g))
    saveGoals(updatedGoals)

    toast({
      title: updatedRoadmap[stepIndex].completed ? "Step completed!" : "Step unmarked",
      description: `Progress updated to ${newProgress}%`,
    })
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !goal) return

    const items = Array.from(goal.roadmap)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    const updatedGoal = {
      ...goal,
      roadmap: items,
      updatedAt: new Date().toISOString(),
    }

    setGoal(updatedGoal)

    // Save to storage
    const goals = loadGoals()
    const updatedGoals = goals.map((g) => (g.id === goal.id ? updatedGoal : g))
    saveGoals(updatedGoals)

    toast({
      title: "Steps reordered",
      description: "Goal roadmap has been reordered successfully.",
    })
  }

  const toggleStepExpansion = (stepId: string) => {
    const newExpanded = new Set(expandedSteps)
    if (newExpanded.has(stepId)) {
      newExpanded.delete(stepId)
    } else {
      newExpanded.add(stepId)
    }
    setExpandedSteps(newExpanded)
  }

  const handleNoteEdit = (stepId: string) => {
    const newEditing = new Set(editingNotes)
    newEditing.add(stepId)
    setEditingNotes(newEditing)
  }

  const handleNoteSave = (stepId: string, stepIndex: number) => {
    if (!goal) return

    const updatedRoadmap = goal.roadmap.map((step: Step, index) =>
      index === stepIndex ? { ...step, notes: noteValues[stepId] || "" } : step,
    )

    const updatedGoal = {
      ...goal,
      roadmap: updatedRoadmap,
      updatedAt: new Date().toISOString(),
    }

    setGoal(updatedGoal)

    // Save to storage
    const goals = loadGoals()
    const updatedGoals = goals.map((g) => (g.id === goal.id ? updatedGoal : g))
    saveGoals(updatedGoals)

    const newEditing = new Set(editingNotes)
    newEditing.delete(stepId)
    setEditingNotes(newEditing)

    toast({
      title: "Note saved",
      description: "Your note has been saved successfully.",
    })
  }

  const handleNoteCancel = (stepId: string, originalNote: string) => {
    setNoteValues((prev) => ({ ...prev, [stepId]: originalNote }))
    const newEditing = new Set(editingNotes)
    newEditing.delete(stepId)
    setEditingNotes(newEditing)
  }

  const handleAddCustomStep = () => {
    if (!goal || !newStepTitle.trim()) return

    const newStep: Step = {
      id: crypto.randomUUID(),
      step: newStepTitle.trim(),
      title: newStepTitle.trim(),
      description: newStepDescription.trim() || "",
      completed: false,
      notes: "",
    }

    const updatedGoal = {
      ...goal,
      roadmap: [...goal.roadmap, newStep],
      updatedAt: new Date().toISOString(),
    }

    setGoal(updatedGoal)

    // Initialize note value for new step
    setNoteValues((prev) => ({ ...prev, [newStep.id]: "" }))

    // Save to storage
    const goals = loadGoals()
    const updatedGoals = goals.map((g) => (g.id === goal.id ? updatedGoal : g))
    saveGoals(updatedGoals)

    // Reset form
    setNewStepTitle("")
    setNewStepDescription("")
    setIsAddingStep(false)

    toast({
      title: "Step added",
      description: "Custom step has been added to your roadmap.",
    })
  }

  const handleExportText = () => {
    if (!goal) return
    downloadGoalAsText(goal)
    toast({
      title: "Export successful",
      description: "Goal exported as text file",
    })
  }

  const handleExportPDF = async () => {
    if (!goal) return
    try {
      await downloadGoalAsPDF(goal, null)
      toast({
        title: "Export successful",
        description: "Goal exported as PDF file",
      })
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Could not export goal as PDF",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container py-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </main>
      </div>
    )
  }

  if (!goal) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Goal not found</h1>
            <Button onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </main>
      </div>
    )
  }

  const completedSteps = goal.roadmap.filter((step) => step.completed).length
  const totalSteps = goal.roadmap.length

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => router.push("/dashboard")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Goals
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportText} size="sm" className="gap-2 bg-transparent">
              <FileText className="h-4 w-4" />
              Export Text
            </Button>
            <Button variant="outline" onClick={handleExportPDF} size="sm" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Goal Overview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Target className="h-6 w-6 text-primary" />
                    {goal.title}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {getMonthName(Number(goal.month))} {goal.year}
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      {goal.progress}% Complete
                    </div>
                  </div>
                </div>
                <Badge variant={goal.progress === 100 ? "default" : "secondary"}>
                  {goal.progress === 100 ? "Completed" : "In Progress"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {goal.description && (
                <>
                  <div>
                    <h3 className="font-medium mb-2">Description</h3>
                    <p className="text-muted-foreground">{goal.description}</p>
                  </div>
                  <Separator />
                </>
              )}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>
                    {completedSteps} of {totalSteps} steps completed
                  </span>
                </div>
                <Progress value={goal.progress} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Roadmap */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Roadmap</CardTitle>
                <Button onClick={() => setIsAddingStep(true)} size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Step
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Add Custom Step Form */}
                {isAddingStep && (
                  <div className="p-4 border rounded-lg bg-muted/50 space-y-3">
                    <Input
                      value={newStepTitle}
                      onChange={(e) => setNewStepTitle(e.target.value)}
                      placeholder="Enter step title"
                      className="font-medium"
                    />
                    <Textarea
                      value={newStepDescription}
                      onChange={(e) => setNewStepDescription(e.target.value)}
                      placeholder="Enter step description (optional)"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleAddCustomStep} size="sm" className="gap-1">
                        <Plus className="h-4 w-4" />
                        Add Step
                      </Button>
                      <Button
                        onClick={() => {
                          setIsAddingStep(false)
                          setNewStepTitle("")
                          setNewStepDescription("")
                        }}
                        variant="outline"
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="roadmap">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                        {goal.roadmap.map((step: Step, index) => {
                          const stepId = step.id || index.toString()
                          const isExpanded = expandedSteps.has(stepId)
                          const isEditingNote = editingNotes.has(stepId)

                          return (
                            <Draggable key={stepId} draggableId={stepId} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={`border rounded-lg transition-colors ${
                                    snapshot.isDragging ? "shadow-lg" : ""
                                  } ${step.completed ? "bg-green-50 dark:bg-green-950/20" : "hover:bg-muted/50"}`}
                                >
                                  <Collapsible open={isExpanded} onOpenChange={() => toggleStepExpansion(stepId)}>
                                    <div className="flex items-center gap-3 p-3">
                                      <div {...provided.dragHandleProps} className="cursor-grab">
                                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                                      </div>

                                      <Checkbox
                                        checked={step.completed}
                                        onCheckedChange={() => handleStepToggle(index)}
                                        className="mt-0.5"
                                      />

                                      <div className="flex-1 min-w-0">
                                        <h4
                                          className={`font-medium ${step.completed ? "line-through text-muted-foreground" : ""}`}
                                        >
                                          {step.step || step.title}
                                        </h4>
                                      </div>

                                      <CollapsibleTrigger asChild>
                                        <Button variant="ghost" size="sm" className="p-1">
                                          {isExpanded ? (
                                            <ChevronDown className="h-4 w-4" />
                                          ) : (
                                            <ChevronRight className="h-4 w-4" />
                                          )}
                                        </Button>
                                      </CollapsibleTrigger>
                                    </div>

                                    <CollapsibleContent>
                                      <div className="px-3 pb-3 ml-10 space-y-3">
                                        {/* Description */}
                                        {step.description && (
                                          <div className="bg-muted/50 rounded p-3">
                                            <h5 className="text-sm font-medium mb-2">Description</h5>
                                            <p
                                              className={`text-sm ${step.completed ? "line-through text-muted-foreground" : "text-muted-foreground"}`}
                                            >
                                              {step.description}
                                            </p>
                                          </div>
                                        )}

                                        {/* Notes Section */}
                                        <div className="bg-blue-50 dark:bg-blue-950/20 rounded p-3">
                                          <div className="flex items-center justify-between mb-2">
                                            <h5 className="text-sm font-medium">Notes</h5>
                                            {!isEditingNote && (
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleNoteEdit(stepId)}
                                                className="h-6 px-2 text-xs"
                                              >
                                                {step.notes ? "Edit" : "Add Note"}
                                              </Button>
                                            )}
                                          </div>

                                          {isEditingNote ? (
                                            <div className="space-y-2">
                                              <Textarea
                                                value={noteValues[stepId] || ""}
                                                onChange={(e) =>
                                                  setNoteValues((prev) => ({ ...prev, [stepId]: e.target.value }))
                                                }
                                                placeholder="Add your notes here..."
                                                rows={3}
                                                className="text-sm"
                                              />
                                              <div className="flex gap-2">
                                                <Button
                                                  size="sm"
                                                  onClick={() => handleNoteSave(stepId, index)}
                                                  className="h-7 px-3 text-xs gap-1"
                                                >
                                                  <Save className="h-3 w-3" />
                                                  Save
                                                </Button>
                                                <Button
                                                  size="sm"
                                                  variant="outline"
                                                  onClick={() => handleNoteCancel(stepId, step.notes || "")}
                                                  className="h-7 px-3 text-xs gap-1"
                                                >
                                                  <X className="h-3 w-3" />
                                                  Cancel
                                                </Button>
                                              </div>
                                            </div>
                                          ) : (
                                            <p className="text-sm text-muted-foreground">
                                              {step.notes || "No notes added yet. Click 'Add Note' to get started."}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    </CollapsibleContent>
                                  </Collapsible>
                                </div>
                              )}
                            </Draggable>
                          )
                        })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Goal Chat FAB */}
        <GoalChatFab goal={goal} onUpdateGoal={setGoal} />
      </main>
    </div>
  )
}
