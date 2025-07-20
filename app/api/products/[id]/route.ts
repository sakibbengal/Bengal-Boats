import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()
    const { id } = params

    console.log("Fetching product with ID:", id) // Debug log

    let product = null

    // Try to find by MongoDB ObjectId first
    if (ObjectId.isValid(id)) {
      try {
        product = await db.collection("products").findOne({ _id: new ObjectId(id) })
        console.log("Found by ObjectId:", product ? "Yes" : "No") // Debug log
      } catch (error) {
        console.log("ObjectId search failed:", error)
      }
    }

    // If not found by ObjectId, try by string id
    if (!product) {
      product = await db.collection("products").findOne({ id: id })
      console.log("Found by string id:", product ? "Yes" : "No") // Debug log
    }

    // If still not found, try by _id as string
    if (!product) {
      product = await db.collection("products").findOne({ _id: id })
      console.log("Found by _id string:", product ? "Yes" : "No") // Debug log
    }

    if (!product) {
      console.log("Product not found with any method")
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 })
    }

    // Transform MongoDB document to proper format
    const transformedProduct = {
      _id: product._id?.toString() || product.id,
      id: product._id?.toString() || product.id,
      name: product.name || "",
      description: product.description || "",
      longDescription: product.longDescription || product.description || "",
      price: Number(product.price) || 0,
      originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
      category: product.category || "",
      images: Array.isArray(product.images)
        ? product.images
        : product.image
          ? [product.image]
          : ["/placeholder.svg?height=300&width=300&text=No+Image"],
      image:
        product.image ||
        (Array.isArray(product.images) && product.images[0]) ||
        "/placeholder.svg?height=300&width=300&text=No+Image",
      stock: Number(product.stock) || Number(product.stockQuantity) || 0,
      inStock:
        product.inStock !== undefined
          ? Boolean(product.inStock)
          : (Number(product.stock) || Number(product.stockQuantity) || 0) > 0,
      rating: Number(product.rating) || 4,
      reviews: Number(product.reviews) || 0,
      featured: Boolean(product.featured),
      flashSale: Boolean(product.flashSale),
      bestSeller: Boolean(product.bestSeller),
      tags: Array.isArray(product.tags) ? product.tags : [],
      specifications: product.specifications || "",
      createdAt: product.createdAt || new Date().toISOString(),
      updatedAt: product.updatedAt || new Date().toISOString(),
    }

    console.log("Returning transformed product:", transformedProduct.name) // Debug log

    return NextResponse.json({
      success: true,
      product: transformedProduct,
    })
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch product",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()
    const { id } = params
    const body = await request.json()

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid product ID" }, { status: 400 })
    }

    const updateData: any = {
      updatedAt: new Date().toISOString(),
    }

    // Only update fields that are provided
    if (body.name !== undefined) updateData.name = body.name
    if (body.description !== undefined) updateData.description = body.description
    if (body.longDescription !== undefined) updateData.longDescription = body.longDescription
    if (body.price !== undefined) updateData.price = Number(body.price)
    if (body.originalPrice !== undefined)
      updateData.originalPrice = body.originalPrice ? Number(body.originalPrice) : undefined
    if (body.category !== undefined) updateData.category = body.category
    if (body.images !== undefined)
      updateData.images = Array.isArray(body.images)
        ? body.images
        : body.image
          ? [body.image]
          : ["/placeholder.svg?height=300&width=300&text=No+Image"]
    if (body.stock !== undefined) {
      updateData.stock = Number(body.stock)
      updateData.inStock = Number(body.stock) > 0
    }
    if (body.rating !== undefined) updateData.rating = Number(body.rating)
    if (body.reviews !== undefined) updateData.reviews = Number(body.reviews)
    if (body.featured !== undefined) updateData.featured = Boolean(body.featured)
    if (body.flashSale !== undefined) updateData.flashSale = Boolean(body.flashSale)
    if (body.bestSeller !== undefined) updateData.bestSeller = Boolean(body.bestSeller)
    if (body.tags !== undefined) updateData.tags = Array.isArray(body.tags) ? body.tags : []
    if (body.specifications !== undefined) updateData.specifications = body.specifications

    const result = await db.collection("products").updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
    })
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update product",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()
    const { id } = params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid product ID" }, { status: 400 })
    }

    const result = await db.collection("products").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete product",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
