import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { createFileMetadata } from "@/lib/cosmos-db"
import { uploadFileToBlob } from "@/lib/azure-blob"
import { randomUUID } from "crypto"

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const folderId = formData.get("folderId") as string | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const fileId = randomUUID()
    const fileExtension = file.name.split(".").pop()
    const uniqueFileName = `${currentUser.userId}/${fileId}.${fileExtension}`

    // Upload to Azure Blob Storage
    const containerName = "user-files"
    const blobUrl = await uploadFileToBlob(containerName, uniqueFileName, buffer, file.type)

    // Save metadata to Cosmos DB
    const fileMetadata = await createFileMetadata({
      id: fileId,
      userId: currentUser.userId,
      fileName: file.name,
      fileSize: file.size,
      contentType: file.type,
      blobUrl,
      folderId: folderId || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    return NextResponse.json({
      message: "File uploaded successfully",
      file: fileMetadata,
    })
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}
