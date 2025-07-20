"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { PageLayout } from "@/components/page-layout"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Filter, X, Grid, List } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Product {
  _id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  description: string
  inStock: boolean
  featured: boolean
  specifications?: string
}

const categoryDisplayNames: { [key: string]: string } = {
  cars: "RC Cars",
  boats: "RC Boats",
  helicopters: "RC Helicopters",
  drones: "RC Drones",
  trucks: "RC Trucks",
  motorcycles: "RC Motorcycles",
  batteries: "Batteries",
  chargers: "Chargers",
  parts: "Parts & Accessories",
  tools: "Tools & Equipment",
}

export default function ShopPage() {
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all")
  const [priceRange, setPriceRange] = useState([0, 50000])
  const [sortBy, setSortBy] = useState("name")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    const category = searchParams.get("category")
    if (category) {
      setSelectedCategory(category)
    }
  }, [searchParams])

  useEffect(() => {
    applyFilters()
  }, [products, searchTerm, selectedCategory, priceRange, sortBy])

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/products")
      const data = await response.json()

      if (data.success) {
        setProducts(data.products || [])

        // Set price range based on actual product prices
        if (data.products && data.products.length > 0) {
          const prices = data.products.map((p: Product) => p.price)
          const minPrice = Math.min(...prices)
          const maxPrice = Math.max(...prices)
          setPriceRange([minPrice, maxPrice])
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      toast({
        title: "Network Error",
        description: "Failed to load products. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...products]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Category filter
    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter((product) => {
        const productCategory = product.category.toLowerCase()
        const filterCategory = selectedCategory.toLowerCase()

        // Check for exact matches and common variations
        return (
          productCategory.includes(filterCategory) ||
          filterCategory.includes(productCategory) ||
          (filterCategory === "cars" && (productCategory.includes("car") || productCategory.includes("vehicle"))) ||
          (filterCategory === "boats" && (productCategory.includes("boat") || productCategory.includes("ship"))) ||
          (filterCategory === "helicopters" && productCategory.includes("helicopter")) ||
          (filterCategory === "drones" &&
            (productCategory.includes("drone") || productCategory.includes("quadcopter"))) ||
          (filterCategory === "trucks" && productCategory.includes("truck")) ||
          (filterCategory === "motorcycles" &&
            (productCategory.includes("motorcycle") || productCategory.includes("bike"))) ||
          (filterCategory === "batteries" && productCategory.includes("battery")) ||
          (filterCategory === "chargers" && productCategory.includes("charger")) ||
          (filterCategory === "parts" && (productCategory.includes("part") || productCategory.includes("accessory"))) ||
          (filterCategory === "tools" && productCategory.includes("tool"))
        )
      })
    }

    // Price filter
    filtered = filtered.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1])

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "name":
          return a.name.localeCompare(b.name)
        case "newest":
          return new Date(b._id).getTime() - new Date(a._id).getTime()
        default:
          return 0
      }
    })

    setFilteredProducts(filtered)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setSortBy("name")
    if (products.length > 0) {
      const prices = products.map((p) => p.price)
      setPriceRange([Math.min(...prices), Math.max(...prices)])
    }
  }

  const activeFiltersCount = [
    searchTerm,
    selectedCategory !== "all" ? selectedCategory : null,
    priceRange[0] > 0 || priceRange[1] < 50000 ? "price" : null,
  ].filter(Boolean).length

  if (isLoading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#222831]">Shop</h1>
            <p className="text-[#393E46] mt-1">
              {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"} found
              {selectedCategory !== "all" && (
                <span className="ml-2">
                  in <strong>{categoryDisplayNames[selectedCategory] || selectedCategory}</strong>
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>

            <div className="flex items-center border rounded-lg">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-64 space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}>
            <Card>
              <CardContent className="p-6 space-y-6">
                {/* Search */}
                <div>
                  <label className="text-sm font-medium text-[#222831] mb-2 block">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#393E46] h-4 w-4" />
                    <Input
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-[#393E46]/30 focus:border-[#00ADB5]"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="text-sm font-medium text-[#222831] mb-2 block">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="border-[#393E46]/30 focus:border-[#00ADB5]">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="cars">RC Cars</SelectItem>
                      <SelectItem value="boats">RC Boats</SelectItem>
                      <SelectItem value="helicopters">RC Helicopters</SelectItem>
                      <SelectItem value="drones">RC Drones</SelectItem>
                      <SelectItem value="trucks">RC Trucks</SelectItem>
                      <SelectItem value="motorcycles">RC Motorcycles</SelectItem>
                      <SelectItem value="batteries">Batteries</SelectItem>
                      <SelectItem value="chargers">Chargers</SelectItem>
                      <SelectItem value="parts">Parts & Accessories</SelectItem>
                      <SelectItem value="tools">Tools & Equipment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-sm font-medium text-[#222831] mb-2 block">
                    Price Range: ৳{priceRange[0]} - ৳{priceRange[1]}
                  </label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={50000}
                    min={0}
                    step={100}
                    className="mt-2"
                  />
                </div>

                {/* Sort */}
                <div>
                  <label className="text-sm font-medium text-[#222831] mb-2 block">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="border-[#393E46]/30 focus:border-[#00ADB5]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name (A-Z)</SelectItem>
                      <SelectItem value="price-low">Price (Low to High)</SelectItem>
                      <SelectItem value="price-high">Price (High to Low)</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Clear Filters */}
                {activeFiltersCount > 0 && (
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="w-full border-[#393E46]/30 text-[#393E46] hover:bg-[#393E46] hover:text-white bg-transparent"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {searchTerm && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Search: {searchTerm}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchTerm("")} />
                  </Badge>
                )}
                {selectedCategory !== "all" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {categoryDisplayNames[selectedCategory] || selectedCategory}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCategory("all")} />
                  </Badge>
                )}
              </div>
            )}

            {filteredProducts.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-[#222831] mb-2">No products found</h3>
                  <p className="text-[#393E46] mb-4">Try adjusting your search criteria or browse all products.</p>
                  <Button onClick={clearFilters} className="bg-[#00ADB5] hover:bg-[#00ADB5]/90">
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                }
              >
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={{
                      id: product._id,
                      name: product.name,
                      price: product.price,
                      originalPrice: product.originalPrice,
                      image: product.image,
                      category: product.category,
                      description: product.description,
                      inStock: product.inStock,
                      featured: product.featured,
                    }}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
