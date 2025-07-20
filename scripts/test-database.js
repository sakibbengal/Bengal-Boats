const { MongoClient } = require("mongodb")
require("dotenv").config({ path: ".env.local" })

async function testDatabaseConnection() {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    console.error("❌ MONGODB_URI environment variable is not set")
    process.exit(1)
  }

  console.log("🔍 Testing MongoDB connection...")
  console.log("URI:", uri.replace(/\/\/([^:]+):([^@]+)@/, "//***:***@"))

  let client

  try {
    client = new MongoClient(uri)
    await client.connect()

    console.log("✅ Successfully connected to MongoDB")

    const db = client.db("bengalboatsbeyond")

    // Test database operations
    console.log("\n📊 Testing database operations...")

    // Test collections
    const collections = await db.listCollections().toArray()
    console.log(
      `📁 Found ${collections.length} collections:`,
      collections.map((c) => c.name),
    )

    // Test basic operations
    const testCollection = db.collection("test")

    // Insert test document
    const insertResult = await testCollection.insertOne({
      test: true,
      timestamp: new Date(),
    })
    console.log("✅ Insert test passed:", insertResult.insertedId)

    // Find test document
    const findResult = await testCollection.findOne({ test: true })
    console.log("✅ Find test passed:", !!findResult)

    // Delete test document
    const deleteResult = await testCollection.deleteOne({ test: true })
    console.log("✅ Delete test passed:", deleteResult.deletedCount === 1)

    // Check required collections
    const requiredCollections = ["users", "products", "orders", "categories", "blog_posts"]
    console.log("\n📋 Checking required collections...")

    for (const collectionName of requiredCollections) {
      const count = await db.collection(collectionName).countDocuments()
      console.log(`📊 ${collectionName}: ${count} documents`)
    }

    console.log("\n✅ Database connection test completed successfully!")
  } catch (error) {
    console.error("❌ Database connection test failed:", error.message)
    process.exit(1)
  } finally {
    if (client) {
      await client.close()
      console.log("🔌 Database connection closed")
    }
  }
}

// Run the test
testDatabaseConnection()
