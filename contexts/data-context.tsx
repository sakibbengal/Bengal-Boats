"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface Product {
  id: string
  name: string
  description: string
  longDescription?: string
  price: number
  originalPrice?: number
  category: string
  images: string[]
  stock: number
  inStock: boolean
  rating: number
  reviews: number
  featured?: boolean
  flashSale?: boolean
  bestSeller?: boolean
  tags: string[]
  specifications?: string
  createdAt?: string
  updatedAt?: string
}

export interface Category {
  id: string
  name: string
  description: string
  icon: string
  image: string
}

export interface Order {
  id: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  items: Array<{
    productId: string
    productName: string
    quantity: number
    price: number
  }>
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  shippingAddress: string
  paymentMethod?: string
  notes?: string
  orderDate: string
  createdAt: string
  updatedAt?: string
}

interface DataContextType {
  products: Product[]
  categories: Category[]
  orders: Order[]
  isLoading: boolean
  refreshProducts: () => Promise<void>
  refreshOrders: () => Promise<void>
  addProduct: (
    product: Omit<Product, "id" | "createdAt" | "updatedAt">,
  ) => Promise<{ success: boolean; message: string }>
  updateProduct: (id: string, product: Partial<Product>) => Promise<{ success: boolean; message: string }>
  deleteProduct: (id: string) => Promise<{ success: boolean; message: string }>
  addOrder: (
    order: Omit<Order, "id" | "createdAt" | "updatedAt">,
  ) => Promise<{ success: boolean; message: string; orderId?: string }>
  updateOrderStatus: (id: string, status: string) => Promise<{ success: boolean; message: string }>
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    initializeData()
  }, [])

  const initializeData = async () => {
    setIsLoading(true)
    try {
      await Promise.all([fetchProducts(), fetchCategories(), fetchOrders()])
    } catch (error) {
      console.error("Error initializing data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setProducts(data.products || [])
      } else {
        console.error("Failed to fetch products:", data.message)
        setProducts([])
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      setProducts([])
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setCategories(data.categories || [])
      } else {
        console.error("Failed to fetch categories:", data.message)
        setCategories([])
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
      setCategories([])
    }
  }

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setOrders(data.orders || [])
      } else {
        console.error("Failed to fetch orders:", data.message)
        setOrders([])
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
      setOrders([])
    }
  }

  const refreshProducts = async () => {
    await fetchProducts()
  }

  const refreshOrders = async () => {
    await fetchOrders()
  }

  const addProduct = async (productData: Omit<Product, "id" | "createdAt" | "updatedAt">) => {
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      })

      const data = await response.json()

      if (data.success) {
        await fetchProducts() // Refresh products list
        return { success: true, message: data.message || "Product added successfully" }
      } else {
        return { success: false, message: data.message || "Failed to add product" }
      }
    } catch (error) {
      console.error("Error adding product:", error)
      return { success: false, message: "Network error. Please try again." }
    }
  }

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      })

      const data = await response.json()

      if (data.success) {
        await fetchProducts() // Refresh products list
        return { success: true, message: data.message || "Product updated successfully" }
      } else {
        return { success: false, message: data.message || "Failed to update product" }
      }
    } catch (error) {
      console.error("Error updating product:", error)
      return { success: false, message: "Network error. Please try again." }
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        await fetchProducts() // Refresh products list
        return { success: true, message: data.message || "Product deleted successfully" }
      } else {
        return { success: false, message: data.message || "Failed to delete product" }
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      return { success: false, message: "Network error. Please try again." }
    }
  }

  const addOrder = async (orderData: Omit<Order, "id" | "createdAt" | "updatedAt">) => {
    try {
      console.log("DataContext: Submitting order:", orderData)

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      const data = await response.json()
      console.log("DataContext: Order API response:", data)

      if (data.success) {
        await fetchOrders() // Refresh orders list
        return {
          success: true,
          message: data.message || "Order placed successfully",
          orderId: data.orderId || data.order?.id,
        }
      } else {
        return { success: false, message: data.message || "Failed to place order" }
      }
    } catch (error) {
      console.error("Error adding order:", error)
      return { success: false, message: "Network error. Please try again." }
    }
  }

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      const data = await response.json()

      if (data.success) {
        await fetchOrders() // Refresh orders list
        return { success: true, message: data.message || "Order status updated successfully" }
      } else {
        return { success: false, message: data.message || "Failed to update order status" }
      }
    } catch (error) {
      console.error("Error updating order status:", error)
      return { success: false, message: "Network error. Please try again." }
    }
  }

  const value: DataContextType = {
    products,
    categories,
    orders,
    isLoading,
    refreshProducts,
    refreshOrders,
    addProduct,
    updateProduct,
    deleteProduct,
    addOrder,
    updateOrderStatus,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
