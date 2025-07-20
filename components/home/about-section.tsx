"use client"

import { useSiteSettings } from "@/contexts/site-settings-context"

export function AboutSection() {
  const { settings, isLoaded } = useSiteSettings()

  // Use uploaded image if available, otherwise use placeholder
  const aboutImage =
    isLoaded && settings.aboutImage && settings.aboutImage.trim() !== ""
      ? settings.aboutImage
      : "/placeholder.svg?height=320&width=500&text=RC+Showcase"

  return (
    <section className="py-16 bg-[#EEEEEE]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#222831] leading-tight">
              Discover Our Passion
              <br />
              for RC Products
            </h2>
            <p className="text-[#393E46] text-lg leading-relaxed">
              At Bengal Boats & Beyond, we specialize in modern design, offering a seamless online shopping experience
              with fast performance for all your RC car and boat needs.
            </p>
          </div>

          {/* Image */}
          <div className="relative">
            <img
              src={aboutImage || "/placeholder.svg"}
              alt="RC Product Showcase"
              className="w-full h-80 object-cover rounded-2xl shadow-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "/placeholder.svg?height=320&width=500&text=RC+Showcase"
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
