// app/users/page.tsx
import { db } from '../db';
import { users } from '../db/schema';

export default async function UsersPage() {
  const allUsers = await db.select().from(users);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Users</h1>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 border-b border-slate-200 font-semibold text-slate-600 text-sm">
          <div>Name</div>
          <div>Username</div>
        </div>

        {allUsers.map((user) => (
          <div key={user.id} className="grid grid-cols-2 gap-4 p-4 border-b border-slate-100 hover:bg-slate-50 transition">
            <div className="font-medium text-slate-900">{user.name || 'Unknown'}</div>
            <div className="text-slate-600">@{user.username}</div>
          </div>
        ))}

        {allUsers.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            No users registered yet.
          </div>
        )}
      </div>
    </div>
  );
}