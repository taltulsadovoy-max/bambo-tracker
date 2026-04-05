'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

function toLocalDatetimeString(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export default function NewWalkPage() {
  const router = useRouter()
  const now = new Date()
  const defaultDeparture = new Date(now.getTime() - 30 * 60000) // 30 min ago

  const [departure, setDeparture] = useState(toLocalDatetimeString(defaultDeparture))
  const [returnTime, setReturnTime] = useState(toLocalDatetimeString(now))
  const [didPee, setDidPee] = useState(false)
  const [didPoop, setDidPoop] = useState(false)
  const [playedWithDogs, setPlayedWithDogs] = useState(false)
  const [playedNicely, setPlayedNicely] = useState<boolean | null>(null)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const durationMins = Math.max(0, Math.round(
    (new Date(returnTime).getTime() - new Date(departure).getTime()) / 60000
  ))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/walks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        departureTime: new Date(departure).toISOString(),
        returnTime: new Date(returnTime).toISOString(),
        didPee,
        didPoop,
        playedWithDogs,
        playedNicely: playedWithDogs ? playedNicely : null,
        notes,
      }),
    })

    setLoading(false)

    if (!res.ok) {
      setError('שגיאה בשמירת הטיול, נסה שוב')
      return
    }

    router.push('/walks')
    router.refresh()
  }

  return (
    <div className="pt-4">
      <h2 className="text-xl font-bold text-gray-800 mb-5">רישום טיול חדש</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Times */}
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">שעת יציאה</label>
            <input
              type="datetime-local"
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">שעת חזרה</label>
            <input
              type="datetime-local"
              value={returnTime}
              onChange={(e) => setReturnTime(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-800"
            />
          </div>
          <div className="bg-orange-50 rounded-xl px-4 py-2 text-center">
            <span className="text-orange-600 font-semibold">⏱ משך הטיול: {durationMins} דקות</span>
          </div>
        </div>

        {/* Business section */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-3">עשה צרכים?</label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setDidPee(!didPee)}
              className={`flex-1 py-3 rounded-xl border-2 font-semibold transition-all ${
                didPee
                  ? 'bg-blue-100 border-blue-400 text-blue-700'
                  : 'bg-gray-50 border-gray-200 text-gray-500'
              }`}
            >
              💧 פיפי
            </button>
            <button
              type="button"
              onClick={() => setDidPoop(!didPoop)}
              className={`flex-1 py-3 rounded-xl border-2 font-semibold transition-all ${
                didPoop
                  ? 'bg-yellow-100 border-yellow-400 text-yellow-700'
                  : 'bg-gray-50 border-gray-200 text-gray-500'
              }`}
            >
              💩 קקי
            </button>
          </div>
        </div>

        {/* Dogs play */}
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">שיחק עם כלבים אחרים?</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { setPlayedWithDogs(true); setPlayedNicely(null) }}
                className={`flex-1 py-3 rounded-xl border-2 font-semibold transition-all ${
                  playedWithDogs
                    ? 'bg-pink-100 border-pink-400 text-pink-700'
                    : 'bg-gray-50 border-gray-200 text-gray-500'
                }`}
              >
                🐾 כן
              </button>
              <button
                type="button"
                onClick={() => { setPlayedWithDogs(false); setPlayedNicely(null) }}
                className={`flex-1 py-3 rounded-xl border-2 font-semibold transition-all ${
                  !playedWithDogs
                    ? 'bg-gray-100 border-gray-400 text-gray-700'
                    : 'bg-gray-50 border-gray-200 text-gray-500'
                }`}
              >
                ❌ לא
              </button>
            </div>
          </div>

          {playedWithDogs && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">שיחקו יפה?</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setPlayedNicely(true)}
                  className={`flex-1 py-3 rounded-xl border-2 font-semibold transition-all ${
                    playedNicely === true
                      ? 'bg-green-100 border-green-400 text-green-700'
                      : 'bg-gray-50 border-gray-200 text-gray-500'
                  }`}
                >
                  😊 כן, יפה
                </button>
                <button
                  type="button"
                  onClick={() => setPlayedNicely(false)}
                  className={`flex-1 py-3 rounded-xl border-2 font-semibold transition-all ${
                    playedNicely === false
                      ? 'bg-red-100 border-red-400 text-red-700'
                      : 'bg-gray-50 border-gray-200 text-gray-500'
                  }`}
                >
                  😤 לא כל כך
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-1">הערות (אופציונלי)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="משהו מיוחד שקרה בטיול..."
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-800 resize-none"
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
          {loading ? 'שומר...' : '✅ שמור טיול'}
        </button>
      </form>
    </div>
  )
}
