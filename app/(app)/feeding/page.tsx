import { prisma } from '@/lib/prisma'
import FeedButton from '@/components/FeedButton'

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat('he-IL', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export default async function FeedingPage() {
  const feedings = await prisma.feeding.findMany({
    orderBy: { fedAt: 'desc' },
    include: { user: { select: { displayName: true } } },
    take: 30,
  })

  return (
    <div className="pt-4 space-y-4">
      <h2 className="text-xl font-bold text-gray-800">האכלות</h2>

      <FeedButton />

      {feedings.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center text-gray-400 shadow-sm">
          <div className="text-4xl mb-2">🦴</div>
          <p>עוד לא נרשמה האכלה</p>
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">היסטוריית האכלות</h3>
          {feedings.map((feeding) => (
            <div key={feeding.id} className="bg-white rounded-2xl p-4 shadow-sm flex justify-between items-center">
              <div>
                <span className="font-semibold text-gray-800">{feeding.user.displayName}</span>
                <div className="text-gray-500 text-sm mt-0.5">{formatDateTime(feeding.fedAt)}</div>
              </div>
              <span className="text-2xl">🦴</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
