import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const { searchParams } = new URL(request.url)

    // Get query parameters
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const limit = searchParams.get("limit")
    const featured = searchParams.get("featured")
    const page = searchParams.get("page") || "1"
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "20")

    console.log("Products API called with params:", { category, search, limit, featured, page, pageSize })

    // Build query
    const query: any = {}

    if (category && category !== "all") {
      // Case-insensitive category matching
      query.category = { $regex: new RegExp(category, "i") }
    }

    if (search) {
      query.$or = [
        { name: { $regex: new RegExp(search, "i") } },
        { description: { $regex: new RegExp(search, "i") } },
        { category: { $regex: new RegExp(search, "i") } },
      ]
    }

    if (featured === "true") {
      query.featured = true
    }

    console.log("MongoDB query:", JSON.stringify(query))

    // Execute query
    let productsQuery = db.collection("products").find(query)

    // Apply limit if specified
    if (limit) {
      productsQuery = productsQuery.limit(Number.parseInt(limit))
    } else {
      // Apply pagination
      const skip = (Number.parseInt(page) - 1) * pageSize
      productsQuery = productsQuery.skip(skip).limit(pageSize)
    }

    const products = await productsQuery.toArray()
    console.log(`Found ${products.length} products`)

    // Transform products to consistent format
    const transformedProducts = products.map((product) => ({
      _id: product._id.toString(),
      id: product._id.toString(),
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
    }))

    // Get total count for pagination (only if not using limit)
    let totalCount = transformedProducts.length
    if (!limit) {
      totalCount = await db.collection("products").countDocuments(query)
    }

    return NextResponse.json({
      success: true,
      products: transformedProducts,
      pagination: {
        page: Number.parseInt(page),
        pageSize,
        total: totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch products",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["name", "price", "category", "description"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ success: false, error: `${field} is required` }, { status: 400 })
      }
    }

    const productData = {
      name: body.name.trim(),
      description: body.description.trim(),
      longDescription: body.longDescription?.trim() || body.description.trim(),
      price: Number(body.price),
      originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
      category: body.category.trim(),
      images: Array.isArray(body.images) ? body.images : body.image ? [body.image] : [],
      image: body.image || (Array.isArray(body.images) && body.images[0]) || "",
      stock: Number(body.stock) || 0,
      inStock: body.inStock !== undefined ? Boolean(body.inStock) : Number(body.stock || 0) > 0,
      rating: Number(body.rating) || 0,
      reviews: Number(body.reviews) || 0,
      featured: Boolean(body.featured),
      flashSale: Boolean(body.flashSale),
      bestSeller: Boolean(body.bestSeller),
      tags: Array.isArray(body.tags) ? body.tags : [],
      specifications: body.specifications || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const result = await db.collection("products").insertOne(productData)

    return NextResponse.json(
      {
        success: true,
        product: {
          ...productData,
          _id: result.insertedId.toString(),
          id: result.insertedId.toString(),
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ success: false, error: "Failed to create product" }, { status: 500 })
  }
}
