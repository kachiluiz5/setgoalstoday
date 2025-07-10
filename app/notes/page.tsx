"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Plus, Search, FileText, Calendar, Tag } from "lucide-react"
import type { Note } from "@/types/note"
import { loadNotes, saveNote, deleteNote } from "@/lib/note-storage"
import { NoteEditor } from "@/components/note-editor"
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal"

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const savedNotes = loadNotes()
    setNotes(savedNotes)
  }, [])

  const handleCreateNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: "Untitled Note",
      content: "",
      tags: [],
      color: "default",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setSelectedNote(newNote)
    setIsEditorOpen(true)
  }

  const handleEditNote = (note: Note) => {
    setSelectedNote(note)
    setIsEditorOpen(true)
  }

  const handleSaveNote = (note: Note) => {
    const updatedNotes = notes.some((n) => n.id === note.id)
      ? notes.map((n) => (n.id === note.id ? note : n))
      : [...notes, note]

    setNotes(updatedNotes)
    saveNote(note)
    setIsEditorOpen(false)
    setSelectedNote(null)

    toast({
      title: "Note Saved",
      description: "Your note has been saved successfully.",
    })
  }

  const handleDeleteNote = (note: Note) => {
    setNoteToDelete(note)
  }

  const confirmDeleteNote = () => {
    if (noteToDelete) {
      const updatedNotes = notes.filter((n) => n.id !== noteToDelete.id)
      setNotes(updatedNotes)
      deleteNote(noteToDelete.id)
      setNoteToDelete(null)

      toast({
        title: "Note Deleted",
        description: "Your note has been deleted successfully.",
      })
    }
  }

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const getColorClass = (color: string) => {
    switch (color) {
      case "yellow":
        return "bg-yellow-100 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800"
      case "green":
        return "bg-green-100 border-green-200 dark:bg-green-900/20 dark:border-green-800"
      case "blue":
        return "bg-blue-100 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
      case "purple":
        return "bg-purple-100 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800"
      case "pink":
        return "bg-pink-100 border-pink-200 dark:bg-pink-900/20 dark:border-pink-800"
      default:
        return "bg-background border-border"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container py-6 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Notes</h1>
          </div>
          <p className="text-muted-foreground">Capture your thoughts, ideas, and important information.</p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Button onClick={handleCreateNote} className="gap-2">
            <Plus className="h-4 w-4" />
            New Note
          </Button>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Notes Grid */}
        {filteredNotes.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">{searchQuery ? "No notes found" : "No notes yet"}</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? "Try adjusting your search terms" : "Create your first note to get started"}
              </p>
              {!searchQuery && (
                <Button onClick={handleCreateNote} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Note
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNotes.map((note) => (
              <Card
                key={note.id}
                className={`cursor-pointer hover:shadow-md transition-shadow ${getColorClass(note.color)}`}
                onClick={() => handleEditNote(note)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg line-clamp-2">{note.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="line-clamp-3 mb-3">{note.content || "No content"}</CardDescription>
                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {note.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          <Tag className="h-2 w-2 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                      {note.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{note.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Note Editor Modal */}
        {isEditorOpen && selectedNote && (
          <NoteEditor
            note={selectedNote}
            onClose={() => {
              setIsEditorOpen(false)
              setSelectedNote(null)
            }}
            onSave={handleSaveNote}
          />
        )}

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={!!noteToDelete}
          onClose={() => setNoteToDelete(null)}
          onConfirm={confirmDeleteNote}
          title="Delete Note"
          description={`Are you sure you want to delete "${noteToDelete?.title}"? This action cannot be undone.`}
        />
      </main>
    </div>
  )
}
