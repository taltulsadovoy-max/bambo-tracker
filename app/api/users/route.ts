import { NextRequest } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET() {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const users = await prisma.user.findMany({
    select: { id: true, username: true, displayName: true, isAdmin: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  })

  return Response.json(users)
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  // Check if current user is admin
  const currentUser = await prisma.user.findUnique({
    where: { id: session.user!.id! },
  })
  if (!currentUser?.isAdmin) {
    return Response.json({ error: 'Only admins can add users' }, { status: 403 })
  }

  const { username, displayName, password } = await request.json()

  if (!username || !displayName || !password) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { username } })
  if (existing) {
    return Response.json({ error: 'Username already exists' }, { status: 409 })
  }

  const passwordHash = await bcrypt.hash(password, 12)

  const user = await prisma.user.create({
    data: { username, displayName, passwordHash },
    select: { id: true, username: true, displayName: true, isAdmin: true },
  })

  return Response.json(user, { status: 201 })
}

export async function DELETE(request: NextRequest) {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user!.id! },
  })
  if (!currentUser?.isAdmin) {
    return Response.json({ error: 'Only admins can delete users' }, { status: 403 })
  }

  const { id } = await request.json()

  if (id === session.user!.id) {
    return Response.json({ error: 'Cannot delete yourself' }, { status: 400 })
  }

  await prisma.user.delete({ where: { id } })
  return Response.json({ success: true })
}
