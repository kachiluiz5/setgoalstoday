"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ImageUploaderProps {
  onImageUpload: (imageDataUrl: string, date: string) => void
}

export function ImageUploader({ onImageUpload }: ImageUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Set today's date as default
  const today = new Date().toISOString().split("T")[0]
  const [imageDate, setImageDate] = useState(today)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file")
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB")
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setPreviewUrl(result)
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = () => {
    if (previewUrl) {
      onImageUpload(previewUrl, imageDate)
      setPreviewUrl(null)
      setImageDate(today) // Reset date to today
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleCancel = () => {
    setPreviewUrl(null)
    setImageDate(today) // Reset date to today
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

      {previewUrl ? (
        <div className="space-y-4">
          <div className="relative">
            <img src={previewUrl || "/placeholder.svg"} alt="Preview" className="max-h-[300px] mx-auto rounded-md" />
            <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={handleCancel}>
              <X className="h-3 w-3" />
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image-date">Date</Label>
            <Input
              id="image-date"
              type="date"
              value={imageDate}
              onChange={(e) => setImageDate(e.target.value)}
              max={today}
              className="text-sm"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleUpload}>
              Save Image
            </Button>
          </div>
        </div>
      ) : (
        <Button variant="outline" onClick={triggerFileInput} className="w-full py-8 border-dashed">
          <Upload className="mr-2 h-4 w-4" /> Upload Progress Image
        </Button>
      )}
    </div>
  )
}
