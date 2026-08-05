// app/users/[username]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '../../db';
import { eq } from 'drizzle-orm';
import { users } from '../../db/schema';

interface UserPageProps {
  params: Promise<{ username: string }>;
}

export const dynamic = 'force-dynamic';

export default async function UserDetailPage({ params }: UserPageProps) {
  const resolvedParams = await params;
  const { username } = resolvedParams;

  // Исполняем ОДИН реляционный запрос Drizzle JOIN (опция with)
  const userWithBlogs = await db.query.users.findFirst({
    where: eq(users.username, username),
    with: {
      blogs: true, // Автоматически подтягивает массив связанных блогов
    },
  });

  // Если пользователя с таким username нет в базе
  if (!userWithBlogs) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Link href="/users" className="text-sm font-medium text-indigo-600 hover:underline">
        ← Back to users
      </Link>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-950">{userWithBlogs.name}</h1>
        <p className="text-sm text-gray-500 mt-1">@{userWithBlogs.username}</p>
        
        <h3 className="text-lg font-semibold text-gray-900 mt-6 border-b border-gray-100 pb-2">
          Added blogs:
        </h3>

        <div className="mt-4 space-y-3">
          {userWithBlogs.blogs.length === 0 ? (
            <p className="text-gray-500 italic">This user has not added any blogs yet.</p>
          ) : (
            userWithBlogs.blogs.map((blog) => (
              <div key={blog.id} className="p-4 border border-gray-100 rounded-lg bg-gray-50">
                <Link 
                  href={`/blogs/${blog.id}`} 
                  className="font-semibold text-indigo-600 hover:underline block text-lg"
                >
                  {blog.title}
                </Link>
                <span className="text-xs text-gray-500">by {blog.author}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
