"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "customer"
  phone?: string
  address?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  register: (userData: {
    name: string
    email: string
    password: string
    phone?: string
    address?: string
  }) => Promise<{ success: boolean; message?: string }>
  logout: () => void
  isAuthenticated: () => boolean
  isAdmin: () => boolean
  updateProfile: (userData: { name: string; phone?: string; address?: string }) => Promise<{
    success: boolean
    message?: string
  }>
  changePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<{
    success: boolean
    message?: string
  }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    const token = localStorage.getItem("authToken")
    if (token) {
      // Verify token and get user data
      fetchUserProfile(token)
    } else {
      setIsLoading(false)
    }
  }, [])

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await fetch("/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setUser(data.user)
        } else {
          localStorage.removeItem("authToken")
        }
      } else {
        localStorage.removeItem("authToken")
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error)
      localStorage.removeItem("authToken")
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem("authToken", data.token)
        setUser(data.user)
        return { success: true }
      } else {
        return { success: false, message: data.message || "Login failed" }
      }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, message: "Network error. Please try again." }
    }
  }

  const register = async (userData: {
    name: string
    email: string
    password: string
    phone?: string
    address?: string
  }) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem("authToken", data.token)
        setUser(data.user)
        return { success: true }
      } else {
        return { success: false, message: data.message || "Registration failed" }
      }
    } catch (error) {
      console.error("Registration error:", error)
      return { success: false, message: "Network error. Please try again." }
    }
  }

  const logout = () => {
    localStorage.removeItem("authToken")
    setUser(null)
  }

  const isAuthenticated = () => {
    return user !== null
  }

  const isAdmin = () => {
    return user?.role === "admin"
  }

  const updateProfile = async (userData: { name: string; phone?: string; address?: string }) => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        return { success: false, message: "Not authenticated" }
      }

      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (data.success) {
        // Update local user state
        setUser((prev) => (prev ? { ...prev, ...userData } : null))
        return { success: true }
      } else {
        return { success: false, message: data.message || "Update failed" }
      }
    } catch (error) {
      console.error("Profile update error:", error)
      return { success: false, message: "Network error. Please try again." }
    }
  }

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        return { success: false, message: "Not authenticated" }
      }

      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      const data = await response.json()

      if (data.success) {
        return { success: true, message: "Password changed successfully" }
      } else {
        return { success: false, message: data.message || "Password change failed" }
      }
    } catch (error) {
      console.error("Password change error:", error)
      return { success: false, message: "Network error. Please try again." }
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated,
        isAdmin,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
