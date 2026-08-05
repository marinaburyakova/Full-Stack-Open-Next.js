// app/login/page.tsx
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react'; // ИМПОРТИРУЕМ СТРОГО КЛИЕНТСКИЙ МЕТОД
import Link from 'next/link';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

// Внутри app/login/page.tsx найди и замени функцию handleSubmit:

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setIsPending(true);

  if (!username || !password) {
    setError('Username and password are required');
    setIsPending(false);
    return;
  }

  try {
    // Включаем redirect: false, чтобы NextAuth НЕ управлял редиректом сам
    const result = await signIn('credentials', {
      username,
      password,
      redirect: false, 
    });

    if (result?.error) {
      setError('Invalid username or password');
      setIsPending(false);
    } else {
      // Локально перенаправляем средствами Next.js на страницу блогов
      window.location.href = '/blogs';
    }
  } catch (err) {
    console.error('Login client error:', err);
    setError('Invalid username or password');
    setIsPending(false);
  }
};


  return (
    <div className="max-w-md mx-auto space-y-6 mt-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-950">Welcome Back</h1>
        <p className="text-slate-500 mt-2">Log in to manage and share your blogs</p>
      </div>

      {/* Обычная форма с обработчиком onSubmit */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 border border-slate-200 rounded-2xl shadow-xs">
        
        {/* Отображение ошибки */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 text-sm font-medium rounded-xl">
            ⚠️ {error}
          </div>
        )}

        <div>
          <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isPending}
            required
            placeholder="mluukkai"
            className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isPending}
            required
            placeholder="••••••••"
            className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2.5 px-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 cursor-pointer text-center"
        >
          {isPending ? 'Logging in...' : 'Log In'}
        </button>

        <p className="text-sm text-slate-600 text-center mt-4">
          Don't have an account yet?{' '}
          <Link href="/register" className="text-indigo-600 hover:underline font-medium">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
