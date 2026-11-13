// sw.js - Service Worker Oficial do APPIGREJA (Notificações Android e Área de Trabalho)
const SW_VERSION = "appigreja-sw-v2";
const CLOUD_DB_URL = "https://appigreja-1f504-default-rtdb.firebaseio.com";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Dispara notificação nativa quando solicitado pelo app ou pelo worker em 2º plano
self.addEventListener("message", (event) => {
  const data = event.data || {};
  if (data.type === "SHOW_NATIVE_NOTIFICATION") {
    const title = data.title || "APPIGREJA";
    const options = {
      body: data.body || "Nova atualização no aplicativo da igreja.",
      icon: data.icon || "logo.png",
      badge: data.icon || "logo.png",
      tag: data.tag || `appigreja_${Date.now()}`,
      renotify: true,
      requireInteraction: Boolean(data.requireInteraction),
      vibrate: [250, 120, 250, 120, 300],
      data: {
        url: data.url || "./dashboard.html",
      },
    };
    event.waitUntil(self.registration.showNotification(title, options));
  }
});

// Quando o usuário toca na notificação no celular (Android) ou clica no banner do Windows/Mac
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "./visitas.html";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) {
          client.focus();
          client.postMessage({
            type: "NOTIFICATION_CLICK_NAVIGATE",
            url: targetUrl,
          });
          return;
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
