// v1.9 proof: rally poses and final-seconds cue never modify scores or gift ledger.
import { chromium } from 'playwright-core';
import {mkdir} from 'node:fs/promises';
await mkdir('browser-evidence',{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',
headless:true,args:['--no-sandbox','--disable-dev-shm-usage',
'--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
try {
 const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
 const errors=[]; page.on('pageerror',e=>errors.push(e.message));
 try {
  await page.goto('http://127.0.0.1:8767/index.html?play=1&team=red&name=QA&low=1&panel=0&visualQA=1',
   {waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForFunction(()=>window.__game?.modelsReady&&window.__v19RallyPreview,{timeout:55000});
  const result=await page.evaluate(()=>{
   const s=window.__game;
   const snapshot=()=>JSON.stringify({scores:s.scores,hits:s.hits,line:s.line,
     ledgers:s.ledger?.size||0});
   const before=snapshot();s.phase='battle';
   const shown=window.__v19RallyPreview('red');
   const rally=window.__v19RallyState();
   const noCredit=before===snapshot();
   const marker=document.getElementById('v19-round-callout');
   return {shown,rally,noCredit,marker:!!marker,
     canvas:document.querySelectorAll('canvas').length,
     overflow:document.documentElement.scrollWidth-innerWidth};
  });
  await page.waitForTimeout(200);
  const callout=await page.evaluate(()=>{
   const el=document.getElementById('v19-round-callout');
   return {show:el.classList.contains('show'),text:el.textContent};
  });
  await page.screenshot({path:'browser-evidence/derbi-v19-team-rally.png',fullPage:true});
  if(!result.shown||result.rally.events!==1||!result.noCredit||
    !result.marker||!callout.show||!/RALLY|AYAĞA/.test(callout.text)||
    result.overflow>4||result.canvas<1||errors.length)
   throw Error('Derbi v1.9 QA failed '+JSON.stringify({result,callout,errors}));
  console.log('Derbi v1.9 rally QA passed',JSON.stringify({result,callout}));
 } finally { await page.close(); }
} finally { await browser.close(); }
