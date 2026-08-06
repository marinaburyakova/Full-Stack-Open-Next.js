// next.config.ts
import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

const nextConfig: NextConfig = {
  // Поддержка MDX
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  
  // Другие настройки
  experimental: {
    mdxRs: true,
  },
  
  // ✅ Добавляем поддержку переменных окружения для тестов
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
};

// Создаем конфигурацию MDX
const withMDX = createMDX({
  extension: /\.mdx?$/,
});

export default withMDX(nextConfig);