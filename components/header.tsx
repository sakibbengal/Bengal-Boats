"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Menu, Search, ShoppingCart, User, LogOut, Settings, Package, ChevronDown } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { useSiteSettings } from "@/contexts/site-settings-context"

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, logout, isAdmin } = useAuth()
  const { items } = useCart()
  const { settings, isLoaded } = useSiteSettings()

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  const handleLogout = () => {
    logout()
    setIsMobileMenuOpen(false)
  }

  // Other RC categories for dropdown
  const otherCategories = [
    { name: "RC Helicopters", href: "/shop?category=helicopters" },
    { name: "RC Drones", href: "/shop?category=drones" },
    { name: "RC Trucks", href: "/shop?category=trucks" },
    { name: "RC Motorcycles", href: "/shop?category=motorcycles" },
    { name: "Batteries", href: "/shop?category=batteries" },
    { name: "Chargers", href: "/shop?category=chargers" },
    { name: "Parts & Accessories", href: "/shop?category=parts" },
    { name: "Tools", href: "/shop?category=tools" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          {/* Desktop: Show logo + name */}
          {isLoaded && settings.logo && (
            <img
              src={settings.logo || "/placeholder.svg"}
              alt={settings.siteName}
              className="h-8 w-auto hidden md:block"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = "none"
              }}
            />
          )}
          {/* Site name - better mobile optimization */}
          <span className="font-bold text-base md:text-xl leading-tight">{settings.siteName}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/shop?category=cars" className="text-sm font-medium hover:text-primary transition-colors">
            RC Cars
          </Link>
          <Link href="/shop?category=boats" className="text-sm font-medium hover:text-primary transition-colors">
            RC Boats
          </Link>

          {/* Others Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-sm font-medium hover:text-primary transition-colors p-0 h-auto">
                Others
                <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {otherCategories.map((category) => (
                <DropdownMenuItem key={category.name} asChild>
                  <Link href={category.href} className="w-full">
                    {category.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Search */}
          <Button variant="ghost" size="sm" onClick={() => setIsSearchOpen(!isSearchOpen)} className="hidden md:flex">
            <Search className="h-4 w-4" />
          </Button>

          {/* Cart */}
          <Link href="/cart">
            <Button variant="ghost" size="sm" className="relative">
              <ShoppingCart className="h-4 w-4" />
              {totalItems > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {totalItems}
                </Badge>
              )}
            </Button>
          </Link>

          {/* User Menu - Desktop Only */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hidden md:flex">
                  <User className="h-4 w-4" />
                  <span className="ml-2">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/account">
                    <User className="mr-2 h-4 w-4" />
                    Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account/orders">
                    <Package className="mr-2 h-4 w-4" />
                    Orders
                  </Link>
                </DropdownMenuItem>
                {isAdmin() && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">
                      <Settings className="mr-2 h-4 w-4" />
                      Admin Panel
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px]">
              <div className="flex flex-col h-full">
                {/* User Info Section */}
                {user && (
                  <div className="border-b pb-4 mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <nav className="flex flex-col space-y-1 flex-1">
                  <Link
                    href="/"
                    className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    href="/shop?category=cars"
                    className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    RC Cars
                  </Link>
                  <Link
                    href="/shop?category=boats"
                    className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    RC Boats
                  </Link>

                  {/* Others Section */}
                  <div className="pt-2">
                    <p className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Others
                    </p>
                    <div className="space-y-1">
                      {otherCategories.map((category) => (
                        <Link
                          key={category.name}
                          href={category.href}
                          className="flex items-center px-6 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* User Actions */}
                  {user && (
                    <div className="pt-4 border-t mt-auto space-y-1">
                      <Link
                        href="/account"
                        className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <User className="mr-3 h-4 w-4" />
                        Account
                      </Link>
                      <Link
                        href="/account/orders"
                        className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Package className="mr-3 h-4 w-4" />
                        Orders
                      </Link>
                      {isAdmin() && (
                        <Link
                          href="/admin"
                          className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Settings className="mr-3 h-4 w-4" />
                          Admin Panel
                        </Link>
                      )}
                      <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="w-full justify-start px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground"
                      >
                        <LogOut className="mr-3 h-4 w-4" />
                        Logout
                      </Button>
                    </div>
                  )}

                  {/* Login/Register for non-users */}
                  {!user && (
                    <div className="pt-4 border-t mt-auto space-y-2">
                      <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full bg-transparent">
                          Login
                        </Button>
                      </Link>
                      <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button className="w-full">Sign Up</Button>
                      </Link>
                    </div>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Search Bar */}
      {isSearchOpen && (
        <div className="border-t bg-background p-4">
          <div className="container">
            <Input
              type="search"
              placeholder="Search products..."
              className="max-w-md"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const query = (e.target as HTMLInputElement).value
                  if (query.trim()) {
                    window.location.href = `/search?q=${encodeURIComponent(query.trim())}`
                  }
                }
              }}
            />
          </div>
        </div>
      )}
    </header>
  )
}
