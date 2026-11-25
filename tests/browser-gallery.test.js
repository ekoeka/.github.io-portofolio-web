const { spawn } = require('node:child_process');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const shots = process.env.GALLERY_SCREENSHOTS;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const server = http.createServer((req, res) => {
  const u = new URL(req.url, 'http://localhost');
  if (u.pathname.startsWith('/fixture-image/')) {
    if (u.pathname.endsWith('/bad.svg')) { res.writeHead(404); res.end(); return; }
    const n = Number(u.pathname.match(/(\d+)/)?.[1] || 0);
    res.writeHead(200, {'Content-Type':'image/svg+xml'});
    res.end(`<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><rect width="640" height="360" fill="hsl(${n*31},45%,35%)"/><text x="50%" y="50%" text-anchor="middle" fill="white" font-size="64">Fixture ${n}</text><path d="M60 290 H580 M120 90 V290 M300 90 V290" stroke="white" stroke-width="5"/></svg>`); return;
  }
  if (u.pathname === '/fixture') {
    const count = Number(u.searchParams.get('count'));
    const images = Array.from({length:count}, (_, i) => `http://127.0.0.1:${server.address().port}/fixture-image/${i+1}.svg`);
    if (u.searchParams.has('bad') && count) images[0] = `http://127.0.0.1:${server.address().port}/fixture-image/bad.svg`;
    const csv = `title,summary,description,images,github,date,tags,youtube,journal\nFixture,Test,Data pengujian,${images.join('|')},,,,,\n`;
    const injection = `<script>window.fetch=async()=>({ok:true,text:async()=>${JSON.stringify(csv)}});</script>`;
    res.writeHead(200, {'Content-Type':'text/html'}); res.end(fs.readFileSync(path.join(root,'detail.html'),'utf8').replace('<script src="theme.js">', injection+'<script src="theme.js">')); return;
  }
  const file = path.join(root, path.basename(u.pathname));
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, {'Content-Type': file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html'}); fs.createReadStream(file).pipe(res);
});
(async () => {
  await new Promise(r => server.listen(0,'127.0.0.1',r));
  const chrome = spawn('/usr/lib/chromium/chromium-headless-shell', ['--no-sandbox','--disable-gpu','--remote-debugging-port=0','--remote-allow-origins=*','about:blank'], {stdio:['ignore','ignore','pipe']});
  try {
    let output = ''; const wsURL = await new Promise((resolve,reject) => { chrome.stderr.on('data', b => { output += b; const m = output.match(/DevTools listening on (ws:\/\/[^\s]+)/); if (m) resolve(m[1]); }); chrome.on('exit', c => reject(Error(`Chromium exited ${c}: ${output}`))); });
    const port = new URL(wsURL).port;
    const targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
    const ws = new WebSocket(targets[0].webSocketDebuggerUrl); await new Promise((resolve,reject) => { ws.onopen=resolve; ws.onerror=reject; });
    let id=0; const pending = new Map(), errors=[];
    ws.onmessage = event => { const m=JSON.parse(event.data); if(m.id && pending.has(m.id)) { const {resolve,reject}=pending.get(m.id); pending.delete(m.id); m.error ? reject(Error(m.error.message)) : resolve(m.result); } else if (m.method==='Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.text); else if(m.method==='Runtime.consoleAPICalled' && m.params.type==='error') errors.push('console.error'); };
    const send = (method,params={}) => new Promise((resolve,reject) => { const n=++id; pending.set(n,{resolve,reject}); ws.send(JSON.stringify({id:n,method,params})); });
    const evalJS = async expression => { const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true}); if(r.exceptionDetails) throw Error(r.exceptionDetails.text); return r.result.value; };
    await send('Page.enable'); await send('Runtime.enable');
    async function open(count, options={}) {
      await send('Emulation.setDeviceMetricsOverride',{width:options.mobile?390:1440,height:options.mobile?844:900,deviceScaleFactor:1,mobile:false});
      await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:options.reduced?'reduce':'no-preference'}]});
      await send('Page.navigate',{url:`http://127.0.0.1:${server.address().port}/fixture?project=Fixture&count=${count}${options.bad?'&bad=1':''}`});
      for(let i=0;i<100;i++){ await sleep(50); if(await evalJS(`document.getElementById('judul')?.textContent === 'Fixture'`)) return; } throw Error('Fixture failed to load');
    }
    const state = () => evalJS(`({position:document.querySelector('#gallery-position').textContent, slides:[...document.querySelectorAll('.gallery-slide')].map(n=>n.dataset.index), controls:!document.querySelector('#gallery-controls-top').hidden, overflow:document.documentElement.scrollWidth>innerWidth, placeholder:!document.querySelector('#gallery-placeholder').hidden, broken:!!document.querySelector('.gallery-image-placeholder:not([hidden])')})`);
    const click = selector => evalJS(`document.querySelector(${JSON.stringify(selector)}).click()`);
    const screenshot = async name => { if (!shots) return; await sleep(500); fs.mkdirSync(shots,{recursive:true}); const metrics=await send('Page.getLayoutMetrics'); const r=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:{x:0,y:0,width:metrics.cssContentSize.width,height:metrics.cssContentSize.height,scale:1}}); fs.writeFileSync(path.join(shots,name),Buffer.from(r.data,'base64')); };
    let s;
    if (!process.env.GALLERY_CASE || process.env.GALLERY_CASE === 'navigation') {
    await open(0); s=await state(); assert.equal(s.placeholder,true); assert.equal(s.controls,false);
    await open(1); s=await state(); assert.equal(s.slides.length,1); assert.equal(s.controls,false);
    await open(2); s=await state(); assert.equal(s.slides.length,2); assert.equal(s.controls,true); await click('#gallery-down'); await sleep(650); assert.equal((await state()).position,'2 / 2'); await click('#gallery-up'); await sleep(650); assert.equal((await state()).position,'1 / 2');
    await open(4); s=await state(); assert.equal(s.slides.length,4); assert.equal(new Set(s.slides).size,4); assert.equal(await evalJS(`document.querySelector('.gallery-slide[data-order="0"]').offsetHeight >= 420 && document.querySelector('.gallery-slide[data-order="0"]').offsetHeight > document.querySelector('.gallery-slide[data-order="1"]').offsetHeight * 2`),true);
    await open(50); s=await state(); assert.equal(s.slides.length,4); assert.equal(s.overflow,false);
    await open(20,{bad:true}); await sleep(200); s=await state(); assert.equal(s.broken,true); assert.equal(s.slides.length,4); assert.equal(s.overflow,false);
    await evalJS(`document.querySelector('#gallery-up').focus()`); await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,nativeVirtualKeyCode:13,text:'\r',unmodifiedText:'\r'}); await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13}); await click('#gallery-up'); await sleep(150); assert.ok(await evalJS(`getComputedStyle(document.querySelector('#gallery-track')).transform !== 'matrix(1, 0, 0, 1, 0, 0)'`)); await sleep(500); s=await state(); assert.equal(s.position,'2 / 20'); assert.equal(s.slides[0],'1');
    await click('#gallery-down'); await sleep(650); assert.equal((await state()).position,'1 / 20');
    await click('#gallery-down'); await sleep(650); assert.equal((await state()).position,'20 / 20');
    await click('#gallery-up'); await sleep(650); assert.equal((await state()).position,'1 / 20');
    await click('.gallery-slide[data-order="2"]'); await sleep(1200); assert.equal((await state()).position,'3 / 20');
    }
    if (!process.env.GALLERY_CASE || process.env.GALLERY_CASE === 'autoplay') {
    await open(20); await sleep(5900); assert.equal((await state()).position,'2 / 20');
    await click('#gallery-toggle'); await sleep(5400); assert.equal((await state()).position,'2 / 20');
    await click('#gallery-toggle'); await sleep(5900); assert.equal((await state()).position,'3 / 20');
    }
    if (!process.env.GALLERY_CASE || process.env.GALLERY_CASE === 'visibility') {
    await open(20); await evalJS(`document.querySelector('#project-gallery').dispatchEvent(new MouseEvent('mouseenter'))`); await sleep(5600); assert.equal((await state()).position,'1 / 20');
    await evalJS(`document.querySelector('#project-gallery').dispatchEvent(new MouseEvent('mouseleave')); Object.defineProperty(document,'hidden',{configurable:true,value:true}); document.dispatchEvent(new Event('visibilitychange'))`); await sleep(5600); assert.equal((await state()).position,'1 / 20');
    await evalJS(`Object.defineProperty(document,'hidden',{configurable:true,value:false}); document.dispatchEvent(new Event('visibilitychange'))`); await sleep(5900); assert.equal((await state()).position,'2 / 20');
    }
    if (!process.env.GALLERY_CASE || process.env.GALLERY_CASE === 'lightbox') {
    const lightState = () => evalJS(`({open:document.querySelector('#image-lightbox').open, position:document.querySelector('#lightbox-position').textContent, zoom:document.querySelector('#lightbox-zoom-reset').textContent, locked:document.body.style.overflow, failed:!document.querySelector('#lightbox-error').hidden, focused:document.querySelector('#image-lightbox').contains(document.activeElement)})`);
    const key = async (key, code, keyCode) => { await send('Input.dispatchKeyEvent',{type:'keyDown',key,code,windowsVirtualKeyCode:keyCode,nativeVirtualKeyCode:keyCode}); await send('Input.dispatchKeyEvent',{type:'keyUp',key,code,windowsVirtualKeyCode:keyCode,nativeVirtualKeyCode:keyCode}); };
    const lightShot = async name => { if (!shots) return; await sleep(300); fs.mkdirSync(shots,{recursive:true}); const r=await send('Page.captureScreenshot',{format:'png'}); fs.writeFileSync(path.join(shots,name),Buffer.from(r.data,'base64')); };
    await open(4); await evalJS(`document.querySelector('.gallery-slide[data-order="0"]').focus()`); await click('.gallery-slide[data-order="0"]'); await sleep(150);
    let l = await lightState(); assert.equal(l.open,true); assert.equal(l.position,'1 / 4'); assert.equal(l.locked,'hidden'); assert.equal(l.focused,true);
    await key('Tab','Tab',9); assert.equal((await lightState()).focused,true);
    await click('#lightbox-zoom-in'); assert.equal((await lightState()).zoom,'125%');
    await click('#lightbox-zoom-out'); assert.equal((await lightState()).zoom,'100%');
    await click('#lightbox-zoom-in'); await click('#lightbox-zoom-reset'); assert.equal((await lightState()).zoom,'100%');
    await click('#lightbox-next'); assert.equal((await lightState()).position,'2 / 4');
    await key('ArrowLeft','ArrowLeft',37); assert.equal((await lightState()).position,'1 / 4');
    await key('ArrowLeft','ArrowLeft',37); assert.equal((await lightState()).position,'4 / 4');
    await key('Escape','Escape',27); await sleep(100); l=await lightState(); assert.equal(l.open,false); assert.equal(l.locked,'');
    assert.equal(await evalJS(`document.activeElement.classList.contains('gallery-slide')`),true);
    await click('.gallery-slide[data-order="0"]'); await evalJS(`document.querySelector('#image-lightbox').click()`); await sleep(100); assert.equal((await lightState()).open,false);
    await open(1); await click('.gallery-slide[data-order="0"]'); assert.equal(await evalJS(`document.querySelector('#lightbox-next').hidden && getComputedStyle(document.querySelector('#lightbox-next')).display === 'none'`),true); await click('#lightbox-close');
    await open(2,{bad:true}); await click('.gallery-slide[data-order="0"]'); await sleep(200); assert.equal((await lightState()).failed,true); await click('#lightbox-close');
    await open(4,{mobile:true,reduced:true}); await click('.gallery-slide[data-order="0"]'); await sleep(150);
    await evalJS(`(() => { const stage=document.querySelector('#lightbox-stage'); const t=(id,x)=>new Touch({identifier:id,target:stage,clientX:x,clientY:100}); stage.dispatchEvent(new TouchEvent('touchstart',{touches:[t(1,100),t(2,200)],bubbles:true})); stage.dispatchEvent(new TouchEvent('touchmove',{touches:[t(1,75),t(2,225)],bubbles:true,cancelable:true})); stage.dispatchEvent(new TouchEvent('touchend',{touches:[],bubbles:true})); })()`);
    assert.equal((await lightState()).zoom,'150%'); await click('#lightbox-zoom-reset');
    await lightShot('lightbox-mobile-dark-fixture.png'); await evalJS(`document.body.classList.remove('dark-mode')`); await lightShot('lightbox-mobile-light-fixture.png');
    await open(4,{reduced:true}); await click('.gallery-slide[data-order="0"]'); await sleep(150); await lightShot('lightbox-desktop-dark-fixture.png');
    await evalJS(`document.body.classList.remove('dark-mode')`); await lightShot('lightbox-desktop-light-fixture.png');
    }
    if (!process.env.GALLERY_CASE || process.env.GALLERY_CASE === 'lightbox-autoplay') {
    await open(4); await click('.gallery-slide[data-order="0"]'); await sleep(5600); assert.equal((await state()).position,'1 / 4');
    await click('#lightbox-close'); await evalJS(`document.activeElement.blur()`); await sleep(5900); assert.equal((await state()).position,'2 / 4');
    await click('#gallery-toggle'); await click('.gallery-slide[data-order="0"]'); await click('#lightbox-close'); await evalJS(`document.activeElement.blur()`); await sleep(5600); assert.equal((await state()).position,'2 / 4');
    }
    if (!process.env.GALLERY_CASE || process.env.GALLERY_CASE === 'visual') {
    await open(20,{reduced:true}); await sleep(5900); assert.equal((await state()).position,'1 / 20'); assert.equal(await evalJS(`document.querySelector('#gallery-toggle').hidden && getComputedStyle(document.querySelector('#gallery-toggle')).display === 'none'`),true);
    await click('#gallery-up'); await sleep(100); assert.equal((await state()).position,'2 / 20');
    await open(20,{reduced:true}); await evalJS(`document.body.classList.remove('dark-mode')`); await screenshot('gallery-desktop-light-fixture.png');
    await open(20,{reduced:true}); await screenshot('gallery-desktop-dark-fixture.png');
    await open(20,{mobile:true,reduced:true}); s=await state(); assert.equal(s.slides.length,3); assert.equal(s.overflow,false); assert.equal(await evalJS(`document.querySelector('.gallery-slide[data-order="0"]').offsetHeight > document.querySelector('.gallery-slide[data-order="1"]').offsetHeight`),true); await screenshot('gallery-mobile-dark-fixture.png');
    await evalJS(`document.body.classList.remove('dark-mode')`); await screenshot('gallery-mobile-light-fixture.png');
    }
    assert.deepEqual(errors,[]); ws.close(); console.log('Chromium gallery checks passed');
  } finally { chrome.kill(); server.close(); }
})().catch(err => { console.error(err); process.exitCode=1; });
