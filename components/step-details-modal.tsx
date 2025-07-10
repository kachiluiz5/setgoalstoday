"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, CheckCircle, Circle, Target, Lightbulb, ArrowRight } from "lucide-react"
import type { RoadmapStep, Goal } from "@/types/goal"
import { formatDescription } from "@/lib/format-utils"

interface StepDetailsModalProps {
  step: RoadmapStep
  goal: Goal
  isOpen: boolean
  onClose: () => void
}

export function StepDetailsModal({ step, goal, isOpen, onClose }: StepDetailsModalProps) {
  const stepIndex = goal.roadmap.findIndex((s) => s.id === step.id)
  const nextStep = goal.roadmap[stepIndex + 1]
  const prevStep = goal.roadmap[stepIndex - 1]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 gap-0">
        {/* Header */}
        <DialogHeader className="p-4 sm:p-6 border-b bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                {step.completed ? (
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
                )}
                <Badge variant="outline" className="text-xs">
                  Step {stepIndex + 1} of {goal.roadmap.length}
                </Badge>
              </div>
              <DialogTitle className="text-lg sm:text-xl font-bold leading-tight">{step.title}</DialogTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Content */}
        <ScrollArea className="flex-1 p-4 sm:p-6">
          <div className="space-y-6">
            {/* Step Description */}
            {step.description && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-base">Step Details</h3>
                </div>
                <div
                  className="prose prose-sm max-w-none text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: formatDescription(step.description) }}
                />
              </div>
            )}

            {/* Progress Context */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                <h3 className="font-semibold text-base">Progress Context</h3>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Goal Progress:</span>
                  <span className="font-medium">{goal.progress}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Completed Steps:</span>
                  <span className="font-medium">
                    {goal.roadmap.filter((s) => s.completed).length} of {goal.roadmap.length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant={step.completed ? "default" : "secondary"} className="text-xs">
                    {step.completed ? "Completed" : "In Progress"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-blue-500" />
                <h3 className="font-semibold text-base">Step Navigation</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {prevStep && (
                  <div className="bg-muted/30 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Previous Step</p>
                    <p className="text-sm font-medium leading-tight">{prevStep.title}</p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {prevStep.completed ? "Completed" : "Pending"}
                    </Badge>
                  </div>
                )}
                {nextStep && (
                  <div className="bg-muted/30 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Next Step</p>
                    <p className="text-sm font-medium leading-tight">{nextStep.title}</p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {nextStep.completed ? "Completed" : "Upcoming"}
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/30 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 text-sm">💡 Pro Tips</h4>
              <ul className="text-blue-800 dark:text-blue-200 text-sm space-y-1">
                <li>• Break this step into smaller daily actions</li>
                <li>• Set a specific deadline for completion</li>
                <li>• Track your progress with notes and updates</li>
                <li>• Celebrate when you complete this step!</li>
              </ul>
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t bg-muted/20">
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">Part of "{goal.title}" goal</p>
            <Button onClick={onClose} className="text-sm">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
