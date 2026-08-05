
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { generateApiToken } from '../auth/meActions';

export const dynamic = 'force-dynamic';

export default async function MePage() {
  const session = await auth();

  // Защита роута: если сессии нет, отправляем на вход
  if (!session?.user?.id) {
    redirect('/login');
  }

  // Получаем свежие данные пользователя из БД (включая его токен)
  const [dbUser] = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  return (
    <div className="max-w-xl mx-auto space-y-6 mt-6">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight">Personal Profile</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your account information and API access.</p>
        </div>

        <div className="border-t border-slate-100 pt-6 space-y-4">
          <div className="grid grid-cols-3 gap-4 text-sm py-2 border-b border-slate-50">
            <span className="text-slate-400 font-medium">Full Name</span>
            <span className="col-span-2 text-slate-800 font-semibold">{dbUser?.name}</span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm py-2 border-b border-slate-50">
            <span className="text-slate-400 font-medium">Username</span>
            <span className="col-span-2 text-slate-600 font-mono">@{dbUser?.username}</span>
          </div>
        </div>

        {/* Секция управления API токеном */}
        <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Personal API Token</h3>
            <p className="text-xs text-slate-500 mt-0.5">Use this token to authenticate external API requests.</p>
          </div>

          <div className="bg-white border border-slate-200 px-4 py-3 rounded-lg font-mono text-sm break-all text-slate-700 min-h-11.5 flex items-center">
            {dbUser?.apiToken ? (
              <span className="text-indigo-600 font-semibold">{dbUser.apiToken}</span>
            ) : (
              <span className="text-slate-400 italic">No token generated yet. Click below to create one.</span>
            )}
          </div>

          {/* Форма с кнопкой генерации, которая вызывает Server Action */}
          <form action={generateApiToken}>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              {dbUser?.apiToken ? 'Regenerate Token' : 'Generate New Token'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
