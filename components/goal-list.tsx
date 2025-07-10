"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GoalCard } from "@/components/goal-card"
import type { Goal } from "@/types/goal"
import { getMonthName } from "@/lib/date-utils"

interface GoalListProps {
  goals: Goal[]
  onUpdateGoal: (goal: Goal) => void
  onDeleteGoal: (goalId: string) => void
}

export function GoalList({ goals, onUpdateGoal, onDeleteGoal }: GoalListProps) {
  const [activeTab, setActiveTab] = useState("active")

  // Group goals by month and year
  const groupedGoals = goals.reduce(
    (acc, goal) => {
      const key = `${goal.year}-${goal.month.padStart(2, "0")}`
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(goal)
      return acc
    },
    {} as Record<string, Goal[]>,
  )

  // Sort months chronologically (most recent first)
  const sortedMonths = Object.keys(groupedGoals).sort((a, b) => b.localeCompare(a))

  const filterGoals = (goals: Goal[]) => {
    const now = new Date()
    const currentMonth = now.getMonth() + 1
    const currentYear = now.getFullYear()

    switch (activeTab) {
      case "active":
        return goals.filter((goal) => {
          const goalMonth = Number.parseInt(goal.month)
          const goalYear = Number.parseInt(goal.year)
          return (
            goal.progress < 100 && (goalYear > currentYear || (goalYear === currentYear && goalMonth >= currentMonth))
          )
        })
      case "completed":
        return goals.filter((goal) => goal.progress === 100)
      case "overdue":
        return goals.filter((goal) => {
          const goalMonth = Number.parseInt(goal.month)
          const goalYear = Number.parseInt(goal.year)
          return (
            goal.progress < 100 && (goalYear < currentYear || (goalYear === currentYear && goalMonth < currentMonth))
          )
        })
      default:
        return goals
    }
  }

  const getTabCounts = () => {
    const now = new Date()
    const currentMonth = now.getMonth() + 1
    const currentYear = now.getFullYear()

    const active = goals.filter((goal) => {
      const goalMonth = Number.parseInt(goal.month)
      const goalYear = Number.parseInt(goal.year)
      return goal.progress < 100 && (goalYear > currentYear || (goalYear === currentYear && goalMonth >= currentMonth))
    }).length

    const completed = goals.filter((goal) => goal.progress === 100).length

    const overdue = goals.filter((goal) => {
      const goalMonth = Number.parseInt(goal.month)
      const goalYear = Number.parseInt(goal.year)
      return goal.progress < 100 && (goalYear < currentYear || (goalYear === currentYear && goalMonth < currentMonth))
    }).length

    return { active, completed, overdue }
  }

  const counts = getTabCounts()

  if (goals.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
          <svg
            className="w-12 h-12 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">No goals yet</h3>
        <p className="text-muted-foreground mb-4">Create your first goal to get started on your journey!</p>
      </div>
    )
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="active" className="relative">
          Active
          {counts.active > 0 && (
            <span className="ml-2 bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">{counts.active}</span>
          )}
        </TabsTrigger>
        <TabsTrigger value="completed" className="relative">
          Completed
          {counts.completed > 0 && (
            <span className="ml-2 bg-green-500 text-white text-xs rounded-full px-2 py-0.5">{counts.completed}</span>
          )}
        </TabsTrigger>
        <TabsTrigger value="overdue" className="relative">
          Overdue
          {counts.overdue > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">{counts.overdue}</span>
          )}
        </TabsTrigger>
      </TabsList>

      <TabsContent value={activeTab} className="mt-6">
        {sortedMonths.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No goals found for this category.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {sortedMonths.map((monthKey) => {
              const monthGoals = groupedGoals[monthKey]
              const filteredGoals = filterGoals(monthGoals)

              if (filteredGoals.length === 0) return null

              const [year, month] = monthKey.split("-")
              const monthName = getMonthName(Number.parseInt(month))

              return (
                <div key={monthKey}>
                  <div className="flex items-center gap-3 mb-4">
                    <h2 className="text-xl font-semibold">
                      {monthName} {year}
                    </h2>
                    <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
                      {filteredGoals.length} goal{filteredGoals.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredGoals.map((goal) => (
                      <GoalCard key={goal.id} goal={goal} onUpdate={onUpdateGoal} onDelete={onDeleteGoal} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}
