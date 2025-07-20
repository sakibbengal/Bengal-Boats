import { getDatabase } from "./mongodb"
import { ObjectId } from "mongodb"
import bcrypt from "bcryptjs"

// Generic database operations
export async function insertDocument(collection: string, document: any) {
  const db = await getDatabase()
  const result = await db.collection(collection).insertOne(document)
  return result
}

export async function insertManyDocuments(collection: string, documents: any[]) {
  const db = await getDatabase()
  const result = await db.collection(collection).insertMany(documents)
  return result
}

export async function findDocuments(collection: string, filter = {}, options = {}) {
  const db = await getDatabase()
  const documents = await db.collection(collection).find(filter, options).toArray()
  return documents
}

export async function findDocument(collection: string, filter: any) {
  const db = await getDatabase()
  const document = await db.collection(collection).findOne(filter)
  return document
}

export async function updateDocument(collection: string, filter: any, update: any) {
  const db = await getDatabase()
  const result = await db.collection(collection).updateOne(filter, { $set: update })
  return result
}

export async function deleteDocument(collection: string, filter: any) {
  const db = await getDatabase()
  const result = await db.collection(collection).deleteOne(filter)
  return result
}

export async function countDocuments(collection: string, filter = {}) {
  const db = await getDatabase()
  const count = await db.collection(collection).countDocuments(filter)
  return count
}

// Product operations
export async function getProducts(filter = {}, limit = 0, skip = 0) {
  const db = await getDatabase()
  const products = await db.collection("products").find(filter).limit(limit).skip(skip).toArray()

  return products.map((product) => ({
    ...product,
    id: product._id?.toString() || product.id,
  }))
}

export async function getProductById(id: string) {
  const db = await getDatabase()
  let filter: any

  // Try to find by ObjectId first, then by string id
  try {
    filter = { _id: new ObjectId(id) }
    let product = await db.collection("products").findOne(filter)

    if (!product) {
      filter = { id: id }
      product = await db.collection("products").findOne(filter)
    }

    if (product) {
      return {
        ...product,
        id: product._id?.toString() || product.id,
      }
    }

    return null
  } catch (error) {
    // If ObjectId conversion fails, try with string id
    filter = { id: id }
    const product = await db.collection("products").findOne(filter)

    if (product) {
      return {
        ...product,
        id: product._id?.toString() || product.id,
      }
    }

    return null
  }
}

export async function createProduct(productData: any) {
  const db = await getDatabase()
  const product = {
    ...productData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const result = await db.collection("products").insertOne(product)
  return {
    ...product,
    id: result.insertedId.toString(),
  }
}

export async function updateProduct(id: string, updateData: any) {
  const db = await getDatabase()
  const update = {
    ...updateData,
    updatedAt: new Date().toISOString(),
  }

  let filter: any
  try {
    filter = { _id: new ObjectId(id) }
    let result = await db.collection("products").updateOne(filter, { $set: update })

    if (result.matchedCount === 0) {
      filter = { id: id }
      result = await db.collection("products").updateOne(filter, { $set: update })
    }

    return result
  } catch (error) {
    filter = { id: id }
    return await db.collection("products").updateOne(filter, { $set: update })
  }
}

export async function deleteProduct(id: string) {
  const db = await getDatabase()

  let filter: any
  try {
    filter = { _id: new ObjectId(id) }
    let result = await db.collection("products").deleteOne(filter)

    if (result.deletedCount === 0) {
      filter = { id: id }
      result = await db.collection("products").deleteOne(filter)
    }

    return result
  } catch (error) {
    filter = { id: id }
    return await db.collection("products").deleteOne(filter)
  }
}

// User operations
export async function createUser(userData: any) {
  const db = await getDatabase()

  // Check if user already exists
  const existingUser = await db.collection("users").findOne({ email: userData.email })
  if (existingUser) {
    throw new Error("User already exists")
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(userData.password, 12)

  const user = {
    ...userData,
    passwordHash: hashedPassword,
    createdAt: new Date().toISOString(),
    role: userData.role || "customer",
  }

  delete user.password // Remove plain password

  const result = await db.collection("users").insertOne(user)
  return {
    ...user,
    id: result.insertedId.toString(),
  }
}

export async function getUserByEmail(email: string) {
  const db = await getDatabase()
  const user = await db.collection("users").findOne({ email })

  if (user) {
    return {
      ...user,
      id: user._id?.toString() || user.id,
    }
  }

  return null
}

export async function getUserById(id: string) {
  const db = await getDatabase()
  let filter: any

  try {
    filter = { _id: new ObjectId(id) }
    let user = await db.collection("users").findOne(filter)

    if (!user) {
      filter = { id: id }
      user = await db.collection("users").findOne(filter)
    }

    if (user) {
      return {
        ...user,
        id: user._id?.toString() || user.id,
      }
    }

    return null
  } catch (error) {
    filter = { id: id }
    const user = await db.collection("users").findOne(filter)

    if (user) {
      return {
        ...user,
        id: user._id?.toString() || user.id,
      }
    }

    return null
  }
}

export async function verifyPassword(plainPassword: string, hashedPassword: string) {
  return await bcrypt.compare(plainPassword, hashedPassword)
}

// Order operations
export async function createOrder(orderData: any) {
  const db = await getDatabase()
  const order = {
    ...orderData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: orderData.status || "pending",
  }

  const result = await db.collection("orders").insertOne(order)
  return {
    ...order,
    id: result.insertedId.toString(),
  }
}

export async function getOrders(filter = {}, limit = 0, skip = 0) {
  const db = await getDatabase()
  const orders = await db.collection("orders").find(filter).sort({ createdAt: -1 }).limit(limit).skip(skip).toArray()

  return orders.map((order) => ({
    ...order,
    id: order._id?.toString() || order.id,
  }))
}

export async function getOrderById(id: string) {
  const db = await getDatabase()
  let filter: any

  try {
    filter = { _id: new ObjectId(id) }
    let order = await db.collection("orders").findOne(filter)

    if (!order) {
      filter = { id: id }
      order = await db.collection("orders").findOne(filter)
    }

    if (order) {
      return {
        ...order,
        id: order._id?.toString() || order.id,
      }
    }

    return null
  } catch (error) {
    filter = { id: id }
    const order = await db.collection("orders").findOne(filter)

    if (order) {
      return {
        ...order,
        id: order._id?.toString() || order.id,
      }
    }

    return null
  }
}

export async function updateOrderStatus(id: string, status: string) {
  const db = await getDatabase()
  const update = {
    status,
    updatedAt: new Date().toISOString(),
  }

  let filter: any
  try {
    filter = { _id: new ObjectId(id) }
    let result = await db.collection("orders").updateOne(filter, { $set: update })

    if (result.matchedCount === 0) {
      filter = { id: id }
      result = await db.collection("orders").updateOne(filter, { $set: update })
    }

    return result
  } catch (error) {
    filter = { id: id }
    return await db.collection("orders").updateOne(filter, { $set: update })
  }
}

// Blog operations
export async function getBlogPosts(filter = {}, limit = 0, skip = 0) {
  const db = await getDatabase()
  const posts = await db
    .collection("blog_posts")
    .find(filter)
    .sort({ publishedAt: -1 })
    .limit(limit)
    .skip(skip)
    .toArray()

  return posts.map((post) => ({
    ...post,
    id: post._id?.toString() || post.id,
  }))
}

export async function getBlogPostBySlug(slug: string) {
  const db = await getDatabase()
  const post = await db.collection("blog_posts").findOne({ slug })

  if (post) {
    return {
      ...post,
      id: post._id?.toString() || post.id,
    }
  }

  return null
}

export async function createBlogPost(postData: any) {
  const db = await getDatabase()
  const post = {
    ...postData,
    publishedAt: postData.publishedAt || new Date().toISOString(),
    views: 0,
  }

  const result = await db.collection("blog_posts").insertOne(post)
  return {
    ...post,
    id: result.insertedId.toString(),
  }
}

export async function updateBlogPost(id: string, updateData: any) {
  const db = await getDatabase()

  let filter: any
  try {
    filter = { _id: new ObjectId(id) }
    let result = await db.collection("blog_posts").updateOne(filter, { $set: updateData })

    if (result.matchedCount === 0) {
      filter = { id: id }
      result = await db.collection("blog_posts").updateOne(filter, { $set: updateData })
    }

    return result
  } catch (error) {
    filter = { id: id }
    return await db.collection("blog_posts").updateOne(filter, { $set: updateData })
  }
}

export async function incrementBlogPostViews(slug: string) {
  const db = await getDatabase()
  return await db.collection("blog_posts").updateOne({ slug }, { $inc: { views: 1 } })
}

// Category operations
export async function getCategories() {
  const db = await getDatabase()
  const categories = await db.collection("categories").find({}).toArray()

  return categories.map((category) => ({
    ...category,
    id: category._id?.toString() || category.id,
  }))
}

export async function createCategory(categoryData: any) {
  const db = await getDatabase()
  const result = await db.collection("categories").insertOne(categoryData)
  return {
    ...categoryData,
    id: result.insertedId.toString(),
  }
}

// Initialize database with sample data
export async function initializeDatabase() {
  const db = await getDatabase()

  try {
    // Import sample data
    const { products, categories, sampleUsers, mockOrders, sampleBlogPosts } = await import("./data")

    // Clear existing data
    await db.collection("products").deleteMany({})
    await db.collection("categories").deleteMany({})
    await db.collection("users").deleteMany({})
    await db.collection("orders").deleteMany({})
    await db.collection("blog_posts").deleteMany({})

    // Insert sample data
    await db.collection("products").insertMany(products)
    await db.collection("categories").insertMany(categories)
    await db.collection("users").insertMany(sampleUsers)
    await db.collection("orders").insertMany(mockOrders)
    await db.collection("blog_posts").insertMany(sampleBlogPosts)

    return {
      success: true,
      message: "Database initialized successfully",
      counts: {
        products: products.length,
        categories: categories.length,
        users: sampleUsers.length,
        orders: mockOrders.length,
        blogPosts: sampleBlogPosts.length,
      },
    }
  } catch (error) {
    console.error("Database initialization error:", error)
    throw error
  }
}
