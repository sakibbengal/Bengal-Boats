import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const category = formData.get("category") as string

    console.log("Upload API called with:", { fileName: file?.name, category })

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ success: false, error: "File must be an image" }, { status: 400 })
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: "File size must be less than 5MB" }, { status: 400 })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const extension = file.name.split(".").pop() || "jpg"
    const filename = `${category || "general"}-${timestamp}-${randomString}.${extension}`

    try {
      // Upload to Vercel Blob
      const blob = await put(filename, file, {
        access: "public",
      })

      console.log("File uploaded successfully to Vercel Blob:", {
        originalName: file.name,
        savedAs: filename,
        url: blob.url,
        size: file.size,
      })

      return NextResponse.json({
        success: true,
        url: blob.url,
        filename: filename,
      })
    } catch (blobError) {
      console.error("Vercel Blob upload error:", blobError)

      // Fallback: Try to save locally (for development)
      if (process.env.NODE_ENV === "development") {
        const { writeFile, mkdir } = await import("fs/promises")
        const { existsSync } = await import("fs")
        const path = await import("path")

        const uploadsDir = path.join(process.cwd(), "public", "uploads")
        if (!existsSync(uploadsDir)) {
          await mkdir(uploadsDir, { recursive: true })
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const filepath = path.join(uploadsDir, filename)
        await writeFile(filepath, buffer)

        const imageUrl = `/uploads/${filename}`
        console.log("File uploaded locally (development):", imageUrl)

        return NextResponse.json({
          success: true,
          url: imageUrl,
          filename: filename,
        })
      }

      throw blobError
    }
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to upload file",
      },
      { status: 500 },
    )
  }
}
