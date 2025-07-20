"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Database, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export default function InitDbPage() {
  const [status, setStatus] = useState<"idle" | "checking" | "initializing" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [dbStatus, setDbStatus] = useState<any>(null)

  const checkDatabaseStatus = async () => {
    setStatus("checking")
    try {
      const response = await fetch("/api/init-db")
      const data = await response.json()

      if (response.ok) {
        setDbStatus(data)
        setMessage("Database connection successful")
      } else {
        setMessage(data.error || "Failed to check database status")
        setStatus("error")
      }
    } catch (error) {
      setMessage("Failed to connect to database")
      setStatus("error")
    } finally {
      if (status !== "error") {
        setStatus("idle")
      }
    }
  }

  const initializeDatabase = async () => {
    setStatus("initializing")
    try {
      const response = await fetch("/api/init-db", {
        method: "POST",
      })
      const data = await response.json()

      if (response.ok) {
        setMessage(data.message)
        setStatus("success")
        // Refresh status after initialization
        setTimeout(checkDatabaseStatus, 1000)
      } else {
        setMessage(data.error || "Failed to initialize database")
        setStatus("error")
      }
    } catch (error) {
      setMessage("Failed to initialize database")
      setStatus("error")
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Database Initialization</h1>
          <p className="text-muted-foreground mt-2">
            Initialize your database with sample data and check connection status
          </p>
        </div>

        {/* Database Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button onClick={checkDatabaseStatus} disabled={status === "checking"}>
                {status === "checking" ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Checking...
                  </>
                ) : (
                  "Check Status"
                )}
              </Button>
            </div>

            {dbStatus && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Users</span>
                    <Badge variant="secondary">{dbStatus.collections?.users || 0}</Badge>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Blog Posts</span>
                    <Badge variant="secondary">{dbStatus.collections?.blogPosts || 0}</Badge>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Products</span>
                    <Badge variant="secondary">{dbStatus.collections?.products || 0}</Badge>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Initialize Database Card */}
        <Card>
          <CardHeader>
            <CardTitle>Initialize Sample Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This will create sample users, blog posts, and products in your database. If data already exists, this
              operation will be skipped.
            </p>

            <div className="space-y-4">
              <Button onClick={initializeDatabase} disabled={status === "initializing"} className="w-full md:w-auto">
                {status === "initializing" ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Initializing...
                  </>
                ) : (
                  "Initialize Database"
                )}
              </Button>

              {/* Sample Data Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Sample Users</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Admin: admin@bengalboats.com (admin123)</li>
                    <li>• Customer: customer@example.com (customer123)</li>
                  </ul>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Sample Content</h4>
                  <ul className="text-sm space-y-1">
                    <li>• 3 Blog posts with different categories</li>
                    <li>• 3 Sample products</li>
                    <li>• Blog categories and tags</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Messages */}
        {message && (
          <Card>
            <CardContent className="pt-6">
              <div
                className={`flex items-center gap-2 ${
                  status === "success" ? "text-green-600" : status === "error" ? "text-red-600" : "text-blue-600"
                }`}
              >
                {status === "success" && <CheckCircle className="h-5 w-5" />}
                {status === "error" && <AlertCircle className="h-5 w-5" />}
                <span>{message}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Environment Check */}
        <Card>
          <CardHeader>
            <CardTitle>Environment Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">MongoDB URI</span>
                <Badge variant={process.env.MONGODB_URI ? "default" : "destructive"}>
                  {process.env.MONGODB_URI ? "Configured" : "Missing"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
