"use client"

import type { Goal } from "@/types/goal"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface GoalCalendarProps {
  goal: Goal
  onUpdateGoal: (goal: Goal) => void
}

export function GoalCalendar({ goal, onUpdateGoal }: GoalCalendarProps) {
  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Coming Soon</AlertTitle>
        <AlertDescription>
          Calendar tracking for your goals will be available in the next update. Stay tuned!
        </AlertDescription>
      </Alert>
    </div>
  )
}
