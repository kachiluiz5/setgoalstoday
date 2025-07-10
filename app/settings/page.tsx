"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Check, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { NotificationSettings } from "@/components/notification-settings"
import { ApiSettingsModal } from "@/components/api-settings-modal"
import { loadApiSettings } from "@/lib/storage"

export default function SettingsPage() {
  const [showApiSettings, setShowApiSettings] = useState(false)
  const [apiSettings, setApiSettings] = useState<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    const savedSettings = loadApiSettings()
    setApiSettings(savedSettings)
  }, [])

  const handleClearLocalData = () => {
    if (window.confirm("Are you sure you want to clear all local data? This action cannot be undone.")) {
      localStorage.clear()
      toast({
        title: "Data cleared",
        description: "All local data has been cleared. The page will now reload.",
      })
      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 2000)
    }
  }

  const getProviderName = (settings: any) => {
    if (settings?.provider) {
      switch (settings.provider) {
        case "gemini":
          return "Google Gemini"
        case "openai":
          return "OpenAI"
        case "anthropic":
          return "Anthropic"
        default:
          return settings.provider
      }
    }
    if (settings?.geminiKey) return "Google Gemini"
    if (settings?.apiKey) return "OpenAI"
    return "Unknown"
  }

  const getModelName = (settings: any) => {
    if (settings?.model) return settings.model
    if (settings?.geminiKey) return "gemini-1.5-flash"
    if (settings?.apiKey) return "gpt-3.5-turbo"
    return "Default"
  }

  const hasApiKey = apiSettings && (apiSettings.apiKey || apiSettings.geminiKey)

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container py-6 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        <div className="grid gap-6">
          {/* Notification Settings */}
          <NotificationSettings />

          {/* AI API Settings */}
          <Card>
            <CardHeader>
              <CardTitle>AI API Settings</CardTitle>
              <CardDescription>
                Configure your AI provider to generate personalized goal roadmaps and daily tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {hasApiKey ? (
                <div className="space-y-4">
                  <Alert className="bg-green-500/10 border-green-500/30">
                    <Check className="h-4 w-4 text-green-500" />
                    <AlertTitle className="text-green-500">API Configured</AlertTitle>
                    <AlertDescription>
                      Provider: {getProviderName(apiSettings)} | Model: {getModelName(apiSettings)}
                    </AlertDescription>
                  </Alert>
                  <Button onClick={() => setShowApiSettings(true)} variant="outline">
                    Update API Settings
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>No API Key Configured</AlertTitle>
                    <AlertDescription>
                      You need to configure your AI API key to generate personalized roadmaps and daily tasks for your
                      goals.
                    </AlertDescription>
                  </Alert>
                  <Button onClick={() => setShowApiSettings(true)}>Configure API Settings</Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Data & Privacy */}
          <Card>
            <CardHeader>
              <CardTitle>Data & Privacy</CardTitle>
              <CardDescription>Manage your data and privacy settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Local Storage</AlertTitle>
                <AlertDescription>
                  All your goals, tasks, and settings are stored locally in your browser. Your data never leaves your
                  device unless you explicitly share it.
                </AlertDescription>
              </Alert>

              <div className="pt-2">
                <Button variant="destructive" onClick={handleClearLocalData}>
                  Clear All Local Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <ApiSettingsModal
          open={showApiSettings}
          onClose={() => setShowApiSettings(false)}
          onSave={(settings) => setApiSettings(settings)}
        />
      </main>
    </div>
  )
}
