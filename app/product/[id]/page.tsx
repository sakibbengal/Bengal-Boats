"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { PageLayout } from "@/components/page-layout"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingCart, Minus, Plus, Star, ChevronLeft, ChevronRight, Check, AlertCircle } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"

interface Product {
  _id: string
  id: string
  name: string
  price: number
  image: string
  images?: string[]
  category: string
  description: string
  longDescription?: string
  specifications?: string
  inStock: boolean
  stock?: number
  rating?: number
  reviews?: number
  featured: boolean
  flashSale?: boolean
  bestSeller?: boolean
  tags?: string[]
}

export default function ProductPage() {
  const params = useParams()
  const { addItem } = useCart()
  const { toast } = useToast()

  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string)
    }
  }, [params.id])

  const fetchProduct = async (id: string) => {
    try {
      setIsLoading(true)

      // Fetch product details
      const productResponse = await fetch(`/api/products/${id}`)

      if (!productResponse.ok) {
        throw new Error("Product not found")
      }

      const productData = await productResponse.json()
      console.log("Product API response:", productData) // Debug log

      if (productData.success && productData.product) {
        setProduct(productData.product)

        // Fetch related products
        try {
          const relatedResponse = await fetch(`/api/products?category=${productData.product.category}&limit=4`)
          const relatedData = await relatedResponse.json()

          if (relatedData.success && relatedData.products) {
            // Filter out current product from related products
            const filtered = relatedData.products.filter((p: Product) => p._id !== id && p.id !== id)
            setRelatedProducts(filtered.slice(0, 4))
          }
        } catch (relatedError) {
          console.error("Error fetching related products:", relatedError)
          // Continue without related products
        }
      } else {
        throw new Error("Invalid product data")
      }
    } catch (error) {
      console.error("Error fetching product:", error)
      toast({
        title: "Error",
        description: "Product not found or failed to load",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!product) return

    try {
      addItem({
        id: product._id || product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        stock: product.stock || 10,
        quantity: quantity,
      })

      toast({
        title: "Added to Cart",
        description: `${quantity} × ${product.name} added to your cart`,
      })
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      })
    }
  }

  const handleBuyNow = () => {
    handleAddToCart()
    // Redirect to cart page
    window.location.href = "/cart"
  }

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 10)) {
      setQuantity(newQuantity)
    }
  }

  const handleImageNavigation = (direction: "prev" | "next") => {
    if (!product?.images) return

    const totalImages = product.images.length
    if (direction === "prev") {
      setSelectedImageIndex((prev) => (prev - 1 + totalImages) % totalImages)
    } else {
      setSelectedImageIndex((prev) => (prev + 1) % totalImages)
    }
  }

  if (isLoading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    )
  }

  if (!product) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <AlertCircle className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
            <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </div>
        </div>
      </PageLayout>
    )
  }

  const displayImages = product.images && product.images.length > 0 ? product.images : [product.image]
  const currentImage = displayImages[selectedImageIndex] || product.image

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={currentImage || "/placeholder.svg?height=600&width=600"}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {displayImages.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={() => handleImageNavigation("prev")}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={() => handleImageNavigation("next")}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}

              {!product.inStock && (
                <Badge className="absolute top-4 right-4 bg-gray-500 hover:bg-gray-500">Out of Stock</Badge>
              )}
            </div>

            {/* Thumbnail Images */}
            {displayImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {displayImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index ? "border-[#00ADB5]" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image || "/placeholder.svg?height=80&width=80"}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="outline" className="mb-2">
                {product.category}
              </Badge>
              <h1 className="text-3xl font-bold text-[#222831] mb-2">{product.name}</h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-[#00ADB5]">৳{product.price.toLocaleString()}</span>
                </div>

                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < (product.rating || 4) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-1">({product.rating || 4.0})</span>
                </div>
              </div>

              <p className="text-[#393E46] leading-relaxed">{product.longDescription || product.description}</p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.inStock ? (
                <>
                  <Check className="h-5 w-5 text-green-600" />
                  <span className="text-green-600 font-medium">In Stock</span>
                  {product.stock && <span className="text-sm text-gray-500">({product.stock} available)</span>}
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <span className="text-red-600 font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="h-10 w-10 p-0"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= (product.stock || 10)}
                    className="h-10 w-10 p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 bg-[#00ADB5] hover:bg-[#00ADB5]/90 text-white"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                  variant="outline"
                  className="flex-1 border-[#00ADB5] text-[#00ADB5] hover:bg-[#00ADB5] hover:text-white bg-transparent"
                >
                  Buy Now
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="mb-12">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="prose max-w-none">
                  <p className="text-[#393E46] leading-relaxed whitespace-pre-line">
                    {product.longDescription || product.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specifications" className="mt-6">
            <Card>
              <CardContent className="p-6">
                {product.specifications ? (
                  <div className="prose max-w-none">
                    <div className="text-[#393E46] leading-relaxed whitespace-pre-line">{product.specifications}</div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">No specifications available for this product.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-[#222831] mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct._id || relatedProduct.id}
                  product={{
                    id: relatedProduct._id || relatedProduct.id,
                    name: relatedProduct.name,
                    price: relatedProduct.price,
                    image: relatedProduct.image,
                    category: relatedProduct.category,
                    description: relatedProduct.description,
                    inStock: relatedProduct.inStock,
                    featured: relatedProduct.featured,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  )
}
