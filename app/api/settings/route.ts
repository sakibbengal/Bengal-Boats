import { type NextRequest, NextResponse } from "next/server"
import { readFile, writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

const SETTINGS_FILE = path.join(process.cwd(), "data", "settings.json")

const defaultSettings = {
  siteName: "Bengal Boats Beyond",
  siteUrl: "",
  siteDescription: "",
  logo: "",
  favicon: "",
  heroImage: "",
  heroTitle: "Explore Modern RC Adventures",
  heroSubtitle: "SHOP NOW TODAY",
  heroButtonText: "Shop Now",
  categoryImage1: "",
  categoryImage2: "",
  categoryImage3: "",
  aboutImage: "",
  contactEmail: "",
  contactPhone: "",
  address: "",
  socialMedia: {
    facebook: "",
    instagram: "",
    youtube: "",
  },
}

export async function GET() {
  try {
    if (existsSync(SETTINGS_FILE)) {
      const data = await readFile(SETTINGS_FILE, "utf-8")
      const settings = JSON.parse(data)
      return NextResponse.json({ success: true, settings: { ...defaultSettings, ...settings } })
    } else {
      return NextResponse.json({ success: true, settings: defaultSettings })
    }
  } catch (error) {
    console.error("Error reading settings:", error)
    return NextResponse.json({ success: true, settings: defaultSettings })
  }
}

export async function POST(request: NextRequest) {
  try {
    const updates = await request.json()

    // Create data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), "data")
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true })
    }

    // Read existing settings or use defaults
    let currentSettings = defaultSettings
    if (existsSync(SETTINGS_FILE)) {
      try {
        const data = await readFile(SETTINGS_FILE, "utf-8")
        currentSettings = { ...defaultSettings, ...JSON.parse(data) }
      } catch (error) {
        console.error("Error reading existing settings:", error)
      }
    }

    // Merge updates with current settings
    const newSettings = { ...currentSettings, ...updates }

    // Save to file
    await writeFile(SETTINGS_FILE, JSON.stringify(newSettings, null, 2))

    return NextResponse.json({ success: true, settings: newSettings })
  } catch (error) {
    console.error("Error saving settings:", error)
    return NextResponse.json({ success: false, error: "Failed to save settings" }, { status: 500 })
  }
}
