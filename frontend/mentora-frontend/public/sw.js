// Базовый service worker: offline fallback только для УЖЕ посещённых
// страниц/ассетов (network-first с кэш-фолбэком) — см. schedule/09,
// "Не входит": полноценный офлайн-режим прохождения курса (видео,
// генерируемые API-ответы) сюда не входит и не кэшируется.
const CACHE_NAME = 'mentora-shell-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Только свои GET-запросы (навигация + статические ассеты). API-запросы
  // (/api/...) не кэшируются — прогресс/данные курса всегда должны быть
  // актуальными, устаревший кэш здесь опаснее отсутствия offline-фолбэка.
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) {
    return;
  }
  if (request.url.includes('/api/')) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        return response;
      })
      .catch(() => caches.match(request).then((cached) => cached ?? Response.error())),
  );
});
