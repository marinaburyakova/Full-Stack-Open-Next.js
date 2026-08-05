// app/users/[username]/page.tsx
import { notFound } from 'next/navigation';
import { db } from '../../db';
import { users, blogs } from '../../db/schema';
import { eq } from 'drizzle-orm';
import Link from 'next/link';

interface PageProps {
  params: {
    username: string;
  };
}

export default async function UserPage({ params }: PageProps) {
  const { username } = await params;

  // Находим пользователя
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  if (!user) {
    notFound();
  }

  // Находим все блоги пользователя
  const userBlogs = await db
    .select()
    .from(blogs)
    .where(eq(blogs.userId, user.id));

  return (
    <div className="max-w-4xl mx-auto">
      <Link 
        href="/users" 
        className="inline-block mb-6 text-indigo-600 hover:text-indigo-700 font-medium"
      >
        ← Back to Users
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-2xl font-bold">
            {user.name?.[0] || user.username?.[0] || 'U'}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{user.name || user.username}</h1>
            <p className="text-slate-500">@{user.username}</p>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Blogs ({userBlogs.length})
          </h2>

          <div className="space-y-3">
            {userBlogs.length === 0 ? (
              <p className="text-slate-500 italic">This user has not added any blogs yet.</p>
            ) : (
              userBlogs.map((blog) => (
                <Link key={blog.id} href={`/blogs/${blog.id}`}>
                  <div className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition cursor-pointer">
                    <h3 className="font-semibold text-slate-900">{blog.title}</h3>
                    <div className="flex gap-4 mt-1 text-sm text-slate-500">
                      <span>By: {blog.author}</span>
                      <span>•</span>
                      <span>❤️ {blog.likes || 0}</span>
                    </div>
                    {blog.url && (
                      <p className="text-sm text-indigo-600 mt-1">{blog.url}</p>
                    )}
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}