"use client"

import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { GoalList } from "@/components/goal-list"
import { GoalCreationModal } from "@/components/goal-creation-modal"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { Goal } from "@/types/goal"
import { loadGoals, saveGoals, getNotificationSettings } from "@/lib/storage"
import { NotificationPrompt } from "@/components/notification-prompt"
import {
  areNotificationsSupported,
  getNotificationPermission,
  initializeNotifications,
  sendIncompleteGoalsNotification,
} from "@/lib/notification-service"

export default function DashboardPage() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [isCreatingGoal, setIsCreatingGoal] = useState(false)
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const savedGoals = loadGoals()
    setGoals(savedGoals)

    // Check if notifications are supported
    if (areNotificationsSupported()) {
      // Check if notification permission has been asked before
      const notificationAsked = localStorage.getItem("notificationAsked")
      const notificationsEnabled = getNotificationSettings()
      const currentPermission = getNotificationPermission()

      // Show the prompt if:
      // 1. User hasn't been asked before OR
      // 2. Permission is "default" (not yet decided)
      if (!notificationAsked || currentPermission === "default") {
        setShowNotificationPrompt(true)
      }

      // Initialize notifications if they're enabled
      if (notificationsEnabled && currentPermission === "granted") {
        initializeNotifications()
        // Send a notification about incomplete goals if there are any
        const incompleteGoals = savedGoals.filter((goal) => goal.progress < 100)
        if (incompleteGoals.length > 0) {
          // Only send if it's been at least 12 hours since the last notification
          const lastNotification = localStorage.getItem("last-notification-time")
          const now = new Date().getTime()
          if (!lastNotification || now - Number.parseInt(lastNotification) > 12 * 60 * 60 * 1000) {
            sendIncompleteGoalsNotification()
            localStorage.setItem("last-notification-time", now.toString())
          }
        }
      }
    }
  }, [])

  const handleAddGoal = (goal: Goal) => {
    const updatedGoals = [...goals, goal]
    setGoals(updatedGoals)
    saveGoals(updatedGoals)
    toast({
      title: "Goal created",
      description: "Your new goal has been added successfully.",
    })
  }

  const handleUpdateGoal = (updatedGoal: Goal) => {
    const updatedGoals = goals.map((goal) => (goal.id === updatedGoal.id ? updatedGoal : goal))
    setGoals(updatedGoals)
    saveGoals(updatedGoals)
    toast({
      title: "Goal updated",
      description: "Your goal has been updated successfully.",
    })
  }

  const handleDeleteGoal = (goalId: string) => {
    const updatedGoals = goals.filter((goal) => goal.id !== goalId)
    setGoals(updatedGoals)
    saveGoals(updatedGoals)
    toast({
      title: "Goal deleted",
      description: "Your goal has been deleted successfully.",
    })
  }

  const handleNotificationPermission = (granted: boolean) => {
    localStorage.setItem("notificationAsked", "true")
    setShowNotificationPrompt(false)
    if (granted) {
      toast({
        title: "Notifications enabled",
        description: "You'll receive reminders about your goals.",
      })
      // Initialize notifications
      initializeNotifications()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container py-6 max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Your Goals</h1>
          <Button onClick={() => setIsCreatingGoal(true)}>
            <Plus className="mr-2 h-4 w-4" /> New Goal
          </Button>
        </div>
        <GoalList goals={goals} onUpdateGoal={handleUpdateGoal} onDeleteGoal={handleDeleteGoal} />
        {isCreatingGoal && (
          <GoalCreationModal
            isOpen={isCreatingGoal}
            onClose={() => setIsCreatingGoal(false)}
            onGoalCreated={handleAddGoal}
          />
        )}
        {showNotificationPrompt && <NotificationPrompt onPermissionChange={handleNotificationPermission} />}
      </main>
    </div>
  )
}
