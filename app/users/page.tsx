
import Link from 'next/link';
import { db } from '../db';
import { users } from '../db/schema';

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  // Получаем список всех пользователей из базы данных PostgreSQL
  const allUsers = await db.select().from(users);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-950">Users</h1>
      
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm divide-y divide-gray-100">
        {allUsers.length === 0 ? (
          <p className="p-6 text-gray-500 italic">No users found.</p>
        ) : (
          allUsers.map((user) => (
            <div key={user.id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition">
              {/* Ссылка на страницу по username */}
              <Link 
                href={`/users/${user.username}`} 
                className="text-indigo-600 font-semibold hover:underline"
              >
                {user.name}
              </Link>
              <span className="text-sm text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full font-medium">
                @{user.username}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
