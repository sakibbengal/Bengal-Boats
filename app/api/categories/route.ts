import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    const categories = await db.collection("categories").find({}).toArray()

    console.log("Categories found:", categories)

    return NextResponse.json({
      success: true,
      categories: categories.map((category) => ({
        _id: category._id.toString(),
        id: category.id || category._id.toString(),
        name: category.name,
        description: category.description,
      })),
    })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["id", "name", "description"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ success: false, error: `${field} is required` }, { status: 400 })
      }
    }

    // Check if category with same id already exists
    const existingCategory = await db.collection("categories").findOne({
      id: body.id,
    })

    if (existingCategory) {
      return NextResponse.json({ success: false, error: "Category with this ID already exists" }, { status: 409 })
    }

    const categoryData = {
      id: body.id,
      name: body.name.trim(),
      description: body.description.trim(),
      icon: body.icon || "",
      image: body.image || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("categories").insertOne(categoryData)

    return NextResponse.json(
      {
        success: true,
        category: {
          ...categoryData,
          _id: result.insertedId.toString(),
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json({ success: false, error: "Failed to create category" }, { status: 500 })
  }
}
