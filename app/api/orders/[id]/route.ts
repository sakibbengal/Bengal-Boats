import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid order ID" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    const order = await db.collection("orders").findOne({ _id: new ObjectId(id) })

    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      order,
    })
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid order ID" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Update order
    const result = await db.collection("orders").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...body,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 })
    }

    // Get updated order
    const updatedOrder = await db.collection("orders").findOne({
      _id: new ObjectId(id),
    })

    return NextResponse.json({
      success: true,
      message: "Order updated successfully",
      order: updatedOrder,
    })
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid order ID" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Prepare update object
    const updateData: any = {
      updatedAt: new Date(),
    }

    // Add fields that can be updated
    if (body.status) {
      updateData.status = body.status
    }

    if (body.trackingNumber) {
      updateData.trackingNumber = body.trackingNumber
    }

    if (body.notes) {
      updateData.notes = body.notes
    }

    // Update the order
    const result = await db
      .collection("orders")
      .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: updateData }, { returnDocument: "after" })

    if (!result.value) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Order updated successfully",
      order: result.value,
    })
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid order ID" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    const result = await db.collection("orders").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Order deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting order:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
