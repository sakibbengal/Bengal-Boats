import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { connectToDatabase, COLLECTIONS } from "@/lib/mongodb"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, message: "Authorization token required" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const { currentPassword, newPassword } = await request.json()

    // Validation
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Current password and new password are required" },
        { status: 400 },
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: "New password must be at least 6 characters long" },
        { status: 400 },
      )
    }

    try {
      const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || "fallback-secret-key") as any

      const { db } = await connectToDatabase()

      // Find user
      const user = await db.collection(COLLECTIONS.USERS).findOne({
        $or: [{ id: decoded.userId }, { _id: decoded.userId }],
      })

      if (!user) {
        return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash)
      if (!isCurrentPasswordValid) {
        return NextResponse.json({ success: false, message: "Current password is incorrect" }, { status: 400 })
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 12)

      // Update password
      const result = await db.collection(COLLECTIONS.USERS).updateOne(
        {
          $or: [{ id: decoded.userId }, { _id: decoded.userId }],
        },
        {
          $set: {
            passwordHash: hashedNewPassword,
            updatedAt: new Date(),
          },
        },
      )

      if (result.matchedCount === 0) {
        return NextResponse.json({ success: false, message: "Failed to update password" }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: "Password changed successfully",
      })
    } catch (jwtError) {
      return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 })
    }
  } catch (error) {
    console.error("Change password error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
