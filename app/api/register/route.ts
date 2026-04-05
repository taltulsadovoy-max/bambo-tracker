import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  const { username, displayName, password } = await request.json()

  if (!username || !displayName || !password) {
    return Response.json({ error: 'יש למלא את כל השדות' }, { status: 400 })
  }

  if (password.length < 4) {
    return Response.json({ error: 'הסיסמה חייבת להכיל לפחות 4 תווים' }, { status: 400 })
  }

  if (!/^[a-z0-9_]+$/.test(username)) {
    return Response.json({ error: 'שם משתמש יכול להכיל רק אותיות באנגלית, מספרים וקו תחתון' }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { username } })
  if (existing) {
    return Response.json({ error: 'שם המשתמש כבר תפוס' }, { status: 409 })
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: { username, displayName, passwordHash, isAdmin: false },
  })

  return Response.json({ id: user.id }, { status: 201 })
}
