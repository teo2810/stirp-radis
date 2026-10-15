// Stirp&Radis service worker: rende l'app disponibile offline quando è pubblicata su https.
// I dati restano nel browser (localStorage): il service worker salva solo i file dell'app.
const CACHE='stirpradis-v30-1';
const ASSETS=['./','./index.html'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).catch(()=>{}).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('stirpradis-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const req=e.request,url=new URL(req.url);
 if(req.method!=='GET'||url.origin!==location.origin)return; // Google e altri siti: mai intercettati
 if(req.mode==='navigate'){ // rete prima, così gli aggiornamenti arrivano subito; cache se offline
  e.respondWith(fetch(req).then(r=>{const copy=r.clone();if(r.ok)caches.open(CACHE).then(c=>c.put('./index.html',copy));return r}).catch(()=>caches.match('./index.html').then(r=>r||caches.match('./'))));return}
 e.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(r=>{if(r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put(req,copy))}return r})));
});
