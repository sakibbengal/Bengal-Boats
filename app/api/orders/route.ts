import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, customer, paymentMethod, deliveryOption, deliveryFee, subtotal, total, notes, status } = body

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, message: "Items are required" }, { status: 400 })
    }

    if (!customer || !customer.name || !customer.email || !customer.phone || !customer.address) {
      return NextResponse.json({ success: false, message: "Customer information is required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Create order object
    const order = {
      items: items.map((item: any) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        city: customer.city || "",
        postalCode: customer.postalCode || "",
      },
      paymentMethod: paymentMethod || "cash_on_delivery",
      deliveryOption: deliveryOption || "inside_dhaka",
      deliveryFee: deliveryFee || 0,
      subtotal: subtotal || 0,
      total: total || 0,
      notes: notes || "",
      status: status || "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Insert order into database
    const result = await db.collection("orders").insertOne(order)

    if (result.insertedId) {
      const createdOrder = await db.collection("orders").findOne({ _id: result.insertedId })
      return NextResponse.json({
        success: true,
        message: "Order created successfully",
        order: createdOrder,
      })
    } else {
      return NextResponse.json({ success: false, message: "Failed to create order" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const skip = Number.parseInt(searchParams.get("skip") || "0")

    const { db } = await connectToDatabase()

    // Build query
    const query: any = {}
    if (status && status !== "all") {
      query.status = status
    }

    // Get orders with pagination
    const orders = await db.collection("orders").find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray()

    // Get total count
    const total = await db.collection("orders").countDocuments(query)

    return NextResponse.json({
      success: true,
      orders,
      pagination: {
        total,
        limit,
        skip,
        hasMore: skip + limit < total,
      },
    })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
