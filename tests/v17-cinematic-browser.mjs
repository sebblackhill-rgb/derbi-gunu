// v1.7 cinematic QA: viewer focus is visual-only, bounded and reduced-FX aware.
import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';
await mkdir('browser-evidence', { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome',
  headless: true, args: ['--no-sandbox','--disable-dev-shm-usage',
    '--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']
});
try {
  const page = await browser.newPage({viewport:{width:390,height:844}, deviceScaleFactor:1});
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  try {
    await page.goto('http://127.0.0.1:8767/index.html?play=1&team=red&name=QA&low=1&panel=0&visualQA=1',
      {waitUntil:'domcontentloaded', timeout:30000});
    await page.waitForFunction(() => window.__game?.modelsReady && window.__v17Preview, {timeout:55000});
    const result = await page.evaluate(() => {
      const s=window.__game, snap=JSON.stringify({hits:s.hits,scores:s.scores});
      // An opt-in rehearsal never awards gifts or scores.
      s.phase='battle';
      const started=window.__v17Preview('red');
      const unchanged=snap===JSON.stringify({hits:s.hits,scores:s.scores});
      const oldFx=s.reducedFx; s.reducedFx=true;
      const calmBlocked=window.__v17Preview('red')===false;
      s.reducedFx=oldFx;
      return {started,unchanged,calmBlocked,canvas:document.querySelectorAll('canvas').length,
        overflow:document.documentElement.scrollWidth-innerWidth};
    });
    await page.waitForTimeout(480);
    const shot=await page.evaluate(() => window.__v17CameraState());
    await page.screenshot({path:'browser-evidence/derbi-v17-cinematic.png',fullPage:true});
    if (!result.started || !result.unchanged || !result.calmBlocked ||
        !shot.active || shot.zoom<=1 || result.canvas<1 || result.overflow>4 || errors.length)
      throw Error('Derbi v1.7 camera QA failed: '+JSON.stringify({result,shot,errors}));
    console.log('Derbi v1.7 cinematic QA passed',JSON.stringify({result,shot}));
  } finally { await page.close(); }
} finally { await browser.close(); }
