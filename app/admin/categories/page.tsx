"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Package } from "lucide-react"

// Static categories data to prevent build errors
const staticCategories = [
  {
    id: "1",
    name: "RC Boats",
    description: "Remote control boats for water adventures",
    icon: "🚤",
    image: "/images/rc-boats-water.jpg",
    productCount: 15,
  },
  {
    id: "2",
    name: "RC Cars",
    description: "High-speed remote control cars",
    icon: "🏎️",
    image: "/images/rc-car-dirt.jpg",
    productCount: 25,
  },
  {
    id: "3",
    name: "RC Planes",
    description: "Flying remote control aircraft",
    icon: "✈️",
    image: "/images/rc-plane-field.jpg",
    productCount: 12,
  },
  {
    id: "4",
    name: "Batteries",
    description: "Power sources for RC vehicles",
    icon: "🔋",
    image: "/placeholder.svg?height=200&width=300",
    productCount: 30,
  },
  {
    id: "5",
    name: "Parts & Accessories",
    description: "Replacement parts and upgrades",
    icon: "🔧",
    image: "/placeholder.svg?height=200&width=300",
    productCount: 45,
  },
]

export default function CategoriesPage() {
  const [categories, setCategories] = useState(staticCategories)
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "",
    image: "",
  })

  const handleAddCategory = () => {
    if (!formData.name || !formData.description) return

    const newCategory = {
      id: `category_${Date.now()}`,
      name: formData.name,
      description: formData.description,
      icon: formData.icon || "📦",
      image: formData.image || "/placeholder.svg?height=200&width=300",
      productCount: 0,
    }

    setCategories((prev) => [...prev, newCategory])
    setFormData({ name: "", description: "", icon: "", image: "" })
    setIsAddingCategory(false)
  }

  const handleEditCategory = (id: string) => {
    const category = categories.find((cat) => cat.id === id)
    if (category) {
      setFormData({
        name: category.name,
        description: category.description,
        icon: category.icon,
        image: category.image,
      })
      setEditingCategory(id)
    }
  }

  const handleUpdateCategory = () => {
    if (!formData.name || !formData.description || !editingCategory) return

    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === editingCategory
          ? {
              ...cat,
              name: formData.name,
              description: formData.description,
              icon: formData.icon || cat.icon,
              image: formData.image || cat.image,
            }
          : cat,
      ),
    )

    setFormData({ name: "", description: "", icon: "", image: "" })
    setEditingCategory(null)
  }

  const handleDeleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id))
  }

  const resetForm = () => {
    setFormData({ name: "", description: "", icon: "", image: "" })
    setIsAddingCategory(false)
    setEditingCategory(null)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Categories</h1>
          <Button onClick={() => setIsAddingCategory(true)} className="bg-[#00ADB5] hover:bg-[#00ADB5]/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>

        {/* Add/Edit Category Form */}
        {(isAddingCategory || editingCategory) && (
          <Card>
            <CardHeader>
              <CardTitle>{editingCategory ? "Edit Category" : "Add New Category"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Category Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter category name"
                  />
                </div>
                <div>
                  <Label htmlFor="icon">Icon (Emoji)</Label>
                  <Input
                    id="icon"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="🚤"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter category description"
                />
              </div>
              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="Enter image URL"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={editingCategory ? handleUpdateCategory : handleAddCategory}
                  className="bg-[#00ADB5] hover:bg-[#00ADB5]/90"
                >
                  {editingCategory ? "Update Category" : "Add Category"}
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category.id} className="overflow-hidden">
              <div className="aspect-video overflow-hidden">
                <img
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder.svg?height=200&width=300"
                  }}
                />
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{category.icon}</span>
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                  </div>
                  <Badge variant="secondary">
                    <Package className="h-3 w-3 mr-1" />
                    {category.productCount}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditCategory(category.id)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteCategory(category.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {categories.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No categories yet</h3>
              <p className="text-muted-foreground mb-4">Create your first category to organize your products</p>
              <Button onClick={() => setIsAddingCategory(true)} className="bg-[#00ADB5] hover:bg-[#00ADB5]/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}
