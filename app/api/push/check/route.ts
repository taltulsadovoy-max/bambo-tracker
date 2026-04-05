import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import webpush from 'web-push'

webpush.setVapidDetails(
  `mailto:${process.env.VAPID_EMAIL}`,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

export async function POST() {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const [lastWalk, settings, subscriptions] = await Promise.all([
    prisma.walk.findFirst({ orderBy: { returnTime: 'desc' } }),
    prisma.appSettings.findFirst(),
    prisma.pushSubscription.findMany(),
  ])

  const thresholdHours = settings?.walkAlertThresholdHours ?? 4

  if (!lastWalk) {
    // No walks ever — send notification
  } else {
    const hoursSince = (Date.now() - new Date(lastWalk.returnTime).getTime()) / (1000 * 60 * 60)
    if (hoursSince < thresholdHours) {
      return Response.json({ sent: false, reason: 'Within threshold' })
    }
  }

  const hoursSince = lastWalk
    ? Math.floor((Date.now() - new Date(lastWalk.returnTime).getTime()) / (1000 * 60 * 60))
    : null

  const message = hoursSince !== null
    ? `הכלב לא יצא לטיול מזה ${hoursSince} שעות! מי לוקח אותו?`
    : 'הכלב צריך לצאת לטיול! מי לוקח אותו?'

  const results = await Promise.allSettled(
    subscriptions.map((sub) =>
      webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        JSON.stringify({ title: '🐕 זמן לטיול!', body: message })
      )
    )
  )

  const sent = results.filter((r) => r.status === 'fulfilled').length

  return Response.json({ sent, total: subscriptions.length })
}
