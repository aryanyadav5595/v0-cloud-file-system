import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getFileById, deleteFileMetadata } from "@/lib/cosmos-db"
import { deleteFileFromBlob } from "@/lib/azure-blob"

export async function GET(request: Request, { params }: { params: Promise<{ fileId: string }> }) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { fileId } = await params
    const file = await getFileById(fileId, currentUser.userId)

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    return NextResponse.json({ file })
  } catch (error) {
    console.error("[v0] Get file error:", error)
    return NextResponse.json({ error: "Failed to get file" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ fileId: string }> }) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { fileId } = await params
    const file = await getFileById(fileId, currentUser.userId)

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // Extract blob name from URL
    const blobName = file.blobUrl.split("/").slice(-2).join("/")
    const containerName = "user-files"

    // Delete from Azure Blob Storage
    await deleteFileFromBlob(containerName, blobName)

    // Delete metadata from Cosmos DB
    await deleteFileMetadata(fileId, currentUser.userId)

    return NextResponse.json({ message: "File deleted successfully" })
  } catch (error) {
    console.error("[v0] Delete file error:", error)
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 })
  }
}
