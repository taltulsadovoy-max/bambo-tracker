import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'טיולי הכלב',
  description: 'מעקב טיולים והאכלה לכלב המשפחה',
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl" className="h-full">
      <body className="min-h-full bg-orange-50">{children}</body>
    </html>
  )
}
