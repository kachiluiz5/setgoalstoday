"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Save, X, Tag, Palette, Pin, PinOff } from "lucide-react"
import type { Note } from "@/types/note"

interface NoteEditorProps {
  note: Note
  onClose: () => void
  onSave: (note: Note) => void
}

const colorOptions = [
  { name: "Default", value: "default", class: "bg-background" },
  { name: "Yellow", value: "yellow", class: "bg-yellow-100 dark:bg-yellow-900/20" },
  { name: "Green", value: "green", class: "bg-green-100 dark:bg-green-900/20" },
  { name: "Blue", value: "blue", class: "bg-blue-100 dark:bg-blue-900/20" },
  { name: "Purple", value: "purple", class: "bg-purple-100 dark:bg-purple-900/20" },
  { name: "Pink", value: "pink", class: "bg-pink-100 dark:bg-pink-900/20" },
]

export function NoteEditor({ note, onClose, onSave }: NoteEditorProps) {
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)
  const [tags, setTags] = useState<string[]>(note.tags || [])
  const [newTag, setNewTag] = useState("")
  const [color, setColor] = useState(note.color || "default")
  const [isPinned, setIsPinned] = useState(note.pinned || false)
  const { toast } = useToast()

  const handleSave = () => {
    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title for your note.",
        variant: "destructive",
      })
      return
    }

    const updatedNote: Note = {
      ...note,
      title: title.trim(),
      content: content.trim(),
      tags,
      color,
      pinned: isPinned,
      updatedAt: new Date().toISOString(),
    }

    onSave(updatedNote)
  }

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const getColorClass = (colorValue: string) => {
    const colorOption = colorOptions.find((option) => option.value === colorValue)
    return colorOption?.class || "bg-background"
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className={`sm:max-w-2xl max-w-[95vw] max-h-[90vh] ${getColorClass(color)}`}>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Edit Note</span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPinned(!isPinned)}
                className={isPinned ? "text-primary" : "text-muted-foreground"}
              >
                {isPinned ? <Pin className="h-4 w-4" /> : <PinOff className="h-4 w-4" />}
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title..."
              className="text-lg font-medium bg-transparent border-none px-0 focus-visible:ring-0"
            />
          </div>

          {/* Content */}
          <div>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing your note..."
              className="min-h-[300px] bg-transparent border-none px-0 resize-none focus-visible:ring-0"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Tags</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {tag}
                  <button onClick={() => handleRemoveTag(tag)} className="ml-1 hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                placeholder="Add a tag..."
                className="flex-1"
              />
              <Button onClick={handleAddTag} size="sm">
                Add
              </Button>
            </div>
          </div>

          {/* Color Picker */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Color</span>
            </div>
            <div className="flex gap-2">
              {colorOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setColor(option.value)}
                  className={`w-8 h-8 rounded-full border-2 ${option.class} ${
                    color === option.value ? "border-primary" : "border-border"
                  }`}
                  title={option.name}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Save Note
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
