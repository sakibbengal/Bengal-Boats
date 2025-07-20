const { MongoClient } = require("mongodb")

const uri =
  "mongodb+srv://bengalboatsnbeyond:RtYy58M13xDCTwBW@bengal-boats-db.eatqp2k.mongodb.net/?retryWrites=true&w=majority&appName=bengal-boats-db"

async function testConnection() {
  const client = new MongoClient(uri)

  try {
    console.log("🔄 Connecting to MongoDB...")
    await client.connect()

    console.log("✅ Successfully connected to MongoDB!")

    // Test database access
    const db = client.db("bengal-boats-db")
    const collections = await db.listCollections().toArray()

    console.log(
      "📊 Available collections:",
      collections.map((c) => c.name),
    )

    // Test a simple operation
    const testCollection = db.collection("test")
    await testCollection.insertOne({ test: true, timestamp: new Date() })
    const testDoc = await testCollection.findOne({ test: true })
    await testCollection.deleteOne({ test: true })

    console.log("🧪 Test operation successful:", testDoc ? "✅" : "❌")

    // Get database stats
    const stats = await db.stats()
    console.log("📈 Database stats:")
    console.log(`   - Database: ${stats.db}`)
    console.log(`   - Collections: ${stats.collections}`)
    console.log(`   - Data Size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`)
  } catch (error) {
    console.error("❌ Connection failed:", error.message)
    process.exit(1)
  } finally {
    await client.close()
    console.log("🔌 Connection closed")
  }
}

testConnection()
