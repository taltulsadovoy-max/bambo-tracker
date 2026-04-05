import Image from 'next/image'
import type { DogProfile, Walk } from '@/app/generated/prisma/client'

function timeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 60) return `לפני ${diffMins} דקות`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `לפני ${diffHours} שעות`
  const diffDays = Math.floor(diffHours / 24)
  return `לפני ${diffDays} ימים`
}

export default function DogHeader({
  dog,
  lastWalk,
}: {
  dog: DogProfile | null
  lastWalk: Walk | null
}) {
  return (
    <div className="bg-gradient-to-r from-orange-400 to-yellow-400 px-4 py-5">
      <div className="max-w-2xl mx-auto flex items-center gap-4">
        <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0 bg-orange-200 flex items-center justify-center">
          {dog?.photoUrl ? (
            <Image
              src={dog.photoUrl}
              alt={dog.name}
              fill
              className="object-cover"
            />
          ) : (
            <span className="text-4xl">🐕</span>
          )}
        </div>
        <div className="flex-1">
          <h2 className="text-white font-bold text-2xl">{dog?.name ?? 'הכלב שלי'}</h2>
          {lastWalk ? (
            <span className="inline-block bg-white/30 text-white text-xs px-3 py-1 rounded-full mt-1">
              🦮 טיול אחרון: {timeAgo(new Date(lastWalk.returnTime))}
            </span>
          ) : (
            <span className="inline-block bg-white/30 text-white text-xs px-3 py-1 rounded-full mt-1">
              🦮 עדיין לא יצא לטיול
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
