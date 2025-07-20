import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { DataProvider } from "@/contexts/data-context"
import { CartProvider } from "@/contexts/cart-context"
import { SiteSettingsProvider } from "@/contexts/site-settings-context"
import { BlogProvider } from "@/contexts/blog-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Bengal Boats & Beyond - RC Boats, Cars & Planes",
  description: "Premium RC boats, cars, and planes for enthusiasts of all levels",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <DataProvider>
              <CartProvider>
                <SiteSettingsProvider>
                  <BlogProvider>
                    {children}
                    <Toaster />
                  </BlogProvider>
                </SiteSettingsProvider>
              </CartProvider>
            </DataProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
