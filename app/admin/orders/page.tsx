"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, Eye, Package, Truck, CheckCircle, XCircle, Clock, DollarSign } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface OrderItem {
  productId: string
  name: string
  quantity: number
  price: number
  image?: string
}

interface Order {
  _id: string
  items: OrderItem[]
  customer: {
    name: string
    email: string
    phone: string
    address: string
    city: string
    postalCode?: string
  }
  paymentMethod: string
  deliveryOption: string
  deliveryFee: number
  subtotal: number
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  notes?: string
  createdAt: string
  updatedAt: string
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

const statusIcons = {
  pending: Clock,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/orders")

      if (response.ok) {
        const data = await response.json()
        console.log("Orders API response:", data) // Debug log

        // Handle different response formats
        let ordersArray = []
        if (data.success && Array.isArray(data.orders)) {
          ordersArray = data.orders
        } else if (Array.isArray(data)) {
          ordersArray = data
        } else if (data.orders && Array.isArray(data.orders)) {
          ordersArray = data.orders
        }

        console.log("Processed orders:", ordersArray) // Debug log
        setOrders(ordersArray)
      } else {
        throw new Error("Failed to fetch orders")
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
      setOrders([])
      toast({
        title: "Error",
        description: "Failed to load orders. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        const updatedOrder = await response.json()
        setOrders(orders.map((order) => (order._id === orderId ? updatedOrder : order)))
        toast({
          title: "Success",
          description: "Order status updated successfully.",
        })
      } else {
        throw new Error("Failed to update order status")
      }
    } catch (error) {
      console.error("Error updating order status:", error)
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.phone.includes(searchTerm)

    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const totalRevenue = orders.reduce((sum, order) => (order.status !== "cancelled" ? sum + order.total : sum), 0)

  const orderStats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Orders</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Orders Management</h1>
          <Button onClick={fetchOrders} variant="outline">
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">{orderStats.total}</p>
                </div>
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">৳{totalRevenue.toFixed(2)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{orderStats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Delivered</p>
                  <p className="text-2xl font-bold">{orderStats.delivered}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Order Management</CardTitle>
            <CardDescription>View and manage all customer orders ({orders.length} total)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by order ID, customer name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Orders Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="text-muted-foreground">
                          {orders.length === 0
                            ? "No orders found in database."
                            : searchTerm || statusFilter !== "all"
                              ? "No orders match your filters."
                              : "No orders to display."}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order) => {
                      const StatusIcon = statusIcons[order.status]
                      return (
                        <TableRow key={order._id}>
                          <TableCell className="font-mono text-sm">#{order._id.slice(-8).toUpperCase()}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{order.customer.name}</div>
                              <div className="text-sm text-muted-foreground">{order.customer.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                          </TableCell>
                          <TableCell className="font-medium">৳{order.total.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge className={statusColors[order.status]}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                                  <Eye className="w-4 h-4 mr-1" />
                                  View
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Order Details</DialogTitle>
                                  <DialogDescription>
                                    Order #{selectedOrder?._id.slice(-8).toUpperCase()}
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedOrder && (
                                  <div className="space-y-6">
                                    {/* Order Status */}
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <p className="text-sm text-muted-foreground">Status</p>
                                        <Badge className={statusColors[selectedOrder.status]}>
                                          <StatusIcon className="w-3 h-3 mr-1" />
                                          {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                                        </Badge>
                                      </div>
                                      <div>
                                        <p className="text-sm text-muted-foreground">Order Date</p>
                                        <p className="font-medium">
                                          {new Date(selectedOrder.createdAt).toLocaleDateString()}
                                        </p>
                                      </div>
                                    </div>

                                    {/* Customer Information */}
                                    <div>
                                      <h3 className="font-semibold mb-3">Customer Information</h3>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                                        <div>
                                          <p className="text-sm text-muted-foreground">Name</p>
                                          <p className="font-medium">{selectedOrder.customer.name}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-muted-foreground">Email</p>
                                          <p className="font-medium">{selectedOrder.customer.email}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-muted-foreground">Phone</p>
                                          <p className="font-medium">{selectedOrder.customer.phone}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-muted-foreground">City</p>
                                          <p className="font-medium">{selectedOrder.customer.city}</p>
                                        </div>
                                        <div className="md:col-span-2">
                                          <p className="text-sm text-muted-foreground">Address</p>
                                          <p className="font-medium">{selectedOrder.customer.address}</p>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Order Items */}
                                    <div>
                                      <h3 className="font-semibold mb-3">Order Items</h3>
                                      <div className="space-y-3">
                                        {selectedOrder.items.map((item, index) => (
                                          <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                                            <img
                                              src={item.image || "/placeholder.svg?height=50&width=50"}
                                              alt={item.name}
                                              className="w-12 h-12 object-cover rounded"
                                            />
                                            <div className="flex-1">
                                              <h4 className="font-medium">{item.name}</h4>
                                              <p className="text-sm text-muted-foreground">
                                                Qty: {item.quantity} × ৳{item.price.toFixed(2)}
                                              </p>
                                            </div>
                                            <div className="font-semibold">
                                              ৳{(item.price * item.quantity).toFixed(2)}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Order Summary */}
                                    <div>
                                      <h3 className="font-semibold mb-3">Order Summary</h3>
                                      <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                                        <div className="flex justify-between">
                                          <span>Subtotal</span>
                                          <span>৳{selectedOrder.subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Delivery Fee ({selectedOrder.deliveryOption.replace("_", " ")})</span>
                                          <span>৳{selectedOrder.deliveryFee.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Payment Method</span>
                                          <span className="capitalize">
                                            {selectedOrder.paymentMethod.replace("_", " ")}
                                          </span>
                                        </div>
                                        <div className="border-t pt-2 flex justify-between font-bold text-lg">
                                          <span>Total</span>
                                          <span>৳{selectedOrder.total.toFixed(2)}</span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Update Status */}
                                    <div>
                                      <h3 className="font-semibold mb-2">Update Status</h3>
                                      <Select
                                        value={selectedOrder.status}
                                        onValueChange={(value) => updateOrderStatus(selectedOrder._id, value)}
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="pending">Pending</SelectItem>
                                          <SelectItem value="processing">Processing</SelectItem>
                                          <SelectItem value="shipped">Shipped</SelectItem>
                                          <SelectItem value="delivered">Delivered</SelectItem>
                                          <SelectItem value="cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
