import { NextRequest } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { endpoint, keys } = await request.json()
  const { p256dh, auth: authKey } = keys

  await prisma.pushSubscription.upsert({
    where: { endpoint },
    create: {
      userId: session.user!.id!,
      endpoint,
      p256dh,
      auth: authKey,
    },
    update: {
      userId: session.user!.id!,
      p256dh,
      auth: authKey,
    },
  })

  return Response.json({ success: true })
}
