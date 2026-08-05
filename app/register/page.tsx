// app/register/page.tsx
'use client';

import { useActionState } from 'react';
import { registerUser, RegisterActionState } from '../auth/actions';
import Link from 'next/link';

const initialState: RegisterActionState = {
  error: undefined,
  fields: {
    name: '',
    username: '',
  },
};

export default function RegisterPage() {
  // Подключаем хук для управления состоянием формы регистрации
  const [state, formAction, isPending] = useActionState(registerUser, initialState);

  return (
    <div className="max-w-md mx-auto space-y-6 mt-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-950">Create an Account</h1>
        <p className="text-gray-500 mt-2">Sign up to start adding your own blogs</p>
      </div>
      
      <form action={formAction} className="space-y-4 bg-white p-6 border border-gray-200 rounded-xl shadow-sm">
        
        {/* Вывод ошибки валидации */}
        {state.error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm font-medium rounded-lg">
            ⚠️ {state.error}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={state.fields?.name} // Значение сохраняется
            disabled={isPending}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900"
            placeholder="Matti Luukkainen"
          />
        </div>

        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Username (min 4 chars)
          </label>
          <input
            type="text"
            id="username"
            name="username"
            defaultValue={state.fields?.username} // Значение сохраняется
            disabled={isPending}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900"
            placeholder="mluukkai"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password (min 4 chars)
          </label>
          <input
            type="password"
            id="password"
            name="password"
            disabled={isPending}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900"
            placeholder="••••••••"
          />
        </div>

        {/* НОВОЕ ПОЛЕ: ПОДТВЕРЖДЕНИЕ ПАРОЛЯ */}
        <div>
          <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            id="passwordConfirm"
            name="passwordConfirm"
            disabled={isPending}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 cursor-pointer text-center"
        >
          {isPending ? 'Registering...' : 'Register'}
        </button>

        <p className="text-sm text-gray-600 text-center mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-600 hover:underline font-medium">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
