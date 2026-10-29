// Stirp&Radis service worker: rende l'app disponibile offline quando è pubblicata su https.
// I dati restano nel browser (localStorage): il service worker salva solo i file dell'app.
const CACHE='stirpradis-v68-0';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icons/icon.svg','./icons/icon-maskable.svg','./icons/icon-48.png','./icons/icon-128.png','./icons/icon-192.png','./icons/icon-256.png','./icons/icon-512.png','./icons/icon-maskable-192.png','./icons/icon-maskable-512.png','./icons/apple-touch-icon.png'];
// Installazione: tutti i file devono arrivare, altrimenti l'aggiornamento fallisce e resta attiva la versione che funziona.
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS.map(u=>new Request(u,{cache:'reload'})))).then(()=>self.skipWaiting()))});
// Le cache precedenti si cancellano solo se quella nuova è completa.
const complete=()=>caches.open(CACHE).then(c=>Promise.all(ASSETS.map(u=>c.match(u)))).then(hits=>hits.every(Boolean));
self.addEventListener('activate',e=>{e.waitUntil(complete().then(ok=>ok?caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('stirpradis-')&&k!==CACHE).map(k=>caches.delete(k)))):null).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const req=e.request,url=new URL(req.url);
 if(req.method!=='GET'||url.origin!==location.origin)return; // Google e altri siti: mai intercettati
 if(req.mode==='navigate'){ // rete prima, così gli aggiornamenti arrivano subito; cache se offline
  e.respondWith(fetch(req).then(r=>{const copy=r.clone();if(r.ok)caches.open(CACHE).then(c=>c.put('./index.html',copy));return r}).catch(()=>caches.match('./index.html').then(r=>r||caches.match('./'))));return}
 e.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(r=>{if(r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put(req,copy))}return r})));
});
