import { prisma } from '@/lib/prisma'
import StatsCharts from '@/components/StatsCharts'

async function getStats() {
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  startOfWeek.setHours(0, 0, 0, 0)

  const weekWalks = await prisma.walk.findMany({
    where: { departureTime: { gte: startOfWeek } },
    include: { user: { select: { id: true, displayName: true } } },
  })

  const userMap: Record<string, { displayName: string; walks: number; totalMinutes: number }> = {}

  for (const walk of weekWalks) {
    const uid = walk.user.id
    if (!userMap[uid]) {
      userMap[uid] = { displayName: walk.user.displayName, walks: 0, totalMinutes: 0 }
    }
    userMap[uid].walks++
    userMap[uid].totalMinutes += walk.durationMinutes
  }

  const totalWalks = weekWalks.length
  const avgDuration =
    totalWalks > 0
      ? Math.round(weekWalks.reduce((s, w) => s + w.durationMinutes, 0) / totalWalks)
      : 0

  const byUser = Object.entries(userMap)
    .map(([id, data]) => ({
      id,
      name: data.displayName,
      walks: data.walks,
      percentage: totalWalks > 0 ? Math.round((data.walks / totalWalks) * 100) : 0,
      avgMinutes: data.walks > 0 ? Math.round(data.totalMinutes / data.walks) : 0,
    }))
    .sort((a, b) => b.walks - a.walks)

  return { totalWalks, avgDuration, byUser, weekStart: startOfWeek }
}

export default async function StatsPage() {
  const { totalWalks, avgDuration, byUser, weekStart } = await getStats()

  const weekLabel = new Intl.DateTimeFormat('he-IL', {
    day: '2-digit',
    month: '2-digit',
  }).format(weekStart)

  const champion = byUser[0]

  return (
    <div className="pt-4 space-y-4">
      <h2 className="text-xl font-bold text-gray-800">סטטיסטיקה שבועית</h2>
      <p className="text-gray-500 text-sm">מאז {weekLabel}</p>

      {champion && (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-4 text-white text-center shadow-md">
          <div className="text-3xl mb-1">🏆</div>
          <p className="font-bold text-lg">{champion.name}</p>
          <p className="text-yellow-100 text-sm">אלוף הטיולים השבוע!</p>
          <p className="font-semibold mt-1">{champion.walks} טיולים ({champion.percentage}%)</p>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
          <div className="text-3xl font-bold text-orange-500">{totalWalks}</div>
          <div className="text-gray-500 text-sm">טיולים השבוע</div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
          <div className="text-3xl font-bold text-green-500">{avgDuration}</div>
          <div className="text-gray-500 text-sm">דקות ממוצע</div>
        </div>
      </div>

      {/* Chart */}
      {byUser.length > 0 ? (
        <StatsCharts data={byUser} />
      ) : (
        <div className="bg-white rounded-2xl p-8 text-center text-gray-400 shadow-sm">
          <div className="text-4xl mb-2">📊</div>
          <p>אין עדיין טיולים השבוע</p>
          <p className="text-sm mt-1">צאו לטיולים כדי לראות סטטיסטיקה!</p>
        </div>
      )}

      {/* Per person breakdown */}
      {byUser.length > 0 && (
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
          <h3 className="font-bold text-gray-700">פירוט לפי אדם</h3>
          {byUser.map((person, i) => (
            <div key={person.id} className="flex items-center gap-3">
              <span className="text-lg">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '🐾'}</span>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-gray-800">{person.name}</span>
                  <span className="text-orange-500 font-bold">{person.walks} טיולים</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-400 rounded-full transition-all"
                    style={{ width: `${person.percentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{person.percentage}%</span>
                  <span>ממוצע {person.avgMinutes} דק'</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
