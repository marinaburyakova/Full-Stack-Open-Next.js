// app/db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set');
  console.error('📝 NODE_ENV:', process.env.NODE_ENV);
  
  if (process.env.NODE_ENV === 'test') {
    console.warn('⚠️ Running in test mode - using fallback');
    throw new Error('DATABASE_URL is missing. Please check .env.test file');
  } else {
    throw new Error('DATABASE_URL is missing in environment variables');
  }
}

const databaseUrl = process.env.DATABASE_URL!;

console.log(`🔌 Connecting to database...`);

const client = postgres(databaseUrl, {
  onnotice: (notice) => {
    if (process.env.NODE_ENV === 'test') return;
    console.log(notice);
  },
  connect_timeout: 10,
});

// Для тестов используем схему test
export const db = drizzle(client, { 
  schema,
  logger: process.env.NODE_ENV === 'development',
});

export default db;