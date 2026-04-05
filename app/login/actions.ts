'use server'

import { signIn } from '@/auth'
import { AuthError } from 'next-auth'

export async function loginAction(_: string | null, formData: FormData) {
  try {
    await signIn('credentials', {
      username: formData.get('username'),
      password: formData.get('password'),
      redirectTo: '/dashboard',
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return 'שם משתמש או סיסמה שגויים'
    }
    throw error
  }
  return null
}
