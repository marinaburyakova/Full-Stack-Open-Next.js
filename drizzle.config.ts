import { defineConfig } from "drizzle-kit"
import * as dotenv from "dotenv"

// Загружаем правильный .env файл
const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env.local"
dotenv.config({ path: envFile })

export default defineConfig({
  schema: "./app/db/schema.ts",
  out: "./app/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  // Для тестов используем схему "test"
  schemaFilter: process.env.NODE_ENV === "test" ? ["test"] : ["public"],
})