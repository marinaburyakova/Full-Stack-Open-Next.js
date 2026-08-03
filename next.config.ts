import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {
    // Указывает Turbopack искать файлы только внутри папки проекта
    root: __dirname, 
  },
}

export default nextConfig
