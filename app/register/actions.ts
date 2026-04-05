'use server'

import { signIn } from '@/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { AuthError } from 'next-auth'

export async function registerAction(_: string | null, formData: FormData) {
  const username = (formData.get('username') as string)?.toLowerCase().trim()
  const displayName = (formData.get('displayName') as string)?.trim()
  const password = formData.get('password') as string

  if (!username || !displayName || !password) return 'יש למלא את כל השדות'
  if (password.length < 4) return 'הסיסמה חייבת להכיל לפחות 4 תווים'
  if (!/^[a-z0-9_]+$/.test(username)) return 'שם משתמש יכול להכיל רק אותיות באנגלית, מספרים וקו תחתון'

  const existing = await prisma.user.findUnique({ where: { username } })
  if (existing) return 'שם המשתמש כבר תפוס'

  const passwordHash = await bcrypt.hash(password, 10)
  await prisma.user.create({ data: { username, displayName, passwordHash, isAdmin: false } })

  try {
    await signIn('credentials', { username, password, redirectTo: '/dashboard' })
  } catch (error) {
    if (error instanceof AuthError) return 'נרשמת! עכשיו התחבר עם הפרטים שלך'
    throw error
  }
  return null
}
