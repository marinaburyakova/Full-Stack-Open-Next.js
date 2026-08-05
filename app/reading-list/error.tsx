// app/reading-list/error.tsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ReadingListError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Reading list error:', error);
  }, [error]);

  return (
    <div className="max-w-4xl mx-auto text-center py-12">
      <h1 className="text-4xl font-bold text-red-600 mb-4">❌ Something went wrong</h1>
      <p className="text-slate-600 mb-8">
        Failed to load your reading list. Please try again.
      </p>
      <div className="flex gap-4 justify-center">
        <button
          onClick={reset}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Try again
        </button>
        <Link 
          href="/blogs" 
          className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition"
        >
          Browse Blogs
        </Link>
      </div>
    </div>
  );
}