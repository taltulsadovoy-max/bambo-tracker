'use client'

import { useActionState } from 'react'
import { registerAction } from './actions'

export default function RegisterPage() {
  const [error, formAction, pending] = useActionState(registerAction, null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-300 to-yellow-300 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🐾</div>
          <h1 className="text-3xl font-black text-white drop-shadow">הצטרף למשפחה!</h1>
          <p className="text-orange-100 mt-1">צור חשבון כדי לעקוב אחרי הכלב</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-6">
          <form action={formAction} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">השם שלך</label>
              <input
                type="text"
                name="displayName"
                placeholder="לדוגמה: אמא, רון, טל..."
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">שם משתמש</label>
              <input
                type="text"
                name="username"
                placeholder="רק אותיות באנגלית ומספרים"
                required
                autoCapitalize="none"
                autoCorrect="off"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">סיסמה</label>
              <input
                type="password"
                name="password"
                placeholder="לפחות 4 תווים"
                required
                minLength={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-800"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-4 rounded-2xl text-lg shadow-md transition-colors"
            >
              {pending ? 'נרשם...' : '✅ הצטרף!'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-4">
            כבר יש לך חשבון?{' '}
            <a href="/login" className="text-orange-500 font-semibold hover:underline">
              כניסה
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
