"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, Copy, Twitter, Facebook, Linkedin } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ShareAppModalProps {
  onClose: () => void
}

export function ShareAppModal({ onClose }: ShareAppModalProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const shareText =
    "Track your goals with YourGoalApp! Set monthly goals, get AI-powered roadmaps, and track your progress."
  const shareUrl = typeof window !== "undefined" ? window.location.origin : "https://yourgoalapp.com"

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)

    toast({
      title: "Link copied",
      description: "Share link has been copied to clipboard",
    })
  }

  const handleShareSocial = (platform: string) => {
    const encodedText = encodeURIComponent(shareText)
    const encodedUrl = encodeURIComponent(shareUrl)

    let url = ""
    switch (platform) {
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`
        break
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
        break
      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
        break
    }

    if (url) {
      window.open(url, "_blank")
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-w-[90vw] w-full overflow-hidden">
        <DialogHeader>
          <DialogTitle>Share YourGoalApp</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="social" className="pt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="link">Copy Link</TabsTrigger>
          </TabsList>

          <TabsContent value="social" className="py-4">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <Button variant="outline" className="flex-1" onClick={() => handleShareSocial("twitter")}>
                <Twitter className="mr-2 h-4 w-4" /> Twitter
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => handleShareSocial("facebook")}>
                <Facebook className="mr-2 h-4 w-4" /> Facebook
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => handleShareSocial("linkedin")}>
                <Linkedin className="mr-2 h-4 w-4" /> LinkedIn
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="link" className="py-4">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="grid flex-1 gap-2 w-full">
                <div className="bg-muted p-2 rounded-md text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                  {shareUrl}
                </div>
              </div>
              <Button onClick={handleCopyLink} size="sm" className="px-3 w-full sm:w-auto">
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
