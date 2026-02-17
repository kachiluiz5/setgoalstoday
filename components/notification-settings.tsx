"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Bell, Plus, X, Clock } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { getNotificationSchedule, saveNotificationSchedule, type NotificationSchedule } from "@/lib/storage"
import { requestNotificationPermission } from "@/lib/notification-service"

export function NotificationSettings() {
  const [schedule, setSchedule] = useState<NotificationSchedule>({
    enabled: false,
    times: ["09:00", "18:00"],
    frequency: "daily",
  })
  const [newTime, setNewTime] = useState("")
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>("default")
  const [isLoaded, setIsLoaded] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Load saved settings
    const savedSchedule = getNotificationSchedule()
    setSchedule(savedSchedule)
    setIsLoaded(true)

    // Check notification permission
    if ("Notification" in window) {
      setPermissionStatus(Notification.permission)
    }
  }, [])

  // Note: enabling/disabling notifications is managed elsewhere (dashboard prompt).
  // Keep settings (times/frequency) editable but remove the explicit enable toggle from settings.

  const handleAddTime = () => {
    const times = schedule?.times || []
    if (!newTime || times.includes(newTime)) return

    const updatedSchedule = {
      ...schedule,
      times: [...times, newTime].sort(),
    }
    setSchedule(updatedSchedule)
    saveNotificationSchedule(updatedSchedule)
    setNewTime("")

    toast({
      title: "Reminder Time Added",
      description: `You'll now receive notifications at ${newTime}.`,
    })
  }

  const handleRemoveTime = (timeToRemove: string) => {
    const updatedSchedule = {
      ...schedule,
      times: schedule.times.filter((time) => time !== timeToRemove),
    }
    setSchedule(updatedSchedule)
    saveNotificationSchedule(updatedSchedule)

    toast({
      title: "Reminder Time Removed",
      description: `Notifications at ${timeToRemove} have been disabled.`,
    })
  }

  const handleFrequencyChange = (frequency: "daily" | "weekly" | "custom") => {
    const updatedSchedule = { ...schedule, frequency }
    setSchedule(updatedSchedule)
    saveNotificationSchedule(updatedSchedule)

    toast({
      title: "Frequency Updated",
      description: `Notifications will now be sent ${frequency}.`,
    })
  }

  // Don't render until loaded to prevent controlled/uncontrolled switch warning
  if (!isLoaded) {
    return null
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="h-5 w-5" />
            Goal Reminders
          </CardTitle>
          <CardDescription className="text-sm">
            Get notified to stay on track with your goals and maintain momentum.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Permission Status (informational) */}
          {permissionStatus !== "granted" && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 rounded-lg">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>Permission needed:</strong> Please allow notifications in your browser to receive reminders.
              </p>
            </div>
          )}

          {/* Frequency Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Frequency</Label>
            <Select value={schedule.frequency || "daily"} onValueChange={handleFrequencyChange}>
              <SelectTrigger className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily" className="text-sm">
                  Daily
                </SelectItem>
                <SelectItem value="weekly" className="text-sm">
                  Weekly
                </SelectItem>
                <SelectItem value="custom" className="text-sm">
                  Custom
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notification Times */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Reminder Times</Label>

            {/* Current Times */}
            <div className="flex flex-wrap gap-2">
              {(schedule.times || []).map((time) => (
                <Badge key={time} variant="secondary" className="gap-1 text-xs">
                  <Clock className="h-3 w-3" />
                  {time}
                  <button onClick={() => handleRemoveTime(time)} className="ml-1 hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>

            {/* Add New Time */}
            <div className="flex gap-2">
              <Input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="flex-1 text-sm"
              />
              <Button onClick={handleAddTime} disabled={!newTime || (schedule.times || []).includes(newTime)} size="sm" className="gap-1 text-sm">
                <Plus className="h-3 w-3" />
                Add
              </Button>
            </div>
          </div>

          {/* Preview */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Preview:</p>
            <p className="text-sm">
              You'll receive {schedule.frequency} reminders at {(schedule.times || []).length > 0 ? (schedule.times || []).join(", ") : "no times set"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
