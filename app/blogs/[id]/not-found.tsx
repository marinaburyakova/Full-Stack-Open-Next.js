// app/blogs/[id]/not-found.tsx
import Link from 'next/link';

export default function BlogNotFound() {
  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <h1 className="text-4xl font-bold text-slate-900 mb-4">📝 Blog Not Found</h1>
      <p className="text-slate-600 mb-8">The blog you are looking for does not exist.</p>
      <Link 
        href="/blogs" 
        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
      >
        Back to Blogs
      </Link>
    </div>
  );
}