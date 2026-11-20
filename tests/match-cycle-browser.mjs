// Accelerated four-round Derbi match acceptance; explicitly not natural-time play.
import {chromium} from 'playwright-core';
import {mkdir} from 'node:fs/promises';
await mkdir('browser-evidence',{recursive:true});
const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,
 args:['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
try{
 const p=await b.newPage({viewport:{width:390,height:844}});
 const errors=[];p.on('pageerror',e=>errors.push(e.message));
 try{
  await p.goto('http://127.0.0.1:8767/index.html?play=1&team=red&name=QA&mobile=1&low=1&panel=0',
   {waitUntil:'domcontentloaded',timeout:30000});
  await p.waitForFunction(()=>window.__game?.modelsReady&&typeof window.__endWin==='function',{timeout:55000});
  const outcomes=await p.evaluate(()=>{
   const s=window.__game;
   window.__resetMatch();
   const stages=[];
   for(const team of ['red','blue','red','red']){
     window.__endWin(team);
     stages.push({team,red:s.scores.red,blue:s.scores.blue,phase:s.phase,over:s.matchOver});
     if(!s.matchOver)window.__resetBattle();
   }
   window.__resetBattle();
   return {stages,finalPhase:s.phase,
     card:document.getElementById('match-card').classList.contains('show'),
     score:s.scores.red+'-'+s.scores.blue};
  });
  await p.screenshot({path:'browser-evidence/derbi-match-final.png',fullPage:true});
  const restarted=await p.evaluate(()=>{
   const s=window.__game;
   const hero=s.users.get(s.heroId);
   if(hero)hero.captainOf='red';
   s.kapMeter=100;
   window.__resetMatch();
   return {phase:s.phase,score:s.scores.red+'-'+s.scores.blue,
     matchOver:s.matchOver,capMeter:s.kapMeter,
     heroCaptain:!!s.users.get(s.heroId)?.captainOf,
     finite:Number.isFinite(s.line)&&Number.isFinite(s.kapMeter)};
  });
  await p.screenshot({path:'browser-evidence/derbi-match-restart.png',fullPage:true});
  console.log(JSON.stringify({outcomes,restarted,errors}));
  if(outcomes.stages.length!==4||outcomes.stages[3].red!==3||
    outcomes.stages[3].blue!==1||!outcomes.stages[3].over||
    !outcomes.card||outcomes.finalPhase!=='matchover'||
    restarted.score!=='0-0'||restarted.matchOver||
    restarted.heroCaptain||restarted.capMeter!==0||!restarted.finite||errors.length)
    throw Error('Derbi accelerated best-of-five match cycle failed');
 }finally{await p.close()}
}finally{await b.close()}
console.log('Derbi four-round match cycle and new-match reset passed');
