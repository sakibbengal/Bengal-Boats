import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase, COLLECTIONS, isDatabaseAvailable } from "@/lib/mongodb"
import { sampleUsers } from "@/lib/data"
import bcrypt from "bcryptjs"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "User ID is required",
        },
        { status: 400 },
      )
    }

    // Quick database availability check
    const dbAvailable = await isDatabaseAvailable()

    if (dbAvailable) {
      try {
        const { db } = await connectToDatabase()

        const user = await db.collection(COLLECTIONS.USERS).findOne(
          { id },
          {
            projection: {
              _id: 0,
              passwordHash: 0, // Exclude password hash for security
            },
          },
        )

        if (user) {
          return NextResponse.json({
            success: true,
            data: user,
          })
        }
      } catch (dbError) {
        console.error("Database error in user by ID:", dbError)
        // Fall through to fallback
      }
    }

    // Fallback to mock data
    const user = sampleUsers.find((u) => u.id === id)

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 },
      )
    }

    // Remove password hash from response
    const { passwordHash, ...userData } = user

    return NextResponse.json({
      success: true,
      data: userData,
    })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch user",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "User ID is required",
        },
        { status: 400 },
      )
    }

    // Validation
    if (body.name && body.name.trim().length < 2) {
      return NextResponse.json(
        {
          success: false,
          error: "Name must be at least 2 characters long",
        },
        { status: 400 },
      )
    }

    if (body.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(body.email)) {
        return NextResponse.json(
          {
            success: false,
            error: "Please enter a valid email address",
          },
          { status: 400 },
        )
      }
    }

    if (body.password && body.password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          error: "Password must be at least 6 characters long",
        },
        { status: 400 },
      )
    }

    const validRoles = ["admin", "customer"]
    if (body.role && !validRoles.includes(body.role)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid role. Must be one of: ${validRoles.join(", ")}`,
        },
        { status: 400 },
      )
    }

    try {
      const { db } = await connectToDatabase()

      // Check if email is being changed and if it already exists
      if (body.email) {
        const existingUser = await db.collection(COLLECTIONS.USERS).findOne({
          email: body.email.toLowerCase(),
          id: { $ne: id }, // Exclude current user
        })
        if (existingUser) {
          return NextResponse.json(
            {
              success: false,
              error: "Email already exists for another user",
            },
            { status: 409 },
          )
        }
      }

      const updateData: any = {
        ...body,
        updatedAt: new Date(),
      }

      // Remove fields that shouldn't be updated
      delete updateData.id
      delete updateData._id
      delete updateData.createdAt

      // Clean string fields
      if (updateData.name) updateData.name = updateData.name.trim()
      if (updateData.email) updateData.email = updateData.email.toLowerCase().trim()
      if (updateData.phone) updateData.phone = updateData.phone.trim()

      // Hash password if provided
      if (updateData.password) {
        updateData.passwordHash = await bcrypt.hash(updateData.password, 12)
        delete updateData.password // Remove plain password
      }

      const result = await db.collection(COLLECTIONS.USERS).updateOne({ id }, { $set: updateData })

      if (result.matchedCount === 0) {
        return NextResponse.json(
          {
            success: false,
            error: "User not found",
          },
          { status: 404 },
        )
      }

      // Fetch updated user (without password hash)
      const updatedUser = await db
        .collection(COLLECTIONS.USERS)
        .findOne({ id }, { projection: { _id: 0, passwordHash: 0 } })

      return NextResponse.json({
        success: true,
        data: updatedUser,
        message: "User updated successfully",
      })
    } catch (dbError) {
      console.error("Database error updating user:", dbError)
      return NextResponse.json(
        {
          success: false,
          error: "Database error: Failed to update user",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update user",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "User ID is required",
        },
        { status: 400 },
      )
    }

    try {
      const { db } = await connectToDatabase()

      // Check if user exists and get their role
      const user = await db.collection(COLLECTIONS.USERS).findOne({ id })
      if (!user) {
        return NextResponse.json(
          {
            success: false,
            error: "User not found",
          },
          { status: 404 },
        )
      }

      // Prevent deletion of admin users (optional safety check)
      if (user.role === "admin") {
        // Count total admin users
        const adminCount = await db.collection(COLLECTIONS.USERS).countDocuments({ role: "admin" })
        if (adminCount <= 1) {
          return NextResponse.json(
            {
              success: false,
              error: "Cannot delete the last admin user",
            },
            { status: 400 },
          )
        }
      }

      const result = await db.collection(COLLECTIONS.USERS).deleteOne({ id })

      if (result.deletedCount === 0) {
        return NextResponse.json(
          {
            success: false,
            error: "User not found",
          },
          { status: 404 },
        )
      }

      return NextResponse.json({
        success: true,
        message: "User deleted successfully",
      })
    } catch (dbError) {
      console.error("Database error deleting user:", dbError)
      return NextResponse.json(
        {
          success: false,
          error: "Database error: Failed to delete user",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete user",
      },
      { status: 500 },
    )
  }
}
