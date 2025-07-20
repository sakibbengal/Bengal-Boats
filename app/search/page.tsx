"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { PageLayout } from "@/components/page-layout"
import { ProductCard } from "@/components/product-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Package } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  stock: number
  rating?: number
  reviews?: number
  description?: string
  featured?: boolean
  flashSale?: boolean
  bestSeller?: boolean
}

function SearchResults() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const searchParams = useSearchParams()

  useEffect(() => {
    const query = searchParams.get("q")
    if (query) {
      setSearchTerm(query)
      searchProducts(query)
    } else {
      setIsLoading(false)
    }
  }, [searchParams])

  const searchProducts = async (query: string) => {
    try {
      setIsLoading(true)
      console.log("Searching for:", query)

      const response = await fetch(`/api/products?search=${encodeURIComponent(query)}`)
      const data = await response.json()

      console.log("Search results:", data)

      if (data.success && data.products) {
        setProducts(data.products)
      } else {
        console.error("Search failed:", data.message)
        setProducts([])
      }
    } catch (error) {
      console.error("Error searching products:", error)
      setProducts([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      searchProducts(searchTerm.trim())
    }
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#222831] mb-4">Search Results</h1>
          {searchParams.get("q") && (
            <p className="text-[#393E46]">
              Results for: <span className="font-semibold">"{searchParams.get("q")}"</span>
            </p>
          )}
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg border p-6 mb-8">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" disabled={!searchTerm.trim()}>
              Search
            </Button>
          </form>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="mb-6">
              <p className="text-[#393E46]">
                Found {products.length} product{products.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Products Found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm
                ? `No products found for "${searchTerm}". Try different keywords or browse our categories.`
                : "Enter a search term to find products."}
            </p>
            <Button onClick={() => (window.location.href = "/shop")} variant="outline">
              Browse All Products
            </Button>
          </div>
        )}
      </div>
    </PageLayout>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchResults />
    </Suspense>
  )
}
