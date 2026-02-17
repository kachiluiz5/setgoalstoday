"use client"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Goal } from "@/types/goal"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, Copy, Download, Twitter, Facebook, Linkedin, Shield, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import html2canvas from "html2canvas"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface ShareGoalModalProps {
  goal: Goal
  onClose: () => void
}

export function ShareGoalModal({ goal, onClose }: ShareGoalModalProps) {
  const [activeTab, setActiveTab] = useState("image")
  const [copied, setCopied] = useState(false)
  const shareCardRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const [shareMessage, setShareMessage] = useState(
    `I'm ${goal.progress}% of the way to my goal: ${goal.title}. Track your goals with YourGoalApp!`,
  )

  useEffect(() => {
    // Handle the back button on mobile
    const handlePopState = () => {
      onClose()
    }

    window.addEventListener("popstate", handlePopState)

    // Push a new history state so back button works
    window.history.pushState({ modal: true }, "")

    return () => {
      window.removeEventListener("popstate", handlePopState)
    }
  }, [onClose])

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareMessage)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadImage = async () => {
    if (!shareCardRef.current) return

    try {
      const canvas = await html2canvas(shareCardRef.current, {
        backgroundColor: "#000000",
        scale: 4, // Higher scale for better quality
        logging: false,
        allowTaint: true,
        useCORS: true,
      })

      const image = canvas.toDataURL("image/png", 1.0) // Use maximum quality
      const link = document.createElement("a")
      link.href = image
      link.download = `goal-${goal.title.toLowerCase().replace(/\s+/g, "-")}.png`
      link.click()

      toast({
        title: "Image downloaded",
        description: "Your goal progress image has been downloaded.",
      })
    } catch (error) {
      console.error("Error generating image:", error)
      toast({
        title: "Error",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleShareSocial = (platform: string) => {
    const shareText = encodeURIComponent(shareMessage)
    const shareUrl = encodeURIComponent(window.location.href)

    let url = ""
    switch (platform) {
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`
        break
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`
        break
      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`
        break
    }

    window.open(url, "_blank")
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-w-[95vw] w-full overflow-hidden">
        <DialogHeader className="flex items-center justify-between">
          <DialogTitle>Share Your Progress</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="absolute right-2 top-2">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <Tabs defaultValue="image" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="image">Share Image</TabsTrigger>
            <TabsTrigger value="link">Share Link</TabsTrigger>
          </TabsList>

          <TabsContent value="image" className="space-y-4 py-4">
            <div
              ref={shareCardRef}
              className="bg-black border rounded-lg p-6 space-y-6 text-white"
              style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
            >
              <div className="text-center text-xs uppercase tracking-widest text-white/70">SETGOALS</div>

              <div className="space-y-2 text-center">
                <h3 className="font-bold text-2xl">my goal is to {goal.title}</h3>
                <p className="text-sm text-white/70">
                  set monthly goals, get ai-powered roadmaps, and track your progress.
                </p>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span className="font-bold">{goal.progress}%</span>
                </div>
                <Progress value={goal.progress} className="h-3 bg-white/20" />
              </div>

              {/* Completely redesigned roadmap steps with proper strikethrough */}
              <div className="space-y-3 pt-2">
                <p className="text-sm font-semibold mb-2">Roadmap:</p>
                {(goal.roadmap || []).slice(0, 5).map((step, index) => (
                  <div key={step.id} className="flex items-center gap-3">
                    <div
                      className={`min-w-7 h-7 rounded-full flex items-center justify-center ${
                        step.completed ? "bg-green-500/30" : "bg-white/20"
                      }`}
                    >
                      <span className={`text-sm ${step.completed ? "text-green-300" : "text-white/90"}`}>
                        {index + 1}
                      </span>
                    </div>
                    <div className="relative">
                      <span className={`text-sm ${step.completed ? "text-white/60" : "text-white/90"}`}>
                        {step.title}
                      </span>
                      {step.completed && (
                        <div
                          className="absolute left-0 right-0"
                          style={{
                            height: "1px",
                            backgroundColor: "rgba(255, 255, 255, 0.6)",
                            top: "50%",
                            transform: "translateY(-50%)",
                          }}
                        />
                      )}
                    </div>
                  </div>
                ))}
                {(goal.roadmap || []).length > 5 && (
                  <p className="text-xs text-white/50 pl-10">+{(goal.roadmap || []).length - 5} more steps</p>
                )}
              </div>

              <div className="pt-2 text-xs text-center">
                <div className="inline-flex items-center gap-1 border border-amber-500/50 bg-amber-500/10 px-3 py-1 rounded-full text-amber-300">
                  <Shield className="h-3 w-3 mr-1" /> Your privacy matters
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" size="sm" onClick={handleDownloadImage} className="gap-2">
                <Download className="h-4 w-4" /> Download
              </Button>

              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => handleShareSocial("twitter")}>
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleShareSocial("facebook")}>
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleShareSocial("linkedin")}>
                  <Linkedin className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="link" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="share-message">Share Message</Label>
              <Textarea
                id="share-message"
                value={shareMessage}
                onChange={(e) => setShareMessage(e.target.value)}
                className="text-sm"
                placeholder="Write your share message in simple, easy-to-read English"
                rows={3}
              />
              <p className="text-xs text-muted-foreground">Use simple, easy-to-read English for better engagement.</p>
            </div>

            <Button onClick={handleCopyLink} className="w-full gap-2">
              {copied ? (
                <>
                  <Check className="h-4 w-4" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" /> Copy to Clipboard
                </>
              )}
            </Button>

            <div className="flex justify-center gap-4 pt-2">
              <Button variant="outline" size="icon" onClick={() => handleShareSocial("twitter")}>
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => handleShareSocial("facebook")}>
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => handleShareSocial("linkedin")}>
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
