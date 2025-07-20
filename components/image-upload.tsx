"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, X, ImageIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ImageUploadProps {
  images?: string[]
  onImagesChange?: (images: string[]) => void
  onImageUpload?: (imageUrl: string) => void
  currentImage?: string
  category: string
  label?: string
  maxImages?: number
}

export function ImageUpload({
  images = [],
  onImagesChange,
  onImageUpload,
  currentImage,
  category,
  label = "Upload Image",
  maxImages = 5,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>(
    images.length > 0 ? images : currentImage ? [currentImage] : [],
  )
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    // Check if adding these files would exceed maxImages
    if (uploadedImages.length + files.length > maxImages) {
      toast({
        title: "Too many images",
        description: `You can only upload up to ${maxImages} images`,
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      const newImages: string[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: `${file.name} is too large. File size must be less than 5MB`,
            variant: "destructive",
          })
          continue
        }

        // Check file type
        if (!file.type.startsWith("image/")) {
          toast({
            title: "Invalid file type",
            description: `${file.name} is not an image file`,
            variant: "destructive",
          })
          continue
        }

        // Create form data
        const formData = new FormData()
        formData.append("file", file)
        formData.append("category", category)

        console.log("Uploading file:", file.name, "Category:", category)

        // Upload to server
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        const data = await response.json()
        console.log("Upload response:", data)

        if (response.ok && data.success) {
          newImages.push(data.url)
        } else {
          throw new Error(data.error || `Upload failed for ${file.name}`)
        }
      }

      if (newImages.length > 0) {
        const updatedImages = [...uploadedImages, ...newImages]
        setUploadedImages(updatedImages)

        // Call the appropriate callback
        if (onImagesChange) {
          onImagesChange(updatedImages)
        } else if (onImageUpload && newImages.length > 0) {
          onImageUpload(newImages[0])
        }

        toast({
          title: "Success",
          description: `${newImages.length} image(s) uploaded successfully`,
        })
      }
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Error uploading image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemove = (index: number) => {
    const updatedImages = uploadedImages.filter((_, i) => i !== index)
    setUploadedImages(updatedImages)

    if (onImagesChange) {
      onImagesChange(updatedImages)
    } else if (onImageUpload) {
      onImageUpload(updatedImages.length > 0 ? updatedImages[0] : "")
    }
  }

  const handleRemoveAll = () => {
    setUploadedImages([])
    if (onImagesChange) {
      onImagesChange([])
    } else if (onImageUpload) {
      onImageUpload("")
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      {/* Display uploaded images */}
      {uploadedImages.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              Uploaded Images ({uploadedImages.length}/{maxImages})
            </p>
            <Button type="button" variant="outline" size="sm" onClick={handleRemoveAll} disabled={isUploading}>
              Remove All
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {uploadedImages.map((imageUrl, index) => (
              <div key={index} className="relative group">
                <img
                  src={imageUrl || "/placeholder.svg"}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder.svg?height=128&width=128&text=Error"
                  }}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemove(index)}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload area */}
      {uploadedImages.length < maxImages && (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
          onClick={handleClick}
        >
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            {isUploading ? "Uploading..." : `Click to upload ${uploadedImages.length === 0 ? "images" : "more images"}`}
          </p>
          <p className="text-xs text-gray-500">
            PNG, JPG, GIF up to 5MB • {uploadedImages.length}/{maxImages} images
          </p>
        </div>
      )}

      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        disabled={isUploading}
        className="hidden"
      />

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleClick}
          disabled={isUploading || uploadedImages.length >= maxImages}
          className="flex-1 bg-transparent"
        >
          <Upload className="h-4 w-4 mr-2" />
          {isUploading ? "Uploading..." : uploadedImages.length >= maxImages ? "Max Images Reached" : "Choose Files"}
        </Button>
      </div>

      {isUploading && (
        <div className="flex items-center justify-center p-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-blue-600">Uploading images...</span>
        </div>
      )}
    </div>
  )
}
