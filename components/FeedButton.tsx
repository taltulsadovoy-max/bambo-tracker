'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function FeedButton() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  async function handleFeed() {
    setLoading(true)
    setSuccess(false)

    const res = await fetch('/api/feeding', { method: 'POST' })

    setLoading(false)

    if (res.ok) {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      router.refresh()
    }
  }

  return (
    <button
      onClick={handleFeed}
      disabled={loading}
      className={`w-full py-6 rounded-2xl text-white font-bold text-xl shadow-lg transition-all active:scale-95 ${
        success
          ? 'bg-green-500'
          : loading
          ? 'bg-gray-400'
          : 'bg-green-500 hover:bg-green-600'
      }`}
    >
      {success ? '✅ נרשם! יאמי!' : loading ? 'שומר...' : '🦴 האכלתי עכשיו!'}
    </button>
  )
}
