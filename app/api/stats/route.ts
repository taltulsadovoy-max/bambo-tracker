import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  // Start of current week (Sunday)
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  startOfWeek.setHours(0, 0, 0, 0)

  const [weekWalks, allUsers] = await Promise.all([
    prisma.walk.findMany({
      where: { departureTime: { gte: startOfWeek } },
      include: { user: { select: { id: true, displayName: true } } },
    }),
    prisma.user.findMany({ select: { id: true, displayName: true } }),
  ])

  // Aggregate by user
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
      displayName: data.displayName,
      walks: data.walks,
      totalMinutes: data.totalMinutes,
      avgMinutes: data.walks > 0 ? Math.round(data.totalMinutes / data.walks) : 0,
      percentage: totalWalks > 0 ? Math.round((data.walks / totalWalks) * 100) : 0,
    }))
    .sort((a, b) => b.walks - a.walks)

  const champion = byUser[0] ?? null

  return Response.json({
    weekStart: startOfWeek.toISOString(),
    totalWalks,
    avgDuration,
    byUser,
    champion,
  })
}
