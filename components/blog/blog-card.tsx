import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface BlogCardProps {
  post: {
    id: string
    slug: string
    title: string
    excerpt: string
    coverImage: string
    date: string
    category: string
    views?: number
  }
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <div className="group border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
        <div className="aspect-[16/9] overflow-hidden">
          <img
            src={post.coverImage || "/placeholder.svg?height=400&width=600&query=RC+boats+blog"}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-5 flex flex-col flex-grow">
          <Badge variant="secondary" className="w-fit mb-2">
            {post.category}
          </Badge>
          <h3 className="font-bold text-lg mb-2 group-hover:text-black transition-colors">{post.title}</h3>
          <p className="text-muted-foreground text-sm mb-4 flex-grow">{post.excerpt}</p>
          <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-100">
            <p className="text-xs text-muted-foreground">
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="text-xs text-muted-foreground">{post.views || 0} views</p>
          </div>
        </div>
      </div>
    </Link>
  )
}
