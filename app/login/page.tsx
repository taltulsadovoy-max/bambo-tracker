'use client'

import { useActionState } from 'react'
import { loginAction } from './actions'

export default function LoginPage() {
  const [error, formAction, pending] = useActionState(loginAction, null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-300 to-yellow-300 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">🐕</div>
          <h1 className="text-3xl font-black text-white drop-shadow">טיולי הכלב</h1>
          <p className="text-orange-100 mt-1">היכנס לחשבון שלך</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-6">
          <form action={formAction} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">שם משתמש</label>
              <input
                type="text"
                name="username"
                placeholder="הכנס שם משתמש"
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
                placeholder="הכנס סיסמה"
                required
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
              {pending ? 'נכנס...' : 'כניסה'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-4">
            חדש פה?{' '}
            <a href="/register" className="text-orange-500 font-semibold hover:underline">
              צור חשבון
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
