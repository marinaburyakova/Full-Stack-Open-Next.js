import { auth } from '../auth';
import Link from 'next/link';

export default async function Home() {
  const session = await auth();

  return (
    <div className="max-w-4xl mx-auto text-center py-12">
      <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
        Welcome to FSO Blog App
      </h1>
      <p className="text-xl text-slate-600 mb-8">
        A full-stack blog application built with Next.js
      </p>
      
      {session?.user ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-green-800 font-semibold">
            ✅ You are logged in as {session.user.name}
          </p>
          <Link 
            href="/blogs" 
            className="inline-block mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Go to Blogs
          </Link>
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-slate-600 mb-4">
            Please sign in to access all features
          </p>
          <Link 
            href="/login" 
            className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Sign In
          </Link>
        </div>
      )}
    </div>
  );
}