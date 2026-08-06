'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<{
    username?: string
    passwordConfirm?: string
  }>({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    console.log('📝 Form submitted')
    console.log('📝 Username:', formData.username)
    console.log('📝 Username length:', formData.username.length)

    setErrors({})
    setServerError('')

    // ✅ Проверка на короткий username
    if (formData.username.length < 3) {
      console.log('❌ Username too short!')
      setErrors({ username: 'Username must be at least 3 characters' })
      // ❗ НЕ ОТПРАВЛЯЕМ ФОРМУ
      return
    }

    // ✅ Проверка на совпадение паролей
    if (formData.password !== formData.confirmPassword) {
      console.log('❌ Passwords do not match!')
      setErrors({ passwordConfirm: 'Passwords do not match' })
      return
    }

    console.log('✅ Validation passed, sending request...')

    setLoading(true)

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          username: formData.username,
          password: formData.password,
        }),
      })

      if (response.ok) {
        router.push('/login')
      } else {
        const data = await response.json()
        setServerError(data.error || 'Registration failed')
      }
    } catch {
      setServerError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Register</h1>
        <p className="text-slate-500 text-sm mb-6">
          Create your account to get started!
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          noValidate
        >
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
              disabled={loading}
            />
            {/* ✅ data-testid="username-error" - всегда в DOM с текстом ошибки */}
            <div
              data-testid="username-error"
              className="mt-1"
            >
              {errors.username && (
                <p className="text-sm text-red-600">{errors.username}</p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
              minLength={6}
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
              disabled={loading}
            />
            {/* ✅ data-testid="passwordConfirm-error" - всегда в DOM с текстом ошибки */}
            <div
              data-testid="passwordConfirm-error"
              className="mt-1"
            >
              {errors.passwordConfirm && (
                <p className="text-sm text-red-600">{errors.passwordConfirm}</p>
              )}
            </div>
          </div>

          {serverError && (
            <div
              data-testid="error-message"
              className="text-red-600 text-sm bg-red-50 p-3 rounded-lg"
            >
              {serverError}
            </div>
          )}

          <button
            type="submit"
            data-testid="register-button"
            disabled={loading}
            className="w-full py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
