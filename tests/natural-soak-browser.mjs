// Natural 20-second staging soak with software Chrome; not real phone/OBS.
import {chromium} from 'playwright-core';
import {mkdir} from 'node:fs/promises';
await mkdir('browser-evidence',{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',
headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
try{
 const page=await browser.newPage({viewport:{width:390,height:844}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 try{
  await page.goto('http://127.0.0.1:8767/index.html?play=1&team=red&name=QA&low=1&panel=0',
    {waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForFunction(()=>window.__game?.modelsReady&&typeof window.handleLiveEvent==='function',{timeout:55000});
  const before=await page.evaluate(()=>({t:performance.now(),users:window.__game.users.size,
    scores:{...window.__game.scores},line:window.__game.line}));
  await page.waitForTimeout(20000);
  const after=await page.evaluate(()=>{
   const s=window.__game;
   return {t:performance.now(),users:s.users.size,scores:{...s.scores},line:s.line,phase:s.phase,
     modelsReady:s.modelsReady,canvas:document.querySelectorAll('canvas').length,
     overflow:document.documentElement.scrollWidth-innerWidth,
     calls:window.__debug?.renderer?.info?.render?.calls??null};
  });
  await page.screenshot({path:'browser-evidence/derbi-20s-natural-soak.png',fullPage:true});
  const elapsed=(after.t-before.t)/1000;
  console.log('Derbi natural soak:',JSON.stringify({before,after,elapsed,errors}));
  if(elapsed<19||!after.modelsReady||after.canvas<1||after.overflow>4||
     !Number.isFinite(after.line)||after.phase==='error'||errors.length)
    throw Error('Derbi natural 20s frame/scene soak failed');
 }finally{await page.close()}
}finally{await browser.close()}
console.log('Derbi natural-time 20s browser soak passed');
