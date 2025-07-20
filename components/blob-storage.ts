/**
 * Simple blob storage utility for handling large images
 * This provides a more reliable alternative to localStorage for large files
 */

// In-memory cache for the current session
const memoryCache = new Map<string, string>()

export const BlobStorage = {
  // Store a blob (data URL or object URL)
  store: async (key: string, data: string): Promise<boolean> => {
    try {
      // Always keep in memory
      memoryCache.set(key, data)

      // Try to persist in localStorage if not too large
      if (data.length < 2 * 1024 * 1024) {
        // Under 2MB
        localStorage.setItem(`blob:${key}`, data)
        return true
      }

      // For larger blobs, we'll just keep them in memory
      // In a real app, you'd upload these to a server/CDN
      console.log(`Blob ${key} is too large for localStorage, keeping in memory only`)
      return true
    } catch (error) {
      console.error(`Failed to store blob ${key}:`, error)
      return false
    }
  },

  // Retrieve a blob
  get: (key: string): string | null => {
    // First check memory cache (for current session)
    if (memoryCache.has(key)) {
      return memoryCache.get(key) || null
    }

    // Then try localStorage
    try {
      const data = localStorage.getItem(`blob:${key}`)
      if (data) {
        // Add to memory cache for faster access next time
        memoryCache.set(key, data)
        return data
      }
    } catch (error) {
      console.error(`Failed to retrieve blob ${key}:`, error)
    }

    return null
  },

  // Remove a blob
  remove: (key: string): boolean => {
    try {
      memoryCache.delete(key)
      localStorage.removeItem(`blob:${key}`)
      return true
    } catch (error) {
      console.error(`Failed to remove blob ${key}:`, error)
      return false
    }
  },

  // Clear all blobs
  clear: (): boolean => {
    try {
      memoryCache.clear()

      // Remove all blob items from localStorage
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("blob:")) {
          localStorage.removeItem(key)
        }
      })

      return true
    } catch (error) {
      console.error("Failed to clear blobs:", error)
      return false
    }
  },
}
