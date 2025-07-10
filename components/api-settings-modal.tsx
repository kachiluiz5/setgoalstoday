"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { loadApiSettings, saveApiSettings } from "@/lib/storage"

interface ApiSettingsModalProps {
  open: boolean
  onClose: () => void
  onSave?: (settings: any) => void
}

export function ApiSettingsModal({ open, onClose, onSave }: ApiSettingsModalProps) {
  const [provider, setProvider] = useState("gemini")
  const [apiKey, setApiKey] = useState("")
  const [model, setModel] = useState("")
  const [baseUrl, setBaseUrl] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      const settings = loadApiSettings()
      if (settings) {
        setProvider(settings.provider || "gemini")
        setApiKey(settings.apiKey || settings.geminiKey || "")
        setModel(settings.model || "")
        setBaseUrl(settings.baseUrl || "")
      }
    }
  }, [open])

  const handleSave = () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your API key.",
        variant: "destructive",
      })
      return
    }

    const settings = {
      provider: provider || "gemini",
      apiKey: apiKey.trim(),
      model: model || getDefaultModel(provider),
      baseUrl: baseUrl.trim() || "",
      // Keep legacy geminiKey for backward compatibility
      ...(provider === "gemini" && { geminiKey: apiKey.trim() }),
    }

    saveApiSettings(settings)

    toast({
      title: "Settings Saved",
      description: "Your AI settings have been saved successfully.",
    })

    if (onSave) {
      onSave(settings)
    }

    onClose()
  }

  const getDefaultModel = (provider: string) => {
    switch (provider) {
      case "openai":
        return "gpt-3.5-turbo"
      case "gemini":
        return "gemini-1.5-flash"
      case "anthropic":
        return "claude-3-haiku-20240307"
      default:
        return "gemini-1.5-flash"
    }
  }

  const getModelOptions = (provider: string) => {
    switch (provider) {
      case "openai":
        return [
          { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
          { value: "gpt-4", label: "GPT-4" },
          { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
        ]
      case "gemini":
        return [
          { value: "gemini-1.5-flash", label: "Gemini 1.5 Flash" },
          { value: "gemini-1.5-pro", label: "Gemini 1.5 Pro" },
        ]
      case "anthropic":
        return [
          { value: "claude-3-haiku-20240307", label: "Claude 3 Haiku" },
          { value: "claude-3-sonnet-20240229", label: "Claude 3 Sonnet" },
          { value: "claude-3-opus-20240229", label: "Claude 3 Opus" },
        ]
      default:
        return [
          { value: "gemini-1.5-flash", label: "Gemini 1.5 Flash" },
          { value: "gemini-1.5-pro", label: "Gemini 1.5 Pro" },
        ]
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>AI Settings</DialogTitle>
          <DialogDescription>
            Configure your AI provider settings for goal coaching and task generation.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="provider">AI Provider</Label>
            <Select value={provider} onValueChange={setProvider}>
              <SelectTrigger>
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gemini">Google Gemini</SelectItem>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="anthropic">Anthropic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key"
            />
          </div>

          <div>
            <Label htmlFor="model">Model</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger>
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                {getModelOptions(provider).map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {provider === "openai" && (
            <div>
              <Label htmlFor="baseUrl">Base URL (Optional)</Label>
              <Input
                id="baseUrl"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://api.openai.com/v1"
              />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1">
              Save Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
