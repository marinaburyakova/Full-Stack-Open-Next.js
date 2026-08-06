// drizzle.config.ts
import { defineConfig } from "drizzle-kit"
import * as dotenv from "dotenv"

// Загружаем правильный .env файл
const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env.local"
console.log(`📝 Loading env from: ${envFile}`)
dotenv.config({ path: envFile })

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is missing in drizzle.config.ts')
  process.exit(1)
}

export default defineConfig({
  schema: "./app/db/schema.ts",
  out: "./app/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  // ✅ Для тестов используем схему "test"
  schemaFilter: process.env.NODE_ENV === "test" ? ["test"] : ["public"],
})