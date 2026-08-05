// app/blogs/page.tsx
import { db } from '../db';
import { blogs } from '../db/schema';
import Link from 'next/link';

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

      <div className="grid gap-4">
        {allBlogs.length === 0 ? (
          <p className="text-slate-500 italic text-center py-8">No blogs available yet.</p>
        ) : (
          allBlogs.map((blog) => (
            <Link key={blog.id} href={`/blogs/${blog.id}`}>
              <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs hover:shadow-md transition cursor-pointer">
                <h3 className="font-bold text-slate-900">{blog.title}</h3>
                <p className="text-sm text-slate-500">Author: {blog.author}</p>
                {blog.url && (
                  <p className="text-sm text-indigo-600 mt-1">{blog.url}</p>
                )}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}