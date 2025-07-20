"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useSiteSettings } from "@/contexts/site-settings-context"

export function HeroSection() {
  const { settings, isLoaded } = useSiteSettings()

  // Use uploaded image if available, otherwise use placeholder
  const heroImage =
    isLoaded && settings.heroImage && settings.heroImage.trim() !== ""
      ? settings.heroImage
      : "/placeholder.svg?height=800&width=1200&text=RC+Adventure+Hero"

  const heroTitle = settings.heroTitle || "Explore Modern RC Adventures"
  const heroSubtitle = settings.heroSubtitle || "SHOP NOW TODAY"
  const heroButtonText = settings.heroButtonText || "Shop Now"

  return (
    <section className="relative h-[70vh] lg:h-[80vh] overflow-hidden bg-white">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${heroImage}')`,
        }}
      >
        {/* Light overlay */}
        <div className="absolute inset-0 bg-white/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center justify-center">
        <div className="text-center text-[#222831] space-y-6">
          <div className="space-y-2">
            <p className="text-sm lg:text-base font-medium tracking-wider uppercase text-[#00ADB5]">{heroSubtitle}</p>
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              {heroTitle.split(" ").map((word, index, array) => (
                <span key={index}>
                  {word}
                  {index === Math.floor(array.length / 2) - 1 ? <br /> : " "}
                </span>
              ))}
            </h1>
          </div>

          <div className="flex justify-center">
            <Link href="/shop">
              <Button
                size="lg"
                className="bg-[#00ADB5] text-white hover:bg-[#00ADB5]/90 font-semibold px-8 py-3 rounded-full min-w-[120px] shadow-lg"
              >
                {heroButtonText}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
