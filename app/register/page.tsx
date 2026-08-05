import { registerUser } from '@/app/auth/actions'
import Link from 'next/link'

export default function RegisterPage() {
  return (
    <div className="max-w-md mx-auto space-y-6 mt-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-950">Create an Account</h1>
        <p className="text-gray-500 mt-2">
          Sign up to start adding your own blogs
        </p>
      </div>

      {/* Нативная форма вызывает Server Action напрямую */}
      <form
        action={registerUser}
        className="space-y-4 bg-white p-6 border border-gray-200 rounded-xl shadow-sm"
      >
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            placeholder="Matti Luukkainen"
          />
        </div>

        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            placeholder="mluukkai"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition cursor-pointer"
        >
          Register
        </button>

        <p className="text-sm text-gray-600 text-center mt-4">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-indigo-600 hover:underline font-medium"
          >
            Log in
          </Link>
        </p>
      </form>
    </div>
  )
}
