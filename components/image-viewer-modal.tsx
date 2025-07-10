"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { useState } from "react"

interface ImageViewerModalProps {
  images: Array<{ url: string; date: string }>
  initialIndex: number
  onClose: () => void
}

export function ImageViewerModal({ images, initialIndex, onClose }: ImageViewerModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden bg-background/95 backdrop-blur-sm">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10 bg-background/50 hover:bg-background/80"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="flex items-center justify-center p-4 h-[80vh] max-h-[80vh]">
            <img
              src={images[currentIndex].url || "/placeholder.svg"}
              alt={`Progress image ${currentIndex + 1}`}
              className="max-h-full max-w-full object-contain"
            />
          </div>

          <div className="absolute left-2 top-1/2 -translate-y-1/2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              className="bg-background/50 hover:bg-background/80"
              disabled={images.length <= 1}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </div>

          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              className="bg-background/50 hover:bg-background/80"
              disabled={images.length <= 1}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-background/80 p-3 text-center">
            <p className="text-sm font-medium">{formatDate(images[currentIndex].date)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Image {currentIndex + 1} of {images.length}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
