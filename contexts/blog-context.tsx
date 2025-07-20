"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  category: string
  tags: string[]
  featuredImage: string
  published: boolean
  views: number
  publishedAt?: string
  createdAt?: Date
  updatedAt?: Date
}

interface BlogContextType {
  posts: BlogPost[]
  categories: string[]
  getPostBySlug: (slug: string) => BlogPost | null
  getRelatedPosts: (postId: string, category: string) => BlogPost[]
  isLoading: boolean
  error: string | null
}

const BlogContext = createContext<BlogContextType | undefined>(undefined)

export function BlogProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchBlogData()
  }, [])

  const fetchBlogData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Fetch blog posts
      const postsResponse = await fetch("/api/blog/posts")
      const postsData = await postsResponse.json()

      if (postsData.success) {
        setPosts(postsData.data || [])

        // Extract unique categories from posts
        const uniqueCategories = [...new Set(postsData.data?.map((post: BlogPost) => post.category) || [])]
        setCategories(uniqueCategories)
      } else {
        throw new Error(postsData.error || "Failed to fetch blog posts")
      }
    } catch (err) {
      console.error("Error fetching blog data:", err)
      setError(err instanceof Error ? err.message : "Failed to load blog data")

      // Fallback to empty data
      setPosts([])
      setCategories([])
    } finally {
      setIsLoading(false)
    }
  }

  const getPostBySlug = (slug: string): BlogPost | null => {
    return posts.find((post) => post.slug === slug) || null
  }

  const getRelatedPosts = (postId: string, category: string): BlogPost[] => {
    return posts.filter((post) => post.id !== postId && post.category === category && post.published).slice(0, 3)
  }

  return (
    <BlogContext.Provider
      value={{
        posts,
        categories,
        getPostBySlug,
        getRelatedPosts,
        isLoading,
        error,
      }}
    >
      {children}
    </BlogContext.Provider>
  )
}

export function useBlog() {
  const context = useContext(BlogContext)
  if (context === undefined) {
    throw new Error("useBlog must be used within a BlogProvider")
  }
  return context
}
