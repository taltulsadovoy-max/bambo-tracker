import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import SettingsClient from '@/components/SettingsClient'

export default async function SettingsPage() {
  const session = await auth()
  const currentUserId = session!.user!.id!

  const [dog, settings, users, currentUser] = await Promise.all([
    prisma.dogProfile.findFirst(),
    prisma.appSettings.findFirst(),
    prisma.user.findMany({
      select: { id: true, username: true, displayName: true, isAdmin: true },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.user.findUnique({
      where: { id: currentUserId },
      select: { isAdmin: true },
    }),
  ])

  return (
    <div className="pt-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">הגדרות</h2>
      <SettingsClient
        dog={dog}
        settings={settings}
        users={users}
        isAdmin={currentUser?.isAdmin ?? false}
        currentUserId={currentUserId}
      />
    </div>
  )
}
