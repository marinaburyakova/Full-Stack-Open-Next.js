// app/blogs/[id]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '../../db';
import { blogs } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { likeBlog } from '../actions';

interface BlogPageProps {
  params: Promise<{ id: string }>;
}

export default async function BlogDetailPage({ params }: BlogPageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  // Ищем запись в базе данных по id
  const [blog] = await db
    .select()
    .from(blogs)
    .where(eq(blogs.id, id))
    .limit(1);

  if (!blog) {
    notFound();
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <Link 
        href="/blogs" 
        className="inline-block text-sm font-medium text-indigo-600 hover:text-indigo-800 transition"
      >
        ← Back to all blogs
      </Link>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-950 mb-2">
            {blog.title}
          </h1>
          <p className="text-gray-600">
            Added by <span className="font-semibold text-gray-800">{blog.author}</span>
          </p>
        </div>

        <div className="border-t border-gray-100 pt-4 space-y-3">
          <div>
            <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">URL</span>
            <a 
              href={blog.url} 
              target="_blank" 
              rel="noreferrer" 
              className="text-blue-500 hover:underline break-all text-sm block mt-1"
            >
              {blog.url}
            </a>
          </div>

          <div className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-lg border border-gray-100 mt-4">
            <span className="text-gray-600 font-medium">Rating: <span className="font-bold text-gray-900">{blog.likes} likes</span></span>
            
            <form action={likeBlog}>
              <input type="hidden" name="id" value={blog.id} />
              <button
                type="submit"
                className="px-4 py-1.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition active:scale-95 cursor-pointer"
              >
                👍 Like
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
