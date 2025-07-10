"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Share2, X, Twitter, Facebook, Linkedin, LinkIcon } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { usePathname } from "next/navigation"

export function FloatingShareButton() {
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Only show on home page
  if (mounted && pathname !== "/") {
    return null
  }

  const handleShare = (platform: string) => {
    const shareText = encodeURIComponent(
      "Track your goals with YourGoalApp! Set monthly goals, get AI-powered roadmaps, and track your progress.",
    )
    const shareUrl = encodeURIComponent(window.location.origin)

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
      case "copy":
        navigator.clipboard.writeText(window.location.origin)
        toast({
          title: "Link copied",
          description: "Share link has been copied to clipboard",
        })
        return
    }

    if (url) {
      window.open(url, "_blank")
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button size="icon" className="h-12 w-12 rounded-full shadow-lg" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-5 w-5" /> : <Share2 className="h-5 w-5" />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => handleShare("twitter")} className="cursor-pointer">
            <Twitter className="mr-2 h-4 w-4" /> Twitter
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShare("facebook")} className="cursor-pointer">
            <Facebook className="mr-2 h-4 w-4" /> Facebook
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShare("linkedin")} className="cursor-pointer">
            <Linkedin className="mr-2 h-4 w-4" /> LinkedIn
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShare("copy")} className="cursor-pointer">
            <LinkIcon className="mr-2 h-4 w-4" /> Copy Link
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
