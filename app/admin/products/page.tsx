"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ImageUpload } from "@/components/image-upload"
import { Package, Plus, Search, Edit, Trash2, DollarSign, ImageIcon, FileText } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import Image from "next/image"

interface Product {
  id: string
  name: string
  description: string
  longDescription?: string
  price: number
  category: string
  images: string[]
  stock: number
  inStock: boolean
  rating?: number
  reviews?: number
  featured?: boolean
  flashSale?: boolean
  bestSeller?: boolean
  tags: string[]
  specifications?: string
  createdAt?: string
  updatedAt?: string
}

// Predefined categories
const PRODUCT_CATEGORIES = [
  "RC Cars",
  "RC Boats",
  "RC Helicopters",
  "RC Drones",
  "RC Trucks",
  "RC Motorcycles",
  "Batteries",
  "Chargers",
  "Parts & Accessories",
  "Tools & Equipment",
]

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    longDescription: "",
    price: "",
    category: "",
    stock: "",
    featured: false,
    flashSale: false,
    bestSeller: false,
    tags: "",
    specifications: "",
  })

  const [uploadedImages, setUploadedImages] = useState<string[]>([])

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, searchTerm, categoryFilter])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")
      const data = await response.json()

      if (data.success) {
        setProducts(data.products || [])
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to fetch products",
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

  const filterProducts = () => {
    let filtered = products

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((product) => product.category === categoryFilter)
    }

    setFilteredProducts(filtered)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      longDescription: "",
      price: "",
      category: "",
      stock: "",
      featured: false,
      flashSale: false,
      bestSeller: false,
      tags: "",
      specifications: "",
    })
    setUploadedImages([])
    setEditingProduct(null)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      longDescription: product.longDescription || "",
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      featured: product.featured || false,
      flashSale: product.flashSale || false,
      bestSeller: product.bestSeller || false,
      tags: product.tags.join(", "),
      specifications: product.specifications || "",
    })
    setUploadedImages(product.images || [])
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        longDescription: formData.longDescription.trim(),
        price: Number.parseFloat(formData.price),
        category: formData.category,
        images: uploadedImages,
        stock: Number.parseInt(formData.stock),
        inStock: Number.parseInt(formData.stock) > 0,
        featured: formData.featured,
        flashSale: formData.flashSale,
        bestSeller: formData.bestSeller,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
        specifications: formData.specifications.trim(),
      }

      const url = editingProduct ? `/api/products/${editingProduct.id}` : "/api/products"
      const method = editingProduct ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: editingProduct ? "Product Updated" : "Product Created",
          description: `${productData.name} has been ${editingProduct ? "updated" : "created"} successfully`,
        })
        setIsDialogOpen(false)
        resetForm()
        fetchProducts()
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to save product",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving product:", error)
      toast({
        title: "Network Error",
        description: "Failed to save product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (product: Product) => {
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Product Deleted",
          description: `${product.name} has been deleted successfully`,
        })
        fetchProducts()
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to delete product",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        title: "Network Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Products Management</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="basic">
                      <Package className="h-4 w-4 mr-2" />
                      Basic Info
                    </TabsTrigger>
                    <TabsTrigger value="pricing">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Pricing
                    </TabsTrigger>
                    <TabsTrigger value="images">
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Images
                    </TabsTrigger>
                    <TabsTrigger value="specifications">
                      <FileText className="h-4 w-4 mr-2" />
                      Specifications
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Product Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Enter product name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category *</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => setFormData({ ...formData, category: value })}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {PRODUCT_CATEGORIES.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Short Description *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Enter short product description"
                        rows={3}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="longDescription">Long Description</Label>
                      <Textarea
                        id="longDescription"
                        value={formData.longDescription}
                        onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                        placeholder="Enter detailed product description"
                        rows={5}
                      />
                    </div>

                    <div>
                      <Label htmlFor="tags">Tags (comma separated)</Label>
                      <Input
                        id="tags"
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        placeholder="e.g., waterproof, remote control, high speed"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="featured"
                          checked={formData.featured}
                          onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                        />
                        <Label htmlFor="featured">Featured</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="flashSale"
                          checked={formData.flashSale}
                          onCheckedChange={(checked) => setFormData({ ...formData, flashSale: checked })}
                        />
                        <Label htmlFor="flashSale">Flash Sale</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="bestSeller"
                          checked={formData.bestSeller}
                          onCheckedChange={(checked) => setFormData({ ...formData, bestSeller: checked })}
                        />
                        <Label htmlFor="bestSeller">Best Seller</Label>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="pricing" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price">Price (৳) *</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          placeholder="0.00"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="stock">Stock Quantity *</Label>
                        <Input
                          id="stock"
                          type="number"
                          value={formData.stock}
                          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                          placeholder="0"
                          required
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="images" className="space-y-4">
                    <div>
                      <Label>Product Images</Label>
                      <ImageUpload images={uploadedImages} onImagesChange={setUploadedImages} maxImages={5} />
                    </div>
                  </TabsContent>

                  <TabsContent value="specifications" className="space-y-4">
                    <div>
                      <Label htmlFor="specifications">Product Specifications</Label>
                      <Textarea
                        id="specifications"
                        value={formData.specifications}
                        onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                        placeholder={`Enter detailed product specifications, for example:

• Material: High-quality ABS plastic
• Scale: 1:10
• Speed: Up to 25 mph
• Battery: 7.4V 2000mAh Li-Po
• Control Range: Up to 100 meters
• Charging Time: 2-3 hours
• Run Time: 15-20 minutes
• Dimensions: 45cm x 25cm x 18cm
• Weight: 2.5 kg
• Waterproof Rating: IPX4`}
                        rows={12}
                        className="font-mono text-sm"
                      />
                      <p className="text-sm text-gray-600 mt-2">
                        Write detailed specifications that will be displayed on the product page. Use bullet points (•)
                        for better formatting.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : editingProduct ? "Update Product" : "Create Product"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {PRODUCT_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>Products ({filteredProducts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h2 className="text-xl font-semibold mb-2">
                  {products.length === 0 ? "No products yet" : "No products found"}
                </h2>
                <p className="text-gray-600 mb-6">
                  {products.length === 0
                    ? "Create your first product to get started"
                    : "Try adjusting your search or filter criteria"}
                </p>
                {products.length === 0 && (
                  <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Product
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                              <Image
                                src={product.images?.[0] || "/placeholder.svg?height=48&width=48"}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-gray-600 truncate max-w-48">{product.description}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{product.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">৳{product.price.toLocaleString()}</p>
                        </TableCell>
                        <TableCell>
                          <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {product.featured && <Badge className="bg-blue-500 text-xs">Featured</Badge>}
                            {product.flashSale && <Badge className="bg-red-500 text-xs">Flash Sale</Badge>}
                            {product.bestSeller && <Badge className="bg-green-500 text-xs">Best Seller</Badge>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(product)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
