// v1.8: genuine viewer hits trigger a readable, account-safe, visual-only spotlight.
import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';
await mkdir('browser-evidence',{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',
 headless:true,args:['--no-sandbox','--disable-dev-shm-usage',
 '--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
try {
 const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 try {
  await page.goto('http://127.0.0.1:8767/index.html?play=1&team=red&name=QA&low=1&panel=0&visualQA=1',
    {waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForFunction(()=>window.__game?.modelsReady&&window.__v18SpotlightPreview,{timeout:55000});
  const result=await page.evaluate(()=>{
    const s=window.__game, before=JSON.stringify({hits:s.hits,scores:s.scores,line:s.line});
    s.phase='battle';
    const started=window.__v18SpotlightPreview('red');
    const el=document.getElementById('v18-spotlight');
    const message=el.querySelector('.message').textContent;
    const shown=el.classList.contains('show');
    const noCredit=before===JSON.stringify({hits:s.hits,scores:s.scores,line:s.line});
    const user=[...s.users.values()].find(u=>u.team==='red'&&!u.isBot&&!u.hostOnly);
    if(user){ user.hostOnly=true; }
    const rejectedHostOnly=!window.__v18SpotlightPreview('red');
    if(user){ user.hostOnly=false; }
    return {started,shown,message,noCredit,rejectedHostOnly,
      overflow:document.documentElement.scrollWidth-innerWidth,
      canvas:document.querySelectorAll('canvas').length};
  });
  await page.screenshot({path:'browser-evidence/derbi-v18-viewer-spotlight.png',fullPage:true});
  if(!result.started||!result.shown||!result.noCredit||!result.rejectedHostOnly||
    !/QA/.test(result.message)||result.canvas<1||result.overflow>4||errors.length)
   throw Error('Derbi v1.8 viewer QA failed '+JSON.stringify({result,errors}));
  console.log('Derbi v1.8 viewer recognition passed',JSON.stringify(result));
 }finally{await page.close()}
}finally{await browser.close()}
