// app/db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;
const isBuilding = process.env.NEXT_PHASE === 'phase-production-build';

if (!connectionString && !isBuilding) {
  throw new Error('DATABASE_URL is missing in runtime! Please check Render Environment variables.');
}

const finalConnectionString = connectionString || 'postgresql://localhost:5432/fake';

const client = postgres(finalConnectionString, { 
  max: isBuilding ? 1 : 10, 
  connect_timeout: isBuilding ? 1 : 15,
  // Включаем обязательную поддержку SSL для защиты соединений с Render
  ssl: isBuilding ? false : 'require' 
});

export const db = drizzle(client, { schema });
