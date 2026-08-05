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

export const dynamic = 'force-dynamic';

export default async function BlogDetailPage({ params }: BlogPageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const [blog] = await db.select().from(blogs).where(eq(blogs.id, id)).limit(1);

  if (!blog) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link 
        href="/blogs" 
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition"
      >
        ← Back to all blogs
      </Link>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight leading-tight">
            {blog.title}
          </h1>
          <p className="text-sm text-slate-500">
            Curated by <span className="font-bold text-slate-800">{blog.author}</span>
          </p>
        </div>

        <div className="border-t border-slate-100 pt-6 space-y-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Resource URL</span>
            <a 
              href={blog.url} 
              target="_blank" 
              rel="noreferrer" 
              className="text-indigo-600 hover:underline break-all text-sm font-medium block mt-1"
            >
              {blog.url}
            </a>
          </div>

          <div className="flex justify-between items-center bg-indigo-50/50 border border-indigo-100/50 px-5 py-4 rounded-xl mt-4">
            <div className="text-sm text-slate-700">
              Community Rating: <span className="font-extrabold text-slate-900">{blog.likes} votes</span>
            </div>
            
            <form action={likeBlog}>
              <input type="hidden" name="id" value={blog.id} />
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 shadow-xs transition active:scale-95 cursor-pointer"
              >
                👍 Appreciate
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
