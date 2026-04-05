import { prisma } from '@/lib/prisma'
import Link from 'next/link'

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('he-IL', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export default async function WalksPage() {
  const walks = await prisma.walk.findMany({
    orderBy: { departureTime: 'desc' },
    include: { user: { select: { displayName: true } } },
    take: 50,
  })

  return (
    <div className="pt-4 space-y-3">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold text-gray-800">היסטוריית טיולים</h2>
        <Link
          href="/walks/new"
          className="bg-orange-500 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow"
        >
          + טיול חדש
        </Link>
      </div>

      {walks.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center text-gray-400 shadow-sm">
          <div className="text-4xl mb-2">🦮</div>
          <p>עוד אין טיולים רשומים</p>
          <p className="text-sm mt-1">לחץ על "טיול חדש" כדי להתחיל</p>
        </div>
      ) : (
        walks.map((walk) => (
          <div key={walk.id} className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-bold text-gray-800">{walk.user.displayName}</span>
                <div className="text-gray-500 text-sm mt-0.5">{formatDate(walk.departureTime)}</div>
              </div>
              <span className="bg-orange-100 text-orange-600 text-sm font-semibold px-3 py-1 rounded-full">
                {walk.durationMinutes} דק'
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {walk.didPee && (
                <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">💧 פיפי</span>
              )}
              {walk.didPoop && (
                <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">💩 קקי</span>
              )}
              {walk.playedWithDogs && (
                <span className={`text-xs px-2 py-1 rounded-full ${
                  walk.playedNicely
                    ? 'bg-green-100 text-green-600'
                    : walk.playedNicely === false
                    ? 'bg-red-100 text-red-600'
                    : 'bg-pink-100 text-pink-600'
                }`}>
                  🐾 {walk.playedNicely ? 'שיחק יפה' : walk.playedNicely === false ? 'לא שיחק יפה' : 'שיחק'}
                </span>
              )}
            </div>
            {walk.notes && (
              <p className="text-gray-500 text-sm mt-2 italic">"{walk.notes}"</p>
            )}
          </div>
        ))
      )}
    </div>
  )
}
