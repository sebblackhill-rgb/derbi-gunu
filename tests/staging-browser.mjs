// Real Chromium staging check. Unlike unit tests this opens the actual game canvas
// and captures browser screenshots. This is NOT a real TikTok feed or phone GPU test.
import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";
const OUT="browser-evidence";
await mkdir(OUT,{recursive:true});
const browser=await chromium.launch({
 executablePath:process.env.CHROME_PATH||"/usr/bin/google-chrome",
 headless:true,args:["--no-sandbox","--disable-dev-shm-usage","--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"]
});
try {
 for(const [name,viewport,query] of [
  ["portrait",{width:390,height:844},"?play=1&team=red&name=QA&mobile=1&low=1&panel=0"],
  ["broadcast",{width:1080,height:1920},"?play=1&team=blue&name=QA&low=1&panel=0"]
 ]){
  const page=await browser.newPage({viewport,deviceScaleFactor:1});
  const errors=[];page.on("pageerror",e=>errors.push(e.message));
  try {
   await page.goto("http://127.0.0.1:8767/index.html"+query,{waitUntil:"domcontentloaded",timeout:30000});
   await page.waitForFunction(()=>window.__game?.modelsReady && typeof window.handleLiveEvent==="function",{timeout:55000});
   const outcome=await page.evaluate(()=>{
     const id="QA-audit",state=window.__game;
     const response=window.handleLiveEvent({type:"chat",userId:id,username:"QA Viewer",comment:"BJK"});
     const viewer=state.users.get(id);
     const oldLikes=viewer?.likes||0;
     const malformed=window.handleLiveEvent({type:"like",userId:id,username:"QA Viewer",likeCount:-5});
     const likesUnchanged=(viewer?.likes||0)===oldLikes;
     const invalidGift=window.handleLiveEvent({type:"gift",userId:id,username:"QA Viewer",giftName:"Rose",diamondCount:-1});
     const finite=[state.line,state.kapMeter,state.scores?.red,state.scores?.blue].every(Number.isFinite);
     return{modelsReady:!!state.modelsReady,joined:!!viewer,response,
       malformed:malformed?.reason,invalidGift:invalidGift?.reason,
       likesUnchanged,finite,overflow:document.documentElement.scrollWidth-innerWidth,
       canvas:document.querySelectorAll("canvas").length,liveMode:location.search.includes("live=1")};
   });
   await page.screenshot({path:`${OUT}/derbi-${name}.png`,fullPage:true});
   console.log(name,JSON.stringify({outcome,errors}));
   if(!outcome.modelsReady||!outcome.joined||!outcome.response?.joined||!outcome.likesUnchanged||outcome.malformed!=="invalid-count"||
      outcome.invalidGift!=="invalid-count"||!outcome.finite||outcome.overflow>4||
      outcome.canvas===0||outcome.liveMode||errors.length)throw Error("Derbi browser acceptance failed: "+name);
  }finally{await page.close()}
 }
}finally{await browser.close()}
console.log("Derbi Chromium browser smoke passed");
