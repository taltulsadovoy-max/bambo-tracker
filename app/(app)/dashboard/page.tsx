import { prisma } from '@/lib/prisma'
import Link from 'next/link'

function formatTime(date: Date) {
  return new Intl.DateTimeFormat('he-IL', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
  }).format(new Date(date))
}

function timeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - new Date(date).getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 60) return `לפני ${diffMins} דקות`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `לפני ${diffHours} שעות`
  const diffDays = Math.floor(diffHours / 24)
  return `לפני ${diffDays} ימים`
}

export default async function DashboardPage() {
  const [lastWalk, lastFeeding, todayWalks] = await Promise.all([
    prisma.walk.findFirst({
      orderBy: { returnTime: 'desc' },
      include: { user: true },
    }),
    prisma.feeding.findFirst({
      orderBy: { fedAt: 'desc' },
      include: { user: true },
    }),
    prisma.walk.count({
      where: {
        departureTime: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
  ])

  return (
    <div className="space-y-4 pt-4">
      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/walks/new"
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-2xl p-5 text-center shadow-md transition-transform active:scale-95"
        >
          <div className="text-3xl mb-2">🦮</div>
          <div className="font-bold text-lg">יוצא לטיול</div>
          <div className="text-orange-100 text-sm">רשום טיול חדש</div>
        </Link>

        <Link
          href="/feeding"
          className="bg-green-500 hover:bg-green-600 text-white rounded-2xl p-5 text-center shadow-md transition-transform active:scale-95"
        >
          <div className="text-3xl mb-2">🦴</div>
          <div className="font-bold text-lg">האכלה</div>
          <div className="text-green-100 text-sm">רשום האכלה</div>
        </Link>
      </div>

      {/* Today Summary */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h3 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wide">היום</h3>
        <div className="flex items-center gap-2 text-gray-600">
          <span className="text-xl">🦮</span>
          <span className="font-semibold text-orange-500 text-xl">{todayWalks}</span>
          <span>טיולים היום</span>
        </div>
      </div>

      {/* Last Walk */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h3 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wide">טיול אחרון</h3>
        {lastWalk ? (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm">מי לקח?</span>
              <span className="font-semibold text-gray-800">{lastWalk.user.displayName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm">מתי?</span>
              <span className="font-semibold text-gray-800">{timeAgo(lastWalk.returnTime)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm">משך</span>
              <span className="font-semibold text-gray-800">{lastWalk.durationMinutes} דקות</span>
            </div>
            <div className="flex gap-2 pt-1">
              {lastWalk.didPee && <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">💧 פיפי</span>}
              {lastWalk.didPoop && <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">💩 קקי</span>}
              {lastWalk.playedWithDogs && <span className="bg-pink-100 text-pink-600 text-xs px-2 py-1 rounded-full">🐾 שיחק</span>}
            </div>
          </div>
        ) : (
          <p className="text-gray-400 text-sm">עוד לא יצא לטיול</p>
        )}
      </div>

      {/* Last Feeding */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h3 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wide">האכלה אחרונה</h3>
        {lastFeeding ? (
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">מי האכיל?</span>
            <span className="font-semibold text-gray-800">{lastFeeding.user.displayName}</span>
          </div>
        ) : null}
        {lastFeeding ? (
          <div className="flex justify-between items-center mt-1">
            <span className="text-gray-500 text-sm">מתי?</span>
            <span className="font-semibold text-gray-800">{formatTime(lastFeeding.fedAt)}</span>
          </div>
        ) : (
          <p className="text-gray-400 text-sm">עוד לא אכל היום</p>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/walks"
          className="bg-white rounded-2xl p-4 shadow-sm hover:bg-orange-50 transition-colors text-center"
        >
          <div className="text-2xl mb-1">📋</div>
          <div className="text-sm font-medium text-gray-700">כל הטיולים</div>
        </Link>
        <Link
          href="/stats"
          className="bg-white rounded-2xl p-4 shadow-sm hover:bg-orange-50 transition-colors text-center"
        >
          <div className="text-2xl mb-1">📊</div>
          <div className="text-sm font-medium text-gray-700">סטטיסטיקה</div>
        </Link>
      </div>
    </div>
  )
}
