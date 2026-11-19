// Derbi Günü staging regression tests. Run: node --test tests/stabilization.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const src=readFileSync(new URL('../js/game.js',import.meta.url),'utf8');
function section(start,end) {
 const a=src.indexOf(start),b=src.indexOf(end,a+start.length);
 assert(a>=0&&b>a,`missing anchors ${start} / ${end}`);
 return src.slice(a,b);
}
const eviction=section('function evictBoundedMaps(now) {','function pendingOf(');
const capture=section('function captureBundle() {','function downloadCapture()');
const replay=section('function replayCapture(bundle) {','function handleLiveEvent(evt) {');
test('gift-bearing unjoined viewer survives 101 no-team comments and 31-minute expiry',()=>{
 const ctx={
  state:{pending:new Map(),seenEvents:new Map(),settledStreaks:new Map()},
  traceOutcome(){},performance:{now:()=>0}
 };
 ctx.state.pending.set('gift',{id:'gift',at:0,diamonds:5,gifts:[{diamonds:5}]});
 for(let i=0;i<101;i++)ctx.state.pending.set('free'+i,{id:'free'+i,at:0,diamonds:0,gifts:[]});
 vm.createContext(ctx);vm.runInContext(eviction,ctx);
 ctx.evictBoundedMaps(1000);
 assert.equal(ctx.state.pending.get('gift').diamonds,5);
 assert(ctx.state.pending.size<=100);
 ctx.evictBoundedMaps(31*60*1000);
 assert.equal(ctx.state.pending.get('gift').diamonds,5);
});
test('capture bundles are snapshots, not references to active recorder array',()=>{
 const rows=[{kind:'mapped-event',payload:{type:'like',likeCount:2}}];
 const ctx={state:{captureEvents:rows,captureStartedAt:0,mode:'solo'},
  CONFIG:{version:'v3.7'},location:{href:'http://example.test/'},navigator:{userAgent:'test'},
  jsonSafe:v=>JSON.parse(JSON.stringify(v)),Date};
 vm.createContext(ctx);vm.runInContext(capture,ctx);
 const snap=ctx.captureBundle();
 rows.push({kind:'mapped-event',payload:{type:'like',likeCount:10}});
 assert.equal(snap.events.length,1);
});
test('replay cannot write to a live or non-sandbox game',()=>{
 const ctx={state:{mode:'solo',captureEnabled:true},location:{search:''},
  URLSearchParams,jsonSafe:v=>JSON.parse(JSON.stringify(v)),handleLiveEvent:()=>{throw Error('active mutation')}};
 vm.createContext(ctx);vm.runInContext(replay,ctx);
 const r=ctx.replayCapture({events:[{kind:'mapped-event',payload:{type:'like',likeCount:2}}]});
 assert.equal(r[0].reason,'requires-isolated-replay-sandbox');
 assert.equal(ctx.state.captureEnabled,true);
});
test('sandbox replay handles mapped rows once, ignores raw/handle-result, never records',()=>{
 const seen=[];
 const ctx={state:{mode:'solo',captureEnabled:true},location:{search:'?replaySandbox=1&demo=0'},
 URLSearchParams,jsonSafe:v=>JSON.parse(JSON.stringify(v)),
 handleLiveEvent:e=>{seen.push(e);assert.equal(ctx.state.captureEnabled,false);return {ok:true}}};
 vm.createContext(ctx);vm.runInContext(replay,ctx);
 const bundle={events:[
  {kind:'raw-provider',payload:{type:'like',data:{likeCount:2}}},
  {kind:'mapped-event',payload:{type:'like',likeCount:2}},
  {kind:'handle-result',payload:{ok:true}}]};
 const result=ctx.replayCapture(bundle);
 assert.equal(result.length,1);assert.equal(seen.length,1);
 assert.equal(ctx.state.captureEnabled,true);assert.equal(bundle.events.length,3);
});
test('phase captain template and New Match state are kept in sync',()=>{
 assert(src.includes('ka.dataset.capState = "off"'));
 assert(src.includes('if (u.captainOf) {'));
 assert(src.includes('u.captainOf = null;'));
 assert(src.includes('if (cue) cue.textContent = "";'));
});
test('source rejects unknown live events and invalid numeric input',()=>{
 assert(src.includes('reason: "unsupported-event-type"'));
 assert(src.includes('reason: "invalid-count"'));
 assert(src.includes('!validCount(likeCount, 100000)'));
});

test('crowd label placement prioritises hero, stays in frame and avoids overlap',()=>{
 const start=src.indexOf('function resolveLabelCollisions() {');
 const end=src.indexOf('const fx2 = $("fx2");',start);
 assert(start>=0 && end>start);
 const labels=Array.from({length:15},(_,i)=>({dataset:{id:i?'viewer'+i:'hero'},_lx:390,_ly:8,style:{}}));
 const users=new Map(labels.map((n,i)=>[n.dataset.id,{id:n.dataset.id,isBot:i>9}]));
 const ctx={labelsEl:{children:labels},state:{users},VIEW_W:390,VIEW_H:844,
   isBot:u=>Boolean(u?.isBot),labelPriority:u=>u?.id==='hero'?1000:100};
 vm.createContext(ctx);vm.runInContext(src.slice(start,end),ctx);
 ctx.resolveLabelCollisions();
 assert.equal(labels[0].style.visibility,'visible');
 const visible=labels.filter(x=>x.style.visibility==='visible');
 assert(visible.length>=1 && visible.length<=15);
 const pos=visible.map(n=>{
   const m=/translate\(([0-9.]+)px,([0-9.]+)px\)/.exec(n.style.transform);
   assert(m,n.dataset.id);
   return{x:Number(m[1]),y:Number(m[2]),id:n.dataset.id};
 });
 for(const p of pos){assert(p.x>=0&&p.x<=390,p.id);assert(p.y>=0&&p.y<=844,p.id);}
 for(let i=0;i<pos.length;i++)for(let j=i+1;j<pos.length;j++){
   const a=users.get(pos[i].id),b=users.get(pos[j].id);
   const wa=a.isBot?44:62,wb=b.isBot?44:62,ha=a.isBot?12:16,hb=b.isBot?12:16;
   assert(!(Math.abs(pos[i].x-pos[j].x)<(wa+wb)*0.52 && Math.abs(pos[i].y-pos[j].y)<(ha+hb)*0.62),
       'labels must be separated: '+pos[i].id+' '+pos[j].id);
 }
});
