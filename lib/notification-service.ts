// Enhanced notification service with comprehensive push notification system

interface NotificationSettings {
  enabled: boolean
  frequency: "low" | "medium" | "high"
  quietHours: {
    start: string
    end: string
  }
  types: {
    dailyTasks: boolean
    goalReminders: boolean
    motivational: boolean
    progress: boolean
    streaks: boolean
  }
}

const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: false,
  frequency: "medium",
  quietHours: {
    start: "22:00",
    end: "08:00",
  },
  types: {
    dailyTasks: true,
    goalReminders: true,
    motivational: true,
    progress: true,
    streaks: true,
  },
}

export function areNotificationsSupported(): boolean {
  return "Notification" in window && "serviceWorker" in navigator
}

export function getNotificationPermission(): NotificationPermission {
  return Notification.permission
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!areNotificationsSupported()) return false

  const permission = await Notification.requestPermission()
  return permission === "granted"
}

export function getNotificationSettings(): NotificationSettings {
  try {
    const stored = localStorage.getItem("notification-settings")
    return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function saveNotificationSettings(settings: NotificationSettings) {
  localStorage.setItem("notification-settings", JSON.stringify(settings))
}

export function initializeNotifications() {
  if (!areNotificationsSupported() || getNotificationPermission() !== "granted") {
    return
  }

  const settings = getNotificationSettings()
  if (!settings.enabled) return

  // Schedule different types of notifications
  scheduleNotifications(settings)
}

function scheduleNotifications(settings: NotificationSettings) {
  // Clear existing notifications
  clearScheduledNotifications()

  const now = new Date()
  const schedules = generateNotificationSchedule(settings, now)

  schedules.forEach((schedule) => {
    const delay = schedule.time.getTime() - now.getTime()
    if (delay > 0) {
      setTimeout(() => {
        if (shouldSendNotification(settings, schedule.time)) {
          sendNotification(schedule.title, {
            body: schedule.body,
            icon: "/placeholder-logo.png",
            tag: schedule.tag,
            requireInteraction: schedule.priority === "high",
          })
        }
      }, delay)
    }
  })
}

function generateNotificationSchedule(settings: NotificationSettings, baseDate: Date) {
  const schedules = []
  const frequency = settings.frequency

  // Morning motivation (8:30 AM)
  if (settings.types.motivational) {
    const morningTime = new Date(baseDate)
    morningTime.setHours(8, 30, 0, 0)
    if (morningTime > baseDate) {
      schedules.push({
        time: morningTime,
        title: "🌅 Good Morning!",
        body: "Ready to tackle your goals today? Check your daily tasks!",
        tag: "morning-motivation",
        priority: "normal" as const,
      })
    }
  }

  // Daily tasks reminder (9:00 AM)
  if (settings.types.dailyTasks) {
    const tasksTime = new Date(baseDate)
    tasksTime.setHours(9, 0, 0, 0)
    if (tasksTime > baseDate) {
      schedules.push({
        time: tasksTime,
        title: "📋 Daily Tasks Ready",
        body: "Your personalized tasks are waiting. Start with the first one!",
        tag: "daily-tasks",
        priority: "high" as const,
      })
    }
  }

  // Midday check-in (based on frequency)
  if (frequency !== "low" && settings.types.progress) {
    const middayTime = new Date(baseDate)
    middayTime.setHours(13, 0, 0, 0)
    if (middayTime > baseDate) {
      schedules.push({
        time: middayTime,
        title: "⚡ Midday Check-in",
        body: "How's your progress? Take a moment to review your tasks.",
        tag: "midday-checkin",
        priority: "normal" as const,
      })
    }
  }

  // Afternoon motivation (3:30 PM)
  if (frequency === "high" && settings.types.motivational) {
    const afternoonTime = new Date(baseDate)
    afternoonTime.setHours(15, 30, 0, 0)
    if (afternoonTime > baseDate) {
      schedules.push({
        time: afternoonTime,
        title: "🚀 Afternoon Boost",
        body: "You're doing great! Keep the momentum going.",
        tag: "afternoon-boost",
        priority: "normal" as const,
      })
    }
  }

  // Evening review (6:00 PM)
  if (settings.types.progress) {
    const eveningTime = new Date(baseDate)
    eveningTime.setHours(18, 0, 0, 0)
    if (eveningTime > baseDate) {
      schedules.push({
        time: eveningTime,
        title: "🌆 Daily Review",
        body: "Time to review your progress and plan for tomorrow!",
        tag: "evening-review",
        priority: "normal" as const,
      })
    }
  }

  return schedules
}

function shouldSendNotification(settings: NotificationSettings, time: Date): boolean {
  if (!settings.enabled) return false

  // Check quiet hours
  const timeStr = time.toTimeString().slice(0, 5)
  const { start, end } = settings.quietHours

  if (start < end) {
    // Normal case: 22:00 to 08:00
    if (timeStr >= start || timeStr <= end) return false
  } else {
    // Overnight case: 08:00 to 22:00 (quiet during day)
    if (timeStr >= start && timeStr <= end) return false
  }

  return true
}

export function sendNotification(title: string, options?: NotificationOptions) {
  if (!areNotificationsSupported() || getNotificationPermission() !== "granted") {
    return
  }

  const settings = getNotificationSettings()
  if (!settings.enabled) return

  const notification = new Notification(title, {
    icon: "/placeholder-logo.png",
    badge: "/placeholder-logo.png",
    ...options,
  })

  // Auto-close after 5 seconds unless it requires interaction
  if (!options?.requireInteraction) {
    setTimeout(() => notification.close(), 5000)
  }

  // Track notification interaction
  notification.onclick = () => {
    window.focus()
    notification.close()
    // Navigate to relevant page based on tag
    if (options?.tag === "daily-tasks") {
      window.location.href = "/daily-tasks"
    } else if (options?.tag?.includes("goal")) {
      window.location.href = "/dashboard"
    }
  }
}

export function sendDailyTasksNotification(tasksCount: number) {
  const messages = [
    `🎯 ${tasksCount} tasks ready for you today!`,
    `📋 Your daily tasks are here - ${tasksCount} items to conquer!`,
    `⚡ Time to shine! ${tasksCount} personalized tasks await.`,
  ]

  const randomMessage = messages[Math.floor(Math.random() * messages.length)]

  sendNotification("Daily Tasks Generated", {
    body: randomMessage,
    tag: "daily-tasks-generated",
    requireInteraction: true,
  })
}

export function sendGoalProgressNotification(goalTitle: string, progress: number) {
  const messages = [
    `🎉 Great progress on "${goalTitle}" - ${progress}% complete!`,
    `🚀 You're ${progress}% done with "${goalTitle}". Keep going!`,
    `⭐ Amazing! "${goalTitle}" is ${progress}% complete.`,
  ]

  const randomMessage = messages[Math.floor(Math.random() * messages.length)]

  sendNotification("Goal Progress Update", {
    body: randomMessage,
    tag: "goal-progress",
  })
}

export function sendMotivationalNotification() {
  const messages = [
    "💪 You've got this! Every small step counts.",
    "🌟 Success is built one day at a time. Keep going!",
    "🔥 Your future self will thank you for today's efforts.",
    "🎯 Focus on progress, not perfection.",
    "⚡ Small consistent actions lead to big results.",
    "🚀 You're closer to your goals than you think!",
    "💎 Diamonds are formed under pressure. You're becoming brilliant!",
    "🌱 Growth happens outside your comfort zone. You're growing!",
  ]

  const randomMessage = messages[Math.floor(Math.random() * messages.length)]

  sendNotification("Daily Motivation", {
    body: randomMessage,
    tag: "motivation",
  })
}

export function sendStreakNotification(streakDays: number) {
  const messages = [
    `🔥 ${streakDays} day streak! You're on fire!`,
    `⚡ Amazing! ${streakDays} days of consistent progress.`,
    `🏆 ${streakDays} days strong! Keep the momentum going.`,
  ]

  const randomMessage = messages[Math.floor(Math.random() * messages.length)]

  sendNotification("Streak Achievement", {
    body: randomMessage,
    tag: "streak",
    requireInteraction: true,
  })
}

export function sendIncompleteGoalsNotification() {
  const messages = [
    "🎯 Don't forget about your goals! Check your progress.",
    "📈 Your goals are waiting for you. Take the next step!",
    "⭐ A few minutes on your goals can make a big difference.",
  ]

  const randomMessage = messages[Math.floor(Math.random() * messages.length)]

  sendNotification("Goal Reminder", {
    body: randomMessage,
    tag: "incomplete-goals",
  })
}

function clearScheduledNotifications() {
  // Clear any existing timeouts (in a real app, you'd track these)
  // This is a simplified version
}

// Schedule recurring daily notifications
export function scheduleRecurringNotifications() {
  const settings = getNotificationSettings()
  if (!settings.enabled) return

  // Schedule for the next 7 days
  for (let i = 0; i < 7; i++) {
    const date = new Date()
    date.setDate(date.getDate() + i)
    scheduleNotifications(settings)
  }
}

// Initialize notifications when the app loads
if (typeof window !== "undefined") {
  // Auto-initialize if permission is already granted
  if (getNotificationPermission() === "granted") {
    initializeNotifications()
  }
}
