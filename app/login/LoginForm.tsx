// app/login/LoginForm.tsx
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function LoginForm() {
  const searchParams = useSearchParams();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPending, setIsPending] = useState(false);

  const errorType = searchParams.get('error');
  const [localError, setLocalError] = useState<string | null>(null);
  
  const displayError = localError || (errorType === 'CredentialsSignin' ? 'Invalid username or password' : null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setIsPending(true);

    if (!username || !password) {
      setLocalError('Username and password are required');
      setIsPending(false);
      return;
    }

    try {
      // ИСПРАВЛЕНИЕ: Отключаем автоматический редирект NextAuth, 
      // чтобы ОШИБКА 404 физически не могла произойти
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false, 
      });

      if (result?.error) {
        setLocalError('Invalid username or password');
        setIsPending(false);
      } else {
        // КАНОНИЧНЫЙ ЖЕСТКИЙ ПЕРЕХОД: браузер сам перейдет на /blogs, 
        // не потеряет порт localhost:3000 и заставит сервер перерисовать шапку сайта!
        window.location.href = '/blogs';
      }
    } catch (err) {
      console.error('Login client error:', err);
      setLocalError('Invalid username or password');
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 border border-slate-200 rounded-2xl shadow-xs">
      {displayError && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 text-sm font-medium rounded-xl">
          ⚠️ {displayError}
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
  );
}
