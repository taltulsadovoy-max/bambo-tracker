'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import type { DogProfile, AppSettings } from '@/app/generated/prisma/client'

type User = {
  id: string
  username: string
  displayName: string
  isAdmin: boolean
}

export default function SettingsClient({
  dog,
  settings,
  users,
  isAdmin,
  currentUserId,
}: {
  dog: DogProfile | null
  settings: AppSettings | null
  users: User[]
  isAdmin: boolean
  currentUserId: string
}) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)

  const [dogName, setDogName] = useState(dog?.name ?? '')
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [savingDog, setSavingDog] = useState(false)

  const [threshold, setThreshold] = useState(settings?.walkAlertThresholdHours ?? 4)
  const [savingThreshold, setSavingThreshold] = useState(false)

  const [newUsername, setNewUsername] = useState('')
  const [newDisplayName, setNewDisplayName] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [addingUser, setAddingUser] = useState(false)
  const [userError, setUserError] = useState('')

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFile(file)
    const url = URL.createObjectURL(file)
    setPhotoPreview(url)
  }

  async function saveDogProfile() {
    setSavingDog(true)
    const formData = new FormData()
    formData.append('name', dogName)
    if (selectedFile) formData.append('photo', selectedFile)

    await fetch('/api/dog', { method: 'PUT', body: formData })
    setSavingDog(false)
    router.refresh()
  }

  async function saveThreshold() {
    setSavingThreshold(true)
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ walkAlertThresholdHours: threshold }),
    })
    setSavingThreshold(false)
    router.refresh()
  }

  async function addUser() {
    setUserError('')
    if (!newUsername || !newDisplayName || !newPassword) {
      setUserError('יש למלא את כל השדות')
      return
    }
    setAddingUser(true)
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: newUsername, displayName: newDisplayName, password: newPassword }),
    })
    setAddingUser(false)
    if (!res.ok) {
      const err = await res.json()
      setUserError(err.error || 'שגיאה בהוספת משתמש')
      return
    }
    setNewUsername('')
    setNewDisplayName('')
    setNewPassword('')
    router.refresh()
  }

  async function deleteUser(id: string) {
    if (!confirm('האם למחוק משתמש זה?')) return
    await fetch('/api/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    router.refresh()
  }

  const photoSrc = photoPreview ?? dog?.photoUrl ?? null

  return (
    <div className="space-y-4">
      {/* Dog Profile */}
      <div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-700">פרופיל הכלב</h3>

        <div className="flex items-center gap-4">
          <div
            className="w-20 h-20 rounded-full overflow-hidden bg-orange-100 flex items-center justify-center border-4 border-orange-200 cursor-pointer flex-shrink-0"
            onClick={() => fileRef.current?.click()}
          >
            {photoSrc ? (
              <Image src={photoSrc} alt="dog" width={80} height={80} className="object-cover w-full h-full" />
            ) : (
              <span className="text-3xl">🐕</span>
            )}
          </div>
          <div className="flex-1">
            <button
              onClick={() => fileRef.current?.click()}
              className="text-orange-500 text-sm font-medium hover:underline"
            >
              {dog?.photoUrl ? 'החלף תמונה' : 'העלה תמונה'}
            </button>
            <p className="text-gray-400 text-xs mt-0.5">JPG, PNG, עד 5MB</p>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handlePhotoChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">שם הכלב</label>
          <input
            type="text"
            value={dogName}
            onChange={(e) => setDogName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-800"
          />
        </div>

        <button
          onClick={saveDogProfile}
          disabled={savingDog}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          {savingDog ? 'שומר...' : 'שמור פרופיל כלב'}
        </button>
      </div>

      {/* Alert threshold */}
      <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
        <h3 className="font-bold text-gray-700">הגדרת התראה</h3>
        <p className="text-gray-500 text-sm">שלח התראה אם הכלב לא יצא תוך:</p>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min={1}
            max={24}
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="w-20 px-3 py-2 border border-gray-200 rounded-xl text-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <span className="text-gray-600">שעות</span>
        </div>
        <button
          onClick={saveThreshold}
          disabled={savingThreshold}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          {savingThreshold ? 'שומר...' : 'שמור הגדרת התראה'}
        </button>
      </div>

      {/* Family members */}
      <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
        <h3 className="font-bold text-gray-700">בני המשפחה</h3>
        <div className="space-y-2">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2">
              <div>
                <span className="font-semibold text-gray-800">{user.displayName}</span>
                <span className="text-gray-400 text-sm mr-2">@{user.username}</span>
                {user.isAdmin && <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">מנהל</span>}
              </div>
              {isAdmin && user.id !== currentUserId && (
                <button
                  onClick={() => deleteUser(user.id)}
                  className="text-red-400 hover:text-red-600 text-sm"
                >
                  מחק
                </button>
              )}
            </div>
          ))}
        </div>

        {isAdmin && (
          <div className="border-t border-gray-100 pt-3 space-y-2">
            <h4 className="text-sm font-semibold text-gray-600">הוסף בן משפחה</h4>
            <input
              type="text"
              placeholder="שם תצוגה (לדוג' אמא)"
              value={newDisplayName}
              onChange={(e) => setNewDisplayName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <input
              type="text"
              placeholder="שם משתמש"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <input
              type="password"
              placeholder="סיסמה"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            {userError && <p className="text-red-500 text-sm">{userError}</p>}
            <button
              onClick={addUser}
              disabled={addingUser}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-semibold py-2 rounded-xl text-sm transition-colors"
            >
              {addingUser ? 'מוסיף...' : '+ הוסף משתמש'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
