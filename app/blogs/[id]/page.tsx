// app/blogs/[id]/page.tsx
import { notFound } from 'next/navigation';
import { auth } from '../../../auth';
import { db } from '../../db';
import { blogs, readingList } from '../../db/schema';
import { eq, and } from 'drizzle-orm';
import Link from 'next/link';
import { likeBlog, deleteBlog } from '../actions';
import { addToReadingList, removeFromReadingList, markAsRead } from '../readingListActions';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function BlogPage({ params }: PageProps) {
  const { id: idString } = await params;
  const id = parseInt(idString, 10);

  if (isNaN(id)) {
    notFound();
  }

  const session = await auth();
  const userId = session?.user?.id;

  const [blog] = await db
    .select()
    .from(blogs)
    .where(eq(blogs.id, id))
    .limit(1);

  if (!blog) {
    notFound();
  }

  // Проверяем, в списке ли чтения
  let inReadingList = false;
  let isRead = false;

  if (userId) {
    try {
      const [readingItem] = await db
        .select()
        .from(readingList)
        .where(
          and(
            eq(readingList.userId, userId),
            eq(readingList.blogId, id)
          )
        )
        .limit(1);

      inReadingList = !!readingItem;
      isRead = readingItem?.isRead || false;
    } catch (error) {
      console.error('Error checking reading list:', error);
    }
  }

  const isOwner = userId === blog.userId;

  return (
    <div className="max-w-2xl mx-auto">
      <Link 
        href="/blogs" 
        className="inline-block mb-6 text-indigo-600 hover:text-indigo-700 font-medium"
      >
        ← Back to Blogs
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold text-slate-900">{blog.title}</h1>
          
          {/* Кнопки для списка чтения */}
          {userId && !isOwner && (
            <div className="flex gap-2">
              {inReadingList ? (
                <>
                  <form action={async () => {
                    'use server';
                    await markAsRead(id);
                  }}>
                    <button
                      type="submit"
                      className={`px-3 py-1.5 text-sm rounded-lg transition ${
                        isRead 
                          ? 'bg-green-100 text-green-700 border border-green-300'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
                      }`}
                    >
                      {isRead ? '✅ Read' : '📖 Mark as Read'}
                    </button>
                  </form>
                  
                  <form action={async () => {
                    'use server';
                    await removeFromReadingList(id);
                  }}>
                    <button
                      type="submit"
                      className="px-3 py-1.5 text-sm bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg transition"
                    >
                      Remove
                    </button>
                  </form>
                </>
              ) : (
                <form action={async () => {
                  'use server';
                  await addToReadingList(id);
                }}>
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-sm bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition"
                  >
                    📚 Add to Reading List
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
          <span>By: {blog.author}</span>
          <span>•</span>
          <span>❤️ {blog.likes || 0}</span>
          {inReadingList && (
            <span className="text-indigo-600">• 📚 In your reading list</span>
          )}
        </div>

        {blog.url && (
          <a 
            href={blog.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block text-indigo-600 hover:text-indigo-700 font-medium mb-4"
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

          {isOwner && (
            <>
              <form action={deleteBlog}>
                <input type="hidden" name="id" value={blog.id} />
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  🗑️ Delete
                </button>
              </form>
              <Link
                href={`/blogs/${blog.id}/edit`}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition"
              >
                ✏️ Edit
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}