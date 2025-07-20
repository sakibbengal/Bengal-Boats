import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectToDatabase, COLLECTIONS } from "@/lib/mongodb"

export const dynamic = "force-dynamic"

// GET user profile
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, message: "Authorization token required" }, { status: 401 })
    }

    const token = authHeader.substring(7)

    try {
      const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || "fallback-secret-key") as any

      const { db } = await connectToDatabase()
      const user = await db.collection(COLLECTIONS.USERS).findOne({
        $or: [{ id: decoded.userId }, { _id: decoded.userId }],
      })

      if (!user) {
        return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
      }

      const userData = {
        id: user.id || user._id?.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        address: user.address || "",
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }

      return NextResponse.json({
        success: true,
        user: userData,
      })
    } catch (jwtError) {
      return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 })
    }
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

// UPDATE user profile
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, message: "Authorization token required" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const { name, phone, address } = await request.json()

    // Validation
    if (!name || name.trim().length < 2) {
      return NextResponse.json({ success: false, message: "Name must be at least 2 characters long" }, { status: 400 })
    }

    try {
      const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || "fallback-secret-key") as any

      const { db } = await connectToDatabase()

      const updateData = {
        name: name.trim(),
        phone: phone?.trim() || "",
        address: address?.trim() || "",
        updatedAt: new Date(),
      }

      const result = await db.collection(COLLECTIONS.USERS).updateOne(
        {
          $or: [{ id: decoded.userId }, { _id: decoded.userId }],
        },
        { $set: updateData },
      )

      if (result.matchedCount === 0) {
        return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        message: "Profile updated successfully",
      })
    } catch (jwtError) {
      return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 })
    }
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
