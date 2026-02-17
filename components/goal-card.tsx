"use client"

import { useState } from "react"
import type { Goal } from "@/types/goal"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { GoalDetailsModal } from "@/components/goal-details-modal"
import { GoalChatModal } from "@/components/goal-chat-modal"
import { Trash2, MoreHorizontal, MessageCircle, Calendar, Target, CheckCircle2, Circle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getMonthName } from "@/lib/date-utils"
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal"
import Link from "next/link"

interface GoalCardProps {
  goal: Goal
  onUpdate: (goal: Goal) => void
  onDelete: (goalId: string) => void
}

export function GoalCard({ goal, onUpdate, onDelete }: GoalCardProps) {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isChatModalOpen, setIsChatModalOpen] = useState(false)

  const handleStepToggle = (stepId: string, completed: boolean) => {
    const updatedRoadmap = (goal.roadmap || []).map((step) => (step.id === stepId ? { ...step, completed } : step))

    const completedSteps = updatedRoadmap.filter((step) => step.completed).length
    const progress = updatedRoadmap.length > 0 ? Math.round((completedSteps / updatedRoadmap.length) * 100) : 0

    const updatedGoal = {
      ...goal,
      roadmap: updatedRoadmap,
      progress,
      updatedAt: new Date().toISOString(),
    }

    onUpdate(updatedGoal)
  }

  const handleDeleteConfirm = () => {
    onDelete(goal.id)
    setIsDeleteModalOpen(false)
  }

  const completedSteps = (goal.roadmap || []).filter((step) => step.completed).length
  const totalSteps = (goal.roadmap || []).length
  const progressColor =
    goal.progress >= 75
      ? "bg-green-500"
      : goal.progress >= 50
        ? "bg-blue-500"
        : goal.progress >= 25
          ? "bg-yellow-500"
          : "bg-gray-400"

  return (
    <>
      <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card via-card to-card/80 hover:scale-[1.02]">
        {/* Progress indicator bar at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-muted">
          <div
            className={`h-full transition-all duration-500 ${progressColor}`}
            style={{ width: `${goal.progress}%` }}
          />
        </div>

        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <CardTitle className="text-lg font-bold leading-tight group-hover:text-primary transition-colors">
                {goal.title}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 text-sm">
                <Calendar className="h-3 w-3" />
                {getMonthName(Number.parseInt(goal.month))} {goal.year}
              </CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsDetailsModalOpen(true)}>
                  <Target className="mr-2 h-4 w-4" /> View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsChatModalOpen(true)}>
                  <MessageCircle className="mr-2 h-4 w-4" /> Chat with Coach
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="text-destructive focus:text-destructive"
                  onClick={() => setIsDeleteModalOpen(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete Goal
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Progress Section */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary">{goal.progress}%</span>
                <span className="text-xs text-muted-foreground">
                  {completedSteps}/{totalSteps}
                </span>
              </div>
            </div>
            <Progress value={goal.progress} className="h-2" />
          </div>

          {/* Steps Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Recent Steps</span>
              {(goal.roadmap || []).length > 3 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-xs text-primary hover:text-primary/80"
                  onClick={() => setIsDetailsModalOpen(true)}
                >
                  View all {goal.roadmap.length} steps
                </Button>
              )}
            </div>
            <div className="space-y-2">
              {(goal.roadmap || []).slice(0, 3).map((step) => (
                <div key={step.id} className="flex items-start gap-3 group/step">
                  <Checkbox
                    id={step.id}
                    checked={step.completed}
                    onCheckedChange={(checked) => handleStepToggle(step.id, checked === true)}
                    className="mt-0.5"
                  />
                  <label
                    htmlFor={step.id}
                    className={`text-sm leading-relaxed cursor-pointer flex-1 transition-all ${
                      step.completed
                        ? "line-through text-muted-foreground"
                        : "text-foreground group-hover/step:text-primary"
                    }`}
                  >
                    {step.step || step.title}
                  </label>
                  {step.completed ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground mt-0.5 opacity-0 group-hover/step:opacity-100 transition-opacity" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-4 gap-2">
          <Link href={`/goals/${goal.id}`} className="flex-1">
            <Button
              variant="outline"
              size="sm"
              className="w-full hover:bg-primary hover:text-primary-foreground transition-colors bg-transparent"
            >
              <Target className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsChatModalOpen(true)}
            className="hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
        </CardFooter>

        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-primary/10" />
          <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full bg-primary/5" />
        </div>
      </Card>

      {isDetailsModalOpen && (
        <GoalDetailsModal goal={goal} onClose={() => setIsDetailsModalOpen(false)} onUpdate={onUpdate} />
      )}

      {isChatModalOpen && (
        <GoalChatModal
          goal={goal}
          isOpen={isChatModalOpen}
          onClose={() => setIsChatModalOpen(false)}
          onUpdateGoal={onUpdate}
        />
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Goal"
        description="Are you sure you want to delete this goal? This action cannot be undone and all progress will be lost."
      />
    </>
  )
}
