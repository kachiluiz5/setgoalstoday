"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Bell, BellOff } from "lucide-react"
import { saveNotificationSettings } from "@/lib/storage"

interface NotificationPromptProps {
  onPermissionChange: (granted: boolean) => void
}

export function NotificationPrompt({ onPermissionChange }: NotificationPromptProps) {
  const [isOpen, setIsOpen] = useState(true)

  const handleAllow = async () => {
    try {
      const permission = await Notification.requestPermission()
      const granted = permission === "granted"
      saveNotificationSettings(granted)
      onPermissionChange(granted)
      setIsOpen(false)
    } catch (error) {
      console.error("Error requesting notification permission:", error)
      onPermissionChange(false)
      setIsOpen(false)
    }
  }

  const handleDeny = () => {
    saveNotificationSettings(false)
    onPermissionChange(false)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md mx-auto">
        <DialogHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Bell className="w-6 h-6 text-blue-600" />
          </div>
          <DialogTitle>Stay on track with your goals</DialogTitle>
          <DialogDescription className="text-center">
            Get gentle reminders to help you maintain momentum and achieve your monthly goals.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={handleDeny} className="flex-1 bg-transparent">
            <BellOff className="w-4 h-4 mr-2" />
            Not now
          </Button>
          <Button onClick={handleAllow} className="flex-1">
            <Bell className="w-4 h-4 mr-2" />
            Allow notifications
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
