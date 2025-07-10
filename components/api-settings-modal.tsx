"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ExternalLink } from "lucide-react"
import { toast } from "sonner"
import { saveApiSettings, type ApiSettings } from "@/lib/storage"

interface ApiSettingsModalProps {
  open: boolean
  onClose: () => void
  onSave?: (settings: ApiSettings) => void
}

export function ApiSettingsModal({ open, onClose, onSave }: ApiSettingsModalProps) {
  const [provider, setProvider] = useState<"openai" | "gemini" | "anthropic">("gemini")
  const [apiKey, setApiKey] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (open) {
      // Load existing settings when modal opens
      try {
        const settings = localStorage.getItem("apiSettings") || localStorage.getItem("api-settings")
        if (settings) {
          const parsed = JSON.parse(settings)
          if (parsed.provider) {
            setProvider(parsed.provider)
          }
          if (parsed.apiKey) {
            setApiKey(parsed.apiKey)
          }
          // Handle legacy format
          if (parsed.geminiKey && !parsed.apiKey) {
            setProvider("gemini")
            setApiKey(parsed.geminiKey)
          }
        }
      } catch (error) {
        console.error("Error loading API settings:", error)
      }
    } else {
      // Reset form when modal closes
      setProvider("gemini")
      setApiKey("")
    }
  }, [open])

  const handleSave = async () => {
    if (!apiKey.trim()) {
      toast.error("Please enter an API key")
      return
    }

    setIsLoading(true)

    try {
      const settings: ApiSettings = {
        provider,
        apiKey: apiKey.trim(),
        model:
          provider === "gemini" ? "gemini-1.5-flash" : provider === "openai" ? "gpt-4" : "claude-3-sonnet-20240229",
      }

      // Save to both possible keys for compatibility
      saveApiSettings(settings)
      localStorage.setItem("apiSettings", JSON.stringify(settings))

      toast.success("API settings saved successfully!")

      if (onSave) {
        onSave(settings)
      }

      onClose()
    } catch (error) {
      console.error("Error saving API settings:", error)
      toast.error("Failed to save API settings")
    } finally {
      setIsLoading(false)
    }
  }

  const getApiKeyUrl = () => {
    switch (provider) {
      case "gemini":
        return "https://aistudio.google.com/app/apikey"
      case "openai":
        return "https://platform.openai.com/api-keys"
      case "anthropic":
        return "https://console.anthropic.com/settings/keys"
      default:
        return "https://aistudio.google.com/app/apikey"
    }
  }

  const handleGetApiKey = () => {
    window.open(getApiKeyUrl(), "_blank")
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Configure AI API</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="provider">AI Provider</Label>
            <Select value={provider} onValueChange={(value: "openai" | "gemini" | "anthropic") => setProvider(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select AI provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gemini">Google Gemini (Free)</SelectItem>
                <SelectItem value="openai">OpenAI GPT</SelectItem>
                <SelectItem value="anthropic">Anthropic Claude</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="apiKey">API Key</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGetApiKey}
                className="h-6 px-2 text-xs bg-transparent"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Get API Key
              </Button>
            </div>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key"
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
