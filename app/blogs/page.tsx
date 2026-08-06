// app/blogs/page.tsx
import { db } from '../db';
import { blogs } from '../db/schema';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function BlogsPage() {
  const allBlogs = await db.select().from(blogs);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight">Blogs</h1>
        <Link 
          href="/blogs/new" 
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Create New Blog
        </Link>
      </div>

      <div data-testid="blogs-list" className="grid gap-4">
        {allBlogs.length === 0 ? (
          <p className="text-slate-500 italic text-center py-8">No blogs available yet.</p>
        ) : (
          allBlogs.map((blog) => (
            <div key={blog.id} className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
              <Link href={`/blogs/${blog.id}`}>
                <h3 className="font-bold text-slate-900 hover:text-indigo-600 transition">
                  {blog.title}
                </h3>
              </Link>
              <p className="text-sm text-slate-500">By: {blog.author}</p>
              <p className="text-sm text-slate-500">{blog.likes || 0} likes</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}