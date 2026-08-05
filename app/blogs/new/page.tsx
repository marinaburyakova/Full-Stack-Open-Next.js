// app/blogs/new/page.tsx
'use client'

import { useActionState } from 'react'
import { createBlog, ActionState } from '../actions'
import Link from 'next/link'

const initialState: ActionState = {
  errors: {},
  success: false,
  message: '',
}

export default function NewBlogPage() {
  const [state, formAction] = useActionState(createBlog, initialState)

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/blogs"
        className="inline-block mb-6 text-indigo-600 hover:text-indigo-700 font-medium"
      >
        ← Back to Blogs
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">
          Create New Blog
        </h1>

        <form
          action={formAction}
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter blog title"
            />
            {state.errors?.title && (
              <p className="mt-1 text-sm text-red-600">
                {state.errors.title[0]}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="author"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Author *
            </label>
            <input
              type="text"
              id="author"
              name="author"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter author name"
            />
            {state.errors?.author && (
              <p className="mt-1 text-sm text-red-600">
                {state.errors.author[0]}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="url"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              URL (optional)
            </label>
            <input
              type="text"
              id="url"
              name="url"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="https://example.com"
            />
            {state.errors?.url && (
              <p className="mt-1 text-sm text-red-600">{state.errors.url[0]}</p>
            )}
          </div>

          {state.errors?._form && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{state.errors._form[0]}</p>
            </div>
          )}

          {state.success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-600">{state.message}</p>
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Create Blog
            </button>
            <Link
              href="/blogs"
              className="px-6 py-2.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
