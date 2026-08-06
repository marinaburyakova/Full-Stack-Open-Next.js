// app/reading-list/page.tsx
import { auth } from '../../auth';
import { redirect } from 'next/navigation';
import { db } from '../db';
import { readingList, blogs } from '../db/schema';
import { eq, desc } from 'drizzle-orm';
import Link from 'next/link';
import { removeFromReadingList, markAsRead } from '../blogs/readingListActions';

export const dynamic = 'force-dynamic';

export default async function ReadingListPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const readingItems = await db
    .select({
      readingListId: readingList.id,
      blogId: blogs.id,
      title: blogs.title,
      author: blogs.author,
      url: blogs.url,
      likes: blogs.likes,
      addedAt: readingList.addedAt,
      isRead: readingList.isRead,
    })
    .from(readingList)
    .innerJoin(blogs, eq(readingList.blogId, blogs.id))
    .where(eq(readingList.userId, session.user.id))
    .orderBy(desc(readingList.addedAt));

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">📚 My Reading List</h1>
          <p className="text-slate-500 mt-1">
            {readingItems.length} {readingItems.length === 1 ? 'blog' : 'blogs'} saved
          </p>
        </div>
        <Link 
          href="/blogs" 
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Browse Blogs
        </Link>
      </div>

      {readingItems.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <p className="text-2xl mb-4">📚</p>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Your reading list is empty</h2>
          <p className="text-slate-500 mb-6">
            Start adding blogs you want to read later!
          </p>
          <Link 
            href="/blogs" 
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Browse Blogs
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {readingItems.map((item) => (
            <div 
              key={item.readingListId} 
              className={`bg-white rounded-xl shadow-sm border p-6 transition ${
                item.isRead ? 'border-green-200 bg-green-50/30' : 'border-slate-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <Link href={`/blogs/${item.blogId}`}>
                    <h2 className={`text-xl font-semibold hover:text-indigo-600 transition ${
                      item.isRead ? 'text-slate-600' : 'text-slate-900'
                    }`}>
                      {item.title}
                    </h2>
                  </Link>
                  <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                    <span>By: {item.author}</span>
                    <span>•</span>
                    <span>❤️ {item.likes || 0}</span>
                    <span>•</span>
                    <span>Added: {new Date(item.addedAt).toLocaleDateString()}</span>
                  </div>
                  {item.isRead && (
                    <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      ✅ Read
                    </span>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  {!item.isRead && (
                    <form action={async () => {
                      'use server';
                      await markAsRead(item.blogId);
                    }}>
                      <button
                        type="submit"
                        className="px-3 py-1.5 text-sm bg-green-50 text-green-600 hover:bg-green-100 border border-green-200 rounded-lg transition"
                      >
                        Mark as Read
                      </button>
                    </form>
                  )}
                  <form action={async () => {
                    'use server';
                    await removeFromReadingList(item.blogId);
                  }}>
                    <button
                      type="submit"
                      className="px-3 py-1.5 text-sm bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg transition"
                    >
                      Remove
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}