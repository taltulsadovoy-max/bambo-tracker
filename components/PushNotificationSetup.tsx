'use client'

import { useEffect } from 'react'

export default function PushNotificationSetup() {
  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return

    async function setup() {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js')

        const permission = await Notification.requestPermission()
        if (permission !== 'granted') return

        const existing = await reg.pushManager.getSubscription()
        if (existing) {
          await saveSubscription(existing)
          return
        }

        const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
        const subscription = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidKey) as unknown as ArrayBuffer,
        })

        await saveSubscription(subscription)
      } catch {
        // silently fail — push is optional
      }
    }

    setup()

    // Check every 15 minutes
    const interval = setInterval(() => {
      fetch('/api/push/check', { method: 'POST' }).catch(() => {})
    }, 15 * 60 * 1000)

    // Check once on load
    fetch('/api/push/check', { method: 'POST' }).catch(() => {})

    return () => clearInterval(interval)
  }, [])

  return null
}

async function saveSubscription(subscription: PushSubscription) {
  const json = subscription.toJSON()
  await fetch('/api/push/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      endpoint: json.endpoint,
      keys: { p256dh: json.keys?.p256dh, auth: json.keys?.auth },
    }),
  })
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)))
}
