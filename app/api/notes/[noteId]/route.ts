import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getNoteById, updateNote, deleteNote } from "@/lib/cosmos-db"

export async function GET(request: Request, { params }: { params: Promise<{ noteId: string }> }) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { noteId } = await params
    const note = await getNoteById(noteId, currentUser.userId)

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 })
    }

    return NextResponse.json({ note })
  } catch (error) {
    console.error("[v0] Get note error:", error)
    return NextResponse.json({ error: "Failed to get note" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ noteId: string }> }) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { noteId } = await params
    const { title, content, tags } = await request.json()

    const note = await updateNote(noteId, currentUser.userId, {
      title,
      content,
      tags,
      updatedAt: new Date().toISOString(),
    })

    return NextResponse.json({
      message: "Note updated successfully",
      note,
    })
  } catch (error) {
    console.error("[v0] Update note error:", error)
    return NextResponse.json({ error: "Failed to update note" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ noteId: string }> }) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { noteId } = await params
    await deleteNote(noteId, currentUser.userId)

    return NextResponse.json({ message: "Note deleted successfully" })
  } catch (error) {
    console.error("[v0] Delete note error:", error)
    return NextResponse.json({ error: "Failed to delete note" }, { status: 500 })
  }
}
