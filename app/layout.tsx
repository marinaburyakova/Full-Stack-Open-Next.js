import type { Metadata } from 'next'
import Link from 'next/link'
import { auth } from '@/auth' // Импортируем проверку сессии NextAuth v5
import './globals.css'

export const metadata: Metadata = {
  title: 'FSO Blog App',
  description: 'Next.js version of Full Stack Open Bloglist',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Проверяем сессию на сервере
  const session = await auth()

  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        <nav className="bg-white border-b border-gray-200 p-4 shadow-sm">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            {/* Навигация слева */}
            <div className="flex gap-6 font-semibold">
              <Link
                href="/"
                className="text-gray-600 hover:text-indigo-600 transition"
              >
                Home
              </Link>
              <Link
                href="/blogs"
                className="text-gray-600 hover:text-indigo-600 transition"
              >
                Blogs
              </Link>
              <Link
                href="/users"
                className="text-gray-600 hover:text-indigo-600 transition"
              >
                Users
              </Link>
            </div>

            {/* Навигация справа */}
            <div className="flex gap-4 items-center font-medium text-sm">
              {session?.user ? (
                <span className="text-gray-500">
                  Logged in as{' '}
                  <strong className="text-gray-800">{session.user.name}</strong>
                </span>
              ) : (
                <Link
                  href="/register"
                  className="text-gray-600 hover:text-indigo-600 transition"
                >
                  Register
                </Link>
              )}
            </div>
          </div>
        </nav>

        <main className="max-w-4xl mx-auto p-6">{children}</main>
      </body>
    </html>
  )
}
