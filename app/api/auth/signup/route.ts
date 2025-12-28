import { NextResponse } from "next/server"
import { createUser, getUserByEmail } from "@/lib/cosmos-db"
import { hashPassword, createToken, setAuthCookie } from "@/lib/auth"
import { randomUUID } from "crypto"

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email)

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create user
    const user = await createUser({
      id: randomUUID(),
      email,
      passwordHash,
      name,
      createdAt: new Date().toISOString(),
    })

    // Create token
    const token = await createToken(user.id, user.email)

    // Set cookie
    await setAuthCookie(token)

    return NextResponse.json({
      message: "User created successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })
  } catch (error) {
    console.error("[v0] Signup error:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
