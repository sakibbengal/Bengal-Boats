"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"

interface Product {
  _id?: string
  id?: string
  name: string
  price: number
  image?: string
  images?: string[]
  category: string
  description?: string
  stock?: number
  stockQuantity?: number
  inStock?: boolean
}

interface ProductCardProps {
  product: Product
  viewMode?: "grid" | "list"
}

export function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  const { addItem, isInCart, getItemQuantity } = useCart()
  const { toast } = useToast()

  const productId = product._id || product.id || ""
  const productImage = product.image || (product.images && product.images[0]) || "/placeholder.svg?height=300&width=300"
  const productStock = product.stock || product.stockQuantity || 0
  const isOutOfStock = productStock <= 0 || product.inStock === false

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isOutOfStock) {
      toast({
        title: "Out of Stock",
        description: "This product is currently out of stock",
        variant: "destructive",
      })
      return
    }

    if (!productId) {
      toast({
        title: "Error",
        description: "Product ID is missing",
        variant: "destructive",
      })
      return
    }

    const cartItem = {
      id: productId,
      name: product.name,
      price: Number(product.price) || 0,
      image: productImage,
      stock: productStock,
    }

    console.log("Adding to cart:", cartItem)
    addItem(cartItem)

    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart`,
    })
  }

  const inCart = isInCart(productId)
  const cartQuantity = getItemQuantity(productId)

  if (viewMode === "list") {
    return (
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-3 sm:p-4">
          <div className="flex gap-3 sm:gap-4">
            <Link href={`/product/${productId}`} className="flex-shrink-0">
              <img
                src={productImage || "/placeholder.svg"}
                alt={product.name}
                className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
              />
            </Link>
            <div className="flex-1 min-w-0">
              <Link href={`/product/${productId}`}>
                <h3 className="font-medium text-xs sm:text-sm text-[#222831] hover:text-[#00ADB5] transition-colors line-clamp-2 leading-tight">
                  {product.name}
                </h3>
              </Link>
              <p className="text-xs text-gray-600 mt-1 line-clamp-2 hidden sm:block">{product.description}</p>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2 sm:mt-3 gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg sm:text-xl font-bold text-[#00ADB5]">৳{product.price}</span>
                  <Badge variant="outline" className="text-xs">
                    {product.category}
                  </Badge>
                  {isOutOfStock && (
                    <Badge variant="destructive" className="text-xs">
                      Out of Stock
                    </Badge>
                  )}
                </div>
                <div className="flex gap-1 sm:gap-2">
                  <Button
                    onClick={handleAddToCart}
                    size="sm"
                    className="bg-[#00ADB5] hover:bg-[#00ADB5]/90 text-xs px-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={isOutOfStock}
                  >
                    <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    {isOutOfStock ? "Out of Stock" : inCart ? `In Cart (${cartQuantity})` : "Add"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative overflow-hidden">
        <Link href={`/product/${productId}`}>
          <img
            src={productImage || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive" className="text-xs">
              Out of Stock
            </Badge>
          </div>
        )}
        <Badge className="absolute top-2 right-2 bg-[#00ADB5] text-xs">{product.category}</Badge>
      </div>

      <CardContent className="p-3 sm:p-4">
        <Link href={`/product/${productId}`}>
          <h3 className="font-medium text-xs sm:text-sm text-[#222831] hover:text-[#00ADB5] transition-colors line-clamp-2 mb-2 leading-tight min-h-[2rem] sm:min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between mb-3">
          <span className="text-lg sm:text-xl font-bold text-[#00ADB5]">৳{product.price}</span>
          {isOutOfStock && (
            <Badge variant="destructive" className="text-xs">
              Out of Stock
            </Badge>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
          <Button
            onClick={handleAddToCart}
            className="w-full bg-[#00ADB5] hover:bg-[#00ADB5]/90 text-xs sm:text-sm py-1 sm:py-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isOutOfStock}
          >
            <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            {isOutOfStock ? "Out of Stock" : inCart ? `In Cart (${cartQuantity})` : "Add to Cart"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
