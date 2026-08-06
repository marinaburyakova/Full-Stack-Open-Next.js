// app/me/page.tsx
import { auth } from '../../auth';
import { redirect } from 'next/navigation';
import { db } from '../db';
import { users, readingList, blogs } from '../db/schema';
import { eq} from 'drizzle-orm';
import { generateApiToken } from '../api/auth/meActions';

export const dynamic = 'force-dynamic';

export default async function MePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const [dbUser] = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  const readingItems = await db
    .select({
      id: readingList.id,
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
    .where(eq(readingList.userId, session.user.id));

  const unreadItems = readingItems.filter(item => !item.isRead);
  

  return (
    <div className="max-w-xl mx-auto space-y-6 mt-6">
      <div data-testid="user-profile" className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight">Personal Profile</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your account information and API access.</p>
        </div>

        <div className="border-t border-slate-100 pt-6 space-y-4">
          <div className="grid grid-cols-3 gap-4 text-sm py-2 border-b border-slate-50">
            <span className="text-slate-400 font-medium">Full Name</span>
            <span data-testid="user-name" className="col-span-2 text-slate-800 font-semibold">
              {dbUser?.name || session.user.name}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm py-2 border-b border-slate-50">
            <span className="text-slate-400 font-medium">Username</span>
            <span data-testid="user-username" className="col-span-2 text-slate-600 font-mono">
              @{dbUser?.username || session.user.email}
            </span>
          </div>
        </div>

        <div data-testid="reading-list-section" className="bg-slate-50 border border-slate-200/60 rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">📚 Reading List</h3>
            <span className="text-xs text-slate-500">
              {readingItems.length} saved
            </span>
          </div>

          {unreadItems.length > 0 ? (
            <div data-testid="unread-section" className="space-y-2">
              {unreadItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-200">
                  <span className="text-sm font-medium text-slate-900">{item.title}</span>
                  <button
                    data-testid={`mark-read-${item.blogId}`}
                    className="text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    Mark as Read
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div data-testid="empty-reading-list">
              <p data-testid="no-unread-blogs" className="text-sm text-slate-500 italic">
                No unread blogs in your reading list
              </p>
            </div>
          )}
        </div>

        <div data-testid="api-token-section" className="bg-slate-50 border border-slate-200/60 rounded-xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Personal API Token</h3>
            <p className="text-xs text-slate-500 mt-0.5">Use this token to authenticate external API requests.</p>
          </div>

          <div className="bg-white border border-slate-200 px-4 py-3 rounded-lg font-mono text-sm break-all text-slate-700 min-h-11.5 flex items-center">
            {dbUser?.apiToken ? (
              <span data-testid="api-token" className="text-indigo-600 font-semibold">
                {dbUser.apiToken}
              </span>
            ) : (
              <span data-testid="no-token-message" className="text-slate-400 italic">
                No token generated yet. Click below to create one.
              </span>
            )}
          </div>

          <form action={generateApiToken}>
            <button
              type="submit"
              data-testid="generate-token-button"
              className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              {dbUser?.apiToken ? '🔄 Regenerate Token' : '⚡ Generate New Token'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}