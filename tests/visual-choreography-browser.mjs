// Real browser rendering proof of v1.6 hit impact overlay.
// The opt-in visual QA hook is inert with normal URLs and cannot change scores.
import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';
await mkdir('browser-evidence',{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',headless:true,
  args:['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
try {
 const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 try{
   await page.goto('http://127.0.0.1:8767/index.html?play=1&team=red&name=QA&low=1&panel=0&visualQA=1',
     {waitUntil:'domcontentloaded',timeout:30000});
   await page.waitForFunction(()=>window.__game?.modelsReady&&window.__visualQA?.impact,{timeout:55000});
   const outcome=await page.evaluate(()=>{
     const s=window.__game;
     const before=JSON.stringify({scores:s.scores,hits:s.hits,line:s.line});
     const a=window.__visualQA.impact('red');
     const b=window.__visualQA.impact('blue');
     const after=JSON.stringify({scores:s.scores,hits:s.hits,line:s.line});
     return {ringCount:b,scoreUnchanged:before===after,canvasCount:document.querySelectorAll('canvas').length,
       overflow:document.documentElement.scrollWidth-window.innerWidth,phase:s.phase};
   });
   await page.screenshot({path:'browser-evidence/derbi-v16-impact-rings.png',fullPage:true});
   console.log('Derbi visual beat',JSON.stringify({outcome,errors}));
   if(!outcome.scoreUnchanged||outcome.ringCount<1||outcome.ringCount>6||
      outcome.canvasCount<1||outcome.overflow>4||errors.length)
      throw Error('Derbi visual choreography regression');
 }finally{await page.close()}
}finally{await browser.close()}
console.log('Derbi v1.6 visual choreography passed');
