// 오프라인 기능 제거: 이미 설치된 기기에서 스스로 지우고 원래대로 인터넷에서 열기
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil((async () => {
  for (const k of await caches.keys()) await caches.delete(k);
  await self.registration.unregister();
  const cs = await self.clients.matchAll({ type: 'window' });
  cs.forEach(c => { try { c.navigate(c.url) } catch (err) {} });
})()));
