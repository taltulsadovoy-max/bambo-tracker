'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Get CSRF token
    const csrfRes = await fetch('/api/auth/csrf')
    const { csrfToken } = await csrfRes.json()

    const res = await fetch('/api/auth/callback/credentials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        username,
        password,
        csrfToken,
        callbackUrl: '/dashboard',
      }),
      redirect: 'manual',
    })

    setLoading(false)

    if (res.status === 302 || res.ok) {
      router.push('/dashboard')
      router.refresh()
    } else {
      setError('שם משתמש או סיסמה שגויים')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-yellow-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">🐕</div>
          <h1 className="text-2xl font-bold text-gray-800">טיולי הכלב</h1>
          <p className="text-gray-500 text-sm mt-1">היכנס לחשבון שלך</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">שם משתמש</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-800"
              placeholder="הכנס שם משתמש"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">סיסמה</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-800"
              placeholder="הכנס סיסמה"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-3 rounded-xl transition-colors"
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
  )
}
