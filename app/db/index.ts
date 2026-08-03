// app/db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set in environment variables');
}

// Для Next.js в режиме разработки предотвращаем создание множественных соединений при Hot Reload
const client = postgres(connectionString, { max: 1 });
export const db = drizzle(client, { schema });
