import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getFileById } from "@/lib/cosmos-db"
import { downloadFileFromBlob } from "@/lib/azure-blob"

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

    // Extract blob name from URL
    const blobName = file.blobUrl.split("/").slice(-2).join("/")
    const containerName = "user-files"

    // Download from Azure Blob Storage
    const downloadResponse = await downloadFileFromBlob(containerName, blobName)

    if (!downloadResponse.readableStreamBody) {
      return NextResponse.json({ error: "Failed to download file" }, { status: 500 })
    }

    // Convert to array buffer
    const chunks: Uint8Array[] = []
    for await (const chunk of downloadResponse.readableStreamBody) {
      chunks.push(chunk)
    }
    const buffer = Buffer.concat(chunks)

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": file.contentType || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${file.fileName}"`,
        "Content-Length": buffer.length.toString(),
      },
    })
  } catch (error) {
    console.error("[v0] Download file error:", error)
    return NextResponse.json({ error: "Failed to download file" }, { status: 500 })
  }
}
