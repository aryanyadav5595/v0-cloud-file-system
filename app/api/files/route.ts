import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getFilesByUserId } from "@/lib/cosmos-db"

export async function GET() {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const files = await getFilesByUserId(currentUser.userId)

    return NextResponse.json({ files })
  } catch (error) {
    console.error("[v0] Get files error:", error)
    return NextResponse.json({ error: "Failed to get files" }, { status: 500 })
  }
}
