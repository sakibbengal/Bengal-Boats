"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface SiteSettings {
  siteName: string
  siteUrl: string
  siteDescription: string
  logo: string
  favicon: string
  heroImage: string
  heroTitle: string
  heroSubtitle: string
  heroButtonText: string
  categoryImage1: string
  categoryImage2: string
  categoryImage3: string
  aboutImage: string
  contactEmail: string
  contactPhone: string
  address: string
  socialMedia: {
    facebook: string
    instagram: string
    youtube: string
  }
}

interface SiteSettingsContextType {
  settings: SiteSettings
  updateSettings: (updates: Partial<SiteSettings>) => Promise<void>
  isLoaded: boolean
  isLoading: boolean
  isClient: boolean
}

const defaultSettings: SiteSettings = {
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

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined)

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Set client-side flag
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Load settings from API on mount
  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const response = await fetch("/api/settings")
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setSettings({ ...defaultSettings, ...data.settings })
        }
      }
    } catch (error) {
      console.error("Failed to load settings:", error)
    } finally {
      setIsLoaded(true)
    }
  }

  const updateSettings = async (updates: Partial<SiteSettings>) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setSettings({ ...defaultSettings, ...data.settings })
        }
      } else {
        throw new Error("Failed to save settings")
      }
    } catch (error) {
      console.error("Failed to update settings:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SiteSettingsContext.Provider value={{ settings, updateSettings, isLoaded, isLoading, isClient }}>
      {children}
    </SiteSettingsContext.Provider>
  )
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext)
  if (context === undefined) {
    throw new Error("useSiteSettings must be used within a SiteSettingsProvider")
  }
  return context
}
