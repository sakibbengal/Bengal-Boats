"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useSiteSettings } from "@/contexts/site-settings-context"

export function CategoryCards() {
  const { settings, isLoaded } = useSiteSettings()

  const categories = [
    {
      title: "Explore Our Products",
      buttonText: "Shop Now",
      href: "/shop",
      defaultImage: "/placeholder.svg?height=320&width=400&text=RC+Products",
      customImage: settings.categoryImage1,
    },
    {
      title: "Top RC Choices",
      buttonText: "Discover More",
      href: "/shop?category=RC%20Cars",
      defaultImage: "/placeholder.svg?height=320&width=400&text=RC+Cars",
      customImage: settings.categoryImage2,
    },
    {
      title: "Quality RC Parts",
      buttonText: "View Selection",
      href: "/shop?category=Accessories%20%26%20Parts",
      defaultImage: "/placeholder.svg?height=320&width=400&text=RC+Parts",
      customImage: settings.categoryImage3,
    },
  ]

  return (
    <section className="py-16 bg-[#393E46]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            // Use uploaded image if available, otherwise use default
            const imageUrl =
              isLoaded && category.customImage && category.customImage.trim() !== ""
                ? category.customImage
                : category.defaultImage

            return (
              <div key={index} className="relative h-80 rounded-2xl overflow-hidden group cursor-pointer shadow-lg">
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-300 group-hover:scale-105"
                  style={{
                    backgroundImage: `url('${imageUrl}')`,
                  }}
                >
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-[#222831]/60 group-hover:bg-[#222831]/70 transition-colors duration-300"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-[#EEEEEE] p-6">
                  <h3 className="text-2xl lg:text-3xl font-bold mb-6">{category.title}</h3>
                  <Link href={category.href}>
                    <Button
                      variant="outline"
                      className="border-2 border-[#00ADB5] text-[#00ADB5] hover:bg-[#00ADB5] hover:text-white font-semibold px-6 py-2 rounded-full transition-all duration-300 bg-transparent"
                    >
                      {category.buttonText}
                    </Button>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
