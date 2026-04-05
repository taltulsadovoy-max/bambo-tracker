'use client'

import { useState, useEffect } from 'react'

export default function StatusBanner({
  lastWalkTime,
  thresholdHours,
}: {
  lastWalkTime: Date | null
  thresholdHours: number
}) {
  const [dismissed, setDismissed] = useState(false)
  const [hoursSince, setHoursSince] = useState(0)

  useEffect(() => {
    if (!lastWalkTime) {
      setHoursSince(thresholdHours + 1)
      return
    }
    const diff = (Date.now() - new Date(lastWalkTime).getTime()) / (1000 * 60 * 60)
    setHoursSince(Math.floor(diff))
  }, [lastWalkTime, thresholdHours])

  if (dismissed || hoursSince < thresholdHours) return null

  return (
    <div className="bg-red-100 border-b border-red-200 px-4 py-3">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">⚠️</span>
          <span className="text-red-700 font-medium text-sm">
            הכלב לא יצא לטיול מזה {hoursSince} שעות! מי לוקח אותו?
          </span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-red-400 hover:text-red-600 text-lg font-bold"
        >
          ×
        </button>
      </div>
    </div>
  )
}
