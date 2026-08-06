// app/db/index.ts
import 'dotenv/config'; // 👈 Добавляем в самом начале
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// ✅ Загружаем .env.test для тестовой среды (используем import)
if (process.env.NODE_ENV === 'test') {
  console.log('🔧 Loading .env.test file...');
  // Используем import вместо require
  const dotenv = await import('dotenv');
  dotenv.config({ path: '.env.test' });
}

// ✅ Проверяем DATABASE_URL с улучшенным сообщением
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set in environment variables');
  console.error('📝 NODE_ENV:', process.env.NODE_ENV);
  console.error('📝 Available env vars with DATABASE:', 
    Object.keys(process.env).filter(key => key.includes('DATABASE'))
  );
  
  if (process.env.NODE_ENV === 'test') {
    console.warn('⚠️ Running in test mode without DATABASE_URL');
    // Используем fallback для тестов (если нужно)
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
  } else {
    throw new Error('DATABASE_URL is missing in environment variables');
  }
}

const databaseUrl = process.env.DATABASE_URL!;

console.log(`🔌 Connecting to database: ${databaseUrl.split('@')[1]?.split('/')[0] || 'unknown'}`);

const client = postgres(databaseUrl, {
  onnotice: (notice) => {
    if (process.env.NODE_ENV === 'test') return;
    console.log(notice);
  },
  connect_timeout: 10,
});

export const db = drizzle(client, { 
  schema,
  logger: process.env.NODE_ENV === 'development',
});

export default db;