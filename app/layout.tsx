// app/layout.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css'; // Если используешь Tailwind

export const metadata: Metadata = {
  title: 'FSO Blog App',
  description: 'Next.js version of Full Stack Open Bloglist',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        {/* Навигационная панель */}
        <nav className="bg-white border-b border-gray-200 p-4 shadow-sm">
          <div className="max-w-4xl mx-auto flex gap-6 font-semibold">
            <Link href="/" className="text-gray-600 hover:text-indigo-600 transition">
              Home
            </Link>
            <Link href="/blogs" className="text-gray-600 hover:text-indigo-600 transition">
              Blogs
            </Link>
          </div>
        </nav>

        {/* Основной контент */}
        <main className="max-w-4xl mx-auto p-6">
          {children}
        </main>
      </body>
    </html>
  );
}
