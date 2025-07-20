import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import bcrypt from "bcryptjs"

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const { searchParams } = new URL(request.url)

    const role = searchParams.get("role")
    const limit = searchParams.get("limit")

    const query: any = {}

    if (role) {
      query.role = role
    }

    let cursor = db.collection("users").find(query, {
      projection: { password: 0, passwordHash: 0 }, // Exclude password fields
    })

    if (limit) {
      cursor = cursor.limit(Number.parseInt(limit))
    }

    const users = await cursor.toArray()

    return NextResponse.json({
      success: true,
      users: users.map((user) => ({
        ...user,
        _id: user._id.toString(),
      })),
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["name", "email", "password"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ success: false, error: `${field} is required` }, { status: 400 })
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ success: false, error: "Invalid email format" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({
      email: body.email.toLowerCase(),
    })

    if (existingUser) {
      return NextResponse.json({ success: false, error: "User with this email already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(body.password, 12)

    const userData = {
      name: body.name.trim(),
      email: body.email.toLowerCase().trim(),
      passwordHash: hashedPassword,
      phone: body.phone || "",
      role: body.role || "customer",
      address: body.address || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("users").insertOne(userData)

    // Return user data without password
    const { passwordHash, ...userResponse } = userData

    return NextResponse.json(
      {
        success: true,
        user: {
          ...userResponse,
          _id: result.insertedId.toString(),
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ success: false, error: "Failed to create user" }, { status: 500 })
  }
}
