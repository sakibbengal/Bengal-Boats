import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { connectToDatabase, COLLECTIONS } from "@/lib/mongodb"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone, address } = await request.json()

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: "Name, email, and password are required" }, { status: 400 })
    }

    if (name.trim().length < 2) {
      return NextResponse.json({ success: false, message: "Name must be at least 2 characters long" }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, message: "Please enter a valid email address" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters long" },
        { status: 400 },
      )
    }

    const { db } = await connectToDatabase()

    // Check if user already exists
    const existingUser = await db.collection(COLLECTIONS.USERS).findOne({
      email: email.toLowerCase().trim(),
    })

    if (existingUser) {
      return NextResponse.json({ success: false, message: "User with this email already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Determine role (admin if email contains "admin")
    const role = email.toLowerCase().includes("admin") ? "admin" : "customer"

    // Generate unique user ID
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Create user object
    const newUser = {
      id: userId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash: hashedPassword,
      phone: phone?.trim() || "",
      address: address?.trim() || "",
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Insert user into database
    const result = await db.collection(COLLECTIONS.USERS).insertOne(newUser)

    if (!result.insertedId) {
      return NextResponse.json({ success: false, message: "Failed to create user account" }, { status: 500 })
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
      process.env.NEXTAUTH_SECRET || "fallback-secret-key",
      { expiresIn: "7d" },
    )

    // Return user data without password
    const userData = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      address: newUser.address,
      role: newUser.role,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    }

    return NextResponse.json({
      success: true,
      message: "User registered successfully",
      user: userData,
      token,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ success: false, message: "Internal server error. Please try again." }, { status: 500 })
  }
}
