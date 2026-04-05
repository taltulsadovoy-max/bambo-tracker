import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import DogHeader from '@/components/DogHeader'
import BottomNav from '@/components/BottomNav'
import TopNav from '@/components/TopNav'
import StatusBanner from '@/components/StatusBanner'
import PushNotificationSetup from '@/components/PushNotificationSetup'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/login')

  const [dog, settings, lastWalk] = await Promise.all([
    prisma.dogProfile.findFirst(),
    prisma.appSettings.findFirst(),
    prisma.walk.findFirst({ orderBy: { returnTime: 'desc' } }),
  ])

  return (
    <div className="min-h-screen flex flex-col bg-orange-50">
      <TopNav userName={session.user?.name ?? ''} />
      <DogHeader dog={dog} lastWalk={lastWalk} />
      <StatusBanner
        lastWalkTime={lastWalk?.returnTime ?? null}
        thresholdHours={settings?.walkAlertThresholdHours ?? 4}
      />
      <main className="flex-1 pb-24 pt-2 px-4 max-w-2xl w-full mx-auto">
        {children}
      </main>
      <BottomNav />
      <PushNotificationSetup />
    </div>
  )
}
