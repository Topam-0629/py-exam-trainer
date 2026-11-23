// 오프라인 저장: 처음 접속 때 전부 받아 두고, 다음부터는 인터넷 없이도 동작
const CACHE='pyexam-offline-v1';
const FILES=["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "cm/codemirror.min.js", "cm/matchbrackets.min.js", "cm/python.min.js", "py/pyodide-lock.json", "py/pyodide.asm.js", "py/pyodide.asm.wasm", "py/pyodide.js", "py/stdlib.wasm", "py/w_cycler-0.12.1-py3-none-any.wasm", "py/w_fonttools-4.51.0-py3-none-any.wasm", "py/w_kiwisolver-1.4.5-cp312-cp312-pyodide_2024_0_wasm32.wasm", "py/w_matplotlib-3.5.2-cp312-cp312-pyodide_2024_0_wasm32.wasm", "py/w_matplotlib_pyodide-0.2.2-py3-none-any.wasm", "py/w_numpy-1.26.4-cp312-cp312-pyodide_2024_0_wasm32.wasm", "py/w_packaging-23.2-py3-none-any.wasm", "py/w_pandas-2.2.0-cp312-cp312-pyodide_2024_0_wasm32.wasm", "py/w_pillow-10.2.0-cp312-cp312-pyodide_2024_0_wasm32.wasm", "py/w_pyparsing-3.1.2-py3-none-any.wasm", "py/w_python_dateutil-2.9.0.post0-py2.py3-none-any.wasm", "py/w_pytz-2024.1-py2.py3-none-any.wasm", "py/w_six-1.16.0-py2.py3-none-any.wasm"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE&&k.startsWith('pyexam-offline')).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const url=new URL(req.url);
  // 페이지 본체: 인터넷 되면 최신으로, 안 되면 저장본
  if(req.mode==='navigate'||(url.origin===location.origin&&/\/(index\.html)?$/.test(url.pathname))){
    e.respondWith(fetch(req).then(r=>{const cp=r.clone();caches.open(CACHE).then(c=>c.put('index.html',cp));return r}).catch(()=>caches.match('index.html')));return}
  // 글꼴: 한 번 받은 건 저장해서 오프라인에서도
  if(/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)){
    e.respondWith(caches.match(req).then(h=>h||fetch(req).then(r=>{const cp=r.clone();caches.open(CACHE).then(c=>c.put(req,cp));return r}).catch(()=>h)));return}
  // 파이썬·편집기 파일: 저장본 먼저
  if(url.origin===location.origin){e.respondWith(caches.match(req,{ignoreSearch:true}).then(h=>h||fetch(req)))}
});
