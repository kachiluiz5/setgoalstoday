"use client"

import type { Goal } from "@/types/goal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

interface GoalAnalyticsProps {
  goal: Goal
}

export function GoalAnalytics({ goal }: GoalAnalyticsProps) {
  // Calculate completed vs remaining steps
  const completedSteps = (goal.roadmap || []).filter((step) => step.completed).length
  const remainingSteps = (goal.roadmap || []).length - completedSteps

  const pieData = [
    { name: "Completed", value: completedSteps, color: "hsl(var(--chart-2))" },
    { name: "Remaining", value: remainingSteps, color: "hsl(var(--muted))" },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Goal Progress</CardTitle>
            <CardDescription>
            {completedSteps} of {(goal.roadmap || []).length} steps completed ({goal.progress}%)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={0} outerRadius={60} paddingAngle={0} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Simple legend instead of recharts legend */}
          <div className="flex justify-center gap-6 mt-2">
            {pieData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                <span className="text-xs">
                  {entry.name}: {Math.round(((entry.value || 0) / ((goal.roadmap || []).length || 1)) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
