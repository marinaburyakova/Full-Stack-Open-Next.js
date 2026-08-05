// app/layout.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { auth } from '@/auth';
import { NotificationProvider } from './context/NotificationContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'FSO Blog App',
  description: 'Next.js version of Full Stack Open Bloglist',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let session = null;
  try {
    session = await auth();
  } catch (error) {
    console.log(error)
    console.warn("NextAuth session is skipped during production compile phase.");
  }

  return (
    <html lang="en" className="h-full bg-slate-50">
      <body className="antialiased min-h-screen flex flex-col font-sans text-slate-900">
        <NotificationProvider>
          {/* СТИЛИЗОВАННАЯ ПАНЕЛЬ НАВИГАЦИИ */}
          <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
              {/* Навигация слева */}
              <div className="flex items-center gap-8">
                <Link href="/" className="text-xl font-bold bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent hover:opacity-90 transition">
                  FSO Blogs
                </Link>
                <div className="flex gap-5 text-sm font-semibold">
                  <Link href="/blogs" className="text-slate-600 hover:text-indigo-600 transition-colors py-2">
                    Blogs
                  </Link>
                  <Link href="/users" className="text-slate-600 hover:text-indigo-600 transition-colors py-2">
                    Users
                  </Link>
                </div>
              </div>

              {/* Навигация справа */}
              <div className="flex gap-4 items-center font-medium text-sm">
                {session?.user ? (
                  <div className="flex items-center gap-3 bg-slate-100/80 px-3 py-1.5 rounded-full border border-slate-200/50">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-slate-600 text-xs">
                      Logged in as <strong className="text-slate-800 font-semibold">{session.user.name}</strong>
                    </span>
                  </div>
                ) : (
                  <Link 
                    href="/register" 
                    className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-xs cursor-pointer"
                  >
                    Get Started
                  </Link>
                )}
              </div>
            </div>
          </nav>

          {/* Основной контент */}
          <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </NotificationProvider>
      </body>
    </html>
  );
}
