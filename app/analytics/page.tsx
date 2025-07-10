"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { loadGoals } from "@/lib/storage"
import { getMonthName } from "@/lib/date-utils"
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { Trophy, TrendingUp, Calendar, Target } from "lucide-react"

export default function AnalyticsPage() {
  const [goals, setGoals] = useState<any[]>([])
  const [completionData, setCompletionData] = useState<any[]>([])
  const [monthlyData, setMonthlyData] = useState<any[]>([])
  const [categoryData, setCategoryData] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalGoals: 0,
    completionRate: 0,
    avgProgress: 0,
    activeGoals: 0,
  })

  useEffect(() => {
    const savedGoals = loadGoals()
    setGoals(savedGoals)

    // Calculate stats
    const totalGoals = savedGoals.length
    const completedGoals = savedGoals.filter((goal) => goal.progress === 100).length
    const inProgressGoals = savedGoals.filter((goal) => goal.progress > 0 && goal.progress < 100).length
    const notStartedGoals = savedGoals.filter((goal) => goal.progress === 0).length

    setStats({
      totalGoals,
      completionRate: totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0,
      avgProgress:
        totalGoals > 0 ? Math.round(savedGoals.reduce((sum, goal) => sum + goal.progress, 0) / totalGoals) : 0,
      activeGoals: inProgressGoals,
    })

    setCompletionData([
      { name: "Completed", value: completedGoals, color: "hsl(var(--chart-2))" },
      { name: "In Progress", value: inProgressGoals, color: "hsl(var(--chart-3))" },
      { name: "Not Started", value: notStartedGoals, color: "hsl(var(--muted))" },
    ])

    // Calculate monthly data
    const monthlyStats: Record<string, { count: number; avgProgress: number }> = {}

    savedGoals.forEach((goal) => {
      const key = `${goal.month}-${goal.year}`
      if (!monthlyStats[key]) {
        monthlyStats[key] = { count: 0, avgProgress: 0 }
      }
      monthlyStats[key].count += 1
      monthlyStats[key].avgProgress += goal.progress
    })

    const monthlyDataArray = Object.entries(monthlyStats).map(([key, stats]) => {
      const [month, year] = key.split("-")
      return {
        month: getMonthName(Number(month)).substring(0, 3),
        year,
        count: stats.count,
        avgProgress: stats.count > 0 ? Math.round(stats.avgProgress / stats.count) : 0,
      }
    })

    // Sort by date
    monthlyDataArray.sort((a, b) => {
      if (a.year !== b.year) return Number(a.year) - Number(b.year)
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      return monthNames.indexOf(a.month) - monthNames.indexOf(b.month)
    })

    setMonthlyData(monthlyDataArray)

    // Extract categories from goal titles for category analysis
    const categories: Record<string, number> = {}
    const commonCategories = ["fitness", "health", "finance", "career", "education", "personal", "family", "travel"]

    savedGoals.forEach((goal) => {
      const title = goal.title.toLowerCase()
      let matched = false

      for (const category of commonCategories) {
        if (title.includes(category)) {
          if (!categories[category]) categories[category] = 0
          categories[category] += 1
          matched = true
          break
        }
      }

      if (!matched) {
        if (!categories["other"]) categories["other"] = 0
        categories["other"] += 1
      }
    })

    const categoryDataArray = Object.entries(categories).map(([category, count]) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      count,
    }))

    setCategoryData(categoryDataArray)
  }, [])

  const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"]

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container py-6 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Goal Analytics</h1>
          <p className="text-muted-foreground">
            Track your progress and gain insights into your goal-setting patterns.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Total Goals</CardTitle>
                <Target className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalGoals}</p>
              <p className="text-xs text-muted-foreground mt-1">Goals created</p>
            </CardContent>
          </Card>

          <Card className="bg-[hsl(var(--chart-2))]/5 border-[hsl(var(--chart-2))]/20">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                <Trophy className="h-4 w-4 text-[hsl(var(--chart-2))]" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.completionRate}%</p>
              <p className="text-xs text-muted-foreground mt-1">Goals completed</p>
            </CardContent>
          </Card>

          <Card className="bg-[hsl(var(--chart-3))]/5 border-[hsl(var(--chart-3))]/20">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
                <TrendingUp className="h-4 w-4 text-[hsl(var(--chart-3))]" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.avgProgress}%</p>
              <p className="text-xs text-muted-foreground mt-1">Across all goals</p>
            </CardContent>
          </Card>

          <Card className="bg-[hsl(var(--chart-4))]/5 border-[hsl(var(--chart-4))]/20">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
                <Calendar className="h-4 w-4 text-[hsl(var(--chart-4))]" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.activeGoals}</p>
              <p className="text-xs text-muted-foreground mt-1">In progress</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="monthly">Monthly Trends</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Goal Completion Status</CardTitle>
                <CardDescription>Distribution of completed, in-progress, and not started goals</CardDescription>
              </CardHeader>
              <CardContent>
                {goals.length > 0 ? (
                  <div>
                    <div className="h-[180px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={completionData}
                            cx="50%"
                            cy="50%"
                            innerRadius={0}
                            outerRadius={60}
                            paddingAngle={0}
                            dataKey="value"
                          >
                            {completionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Simple legend */}
                    <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 mt-2">
                      {completionData.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                          <span className="text-xs">
                            {entry.name}: {entry.value} (
                            {goals.length > 0 ? Math.round((entry.value / goals.length) * 100) : 0}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[200px] text-center">
                    <Target className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-1">No goals yet</h3>
                    <p className="text-sm text-muted-foreground">Create your first goal to see analytics</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monthly" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Goal Progress</CardTitle>
                <CardDescription>Average progress percentage by month</CardDescription>
              </CardHeader>
              <CardContent>
                {monthlyData.length > 0 ? (
                  <div>
                    <div className="h-[180px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={monthlyData}
                          margin={{
                            top: 5,
                            right: 5,
                            left: 5,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" tick={{ fontSize: 10 }} tickLine={false} />
                          <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                          <Line
                            type="monotone"
                            dataKey="avgProgress"
                            stroke="hsl(var(--chart-2))"
                            strokeWidth={2}
                            dot={{ r: 3 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="count"
                            stroke="hsl(var(--chart-3))"
                            strokeWidth={2}
                            dot={{ r: 3 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Simple legend */}
                    <div className="flex justify-center gap-6 mt-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-2))]"></div>
                        <span className="text-xs">Avg Progress</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-3))]"></div>
                        <span className="text-xs">Goal Count</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[200px] text-center">
                    <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-1">No monthly data yet</h3>
                    <p className="text-sm text-muted-foreground">Create goals across different months to see trends</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Goal Categories</CardTitle>
                <CardDescription>Distribution of goals by category</CardDescription>
              </CardHeader>
              <CardContent>
                {categoryData.length > 0 ? (
                  <div>
                    <div className="h-[180px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={categoryData}
                          layout="vertical"
                          margin={{
                            top: 5,
                            right: 5,
                            left: 50,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} />
                          <YAxis
                            type="category"
                            dataKey="category"
                            tick={{ fontSize: 10 }}
                            tickLine={false}
                            width={50}
                          />
                          <Bar dataKey="count">
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Simple legend */}
                    <div className="flex justify-center flex-wrap gap-x-4 gap-y-2 mt-2">
                      {categoryData.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          ></div>
                          <span className="text-xs">
                            {entry.category}: {entry.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[200px] text-center">
                    <Target className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-1">No category data yet</h3>
                    <p className="text-sm text-muted-foreground">Create goals to see category distribution</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
