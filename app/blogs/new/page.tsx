// app/blogs/new/page.tsx
'use client'; // Форма становится интерактивной клиентской частью

import { useActionState } from 'react';
import { createBlog, ActionState } from '../actions';
import Link from 'next/link';

const initialState: ActionState = {
  error: undefined,
  fields: {
    title: '',
    author: '',
    url: '',
  },
};

export default function NewBlogPage() {
  // Инициализируем хук управления состоянием серверного действия
  // state — текущее состояние (ошибка + сохраненные поля)
  // formAction — обертка для отправки, которую мы передаем в тег <form>
  // isPending — флаг, показывающий, идет ли сейчас запрос на сервер
  const [state, formAction, isPending] = useActionState(createBlog, initialState);

  return (
    <div className="max-w-md mx-auto space-y-6 mt-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-950">Create New Blog</h1>
        <Link href="/blogs" className="text-sm font-medium text-gray-600 hover:underline">
          Cancel
        </Link>
      </div>
      
      <form action={formAction} className="space-y-4 bg-white p-6 border border-gray-200 rounded-xl shadow-sm">
        
        {/* Вывод сообщения об ошибке валидации */}
        {state.error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm font-medium rounded-lg">
            ⚠️ {state.error}
          </div>
        )}

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title (min 5 chars)
          </label>
          <input
            type="text"
            id="title"
            name="title"
            defaultValue={state.fields?.title} // Значение сохраняется после неудачной отправки
            disabled={isPending}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900 disabled:opacity-50"
          />
        </div>

        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
            Author (min 5 chars)
          </label>
          <input
            type="text"
            id="author"
            name="author"
            defaultValue={state.fields?.author} // Значение сохраняется
            disabled={isPending}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900 disabled:opacity-50"
          />
        </div>

        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
            URL (min 5 chars)
          </label>
          <input
            type="text" // Меняем на text, чтобы валидация длины срабатывала до встроенной браузерной проверки url
            id="url"
            name="url"
            defaultValue={state.fields?.url} // Значение сохраняется
            disabled={isPending}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900 disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 cursor-pointer text-center"
        >
          {isPending ? 'Creating...' : 'Create Blog'}
        </button>
      </form>
    </div>
  );
}
