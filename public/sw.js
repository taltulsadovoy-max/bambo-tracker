self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {}
  const title = data.title || 'טיולי הכלב'
  const body = data.body || 'הכלב צריך לצאת לטיול!'

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: '/dog-icon.png',
      badge: '/dog-icon.png',
      vibrate: [200, 100, 200],
      tag: 'walk-reminder',
      renotify: true,
      actions: [
        { action: 'open', title: 'פתח אפליקציה' },
      ],
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    clients.openWindow('/')
  )
})
