// 오프라인 저장: 페이지가 다 뜬 뒤에 천천히 받아 두고, 인터넷이 없거나 느리면 저장본으로 열기
const CACHE='pyexam-offline-v2';
const FILES=["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "cm/codemirror.min.js", "cm/matchbrackets.min.js", "cm/python.min.js", "py/pyodide-lock.json", "py/pyodide.asm.js", "py/pyodide.asm.wasm", "py/pyodide.js", "py/stdlib.wasm", "py/w_cycler-0.12.1-py3-none-any.wasm", "py/w_fonttools-4.51.0-py3-none-any.wasm", "py/w_kiwisolver-1.4.5-cp312-cp312-pyodide_2024_0_wasm32.wasm", "py/w_matplotlib-3.5.2-cp312-cp312-pyodide_2024_0_wasm32.wasm", "py/w_matplotlib_pyodide-0.2.2-py3-none-any.wasm", "py/w_numpy-1.26.4-cp312-cp312-pyodide_2024_0_wasm32.wasm", "py/w_packaging-23.2-py3-none-any.wasm", "py/w_pandas-2.2.0-cp312-cp312-pyodide_2024_0_wasm32.wasm", "py/w_pillow-10.2.0-cp312-cp312-pyodide_2024_0_wasm32.wasm", "py/w_pyparsing-3.1.2-py3-none-any.wasm", "py/w_python_dateutil-2.9.0.post0-py2.py3-none-any.wasm", "py/w_pytz-2024.1-py2.py3-none-any.wasm", "py/w_six-1.16.0-py2.py3-none-any.wasm"];
self.addEventListener('install',e=>{self.skipWaiting();
  // 설치를 막지 않도록 백그라운드로 하나씩 받기
  e.waitUntil(caches.open(CACHE).then(async c=>{for(const f of FILES){try{if(!(await c.match(f)))await c.add(f)}catch(err){}}}))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE&&k.startsWith('pyexam-offline')).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
const timeout=(p,ms)=>new Promise((res,rej)=>{const t=setTimeout(()=>rej(new Error('timeout')),ms);p.then(v=>{clearTimeout(t);res(v)},e=>{clearTimeout(t);rej(e)})});
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.pathname.endsWith('/reset.html'))return;  // 초기화 페이지는 항상 인터넷으로
  if(req.mode==='navigate'||(url.origin===location.origin&&/\/(index\.html)?$/.test(url.pathname))){
    const net=fetch(req).then(r=>{if(r.ok){const cp=r.clone();caches.open(CACHE).then(c=>c.put('index.html',cp))}return r});
    e.respondWith(caches.match('index.html').then(hit=>hit?timeout(net,4000).catch(()=>hit):net));return}
  if(/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)){
    e.respondWith(caches.match(req).then(h=>h||fetch(req).then(r=>{const cp=r.clone();caches.open(CACHE).then(c=>c.put(req,cp));return r})));return}
  if(url.origin===location.origin){e.respondWith(caches.match(req,{ignoreSearch:true}).then(h=>h||fetch(req)))}
});
