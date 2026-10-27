/* Plato Diario · funciona sin internet */
const CACHE="plato-diario-be780ba004";
const SHELL=["./","./index.html","./manifest.json","./icon-180.png","./icon-192.png","./icon-512.png"];
self.addEventListener("install",e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL))); });
self.addEventListener("activate",e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith("plato-diario-")&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener("message",e=>{ if(e.data==="skip") self.skipWaiting(); });
self.addEventListener("fetch",e=>{
  const req=e.request; if(req.method!=="GET") return;
  const url=new URL(req.url);
  if(url.origin===location.origin){
    if(req.mode==="navigate"){
      e.respondWith(fetch(req).then(r=>{ const cp=r.clone(); caches.open(CACHE).then(c=>c.put("./index.html",cp)); return r; }).catch(()=>caches.match("./index.html")));
      return;
    }
    e.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(r=>{ const cp=r.clone(); caches.open(CACHE).then(c=>c.put(req,cp)); return r; })));
    return;
  }
  if(/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)){
    e.respondWith(caches.open("plato-diario-fuentes").then(c=>c.match(req).then(hit=>{ const net=fetch(req).then(r=>{ c.put(req,r.clone()); return r; }).catch(()=>hit); return hit||net; })));
  }
});
