"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { StickyNote, Loader2, Plus } from "lucide-react"
import type { Note } from "@/lib/types"
import { NoteCard } from "./note-card"
import { NoteDialog } from "./note-dialog"

interface NoteListProps {
  refreshTrigger?: number
}

export function NoteList({ refreshTrigger }: NoteListProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const { toast } = useToast()

  const fetchNotes = async () => {
    try {
      const response = await fetch("/api/notes")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch notes")
      }

      setNotes(data.notes)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load notes",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [refreshTrigger])

  const handleNoteDeleted = (noteId: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId))
  }

  const handleNoteCreated = () => {
    setIsCreateDialogOpen(false)
    fetchNotes()
  }

  const handleNoteUpdated = () => {
    fetchNotes()
  }

  if (isLoading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Card>
    )
  }

  if (notes.length === 0) {
    return (
      <>
        <Card className="p-8">
          <div className="text-center">
            <StickyNote className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No notes yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Create your first note to get started</p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Note
            </Button>
          </div>
        </Card>

        <NoteDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} onSuccess={handleNoteCreated} />
      </>
    )
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} onDeleted={handleNoteDeleted} onUpdated={handleNoteUpdated} />
        ))}
      </div>

      <NoteDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} onSuccess={handleNoteCreated} />
    </>
  )
}
