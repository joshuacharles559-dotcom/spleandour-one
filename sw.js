const V='spl-v4',F=['./','index.html','config.js','shim.js','cloud.js','extras.js','manifest.json','notifications.js'];
self.addEventListener('install',e=>e.waitUntil(caches.open(V).then(c=>c.addAll(F)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>clients.claim())));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin||u.pathname.startsWith('/.netlify'))return; e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(V).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request)))});

self.addEventListener('push', event=>{
  let data={title:'Spleandour One',body:'Open the app to see updates',url:'./'};
  try{if(event.data) data=event.data.json();}catch(e){}
  const title=data.title||'Spleandour One';
  const options={body:data.body||'',icon:'./icon-192.png',badge:'./icon-192.png',data:{url:data.url||'./'}};
  event.waitUntil(self.registration.showNotification(title,options));
});

self.addEventListener('notificationclick', event=>{
  event.notification.close();
  const url = event.notification.data && event.notification.data.url ? event.notification.data.url : './';
  event.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(windowClients=>{
    for (let i=0;i<windowClients.length;i++){const client=windowClients[i];if(client.url===url && 'focus' in client) return client.focus();}
    if (clients.openWindow) return clients.openWindow(url);
  }));
});
