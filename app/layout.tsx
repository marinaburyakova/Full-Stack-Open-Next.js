import type { Metadata } from 'next'
import Link from 'next/link'
import { auth, signOut } from '../auth'
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
  const session = await auth()

  const handleLogout = async () => {
    'use server'
    await signOut({ redirectTo: '/login' })
  }

  return (
    <html lang="en" className="h-full bg-slate-50">
      <body className="antialiased min-h-screen flex flex-col font-sans text-slate-900">
        <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
            <div className="flex items-center gap-8">
              <Link
                href="/"
                className="text-xl font-bold bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent hover:opacity-90 transition"
              >
                FSO Blogs
              </Link>
              <div className="flex gap-5 text-sm font-semibold">
                <Link
                  href="/blogs"
                  className="text-slate-600 hover:text-indigo-600 transition-colors py-2"
                >
                  Blogs
                </Link>
                <Link
                  href="/users"
                  className="text-slate-600 hover:text-indigo-600 transition-colors py-2"
                >
                  Users
                </Link>
                {session?.user && (
                  <>
                    <Link
                      href="/reading-list"
                      className="text-slate-600 hover:text-indigo-600 transition-colors py-2"
                    >
                      Reading List
                    </Link>
                    <Link
                      href="/me"
                      className="text-slate-600 hover:text-indigo-600 transition-colors py-2"
                    >
                      My Profile
                    </Link>
                  </>
                )}
              </div>
            </div>

            <div className="flex gap-4 items-center font-medium text-sm">
              {session?.user ? (
                <div className="flex items-center gap-4">
                  <div className="bg-slate-100/80 px-3 py-1.5 rounded-full border border-slate-200/50 text-xs">
                    Logged in as{' '}
                    <strong className="text-slate-800 font-semibold">
                      {session.user.name}
                    </strong>
                  </div>
                  <form action={handleLogout}>
                    <button
                      type="submit"
                      className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-white border border-rose-200 hover:bg-rose-600 rounded-xl transition shadow-xs cursor-pointer"
                    >
                      Logout
                    </button>
                  </form>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-xs cursor-pointer"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 text-sm font-semibold text-indigo-600 hover:text-white border border-indigo-200 hover:bg-indigo-600 rounded-xl transition shadow-xs cursor-pointer"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </nav>

        <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}