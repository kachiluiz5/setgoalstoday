"use client"

import type { Goal } from "@/types/goal"

export interface UserContext {
  goalHistory: Goal[]
  completionPatterns: {
    averageCompletionRate: number
    bestPerformingCategories: string[]
    commonObstacles: string[]
    preferredTimeframes: string[]
  }
  personalityProfile: {
    motivationStyle: "intrinsic" | "extrinsic" | "mixed"
    planningPreference: "detailed" | "flexible" | "minimal"
    challengeLevel: "conservative" | "moderate" | "ambitious"
  }
  currentMomentum: {
    recentActivity: number
    streakLength: number
    energyLevel: "low" | "medium" | "high"
  }
}

export class UserContextAnalyzer {
  static analyzeUserContext(goals: Goal[]): UserContext {
    const completionPatterns = this.analyzeCompletionPatterns(goals)
    const personalityProfile = this.inferPersonalityProfile(goals)
    const currentMomentum = this.calculateCurrentMomentum(goals)

    return {
      goalHistory: goals,
      completionPatterns,
      personalityProfile,
      currentMomentum,
    }
  }

  private static analyzeCompletionPatterns(goals: Goal[]) {
    if (goals.length === 0) {
      return {
        averageCompletionRate: 0,
        bestPerformingCategories: [],
        commonObstacles: [],
        preferredTimeframes: [],
      }
    }

    // Calculate average completion rate
    const totalProgress = goals.reduce((sum, goal) => sum + goal.progress, 0)
    const averageCompletionRate = Math.round(totalProgress / goals.length)

    // Analyze goal categories (inferred from titles)
    const categories = this.categorizeGoals(goals)
    const bestPerformingCategories = this.findBestPerformingCategories(categories)

    // Identify common obstacles (inferred from incomplete goals)
    const commonObstacles = this.identifyCommonObstacles(goals)

    // Analyze preferred timeframes
    const preferredTimeframes = this.analyzeTimeframes(goals)

    return {
      averageCompletionRate,
      bestPerformingCategories,
      commonObstacles,
      preferredTimeframes,
    }
  }

  private static inferPersonalityProfile(goals: Goal[]) {
    // Analyze goal complexity and structure to infer personality
    const avgStepsPerGoal =
      goals.length > 0 ? goals.reduce((sum, goal) => sum + goal.roadmap.length, 0) / goals.length : 0

    const planningPreference = avgStepsPerGoal > 7 ? "detailed" : avgStepsPerGoal > 4 ? "flexible" : "minimal"

    // Analyze goal ambition level
    const ambitiousKeywords = ["master", "expert", "professional", "advanced", "complete", "transform"]
    const ambitiousGoals = goals.filter((goal) =>
      ambitiousKeywords.some(
        (keyword) =>
          goal.title.toLowerCase().includes(keyword) ||
          (goal.description && goal.description.toLowerCase().includes(keyword)),
      ),
    )

    const challengeLevel =
      ambitiousGoals.length / Math.max(goals.length, 1) > 0.6
        ? "ambitious"
        : ambitiousGoals.length / Math.max(goals.length, 1) > 0.3
          ? "moderate"
          : "conservative"

    // Infer motivation style (simplified heuristic)
    const motivationStyle = "mixed" // Default to mixed for now

    return {
      motivationStyle,
      planningPreference,
      challengeLevel,
    }
  }

  private static calculateCurrentMomentum(goals: Goal[]) {
    const now = new Date()
    const recentGoals = goals.filter((goal) => {
      const updatedAt = new Date(goal.updatedAt)
      const daysDiff = (now.getTime() - updatedAt.getTime()) / (1000 * 3600 * 24)
      return daysDiff <= 7 // Goals updated in last 7 days
    })

    const recentActivity = Math.min(recentGoals.length * 2, 10) // Scale to 0-10

    // Calculate streak (simplified)
    const streakLength = this.calculateStreakLength(goals)

    // Infer energy level from recent activity and progress
    const energyLevel = recentActivity >= 7 ? "high" : recentActivity >= 4 ? "medium" : "low"

    return {
      recentActivity,
      streakLength,
      energyLevel,
    }
  }

  private static categorizeGoals(goals: Goal[]): Map<string, Goal[]> {
    const categories = new Map<string, Goal[]>()

    const categoryKeywords = {
      "Health & Fitness": ["fitness", "health", "exercise", "workout", "diet", "weight", "run", "gym"],
      "Learning & Education": ["learn", "study", "course", "skill", "language", "read", "book", "education"],
      "Career & Business": ["career", "job", "business", "work", "professional", "income", "promotion"],
      "Personal Development": ["habit", "mindfulness", "meditation", "personal", "growth", "development"],
      Creative: ["creative", "art", "music", "write", "design", "craft", "photography"],
      Relationships: ["relationship", "social", "family", "friends", "communication", "networking"],
      Financial: ["money", "financial", "save", "invest", "budget", "debt", "wealth"],
    }

    goals.forEach((goal) => {
      const goalText = (goal.title + " " + (goal.description || "")).toLowerCase()
      let categorized = false

      for (const [category, keywords] of Object.entries(categoryKeywords)) {
        if (keywords.some((keyword) => goalText.includes(keyword))) {
          if (!categories.has(category)) {
            categories.set(category, [])
          }
          categories.get(category)!.push(goal)
          categorized = true
          break
        }
      }

      if (!categorized) {
        if (!categories.has("Other")) {
          categories.set("Other", [])
        }
        categories.get("Other")!.push(goal)
      }
    })

    return categories
  }

  private static findBestPerformingCategories(categories: Map<string, Goal[]>): string[] {
    const categoryPerformance = Array.from(categories.entries()).map(([category, goals]) => {
      const avgProgress = goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length
      return { category, avgProgress }
    })

    return categoryPerformance
      .sort((a, b) => b.avgProgress - a.avgProgress)
      .slice(0, 3)
      .map((item) => item.category)
  }

  private static identifyCommonObstacles(goals: Goal[]): string[] {
    // This is a simplified version - in a real implementation,
    // you might analyze step completion patterns, time gaps, etc.
    const incompleteGoals = goals.filter((goal) => goal.progress < 100)

    if (incompleteGoals.length === 0) return []

    // Common obstacle patterns based on goal analysis
    const obstacles = []

    if (incompleteGoals.length / goals.length > 0.7) {
      obstacles.push("Difficulty maintaining consistency")
    }

    const avgStepsCompleted =
      incompleteGoals.reduce((sum, goal) => {
        const completedSteps = goal.roadmap.filter((step) => step.completed).length
        return sum + completedSteps / goal.roadmap.length
      }, 0) / incompleteGoals.length

    if (avgStepsCompleted < 0.3) {
      obstacles.push("Challenges with getting started")
    } else if (avgStepsCompleted > 0.7) {
      obstacles.push("Difficulty finishing strong")
    }

    return obstacles
  }

  private static analyzeTimeframes(goals: Goal[]): string[] {
    // Analyze the months/years goals are set for
    const timeframes = goals.map((goal) => `${goal.month}/${goal.year}`)
    const timeframeCounts = timeframes.reduce(
      (acc, tf) => {
        acc[tf] = (acc[tf] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(timeframeCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([tf]) => tf)
  }

  private static calculateStreakLength(goals: Goal[]): number {
    // Simplified streak calculation
    // In a real implementation, you'd track daily activity
    const recentGoals = goals.filter((goal) => {
      const updatedAt = new Date(goal.updatedAt)
      const daysDiff = (new Date().getTime() - updatedAt.getTime()) / (1000 * 3600 * 24)
      return daysDiff <= 30
    })

    return Math.min(recentGoals.length * 2, 30) // Simplified streak
  }
}
