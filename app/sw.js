/* Para que la app abra sin internet: guarda una copia de cada archivo de la app y del Código.
   Siempre intenta primero la versión nueva (así llegan las actualizaciones) y, sin conexión, usa la copia. */
const CACHE='jueceogaf-v3';
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET')return;
  const propio=u.origin===location.origin&&!/\.pdf$/i.test(u.pathname);
  const cdn=/^(cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com)$/.test(u.hostname);
  if(!propio&&!cdn)return;
  e.respondWith(fetch(e.request).then(r=>{if(r.ok){const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));}return r;})
    .catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||Response.error())));
});
