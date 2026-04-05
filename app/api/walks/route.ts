import { NextRequest } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const walks = await prisma.walk.findMany({
    orderBy: { departureTime: 'desc' },
    include: { user: { select: { displayName: true } } },
    take: 50,
  })

  return Response.json(walks)
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const {
    departureTime,
    returnTime,
    didPee,
    didPoop,
    playedWithDogs,
    playedNicely,
    notes,
  } = body

  const departure = new Date(departureTime)
  const returnT = new Date(returnTime)
  const durationMinutes = Math.max(0, Math.round((returnT.getTime() - departure.getTime()) / 60000))

  const walk = await prisma.walk.create({
    data: {
      userId: session.user!.id!,
      departureTime: departure,
      returnTime: returnT,
      durationMinutes,
      didPee: !!didPee,
      didPoop: !!didPoop,
      playedWithDogs: !!playedWithDogs,
      playedNicely: playedWithDogs ? (playedNicely ?? null) : null,
      notes: notes || null,
    },
  })

  return Response.json(walk, { status: 201 })
}
