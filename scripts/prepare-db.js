const fs = require("fs");
const path = require("path");

const schemaPath = path.join(__dirname, "../prisma/schema.prisma");
const dbUrl = process.env.DATABASE_URL || "";

if (dbUrl.startsWith("postgres:") || dbUrl.startsWith("postgresql:")) {
  console.log("💎 Production environment detected: Connecting to PostgreSQL database.");
  console.log("💎 Adjusting Prisma schema datasource provider...");

  // ...
  try {
    let schema = fs.readFileSync(schemaPath, "utf8");

    // Replace provider = "sqlite" with provider = "postgresql"
    const originalSchema = schema;
    schema = schema.replace(/provider\s*=\s*"sqlite"/g, 'provider = "postgresql"');

    if (schema !== originalSchema) {
      fs.writeFileSync(schemaPath, schema);
      console.log("✅ Prisma schema successfully updated to use 'postgresql' provider.");
    } else {
      console.log("ℹ️ Prisma schema provider was already set to 'postgresql' or could not be found.");
    }
  } catch (error) {
    console.error("❌ Failed to modify Prisma schema provider:", error);
    process.exit(1);
  }
} else {
  console.log("💻 Local environment detected: Connecting to SQLite database (default).");
  console.log("ℹ️ No schema adjustment needed.");
}
