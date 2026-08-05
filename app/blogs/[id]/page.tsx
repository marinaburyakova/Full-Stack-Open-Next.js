// app/blogs/[id]/page.tsx
import { notFound } from 'next/navigation';
import { db } from '../../db';
import { blogs } from '../../db/schema';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import { likeBlog, deleteBlog } from '../actions';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function BlogPage({ params }: PageProps) {
  // Преобразуем строку в число
  const id = parseInt(params.id, 10);

  if (isNaN(id)) {
    notFound();
  }

  const [blog] = await db
    .select()
    .from(blogs)
    .where(eq(blogs.id, id))
    .limit(1);

  if (!blog) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link 
        href="/blogs" 
        className="inline-block mb-6 text-indigo-600 hover:text-indigo-700 font-medium"
      >
        ← Back to Blogs
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">{blog.title}</h1>
        
        <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
          <span>By: {blog.author}</span>
          <span>•</span>
          <span>Likes: {blog.likes || 0}</span>
        </div>

        {blog.url && (
          <a 
            href={blog.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Read more →
          </a>
        )}

        <div className="mt-6 flex gap-4">
          <form action={likeBlog}>
            <input type="hidden" name="id" value={blog.id} />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              👍 Like
            </button>
          </form>

          <form action={deleteBlog}>
            <input type="hidden" name="id" value={blog.id} />
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              🗑️ Delete
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}