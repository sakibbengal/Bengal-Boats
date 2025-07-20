"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Package, Users, ShoppingCart, Settings, BarChart3 } from "lucide-react"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

interface AdminSidebarProps {
  onItemClick?: () => void
}

export function AdminSidebar({ onItemClick }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-4 lg:p-6">
        <h2 className="text-lg lg:text-xl font-bold text-gray-800">Admin Panel</h2>
      </div>
      <nav className="mt-4 lg:mt-6 px-2 lg:px-0">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onItemClick}
              className={cn(
                "flex items-center px-4 lg:px-6 py-3 text-sm font-medium transition-colors rounded-lg lg:rounded-none mx-2 lg:mx-0 mb-1 lg:mb-0",
                isActive
                  ? "bg-primary/10 text-primary border-r-2 border-primary"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
              )}
            >
              <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
              <span className="truncate">{item.title}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
