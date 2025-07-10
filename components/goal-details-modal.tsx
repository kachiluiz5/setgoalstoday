"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { StepChatModal } from "@/components/step-chat-modal"
import { MessageCircle } from "lucide-react"
import Link from "next/link"
import { formatDescription } from "@/lib/format-utils"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import type { Goal, RoadmapStep } from "@/types/goal"
import { getMonthName } from "@/lib/date-utils"

interface GoalDetailsModalProps {
  goal: Goal | null
  open: boolean
  onClose: () => void
  onUpdate: (goal: Goal) => void
}

export function GoalDetailsModal({ goal, open, onClose, onUpdate }: GoalDetailsModalProps) {
  const [editingStep, setEditingStep] = useState<string | null>(null)
  const [newStepTitle, setNewStepTitle] = useState("")
  const [newStepDescription, setNewStepDescription] = useState("")
  const [isAddingStep, setIsAddingStep] = useState(false)
  const [editStepTitle, setEditStepTitle] = useState("")
  const [editStepDescription, setEditStepDescription] = useState("")
  const { toast } = useToast()
  const [chatStep, setChatStep] = useState<any>(null)

  if (!goal) return null

  const completedSteps = goal.roadmap.filter((step) => step.completed).length
  const totalSteps = goal.roadmap.length
  const progressPercentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0

  const handleStepToggle = (stepId: string, completed: boolean) => {
    const updatedRoadmap = goal.roadmap.map((step) => (step.id === stepId ? { ...step, completed } : step))

    const completedSteps = updatedRoadmap.filter((step) => step.completed).length
    const progress = Math.round((completedSteps / updatedRoadmap.length) * 100)

    const updatedGoal = {
      ...goal,
      roadmap: updatedRoadmap,
      progress,
      updatedAt: new Date().toISOString(),
    }

    onUpdate(updatedGoal)
  }

  const handleAddStep = () => {
    if (!newStepTitle.trim()) return

    const newStep: RoadmapStep = {
      id: Date.now().toString(),
      step: newStepTitle.trim(),
      description: newStepDescription.trim(),
      completed: false,
    }

    const updatedGoal = {
      ...goal,
      roadmap: [...goal.roadmap, newStep],
      updatedAt: new Date().toISOString(),
    }

    onUpdate(updatedGoal)
    setNewStepTitle("")
    setNewStepDescription("")
    setIsAddingStep(false)
    toast({
      title: "Step added",
      description: "New step has been added to your goal roadmap.",
    })
  }

  const handleDeleteStep = (stepId: string) => {
    const updatedRoadmap = goal.roadmap.filter((step) => step.id !== stepId)
    const updatedGoal = {
      ...goal,
      roadmap: updatedRoadmap,
      updatedAt: new Date().toISOString(),
    }

    onUpdate(updatedGoal)
    toast({
      title: "Step deleted",
      description: "Step has been removed from your goal roadmap.",
    })
  }

  const handleEditStep = (stepId: string) => {
    const step = goal.roadmap.find((step) => step.id === stepId)
    if (step) {
      setEditStepTitle(step.step || step.title || "")
      setEditStepDescription(step.description || "")
      setEditingStep(stepId)
    }
  }

  const handleSaveEdit = (stepId: string) => {
    const updatedRoadmap = goal.roadmap.map((step) =>
      step.id === stepId
        ? {
            ...step,
            step: editStepTitle.trim(),
            title: editStepTitle.trim(),
            description: editStepDescription.trim(),
          }
        : step,
    )

    const updatedGoal = {
      ...goal,
      roadmap: updatedRoadmap,
      updatedAt: new Date().toISOString(),
    }

    onUpdate(updatedGoal)
    setEditingStep(null)
    setEditStepTitle("")
    setEditStepDescription("")
    toast({
      title: "Step updated",
      description: "Step has been updated successfully.",
    })
  }

  const handleCancelEdit = () => {
    setEditingStep(null)
    setEditStepTitle("")
    setEditStepDescription("")
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(goal.roadmap)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    const updatedGoal = {
      ...goal,
      roadmap: items,
      updatedAt: new Date().toISOString(),
    }

    onUpdate(updatedGoal)
    toast({
      title: "Steps reordered",
      description: "Goal roadmap has been reordered successfully.",
    })
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">{goal.title}</DialogTitle>
            <p className="text-sm text-muted-foreground">
              {getMonthName(Number.parseInt(goal.month))} {goal.year}
            </p>
          </DialogHeader>

          <div className="space-y-6">
            {/* Goal Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold">
                    {getMonthName(Number(goal.month))} {goal.year}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>
                        {completedSteps} of {totalSteps} steps
                      </span>
                      <span>{progressPercentage}%</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant={progressPercentage === 100 ? "default" : "secondary"}>
                    {progressPercentage === 100 ? "Completed" : "In Progress"}
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {/* Description */}
            {goal.description && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{goal.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Roadmap */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Roadmap</CardTitle>
                  <Button onClick={() => setIsAddingStep(true)} size="sm" className="gap-2">
                    Add Step
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="roadmap">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                        {goal.roadmap.map((step, index) => (
                          <Draggable key={step.id} draggableId={step.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`flex items-start gap-3 p-3 rounded-lg border ${
                                  snapshot.isDragging ? "shadow-lg" : ""
                                } ${step.completed ? "bg-green-50 dark:bg-green-950/20" : "bg-background"}`}
                              >
                                <div {...provided.dragHandleProps} className="mt-1">
                                  {/* Drag handle icon */}
                                </div>

                                <Checkbox
                                  id={`detail-${step.id}`}
                                  checked={step.completed}
                                  onCheckedChange={(checked) => handleStepToggle(step.id, checked === true)}
                                  className="mt-0.5"
                                />

                                <div className="flex-1 min-w-0">
                                  {editingStep === step.id ? (
                                    <div className="space-y-2">
                                      <Input
                                        value={editStepTitle}
                                        onChange={(e) => setEditStepTitle(e.target.value)}
                                        placeholder="Step title"
                                        className="font-medium"
                                      />
                                      <Textarea
                                        value={editStepDescription}
                                        onChange={(e) => setEditStepDescription(e.target.value)}
                                        placeholder="Step description (optional)"
                                        rows={2}
                                      />
                                      <div className="flex gap-2">
                                        <Button size="sm" onClick={() => handleSaveEdit(step.id)} className="gap-1">
                                          Save
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={handleCancelEdit}
                                          className="gap-1 bg-transparent"
                                        >
                                          Cancel
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <>
                                      <h4
                                        className={`font-medium ${
                                          step.completed ? "line-through text-muted-foreground" : ""
                                        }`}
                                      >
                                        {step.step || step.title}
                                      </h4>
                                      {step.description && (
                                        <div
                                          className={`text-sm mt-1 ${
                                            step.completed
                                              ? "line-through text-muted-foreground"
                                              : "text-muted-foreground"
                                          }`}
                                          dangerouslySetInnerHTML={{ __html: formatDescription(step.description) }}
                                        />
                                      )}
                                    </>
                                  )}
                                </div>

                                {editingStep !== step.id && (
                                  <div className="flex gap-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleEditStep(step.id)}
                                      className="p-1 h-auto"
                                    >
                                      {/* Edit icon */}
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteStep(step.id)}
                                      className="p-1 h-auto text-destructive hover:text-destructive"
                                    >
                                      {/* Delete icon */}
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6"
                                      onClick={() => setChatStep(step)}
                                    >
                                      <MessageCircle className="h-3 w-3" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>

                {/* Add New Step Form */}
                {isAddingStep && (
                  <div className="p-3 border rounded-lg bg-muted/50 space-y-3">
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
                      <Button onClick={handleAddStep} size="sm" className="gap-1">
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
              </CardContent>
            </Card>
          </div>
          <div className="flex justify-center mt-4">
            <Link href={`/goals/${goal.id}`}>
              <Button variant="outline" size="sm">
                Open Full View
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>

      {chatStep && <StepChatModal goal={goal} step={chatStep} isOpen={!!chatStep} onClose={() => setChatStep(null)} />}
    </>
  )
}
