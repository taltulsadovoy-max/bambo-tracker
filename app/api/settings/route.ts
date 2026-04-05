import { NextRequest } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const settings = await prisma.appSettings.findFirst()
  return Response.json(settings)
}

export async function PUT(request: NextRequest) {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { walkAlertThresholdHours } = await request.json()

  const settings = await prisma.appSettings.findFirst()
  if (!settings) return Response.json({ error: 'Settings not found' }, { status: 404 })

  const updated = await prisma.appSettings.update({
    where: { id: settings.id },
    data: { walkAlertThresholdHours: Number(walkAlertThresholdHours) },
  })

  return Response.json(updated)
}
