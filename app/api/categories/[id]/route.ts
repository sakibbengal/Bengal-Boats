import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase, COLLECTIONS, isDatabaseAvailable } from "@/lib/mongodb"
import { categories } from "@/lib/data"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Category ID is required",
        },
        { status: 400 },
      )
    }

    // Quick database availability check
    const dbAvailable = await isDatabaseAvailable()

    if (dbAvailable) {
      try {
        const { db } = await connectToDatabase()

        const category = await db.collection(COLLECTIONS.CATEGORIES).findOne(
          { id },
          {
            projection: { _id: 0 },
          },
        )

        if (category) {
          return NextResponse.json({
            success: true,
            data: category,
          })
        }
      } catch (dbError) {
        console.error("Database error in category by ID:", dbError)
        // Fall through to fallback
      }
    }

    // Fallback to mock data
    const category = categories.find((c) => c.id === id)

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: "Category not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: category,
    })
  } catch (error) {
    console.error("Error fetching category:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch category",
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
          error: "Category ID is required",
        },
        { status: 400 },
      )
    }

    // Validation
    if (body.name && body.name.trim().length < 2) {
      return NextResponse.json(
        {
          success: false,
          error: "Category name must be at least 2 characters long",
        },
        { status: 400 },
      )
    }

    try {
      const { db } = await connectToDatabase()

      // Check if name is being changed and if it already exists
      if (body.name) {
        const existingCategory = await db.collection(COLLECTIONS.CATEGORIES).findOne({
          name: { $regex: new RegExp(`^${body.name.trim()}$`, "i") },
          id: { $ne: id }, // Exclude current category
        })
        if (existingCategory) {
          return NextResponse.json(
            {
              success: false,
              error: "Category name already exists",
            },
            { status: 409 },
          )
        }
      }

      const updateData = {
        ...body,
        updatedAt: new Date(),
      }

      // Remove fields that shouldn't be updated
      delete updateData.id
      delete updateData._id
      delete updateData.createdAt

      // Clean string fields
      if (updateData.name) updateData.name = updateData.name.trim()
      if (updateData.description) updateData.description = updateData.description.trim()

      const result = await db.collection(COLLECTIONS.CATEGORIES).updateOne({ id }, { $set: updateData })

      if (result.matchedCount === 0) {
        return NextResponse.json(
          {
            success: false,
            error: "Category not found",
          },
          { status: 404 },
        )
      }

      // Fetch updated category
      const updatedCategory = await db.collection(COLLECTIONS.CATEGORIES).findOne({ id }, { projection: { _id: 0 } })

      return NextResponse.json({
        success: true,
        data: updatedCategory,
        message: "Category updated successfully",
      })
    } catch (dbError) {
      console.error("Database error updating category:", dbError)
      return NextResponse.json(
        {
          success: false,
          error: "Database error: Failed to update category",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error updating category:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update category",
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
          error: "Category ID is required",
        },
        { status: 400 },
      )
    }

    try {
      const { db } = await connectToDatabase()

      // Check if category has products
      const productCount = await db.collection(COLLECTIONS.PRODUCTS).countDocuments({
        category: { $exists: true },
      })

      if (productCount > 0) {
        // Get category name for the check
        const category = await db.collection(COLLECTIONS.CATEGORIES).findOne({ id })
        if (category) {
          const productsInCategory = await db.collection(COLLECTIONS.PRODUCTS).countDocuments({
            category: category.name,
          })

          if (productsInCategory > 0) {
            return NextResponse.json(
              {
                success: false,
                error: "Cannot delete category that contains products. Please move or delete products first.",
              },
              { status: 400 },
            )
          }
        }
      }

      const result = await db.collection(COLLECTIONS.CATEGORIES).deleteOne({ id })

      if (result.deletedCount === 0) {
        return NextResponse.json(
          {
            success: false,
            error: "Category not found",
          },
          { status: 404 },
        )
      }

      return NextResponse.json({
        success: true,
        message: "Category deleted successfully",
      })
    } catch (dbError) {
      console.error("Database error deleting category:", dbError)
      return NextResponse.json(
        {
          success: false,
          error: "Database error: Failed to delete category",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete category",
      },
      { status: 500 },
    )
  }
}
