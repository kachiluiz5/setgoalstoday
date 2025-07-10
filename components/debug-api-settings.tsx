"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DebugApiSettings() {
  const [settings, setSettings] = useState<any>(null)
  const [rawData, setRawData] = useState<string>("")

  const checkSettings = () => {
    try {
      const stored = localStorage.getItem("apiSettings")
      setRawData(stored || "null")
      if (stored) {
        const parsed = JSON.parse(stored)
        setSettings(parsed)
      } else {
        setSettings(null)
      }
    } catch (error) {
      setSettings({ error: error.message })
    }
  }

  useEffect(() => {
    checkSettings()
  }, [])

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>API Settings Debug</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={checkSettings} variant="outline" size="sm">
          Refresh
        </Button>
        <div>
          <p className="text-sm font-medium">Raw localStorage data:</p>
          <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-auto">{rawData}</pre>
        </div>
        <div>
          <p className="text-sm font-medium">Parsed settings:</p>
          <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-auto">{JSON.stringify(settings, null, 2)}</pre>
        </div>
      </CardContent>
    </Card>
  )
}
