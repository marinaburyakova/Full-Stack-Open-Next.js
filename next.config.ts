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
};

// Создаем конфигурацию MDX
const withMDX = createMDX({
  extension: /\.mdx?$/,
});

export default withMDX(nextConfig);