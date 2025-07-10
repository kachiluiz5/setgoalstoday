"use client"

import type { Note } from "@/types/note"

export function saveNotes(notes: Note[]): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("notes", JSON.stringify(notes))
    } catch (error) {
      console.error("Error saving notes to localStorage:", error)
    }
  }
}

export function loadNotes(): Note[] {
  if (typeof window !== "undefined") {
    try {
      const savedNotes = localStorage.getItem("notes")
      if (savedNotes) {
        return JSON.parse(savedNotes)
      }
    } catch (error) {
      console.error("Error loading notes from localStorage:", error)
    }
  }
  return []
}

export function saveNote(note: Note): void {
  const notes = loadNotes()
  const existingIndex = notes.findIndex((n) => n.id === note.id)

  if (existingIndex >= 0) {
    notes[existingIndex] = note
  } else {
    notes.unshift(note)
  }

  saveNotes(notes)
}

export function deleteNote(noteId: string): void {
  const notes = loadNotes()
  const filteredNotes = notes.filter((n) => n.id !== noteId)
  saveNotes(filteredNotes)
}
