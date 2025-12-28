import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { createNote, getNotesByUserId } from "@/lib/cosmos-db"
import { randomUUID } from "crypto"

export async function GET() {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const notes = await getNotesByUserId(currentUser.userId)

    return NextResponse.json({ notes })
  } catch (error) {
    console.error("[v0] Get notes error:", error)
    return NextResponse.json({ error: "Failed to get notes" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, content, tags } = await request.json()

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    const note = await createNote({
      id: randomUUID(),
      userId: currentUser.userId,
      title,
      content,
      tags: tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    return NextResponse.json({
      message: "Note created successfully",
      note,
    })
  } catch (error) {
    console.error("[v0] Create note error:", error)
    return NextResponse.json({ error: "Failed to create note" }, { status: 500 })
  }
}
