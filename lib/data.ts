// Categories for the application
export const categories = [
  {
    id: "boats",
    name: "RC Boats",
    description: "Remote control boats for water adventures",
    image: "/images/rc-boats-water.jpg",
  },
  {
    id: "cars",
    name: "RC Cars",
    description: "High-speed remote control cars and trucks",
    image: "/images/rc-car-dirt.jpg",
  },
  {
    id: "planes",
    name: "RC Planes",
    description: "Remote control aircraft and drones",
    image: "/images/rc-plane-field.jpg",
  },
]

// Blog categories
export const blogCategories = [
  { id: "tutorials", name: "Tutorials", description: "How-to guides and tutorials" },
  { id: "reviews", name: "Reviews", description: "Product reviews and comparisons" },
  { id: "news", name: "News", description: "Latest RC news and updates" },
  { id: "tips", name: "Tips & Tricks", description: "Expert tips and tricks" },
]

// Empty arrays for database-only implementation
export const products: any[] = []
export const sampleUsers: any[] = []
export const sampleBlogPosts: any[] = []
export const mockProducts: any[] = []
export const mockOrders: any[] = []
export const sampleOrders: any[] = []

// Export categories as default for backward compatibility
export default categories
