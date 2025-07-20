import { type NextRequest, NextResponse } from "next/server"
import { initializeDatabase } from "@/lib/database-operations"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: "Use POST method to initialize the database",
    endpoint: "/api/init-db",
    method: "POST",
  })
}

export async function POST(request: NextRequest) {
  try {
    const result = await initializeDatabase()

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
      data: result,
    })
  } catch (error) {
    console.error("Database initialization failed:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Failed to initialize database",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
