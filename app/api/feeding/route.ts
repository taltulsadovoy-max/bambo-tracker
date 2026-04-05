import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const feedings = await prisma.feeding.findMany({
    orderBy: { fedAt: 'desc' },
    include: { user: { select: { displayName: true } } },
    take: 30,
  })

  return Response.json(feedings)
}

export async function POST() {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const feeding = await prisma.feeding.create({
    data: {
      userId: session.user!.id!,
      fedAt: new Date(),
    },
  })

  return Response.json(feeding, { status: 201 })
}
