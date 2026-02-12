import { MongoClient } from "mongodb";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const MONGODB_URI =
  "mongodb+srv://michelle_db_user:KjKuhkkFBFrXG47y@zm-shop.c5knemy.mongodb.net/zm_shop_db";
const DB_NAME = "zm_shop_db";

async function migrateVariants() {
  const client = new MongoClient(MONGODB_URI);

  try {
    console.log("🔌 Connecting to MongoDB...");
    await client.connect();

    const db = client.db(DB_NAME);
    const products = db.collection("products");

    console.log("📊 Checking for products to migrate...");

    // Count documents that need migration
    const countToMigrate = await products.countDocuments({
      "variants.attributeValues": { $type: "object" },
    });

    console.log(
      `📝 Found ${countToMigrate} products with Map-style attributeValues`,
    );

    if (countToMigrate === 0) {
      console.log("✅ No migration needed!");
      return;
    }

    console.log("🚀 Starting migration...");

    // Run the aggregation pipeline
    const result = await products.updateMany(
      { "variants.attributeValues": { $type: "object" } },
      [
        {
          $set: {
            variants: {
              $map: {
                input: "$variants",
                as: "variant",
                in: {
                  $mergeObjects: [
                    "$$variant",
                    {
                      attributeValues: {
                        $objectToArray: "$$variant.attributeValues",
                      },
                    },
                  ],
                },
              },
            },
          },
        },
        {
          $set: {
            variants: {
              $map: {
                input: "$variants",
                as: "variant",
                in: {
                  $mergeObjects: [
                    "$$variant",
                    {
                      attributeValues: {
                        $map: {
                          input: "$$variant.attributeValues",
                          as: "attr",
                          in: {
                            key: "$$attr.k",
                            value: "$$attr.v",
                          },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      ],
    );

    console.log("\n=== ✅ Migration Complete ===");
    console.log(`Matched documents: ${result.matchedCount}`);
    console.log(`Modified documents: ${result.modifiedCount}`);

    // Verify by checking remaining
    const remaining = await products.countDocuments({
      "variants.attributeValues": { $type: "object" },
    });
    console.log(`Remaining to migrate: ${remaining}`);

    if (remaining > 0) {
      console.warn("⚠️  Some documents were not migrated!");
    } else {
      console.log("🎉 All documents migrated successfully!");
    }

    // Show sample of migrated data
    const sample = await products.findOne({ "variants.0": { $exists: true } });
    if (sample) {
      console.log("\n📋 Sample migrated variant:");
      console.log(JSON.stringify(sample.variants[0], null, 2));
    }
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await client.close();
    console.log("\n🔌 Disconnected from MongoDB");
  }
}

// Run migration
migrateVariants();
