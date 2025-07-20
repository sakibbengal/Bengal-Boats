"use client"

import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { TrendingUp, DollarSign, ShoppingCart, Eye, Download } from "lucide-react"
import { useData } from "@/contexts/data-context"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import { useState } from "react"

export default function AdminAnalytics() {
  const { products, orders } = useData()
  const [timeRange, setTimeRange] = useState("30")

  // Calculate real-time analytics
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
  const totalOrders = orders.length
  const totalProducts = products.length
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  // Calculate conversion rate (assuming 1000 visitors for demo)
  const conversionRate = totalOrders > 0 ? (totalOrders / 1000) * 100 : 0

  // Get date range based on selection
  const getDateRange = () => {
    const now = new Date()
    const days = Number.parseInt(timeRange)
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
    return { startDate, endDate: now }
  }

  // Filter orders by date range
  const getOrdersInRange = () => {
    const { startDate, endDate } = getDateRange()
    return orders.filter((order) => {
      const orderDate = new Date(order.orderDate)
      return orderDate >= startDate && orderDate <= endDate
    })
  }

  const ordersInRange = getOrdersInRange()
  const revenueInRange = ordersInRange.reduce((sum, order) => sum + order.total, 0)

  // Daily sales data
  const getDailySalesData = () => {
    const { startDate, endDate } = getDateRange()
    const days = []
    const current = new Date(startDate)

    while (current <= endDate) {
      const dayOrders = orders.filter((order) => {
        const orderDate = new Date(order.orderDate)
        return orderDate.toDateString() === current.toDateString()
      })

      days.push({
        date: current.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        revenue: dayOrders.reduce((sum, order) => sum + order.total, 0),
        orders: dayOrders.length,
      })

      current.setDate(current.getDate() + 1)
    }

    return days
  }

  // Category performance
  const getCategoryPerformance = () => {
    const categoryStats: { [key: string]: { revenue: number; orders: number; products: number } } = {}

    // Initialize with all categories
    const categories = [...new Set(products.map((p) => p.category))]
    categories.forEach((cat) => {
      categoryStats[cat] = { revenue: 0, orders: 0, products: 0 }
    })

    // Count products per category
    products.forEach((product) => {
      categoryStats[product.category].products++
    })

    // Calculate revenue and orders per category
    orders.forEach((order) => {
      order.items.forEach((item) => {
        const product = products.find((p) => p.name === item.productName)
        if (product && categoryStats[product.category]) {
          categoryStats[product.category].revenue += item.quantity * item.price
          categoryStats[product.category].orders++
        }
      })
    })

    return Object.entries(categoryStats)
      .map(([category, stats]) => ({
        category,
        ...stats,
      }))
      .sort((a, b) => b.revenue - a.revenue)
  }

  // Top products by sales
  const getTopProducts = () => {
    const productStats: { [key: string]: { product: any; revenue: number; quantity: number } } = {}

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const product = products.find((p) => p.name === item.productName)
        if (product) {
          if (!productStats[product.id]) {
            productStats[product.id] = { product, revenue: 0, quantity: 0 }
          }
          productStats[product.id].revenue += item.quantity * item.price
          productStats[product.id].quantity += item.quantity
        }
      })
    })

    return Object.values(productStats)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)
  }

  // Order status distribution
  const getOrderStatusData = () => {
    const statusCounts = {
      pending: orders.filter((o) => o.status === "pending").length,
      shipped: orders.filter((o) => o.status === "shipped").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
    }

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
      color:
        status === "pending"
          ? "#f59e0b"
          : status === "shipped"
            ? "#3b82f6"
            : status === "delivered"
              ? "#10b981"
              : "#ef4444",
    }))
  }

  const dailySalesData = getDailySalesData()
  const categoryPerformance = getCategoryPerformance()
  const topProducts = getTopProducts()
  const orderStatusData = getOrderStatusData()

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">Comprehensive business insights and performance metrics</p>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">৳{totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">৳{revenueInRange.toLocaleString()} in selected period</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
              <p className="text-xs text-muted-foreground">{ordersInRange.length} in selected period</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">৳{Math.round(averageOrderValue).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Per order average</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{conversionRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">Visitors to customers</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dailySalesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`৳${value.toLocaleString()}`, "Revenue"]} />
                  <Area type="monotone" dataKey="revenue" stroke="#2563eb" fill="#2563eb" fillOpacity={0.1} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Category Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryPerformance.map((category) => (
                <div key={category.category} className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">{category.category}</h3>
                  <div className="space-y-1 text-sm">
                    <p>Revenue: ৳{category.revenue.toLocaleString()}</p>
                    <p>Orders: {category.orders}</p>
                    <p>Products: {category.products}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            {topProducts.length > 0 ? (
              <div className="space-y-4">
                {topProducts.map((item, index) => (
                  <div key={item.product.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-lg text-muted-foreground">#{index + 1}</span>
                      <img
                        src={item.product.images[0] || "/placeholder.svg"}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">{item.product.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">৳{item.revenue.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">{item.quantity} sold</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">No sales data available</div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
