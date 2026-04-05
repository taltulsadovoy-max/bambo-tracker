import { auth, signOut } from '@/auth'

export default async function TopNav({ userName }: { userName: string }) {
  return (
    <nav className="bg-white shadow-sm px-4 py-3">
      <div className="max-w-2xl mx-auto flex justify-between items-center">
        <span className="text-gray-600 text-sm">שלום, <strong>{userName}</strong></span>
        <form
          action={async () => {
            'use server'
            await signOut({ redirectTo: '/login' })
          }}
        >
          <button
            type="submit"
            className="text-sm text-orange-500 hover:text-orange-700 font-medium"
          >
            יציאה
          </button>
        </form>
      </div>
    </nav>
  )
}
