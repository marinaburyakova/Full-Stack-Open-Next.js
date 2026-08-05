// app/login/page.tsx
'use client';

import { useActionState } from 'react';
// ИМПОРТИРУЕМ ИСПРАВЛЕННОЕ ДЕЙСТВИЕ НАПРЯМУЮ ИЗ АУТЕНТИФИКАЦИИ
import { loginUserAction, LoginActionState } from '../../auth'; 
import Link from 'next/link';

const initialState: LoginActionState = {
  error: undefined,
  fields: {
    username: '',
  },
};

export default function LoginPage() {
  // Передаем новое действие в хук
  const [state, formAction, isPending] = useActionState(loginUserAction, initialState);

  return (
    <div className="max-w-md mx-auto space-y-6 mt-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-950">Welcome Back</h1>
        <p className="text-slate-500 mt-2">Log in to manage and share your blogs</p>
      </div>

      <form action={formAction} className="space-y-4 bg-white p-6 border border-slate-200 rounded-2xl shadow-xs">
        
        {state.error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 text-sm font-medium rounded-xl">
            ⚠️ {state.error}
          </div>
        )}

        <div>
          <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            defaultValue={state.fields?.username}
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
            name="password"
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
