import { PageLayout } from "@/components/page-layout"
import { HeroSection } from "@/components/home/hero-section"
import { CategoryCards } from "@/components/home/category-cards"
import { FeaturedProducts } from "@/components/home/featured-products"
import { AboutSection } from "@/components/home/about-section"

export default function HomePage() {
  return (
    <PageLayout>
      <HeroSection />

      {/* Gap after hero section for PC devices */}
      <div className="hidden md:block h-8 lg:h-12"></div>

      <CategoryCards />
      <FeaturedProducts />
      <AboutSection />
    </PageLayout>
  )
}
