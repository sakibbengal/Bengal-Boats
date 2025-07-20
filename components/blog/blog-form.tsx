"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/image-upload"
import { X, Plus, Save, ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

interface BlogFormProps {
  onSubmit: (data: any) => void
  isSubmitting: boolean
  initialData?: any
}

export function BlogForm({ onSubmit, isSubmitting, initialData }: BlogFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    featuredImage: "",
    tags: [] as string[],
    author: {
      name: "Admin",
      avatar: "/placeholder.svg?height=40&width=40&text=A",
    },
    status: "published" as "draft" | "published",
  })
  const [newTag, setNewTag] = useState("")
  const [images, setImages] = useState<string[]>([])

  // Initialize form with initial data if provided
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        excerpt: initialData.excerpt || "",
        content: initialData.content || "",
        featuredImage: initialData.featuredImage || "",
        tags: initialData.tags || [],
        author: initialData.author || {
          name: "Admin",
          avatar: "/placeholder.svg?height=40&width=40&text=A",
        },
        status: initialData.status || "published",
      })

      if (initialData.featuredImage) {
        setImages([initialData.featuredImage])
      }
    }
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag],
      }))
      setNewTag("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }))
  }

  const handleImagesChange = (newImages: string[]) => {
    setImages(newImages)
    if (newImages.length > 0) {
      setFormData((prev) => ({ ...prev, featuredImage: newImages[0] }))
    } else {
      setFormData((prev) => ({ ...prev, featuredImage: "" }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter post title"
              required
            />
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              placeholder="Brief summary of the post"
              rows={3}
              required
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex space-x-2">
              <Input
                id="tags"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
              />
              <Button type="button" onClick={handleAddTag}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Featured Image */}
          <div className="space-y-2">
            <Label>Featured Image</Label>
            <ImageUpload images={images} onImagesChange={handleImagesChange} maxImages={1} label="Featured Image" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Write your blog post content here..."
          rows={15}
          required
        />
        <p className="text-sm text-muted-foreground">
          You can use HTML tags for formatting. For example, &lt;h2&gt;Heading&lt;/h2&gt; for headings.
        </p>
      </div>

      {/* Form Actions */}
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/blog")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting ? "Saving..." : initialData ? "Update Post" : "Create Post"}
        </Button>
      </div>
    </form>
  )
}
