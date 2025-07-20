"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Package } from "lucide-react"
import Link from "next/link"

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

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/products?featured=true&limit=8")
      const data = await response.json()

      if (data.success && data.products) {
        setProducts(data.products)
      } else {
        console.error("Failed to fetch featured products:", data.message)
        setProducts([])
      }
    } catch (error) {
      console.error("Error fetching featured products:", error)
      setProducts([])
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#222831] mb-4">Featured Products</h2>
            <p className="text-[#393E46] max-w-2xl mx-auto">
              Discover our handpicked selection of premium RC vehicles and accessories
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#222831] mb-4">Featured Products</h2>
            <p className="text-[#393E46] max-w-2xl mx-auto">
              Discover our handpicked selection of premium RC vehicles and accessories
            </p>
          </div>

          <div className="text-center py-12">
            <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Featured Products</h3>
            <p className="text-gray-500 mb-6">Check back later for our featured products</p>
            <Link href="/shop">
              <Button className="bg-[#00ADB5] hover:bg-[#00ADB5]/90">Browse All Products</Button>
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#222831] mb-4">Featured Products</h2>
          <p className="text-[#393E46] max-w-2xl mx-auto">
            Discover our handpicked selection of premium RC vehicles and accessories
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center">
          <Link href="/shop">
            <Button size="lg" className="bg-[#00ADB5] hover:bg-[#00ADB5]/90 text-white px-8">
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
