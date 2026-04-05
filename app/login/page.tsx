'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const csrfRes = await fetch('/api/auth/csrf')
      const { csrfToken } = await csrfRes.json()

      const res = await fetch('/api/auth/callback/credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          username,
          password,
          csrfToken,
          callbackUrl: `${window.location.origin}/dashboard`,
        }),
        redirect: 'follow',
        credentials: 'include',
      })

      if (res.ok && res.url.includes('/dashboard')) {
        window.location.href = '/dashboard'
        return
      }

      // Try checking if we got a session cookie
      const sessionCheck = await fetch('/api/auth/session', { credentials: 'include' })
      const session = await sessionCheck.json()

      if (session?.user) {
        window.location.href = '/dashboard'
        return
      }

      setError('שם משתמש או סיסמה שגויים')
    } catch {
      setError('שגיאה בהתחברות, נסה שוב')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-300 to-yellow-300 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">🐕</div>
          <h1 className="text-3xl font-black text-white drop-shadow">טיולי הכלב</h1>
          <p className="text-orange-100 mt-1">היכנס לחשבון שלך</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">שם משתמש</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="הכנס שם משתמש"
                required
                autoCapitalize="none"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">סיסמה</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-4 rounded-2xl text-lg shadow-md transition-colors"
            >
              {loading ? 'נכנס...' : 'כניסה'}
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
