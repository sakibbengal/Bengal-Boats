import { MongoClient, type Db } from "mongodb"

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to .env.local")
}

const uri = process.env.MONGODB_URI
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  const client = await clientPromise
  const db = client.db("bengalboatsbeyond")
  return { client, db }
}

export const COLLECTIONS = {
  PRODUCTS: "products",
  CATEGORIES: "categories",
  USERS: "users",
  ORDERS: "orders",
  BLOG_POSTS: "blog_posts",
}

// Get database connection
// Database and collection names
// export const DATABASE_NAME = "bengalboats"
// export const COLLECTIONS = {
//   PRODUCTS: "products",
//   CATEGORIES: "categories",
//   USERS: "users",
//   ORDERS: "orders",
//   BLOG_POSTS: "blog_posts",
//   BLOG_CATEGORIES: "blog_categories",
// }

// Get database connection
// export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
//   try {
//     const client = await clientPromise
//     const db = client.db(DATABASE_NAME)
//     return { client, db }
//   } catch (error) {
//     console.error("Failed to connect to MongoDB:", error)
//     throw new Error("Database connection failed")
//   }
// }

// Check if database is available
export async function isDatabaseAvailable(): Promise<boolean> {
  try {
    const { client } = await connectToDatabase()
    await client.db("bengalboatsbeyond").admin().ping()
    return true
  } catch (error) {
    console.error("Database not available:", error)
    return false
  }
}

// Get database instance
export async function getDatabase(): Promise<Db> {
  try {
    const { db } = await connectToDatabase()
    return db
  } catch (error) {
    console.error("Failed to get database:", error)
    throw new Error("Database connection failed")
  }
}

// Helper functions for user operations
export async function findUserByEmail(email: string) {
  try {
    const collection = await getCollection(COLLECTIONS.USERS)
    return await collection.findOne({ email })
  } catch (error) {
    console.error("Error finding user:", error)
    return null
  }
}

export async function createUser(userData: any) {
  try {
    const collection = await getCollection(COLLECTIONS.USERS)
    const result = await collection.insertOne({
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    return result
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

export async function getAllUsers() {
  try {
    const collection = await getCollection(COLLECTIONS.USERS)
    return await collection.find({}, { projection: { passwordHash: 0 } }).toArray()
  } catch (error) {
    console.error("Error fetching users:", error)
    return []
  }
}

// Helper functions for product operations
export async function getAllProducts() {
  try {
    const collection = await getCollection(COLLECTIONS.PRODUCTS)
    return await collection.find({}).toArray()
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

export async function getProductById(id: string) {
  try {
    const collection = await getCollection(COLLECTIONS.PRODUCTS)
    return await collection.findOne({ id })
  } catch (error) {
    console.error("Error fetching product:", error)
    return null
  }
}

export async function createProduct(productData: any) {
  try {
    const collection = await getCollection(COLLECTIONS.PRODUCTS)
    const result = await collection.insertOne({
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    return result
  } catch (error) {
    console.error("Error creating product:", error)
    throw error
  }
}

export async function updateProduct(id: string, productData: any) {
  try {
    const collection = await getCollection(COLLECTIONS.PRODUCTS)
    const result = await collection.updateOne(
      { id },
      {
        $set: {
          ...productData,
          updatedAt: new Date(),
        },
      },
    )
    return result
  } catch (error) {
    console.error("Error updating product:", error)
    throw error
  }
}

export async function deleteProduct(id: string) {
  try {
    const collection = await getCollection(COLLECTIONS.PRODUCTS)
    const result = await collection.deleteOne({ id })
    return result
  } catch (error) {
    console.error("Error deleting product:", error)
    throw error
  }
}

// Helper functions for order operations
export async function getAllOrders() {
  try {
    const collection = await getCollection(COLLECTIONS.ORDERS)
    return await collection.find({}).sort({ createdAt: -1 }).toArray()
  } catch (error) {
    console.error("Error fetching orders:", error)
    return []
  }
}

export async function getOrdersByUserId(userId: string) {
  try {
    const collection = await getCollection(COLLECTIONS.ORDERS)
    return await collection.find({ userId }).sort({ createdAt: -1 }).toArray()
  } catch (error) {
    console.error("Error fetching user orders:", error)
    return []
  }
}

export async function createOrder(orderData: any) {
  try {
    const collection = await getCollection(COLLECTIONS.ORDERS)
    const result = await collection.insertOne({
      ...orderData,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    return result
  } catch (error) {
    console.error("Error creating order:", error)
    throw error
  }
}

export async function updateOrderStatus(id: string, status: string) {
  try {
    const collection = await getCollection(COLLECTIONS.ORDERS)
    const result = await collection.updateOne(
      { id },
      {
        $set: {
          status,
          updatedAt: new Date(),
        },
      },
    )
    return result
  } catch (error) {
    console.error("Error updating order status:", error)
    throw error
  }
}

// Helper functions for category operations
export async function getAllCategories() {
  try {
    const collection = await getCollection(COLLECTIONS.CATEGORIES)
    return await collection.find({}).toArray()
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

export async function createCategory(categoryData: any) {
  try {
    const collection = await getCollection(COLLECTIONS.CATEGORIES)
    const result = await collection.insertOne({
      ...categoryData,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    return result
  } catch (error) {
    console.error("Error creating category:", error)
    throw error
  }
}

// Helper functions for blog operations
export async function getAllBlogPosts() {
  try {
    const collection = await getCollection(COLLECTIONS.BLOG_POSTS)
    return await collection.find({}).sort({ createdAt: -1 }).toArray()
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return []
  }
}

export async function getBlogPostBySlug(slug: string) {
  try {
    const collection = await getCollection(COLLECTIONS.BLOG_POSTS)
    return await collection.findOne({ slug })
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return null
  }
}

export async function createBlogPost(postData: any) {
  try {
    const collection = await getCollection(COLLECTIONS.BLOG_POSTS)
    const result = await collection.insertOne({
      ...postData,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    return result
  } catch (error) {
    console.error("Error creating blog post:", error)
    throw error
  }
}

// Type definitions
export interface DatabaseUser {
  id: string
  name: string
  email: string
  passwordHash: string
  phone?: string
  role: "admin" | "customer"
  createdAt: Date
  updatedAt: Date
}

export interface DatabaseProduct {
  id: string
  name: string
  description: string
  price: number
  category: string
  images: string[]
  inStock: boolean
  stockQuantity: number
  createdAt: Date
  updatedAt: Date
}

export interface DatabaseOrder {
  id: string
  userId: string
  items: Array<{
    productId: string
    quantity: number
    price: number
  }>
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  shippingAddress: {
    name: string
    address: string
    city: string
    postalCode: string
    country: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface DatabaseCategory {
  id: string
  name: string
  description: string
  image: string
  createdAt: Date
  updatedAt: Date
}

export interface DatabaseBlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  author: string
  publishedAt: Date
  category: string
  tags: string[]
  featured: boolean
  image: string
  createdAt: Date
  updatedAt: Date
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
// export default clientPromise

// Helper function to get collection
async function getCollection(collectionName: string) {
  try {
    const { db } = await connectToDatabase()
    return db.collection(collectionName)
  } catch (error) {
    console.error(`Failed to get collection ${collectionName}:`, error)
    throw error
  }
}
