import { chromium } from "playwright-core";
import { runReplayHarness } from "./replay-capture.mjs";

const BASE = process.env.BASE || "http://127.0.0.1:8767";
const results = [];
function check(name, ok, detail) {
  results.push({ name, ok: !!ok, detail: detail || "" });
  console.log((ok ? "PASS" : "FAIL") + "  " + name + (detail ? " — " + detail : ""));
}

const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--use-gl=angle", "--use-angle=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"],
});

async function open(url, viewport = { width: 390, height: 844 }) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForFunction(() => window.__game && window.__game.modelsReady, { timeout: 40000 });
  page._errors = errors;
  return page;
}

/* -------------------- keyword matching (D2) -------------------- */
const kwPage = await open(BASE + "/index.html?play=1&team=red&name=Kw&mobile=1&low=1&v=34t");
const kw = await kwPage.evaluate(() => {
  const p = window.__parseTeam;
  return {
    FB: p("FB"),
    fbBang: p("fb!"),
    Fener: p("Fener"),
    Fenerbahce: p("Fenerbahçe"),
    goFener: p("go Fener go"),
    Besiktas: p("Beşiktaş"),
    BJK: p("BJK"),
    Kartal: p("KARTAL"),
    karaKartal: p("kara kartal"),
    FBI: p("FBI"),
    fbiLower: p("fbi"),
    longer: p("completely unrelated text"),
    fenerbahceli: p("FENERBAHCELI"),
    AFB: p("AFB"),
    empty: p(""),
    emoji: p("💛💙"),
  };
});
check("D2 FB token → blue", kw.FB === "blue", JSON.stringify(kw.FB));
check("D2 fb! → blue", kw.fbBang === "blue");
check("D2 Fener → blue", kw.Fener === "blue");
check("D2 Fenerbahçe → blue", kw.Fenerbahce === "blue");
check("D2 go Fener go → blue", kw.goFener === "blue");
check("D2 Beşiktaş → red", kw.Besiktas === "red");
check("D2 BJK → red", kw.BJK === "red");
check("D2 KARTAL → red", kw.Kartal === "red");
check("D2 kara kartal phrase → red", kw.karaKartal === "red");
check("D2 FBI does not join FB", kw.FBI == null, JSON.stringify(kw.FBI));
check("D2 fbi does not join FB", kw.fbiLower == null);
check("D2 unrelated string is null", kw.longer == null);
check("D2 FENERBAHCELI is not a prefix match", kw.fenerbahceli == null, JSON.stringify(kw.fenerbahceli));
check("D2 AFB is not FB", kw.AFB == null);
check("D2 empty is null", kw.empty == null);
check("D2 emoji 💛💙 → blue", kw.emoji === "blue");
await kwPage.close();

/* -------------------- D1 source isolation (exact repro) -------------------- */
const d1a = await open(BASE + "/index.html?mobile=1&low=1&v=34d1a");
const d1before = await d1a.evaluate(() => {
  const r1 = window.handleLiveEvent({ type: "like", userId: "local:pablo", username: "Pablo", source: "host" });
  const r2 = window.handleLiveEvent({ type: "gift", userId: "local:pablo", username: "Pablo", giftName: "lion", diamondCount: 2999, source: "host" });
  const pending = [...window.__game.pending.values()][0];
  const join = window.handleLiveEvent({ type: "chat", userId: "local:pablo", username: "Pablo", comment: "FB", source: "host" });
  const u = window.__game.users.get("local:pablo");
  const board = window.__topCapos(4).map((x) => x.id);
  const trace = window.__lastOutcome();
  return {
    r1: r1.status, r2: r2.status, pendingHost: !!(pending && pending.hostOnly), pendingDia: pending && pending.diamonds,
    joinOk: join.ok, created: join.created, hostOnly: u && u.hostOnly,
    diamonds: u && u.diamonds, testDiamonds: u && u.testDiamonds,
    onBoard: board.includes("local:pablo"),
    boardIds: board,
    traceStatus: trace && trace.status, traceReason: trace && trace.reason,
  };
});
check("D1 pre-join host Like+Lion are held then settled as host", d1before.pendingHost && d1before.joinOk, JSON.stringify(d1before));
check("D1 pre-join host Lion does not enter public diamonds", (d1before.diamonds || 0) === 0, "diamonds=" + d1before.diamonds);
check("D1 pre-join host Lion goes to test ledger", (d1before.testDiamonds || 0) >= 2999, "testDiamonds=" + d1before.testDiamonds);
check("D1 pre-join host user is hostOnly", !!d1before.hostOnly);
check("D1 pre-join host user is not on gift board", d1before.onBoard === false, "board=" + JSON.stringify(d1before.boardIds));

const d1postGift = await d1a.evaluate(() => {
  const r = window.handleLiveEvent({ type: "gift", userId: "local:pablo", username: "Pablo", giftName: "lion", diamondCount: 2999, source: "host" });
  const u = window.__game.users.get("local:pablo");
  return { diamonds: u.diamonds, testDiamonds: u.testDiamonds, onBoard: window.__topCapos(4).some((x) => x.id === "local:pablo"), status: r.status };
});
check("D1 post-join host Lion still stays off the public board", d1postGift.diamonds === 0 && d1postGift.onBoard === false, JSON.stringify(d1postGift));
await d1a.close();

const d1b = await open(BASE + "/index.html?mobile=1&low=1&v=34d1b");
const d1after = await d1b.evaluate(() => {
  window.handleLiveEvent({ type: "chat", userId: "local:pablo", username: "Pablo", comment: "FB", source: "host" });
  window.handleLiveEvent({ type: "gift", userId: "local:pablo", username: "Pablo", giftName: "lion", diamondCount: 2999, source: "host" });
  const u = window.__game.users.get("local:pablo");
  return { diamonds: u.diamonds, testDiamonds: u.testDiamonds, hostOnly: u.hostOnly, onBoard: window.__topCapos(4).some((x) => x.id === "local:pablo") };
});
check("D1 join-first then Lion matches pre-join eligibility", d1after.diamonds === 0 && d1after.hostOnly && d1after.onBoard === false && (d1after.testDiamonds || 0) >= 2999, JSON.stringify(d1after));
await d1b.close();

/* genuine (non-host) pending still reaches the board */
const d1c = await open(BASE + "/index.html?mobile=1&low=1&v=34d1c");
const d1real = await d1c.evaluate(() => {
  window.handleLiveEvent({ type: "gift", userId: "tt:ayse", username: "ayse", giftName: "lion", diamondCount: 2999 });
  window.handleLiveEvent({ type: "chat", userId: "tt:ayse", username: "ayse", comment: "BJK" });
  const u = window.__game.users.get("tt:ayse");
  return { diamonds: u && u.diamonds, hostOnly: u && u.hostOnly, onBoard: window.__topCapos(4).some((x) => x.id === "tt:ayse"), pendingLeft: window.__game.pending.has("tt:ayse") };
});
check("D1 genuine pending Lion settles to public board", d1real.diamonds >= 2999 && !d1real.hostOnly && d1real.onBoard && !d1real.pendingLeft, JSON.stringify(d1real));
await d1c.close();

/* -------------------- D8 pending action replay -------------------- */
const d8 = await open(BASE + "/index.html?live=1&mobile=1&low=1&v=34d8");
await d8.waitForTimeout(200);
const d8same = await d8.evaluate(() => {
  window.__setLiveStatus && window.__setLiveStatus("LIVE");
  window.handleLiveEvent({ type: "chat", userId: "tt:seed", username: "seed", comment: "BJK" });
  const line0 = window.__game.line;
  window.handleLiveEvent({ type: "gift", userId: "tt:lionfan", username: "lionfan", giftName: "lion", diamondCount: 1000 });
  const lineHeld = window.__game.line;
  const join = window.handleLiveEvent({ type: "chat", userId: "tt:lionfan", username: "lionfan", comment: "FB" });
  return { line0, lineHeld, lineAfter: window.__game.line, joined: join.ok, captain: window.__game.users.get("tt:lionfan") && window.__game.users.get("tt:lionfan").captainOf, diamonds: window.__game.users.get("tt:lionfan") && window.__game.users.get("tt:lionfan").diamonds };
});
check("D8 pending Lion does not push the line before join", Math.abs(d8same.lineHeld - d8same.line0) < 0.001, JSON.stringify(d8same));
check("D8 pending Lion replays the line push on join", d8same.lineAfter < d8same.line0 - 0.05, JSON.stringify(d8same));
check("D8 pending Lion still awards captain + diamonds", d8same.captain === "blue" && d8same.diamonds >= 1000, JSON.stringify(d8same));

// expired action after reset: credit remains, no extra push into the new round
const d8exp = await d8.evaluate(() => {
  window.handleLiveEvent({ type: "gift", userId: "tt:late", username: "late", giftName: "lion", diamondCount: 1000 });
  window.__resetMatch();
  const line0 = window.__game.line;
  window.handleLiveEvent({ type: "chat", userId: "tt:late", username: "late", comment: "BJK" });
  const u = window.__game.users.get("tt:late");
  return { line0, line: window.__game.line, diamonds: u && u.diamonds, pending: window.__game.pending.has("tt:late") };
});
check("D8 expired pending Lion keeps credit after reset", (d8exp.diamonds || 0) >= 1000 && !d8exp.pending, JSON.stringify(d8exp));
check("D8 expired pending Lion does not fire a stale line push", Math.abs(d8exp.line - d8exp.line0) < 0.12, JSON.stringify(d8exp)); // join may land a normal swing; a Lion push is 0.16
await d8.close();

/* -------------------- D7 capacity -------------------- */
const d7 = await open(BASE + "/index.html?live=1&mobile=1&low=1&v=34d7");
const d7res = await d7.evaluate(() => {
  const errors = [];
  window.addEventListener("error", (e) => errors.push(String(e.message || e)));
  const prevMax = window.CONFIG.maxFans;
  window.CONFIG.maxFans = 4;
  // fill with 4 real users
  for (const [id, team] of [["u1","BJK"],["u2","BJK"],["u3","FB"],["u4","FB"]]) {
    window.handleLiveEvent({ type: "chat", userId: "tt:" + id, username: id, comment: team });
  }
  const filled = window.__game.users.size;
  window.handleLiveEvent({ type: "gift", userId: "tt:fifth", username: "fifth", giftName: "lion", diamondCount: 1500 });
  let threw = false;
  let join;
  try {
    join = window.handleLiveEvent({ type: "chat", userId: "tt:fifth", username: "fifth", comment: "FB" });
  } catch (e) {
    threw = true;
    join = { error: String(e) };
  }
  const created = !!(join && join.created) || window.__game.users.has("tt:fifth");
  const pending = window.__game.pending.get("tt:fifth") || window.__game.pending.get("fifth");
  const wait = window.__game.waitlist && window.__game.waitlist.size;
  const outcome = window.__lastOutcome();
  window.CONFIG.maxFans = prevMax;
  return { filled, threw, created, join, pendingDiamonds: pending && pending.diamonds, wait, outcome, errors };
});
check("D7 no exception at all-human capacity", !d7res.threw && (d7res.errors || []).length === 0, JSON.stringify(d7res));
check("D7 no avatar is created over capacity", d7res.created === false, JSON.stringify(d7res.join));
check("D7 pending gift credit is kept", (d7res.pendingDiamonds || 0) >= 1500, JSON.stringify(d7res));
check("D7 outcome is held/capacity", d7res.join && d7res.join.reason === "capacity" && d7res.join.status === "held", JSON.stringify(d7res.join));
const d7pageErrors = d7._errors.filter((e) => /id|undefined|null/i.test(e));
check("D7 page has no null-deref errors", d7pageErrors.length === 0, d7pageErrors.join(" | "));
await d7.close();

/* -------------------- D9 board filter-then-top4 -------------------- */
const d9 = await open(BASE + "/index.html?demo=1&mobile=1&low=1&v=34d9");
const d9res = await d9.evaluate(() => {
  // inflate a few bots, a host-only test user, and a lower-credit real supporter
  const bots = [...window.__game.users.values()].filter((u) => u.isBot || String(u.id).startsWith("bot:")).slice(0, 4);
  bots.forEach((u, i) => { u.diamonds = 5000 - i * 10; });
  window.handleLiveEvent({ type: "chat", userId: "local:hosty", username: "hosty", comment: "BJK", source: "host" });
  const host = window.__game.users.get("local:hosty");
  if (host) { host.diamonds = 8000; host.hostOnly = true; host.testDiamonds = 8000; }
  window.handleLiveEvent({ type: "chat", userId: "tt:real", username: "realFan", comment: "FB" });
  const real = window.__game.users.get("tt:real");
  if (real) { real.diamonds = 40; }
  const top = window.__topCapos(4);
  return { ids: top.map((u) => u.id + ":" + u.diamonds + (u.hostOnly ? ":host" : "") + (u.isBot ? ":bot" : "")), hasReal: top.some((u) => u.id === "tt:real"), hasHost: top.some((u) => u.hostOnly), hasBot: top.some((u) => u.isBot || String(u.id).startsWith("bot:")) };
});
check("D9 real low-credit supporter appears after eligibility filter", d9res.hasReal, JSON.stringify(d9res));
check("D9 host-only and bots are excluded from the gift board", !d9res.hasHost && !d9res.hasBot, JSON.stringify(d9res));
await d9.close();

/* -------------------- D10 duplicates + streaks -------------------- */
const d10 = await open(BASE + "/index.html?live=1&mobile=1&low=1&v=34d10");
const d10res = await d10.evaluate(async () => {
  window.handleLiveEvent({ type: "chat", userId: "tt:streak", username: "streak", comment: "BJK" });
  const u = window.__game.users.get("tt:streak");
  const first = window.handleLiveEvent({ type: "gift", userId: "tt:streak", username: "streak", giftName: "rose", diamondCount: 1, repeatCount: 1, repeatEnd: false, eventId: "g1" });
  const mid = window.handleLiveEvent({ type: "gift", userId: "tt:streak", username: "streak", giftName: "rose", diamondCount: 1, repeatCount: 3, repeatEnd: false, eventId: "g1b" });
  const dMid = u.diamonds;
  const fin = window.handleLiveEvent({ type: "gift", userId: "tt:streak", username: "streak", giftName: "rose", diamondCount: 1, repeatCount: 5, repeatEnd: true, eventId: "g1-end" });
  const dFin = u.diamonds;
  const dup = window.handleLiveEvent({ type: "gift", userId: "tt:streak", username: "streak", giftName: "rose", diamondCount: 1, repeatCount: 5, repeatEnd: true, eventId: "g1-end" });
  const dDup = u.diamonds;
  // new streak that never finishes — timeout should settle once
  const open = window.handleLiveEvent({ type: "gift", userId: "tt:streak", username: "streak", giftName: "rose", diamondCount: 1, repeatCount: 2, repeatEnd: false, eventId: "g2" });
  const held = window.__game.giftStreaks.size;
  // accelerate timeout
  for (const rec of window.__game.giftStreaks.values()) rec.heldAt = performance.now() - 9000;
  // tick expire by sending a dummy chat (expireStreaks also runs in rAF; call by waiting)
  return { first: first.status, mid: mid.status, dMid, fin: fin.status, dFin, dup: dup.reason, dDup, open: open.status, held, diamonds: u.diamonds };
});
check("D10 in-progress streak does not credit", d10res.dMid === 0 && d10res.first === "held" && d10res.mid === "held", JSON.stringify(d10res));
check("D10 final streak tick credits once (x5)", d10res.dFin === 5 && d10res.fin === "applied", JSON.stringify(d10res));
check("D10 duplicate final event is rejected", d10res.dup === "duplicate" && d10res.dDup === 5, JSON.stringify(d10res));

// allow expireStreaks to run
await d10.waitForTimeout(400);
const d10to = await d10.evaluate(() => {
  for (const rec of window.__game.giftStreaks.values()) rec.heldAt = performance.now() - 9000;
  return { held: window.__game.giftStreaks.size, diamonds: window.__game.users.get("tt:streak").diamonds };
});
// give the rAF loop a moment
await d10.waitForTimeout(300);
const d10to2 = await d10.evaluate(() => ({
  held: window.__game.giftStreaks.size,
  diamonds: window.__game.users.get("tt:streak").diamonds,
  last: window.__lastOutcome()
}));
check("D10 unfinished streak settles once on timeout", d10to2.held === 0 && d10to2.diamonds >= 7, JSON.stringify(d10to2));
await d10.close();

/* -------------------- reset boundaries + phase -------------------- */
const rst = await open(BASE + "/index.html?play=1&team=red&name=Hero&mobile=1&low=1&v=34rst");
const rstRes = await rst.evaluate(() => {
  const u = window.__game.users.get(window.__game.heroId);
  u.hits = 7; u.sessionHits = 7; u.points = 100;
  window.__game.hits.red = 7;
  window.__game.sessionHits.red = 7;
  window.__game.scores.red = 2;
  window.__resetRoundCounters();
  const afterRound = { hits: u.hits, sessionHits: u.sessionHits, points: u.points, teamHits: window.__game.hits.red, teamSession: window.__game.sessionHits.red, scores: window.__game.scores.red };
  window.__resetMatch();
  return { afterRound, scoresAfterMatch: { ...window.__game.scores }, matchOver: window.__game.matchOver, phase: window.__game.phase, hitsAfterMatch: window.__game.hits.red };
});
check("reset: round counters zero, session and scores kept", rstRes.afterRound.hits === 0 && rstRes.afterRound.teamHits === 0 && rstRes.afterRound.sessionHits === 7 && rstRes.afterRound.points === 100 && rstRes.afterRound.scores === 2, JSON.stringify(rstRes.afterRound));
check("reset: new match zeros series scores", rstRes.scoresAfterMatch.red === 0 && rstRes.scoresAfterMatch.blue === 0 && rstRes.matchOver === false && rstRes.phase === "battle", JSON.stringify(rstRes));
await rst.close();

/* -------------------- D4 one ceremony; D5 one captain log -------------------- */
const cer = await open(BASE + "/index.html?play=1&team=red&name=Hero&mobile=1&low=1&v=34cer");
const cerRes = await cer.evaluate(() => {
  const logs = [];
  const box = document.getElementById("log");
  const u = window.__game.users.get(window.__game.heroId);
  window.__game.kapMeter = 100;
  window.__game.phase = "battle";
  // call tryKaptan via the button
  document.getElementById("btn-kaptan").click();
  const capoLogs = [...box.querySelectorAll(".log-item.capo")].map((n) => n.textContent);
  // force a 3-0 match
  window.__game.scores.red = 2;
  window.__endWin("red");
  const endShow = document.getElementById("end-card").classList.contains("show");
  const matchShow = document.getElementById("match-card").classList.contains("show");
  const endInert = document.getElementById("end-card").hasAttribute("inert");
  return { capoLogs, points: u.points, diamonds: u.diamonds, endShow, matchShow, endInert, matchOver: window.__game.matchOver };
});
await cer.waitForTimeout(100);
const cerRes2 = await cer.evaluate(() => ({
  endShow: document.getElementById("end-card").classList.contains("show"),
  matchShow: document.getElementById("match-card").classList.contains("show"),
  endInert: document.getElementById("end-card").hasAttribute("inert"),
  capoLogs: [...document.querySelectorAll("#log .log-item.capo")].map((n) => n.textContent)
}));
check("D5 solo captain logs once in points, zero diamonds", cerRes.capoLogs.length === 1 && /100/.test(cerRes.capoLogs[0] || "") && /puan|pts/i.test(cerRes.capoLogs[0] || "") && cerRes.diamonds === 0 && cerRes.points >= 100, JSON.stringify(cerRes.capoLogs));
check("D4 match ceremony hides the round card", (cerRes2.matchShow || cerRes.matchShow) && (cerRes2.endInert || !cerRes2.endShow), JSON.stringify(cerRes2));
await cer.close();

/* -------------------- D3 Test button vs join strip -------------------- */
const d3 = await open(BASE + "/index.html?live=1&mobile=1&low=1&v=34d3");
await d3.waitForTimeout(500);
const d3geo = await d3.evaluate(() => {
  const btn = document.getElementById("btn-testet");
  const join = document.getElementById("join-card");
  const br = btn.getBoundingClientRect();
  const jr = join.getBoundingClientRect();
  const overlap = !(br.right < jr.left || br.left > jr.right || br.bottom < jr.top || br.top > jr.bottom);
  return { overlap, btn: { t: +br.top.toFixed(0), b: +br.bottom.toFixed(0), l: +br.left.toFixed(0) }, join: { t: +jr.top.toFixed(0), b: +jr.bottom.toFixed(0) }, btnText: btn.textContent };
});
check("D3 Test button does not cover the join strip", d3geo.overlap === false, JSON.stringify(d3geo));
await d3.close();

/* -------------------- D6 language -------------------- */
const d6 = await open(BASE + "/index.html?play=1&team=fb&name=QAPhone&lang=en&low=1&mobile=1&v=34d6");
const d6en = await d6.evaluate(() => ({
  title: document.getElementById("banner-title").textContent,
  pick: document.getElementById("pick-title") && document.getElementById("pick-title").textContent,
  panelUser: document.getElementById("lbl-fake-user").textContent,
  panelFine: document.getElementById("panel-fine").textContent,
  bot: document.getElementById("bot-label-text").textContent,
  like: document.getElementById("btn-like").textContent,
  rose: document.getElementById("btn-rose").textContent,
  lang: window.CONFIG.lang,
  rules: document.getElementById("rule-win") && document.getElementById("rule-win").textContent,
  super: document.getElementById("btn-super").textContent,
  kap: document.getElementById("btn-kaptan").textContent,
}));
check("D6 English route translates panel, rules and actions", d6en.lang === "en" && /DERBY DAY/i.test(d6en.title) && /Username/i.test(d6en.panelUser) && /Host simulation/i.test(d6en.panelFine) && /Synthetic/i.test(d6en.bot) && /Rose/i.test(d6en.rose) && /best of five/i.test(d6en.rules) && /SUPER/i.test(d6en.super), JSON.stringify(d6en));
await d6.evaluate(() => window.toggleLang());
const d6tr = await d6.evaluate(() => ({
  lang: window.CONFIG.lang,
  title: document.getElementById("banner-title").textContent,
  panelUser: document.getElementById("lbl-fake-user").textContent,
  rose: document.getElementById("btn-rose").textContent
}));
check("D6 language button switches to Turkish", d6tr.lang === "tr" && /DERBİ/i.test(d6tr.title) && /Kullanıcı/i.test(d6tr.panelUser), JSON.stringify(d6tr));
await d6.close();

/* -------------------- D11 honest DISCONNECTED + diagnostic receipt -------------------- */
const live = await open(BASE + "/index.html?live=1&lang=en&low=1&mobile=1&connectms=400&v=34live");
await live.waitForFunction(() => {
  const s = window.__debugLive && window.__debugLive().status;
  return s === "DISCONNECTED" || s === "RETRYING";
}, { timeout: 15000 }).catch(() => {});
const liveInfo = await live.evaluate(() => {
  const d = window.__debugLive();
  const pill = document.getElementById("live-pill").textContent;
  const timer = document.getElementById("timer").textContent;
  const bots = [...window.__game.users.values()].filter((u) => u.isBot).length;
  const trace = document.getElementById("event-trace");
  window.handleLiveEvent({ type: "gift", userId: "tt:z", username: "z", giftName: "rose", diamondCount: 1, eventId: "dupA" });
  window.handleLiveEvent({ type: "gift", userId: "tt:z", username: "z", giftName: "rose", diamondCount: 1, eventId: "dupA" });
  return {
    status: d && d.status, pill, timer, bots,
    trace: document.getElementById("event-trace").textContent,
    last: window.__lastOutcome(),
    roundStart: window.__game.roundStart,
    standby: window.__liveStandby && window.__liveStandby()
  };
});
const honest = liveInfo.status === "DISCONNECTED" || liveInfo.status === "RETRYING" || liveInfo.status === "CONNECTING";
check("D11 live timeout stays honest (not LIVE)", honest && liveInfo.status !== "LIVE", JSON.stringify({ pill: liveInfo.pill, status: liveInfo.status }));
check("D11 DISCONNECTED live does not spawn bots", liveInfo.bots === 0, "bots=" + liveInfo.bots);
check("D11 empty disconnected live is on STANDBY, clock not burning", liveInfo.standby === true && liveInfo.roundStart === 0, JSON.stringify(liveInfo));
check("diagnostic receipt visible without console", /duplicate|rejected|held|applied|settled|HOST|outcome/i.test(liveInfo.trace + JSON.stringify(liveInfo.last)), liveInfo.trace);
await live.close();

/* ============================================================
   v3.5  N1–N11 repros
   ============================================================ */

/* N1: idle player must not see personal victory copy */
const n1 = await open(BASE + "/index.html?play=1&team=fb&name=Idle&lang=en&low=1&mobile=1&v=35n1");
const n1res = await n1.evaluate(() => {
  window.__stopBot && window.__stopBot();
  const u = window.__game.users.get(window.__game.heroId);
  u.hits = 0; u.knockouts = 0; u.rankHits = 0; u.rankLikes = 0; u.likes = 0;
  window.__game.line = -0.23;
  window.__endWin("blue");
  window.__showEndCard();
  const title = document.getElementById("end-title").textContent;
  const stats = document.getElementById("end-stats").innerText;
  const rule = (document.getElementById("rule-timeout") || {}).textContent || "";
  return {
    title, stats, rule,
    winner: window.__game.winner,
    hits: u.hits,
    contributed: window.__heroContributed(u),
  };
});
check("N1 idle timeout is not personal victory copy", n1res.contributed === false && n1res.hits === 0 && !/SQUARE IS YOURS/i.test(n1res.title) && /TEAM TOOK THE SQUARE|YOUR TEAM/i.test(n1res.title), JSON.stringify(n1res));
check("N1 timeout margin rule is documented", /2%/.test(n1res.stats + " " + n1res.rule), JSON.stringify({ stats: n1res.stats, rule: n1res.rule }));
const n1active = await n1.evaluate(() => {
  const u = window.__game.users.get(window.__game.heroId);
  u.hits = 3; u.rankHits = 3;
  window.__showEndCard();
  return { title: document.getElementById("end-title").textContent, contributed: window.__heroContributed(u) };
});
check("N1 contributing player still sees personal victory copy", n1active.contributed === true && /SQUARE IS YOURS/i.test(n1active.title), JSON.stringify(n1active));
await n1.close();

/* N2: waitlist promotes when a slot frees and credit settles */
const n2 = await open(BASE + "/index.html?low=1&mobile=1&lang=en&v=35n2");
const n2res = await n2.evaluate(() => {
  window.__stopBot && window.__stopBot();
  for (const id of [...window.__game.users.keys()]) window.__removeUser(id, { promote: false });
  window.__game.waitlist.clear();
  window.CONFIG.maxFans = 4;
  for (const [id, name, comment] of [["tt:a","A","BJK"],["tt:b","B","BJK"],["tt:c","C","FB"],["tt:d","D","FB"]]) {
    window.handleLiveEvent({ type: "chat", userId: id, username: name, comment });
  }
  const atCap = window.__game.users.size;
  window.handleLiveEvent({ type: "gift", userId: "tt:e", username: "Eve", giftName: "rose", diamondCount: 10, eventId: "e-gift" });
  const joinE = window.handleLiveEvent({ type: "chat", userId: "tt:e", username: "Eve", comment: "BJK" });
  const pendingBefore = window.__pendingOf("tt:e", "Eve").diamonds;
  const waitSize = window.__game.waitlist.size;
  const inBefore = window.__game.users.has("tt:e");
  window.__removeUser("tt:d");
  const eve = window.__game.users.get("tt:e");
  return {
    atCap, joinE, waitSize, inBefore, pendingBefore,
    afterSize: window.__game.users.size,
    eveIn: !!eve, eveDiamonds: eve && eve.diamonds, eveTeam: eve && eve.team,
    waitAfter: window.__game.waitlist.size,
    receipt: window.__lastReceipt && window.__lastReceipt(),
  };
});
check("N2 fifth joiner is waitlisted at capacity", n2res.atCap === 4 && n2res.inBefore === false && n2res.waitSize >= 1 && (n2res.pendingBefore || 0) >= 10, JSON.stringify(n2res));
check("N2 waitlist promotes and settles held credit", n2res.eveIn === true && n2res.eveDiamonds === 10 && n2res.waitAfter === 0 && n2res.eveTeam === "red", JSON.stringify(n2res));
await n2.close();

/* N3: composite event-id + streak-key dedupe */
const n3 = await open(BASE + "/index.html?play=1&team=red&name=StreakQA&low=1&mobile=1&v=35n3");
const n3res = await n3.evaluate(() => {
  window.handleLiveEvent({ type: "chat", userId: "tt:sameid", username: "sameid", comment: "BJK" });
  const open = window.handleLiveEvent({ type: "gift", userId: "tt:sameid", username: "sameid", giftName: "rose", diamondCount: 1, repeatCount: 1, repeatEnd: false, eventId: "X" });
  const midDup = window.handleLiveEvent({ type: "gift", userId: "tt:sameid", username: "sameid", giftName: "rose", diamondCount: 1, repeatCount: 1, repeatEnd: false, eventId: "X" });
  const dOpen = window.__game.users.get("tt:sameid").diamonds;
  const fin = window.handleLiveEvent({ type: "gift", userId: "tt:sameid", username: "sameid", giftName: "rose", diamondCount: 1, repeatCount: 5, repeatEnd: true, eventId: "X" });
  const dFin = window.__game.users.get("tt:sameid").diamonds;
  const finDup = window.handleLiveEvent({ type: "gift", userId: "tt:sameid", username: "sameid", giftName: "rose", diamondCount: 1, repeatCount: 5, repeatEnd: true, eventId: "X" });
  const dFinDup = window.__game.users.get("tt:sameid").diamonds;

  window.handleLiveEvent({ type: "chat", userId: "tt:idless", username: "idless", comment: "FB" });
  const f1 = window.handleLiveEvent({ type: "gift", userId: "tt:idless", username: "idless", giftName: "rose", diamondCount: 1, repeatCount: 5, repeatEnd: true });
  const d1 = window.__game.users.get("tt:idless").diamonds;
  const f2 = window.handleLiveEvent({ type: "gift", userId: "tt:idless", username: "idless", giftName: "rose", diamondCount: 1, repeatCount: 3, repeatEnd: true });
  const d2 = window.__game.users.get("tt:idless").diamonds;

  window.handleLiveEvent({ type: "chat", userId: "tt:late", username: "late", comment: "BJK" });
  window.handleLiveEvent({ type: "gift", userId: "tt:late", username: "late", giftName: "heart", diamondCount: 1, repeatCount: 4, repeatEnd: true, eventId: "late-1" });
  const dLate1 = window.__game.users.get("tt:late").diamonds;
  const lateLower = window.handleLiveEvent({ type: "gift", userId: "tt:late", username: "late", giftName: "heart", diamondCount: 1, repeatCount: 2, repeatEnd: true, eventId: "late-2" });
  const dLate2 = window.__game.users.get("tt:late").diamonds;

  window.handleLiveEvent({ type: "chat", userId: "tt:miss", username: "miss", comment: "FB" });
  const openMiss = window.handleLiveEvent({ type: "gift", userId: "tt:miss", username: "miss", giftName: "rose", diamondCount: 1, repeatCount: 3, repeatEnd: false, eventId: "miss-1" });
  const dMissOpen = window.__game.users.get("tt:miss").diamonds;
  return {
    open: open.status, midDup: midDup.reason, dOpen, fin: fin.status, dFin, finDup: finDup.reason, dFinDup,
    f1: f1.status, d1, f2: f2.reason || f2.status, d2,
    dLate1, lateLower: lateLower.reason || lateLower.status, dLate2,
    openMiss: openMiss.status, dMissOpen, held: window.__game.giftStreaks.size,
  };
});
check("N3 same-id open then final credits once (x5)", n3res.dOpen === 0 && n3res.dFin === 5 && n3res.fin === "applied" && n3res.midDup === "duplicate" && n3res.finDup === "duplicate" && n3res.dFinDup === 5, JSON.stringify(n3res));
check("N3 ID-less repeated finals do not double-credit", n3res.d1 === 5 && n3res.d2 === 5 && n3res.f2 !== "applied", JSON.stringify(n3res));
check("N3 late lower-count after settlement does not add more", n3res.dLate1 === 4 && n3res.dLate2 === 4, JSON.stringify(n3res));
check("N3 missing final stays held until timeout path", n3res.openMiss === "held" && n3res.dMissOpen === 0 && n3res.held >= 1, JSON.stringify(n3res));
await n3.waitForTimeout(8500);
const n3to = await n3.evaluate(() => ({
  diamonds: window.__game.users.get("tt:miss").diamonds,
  held: window.__game.giftStreaks.size,
}));
check("N3 missing final settles once on timeout", n3to.diamonds === 3 && n3to.held === 0, JSON.stringify(n3to));
await n3.close();

/* N4: pending receipt wording depends on phase */
const n4 = await open(BASE + "/index.html?low=1&mobile=1&lang=en&v=35n4");
const n4lobby = await n4.evaluate(() => {
  window.__game.phase = "lobby";
  window.__game.roundStart = 0;
  window.handleLiveEvent({ type: "gift", userId: "tt:p1", username: "Pat", giftName: "rose", diamondCount: 1, eventId: "p1" });
  return { receipt: window.__lastReceipt(), phase: window.__game.phase };
});
check("N4 lobby pending receipt does not promise an action", /credit held/i.test(n4lobby.receipt) && !/take credit and the action/i.test(n4lobby.receipt) && !/end of this round/i.test(n4lobby.receipt), JSON.stringify(n4lobby));
const n4battle = await n4.evaluate(() => {
  window.__game.phase = "battle";
  window.__game.roundStart = performance.now();
  window.handleLiveEvent({ type: "gift", userId: "tt:p2", username: "Pam", giftName: "rose", diamondCount: 1, eventId: "p2" });
  return { receipt: window.__lastReceipt(), phase: window.__game.phase };
});
check("N4 battle pending receipt offers credit and the action", /take credit and the action/i.test(n4battle.receipt), JSON.stringify(n4battle));
await n4.close();

/* N5: host-test captain stays out of the public captain lane */
const n5 = await open(BASE + "/index.html?low=1&mobile=1&lang=en&v=35n5");
const n5res = await n5.evaluate(() => {
  window.handleLiveEvent({ type: "gift", userId: "local:host", username: "Host", giftName: "lion", diamondCount: 2999, source: "host" });
  window.handleLiveEvent({ type: "chat", userId: "local:host", username: "Host", comment: "FB", source: "host" });
  const u = window.__game.users.get("local:host");
  const caps = window.__captains();
  const board = window.__topCapos(4).map((x) => x.id);
  return {
    hostOnly: u && u.hostOnly,
    captainOf: u && u.captainOf,
    publicBlue: caps.blue && caps.blue.id,
    publicRed: caps.red && caps.red.id,
    board,
    diamonds: u && u.diamonds,
    testDiamonds: u && u.testDiamonds,
  };
});
check("N5 host-test captain is excluded from the public lane", n5res.hostOnly === true && n5res.publicBlue == null && n5res.publicRed == null && n5res.board.indexOf("local:host") === -1 && (n5res.diamonds || 0) === 0, JSON.stringify(n5res));
await n5.close();

/* N6: receipts never print raw kind 'small' */
const n6 = await open(BASE + "/index.html?low=1&mobile=1&lang=en&v=35n6");
const n6res = await n6.evaluate(() => {
  window.handleLiveEvent({ type: "gift", userId: "tt:rose34", username: "Rose34", diamondCount: 1, eventId: "s1" });
  const r1 = window.__lastReceipt();
  window.handleLiveEvent({ type: "gift", userId: "tt:rose34", username: "Rose34", giftName: "rose", diamondCount: 1, eventId: "s2" });
  const r2 = window.__lastReceipt();
  const label = window.__giftLabel({ kind: "small", giftName: "small" });
  return { r1, r2, label };
});
check("N6 receipts and labels use a display name, not raw 'small'", !/small/i.test(n6res.r1 + " " + n6res.r2 + " " + n6res.label) && /Gift|Rose|Hediye|Gül/i.test(n6res.r1 + n6res.r2 + n6res.label), JSON.stringify(n6res));
await n6.close();

/* N7: EN title is not under the language button */
async function titleClear(page, label) {
  const geo = await page.evaluate(() => {
    const title = document.getElementById("banner-title");
    const btn = document.getElementById("btn-lang");
    const tr = title.getBoundingClientRect();
    const br = btn.getBoundingClientRect();
    const overlap = !(tr.right < br.left || tr.left > br.right || tr.bottom < br.top || tr.top > br.bottom);
    return {
      overlap,
      title: title.textContent,
      t: { l: +tr.left.toFixed(1), r: +tr.right.toFixed(1), t: +tr.top.toFixed(1), b: +tr.bottom.toFixed(1) },
      b: { l: +br.left.toFixed(1), r: +br.right.toFixed(1), t: +br.top.toFixed(1), b: +br.bottom.toFixed(1) },
    };
  });
  check(label, geo.overlap === false && /DERBY DAY/i.test(geo.title), JSON.stringify(geo));
}
const n7m = await open(BASE + "/index.html?play=1&team=fb&name=QAPhone&lang=en&low=1&mobile=1&v=35n7m");
await titleClear(n7m, "N7 EN title clear of language button on phone 390x844");
await n7m.close();
const n7d = await open(BASE + "/index.html?play=1&team=fb&name=QAPhone&lang=en&low=1&mobile=1&v=35n7d", { width: 1280, height: 720 });
await titleClear(n7d, "N7 EN title clear of language button at 1280x720");
await n7d.close();

/* N8: auto-reconnect with backoff, manual button kept, honest states */
const n8 = await open(BASE + "/index.html?live=1&lang=en&low=1&mobile=1&connectms=250&v=35n8");
await n8.evaluate(() => {
  window.CONFIG.reconnectDelays = [80, 80, 80, 80, 80];
  window.CONFIG.maxAutoReconnect = 3;
});
await n8.waitForFunction(() => {
  const r = window.__reconnectState && window.__reconnectState();
  return r && (r.status === "RETRYING" || r.attempt >= 1);
}, { timeout: 8000 }).catch(() => {});
const n8mid = await n8.evaluate(() => {
  const r = window.__reconnectState();
  const btn = document.getElementById("btn-reconnect");
  const pill = document.getElementById("live-pill").textContent;
  return { r, pill, btnShow: btn && !btn.hidden, btnText: btn && btn.textContent };
});
check("N8 auto-retry is visible and stays honest", (n8mid.r.status === "RETRYING" || n8mid.r.status === "CONNECTING" || n8mid.r.status === "DISCONNECTED") && n8mid.r.status !== "LIVE" && n8mid.r.attempt >= 1, JSON.stringify(n8mid));
check("N8 Reconnect button remains available during retry", n8mid.btnShow === true || n8mid.r.status === "CONNECTING", JSON.stringify(n8mid));
await n8.waitForFunction(() => window.__reconnectState && window.__reconnectState().stopped === true, { timeout: 8000 }).catch(() => {});
const n8end = await n8.evaluate(() => {
  const r = window.__reconnectState();
  const btn = document.getElementById("btn-reconnect");
  return { r, btnShow: btn && !btn.hidden, last: document.getElementById("live-last").textContent };
});
check("N8 exhausted retries stay DISCONNECTED with manual button", n8end.r.stopped === true && n8end.r.status === "DISCONNECTED" && n8end.btnShow === true, JSON.stringify(n8end));
await n8.close();

/* N9: team-lock notice once per user */
const n9 = await open(BASE + "/index.html?low=1&mobile=1&lang=en&v=35n9");
const n9res = await n9.evaluate(() => {
  window.handleLiveEvent({ type: "chat", userId: "tt:lock", username: "Lee", comment: "BJK" });
  window.__game.phase = "battle";
  window.__game.roundStart = performance.now();
  const first = window.handleLiveEvent({ type: "chat", userId: "tt:lock", username: "Lee", comment: "FB" });
  const receipt1 = window.__lastReceipt();
  const u = window.__game.users.get("tt:lock");
  const second = window.handleLiveEvent({ type: "chat", userId: "tt:lock", username: "Lee", comment: "Fenerbahçe" });
  const receipt2 = window.__lastReceipt();
  return { team: u.team, lock: u.lockNotified, receipt1, receipt2, first, second };
});
check("N9 other-team chat shows the lock notice once and keeps the team", n9res.team === "red" && n9res.lock === true && /locked/i.test(n9res.receipt1) && n9res.receipt2 === n9res.receipt1, JSON.stringify(n9res));
await n9.close();

/* N10: readable super cooldown seconds */
const n10 = await open(BASE + "/index.html?play=1&team=red&name=CD&lang=en&low=1&mobile=1&v=35n10");
const n10res = await n10.evaluate(() => {
  window.__game.superUntil = performance.now() + 4500;
  window.__updateKapUI();
  const cd = document.getElementById("super-cd");
  const btn = document.getElementById("btn-super");
  const cs = cd ? getComputedStyle(cd) : null;
  const br = cd ? cd.getBoundingClientRect() : null;
  return {
    text: cd && cd.textContent,
    hidden: cd && cd.hidden,
    display: cs && cs.display,
    fontSize: cs && parseFloat(cs.fontSize),
    visible: !!(br && br.width > 0 && br.height > 0),
    height: br && +br.height.toFixed(1),
    hasCdClass: btn.classList.contains("cd"),
  };
});
check("N10 super cooldown shows a readable seconds cue", n10res.hasCdClass && n10res.visible && n10res.hidden === false && /[1-9]s/.test(n10res.text || "") && n10res.fontSize >= 16, JSON.stringify(n10res));
await n10.close();

/* N11: captain meter spendable at round end, not wasted */
const n11 = await open(BASE + "/index.html?play=1&team=red&name=Kap&lang=en&low=1&mobile=1&v=35n11");
const n11res = await n11.evaluate(() => {
  const u = window.__game.users.get(window.__game.heroId);
  window.__game.kapMeter = 100;
  window.__game.phase = "victory";
  window.__game.winner = "red";
  const pts0 = u.points || 0;
  window.__tryKaptan();
  const afterPress = { meter: window.__game.kapMeter, points: u.points, pts0 };
  window.__game.kapMeter = 100;
  window.__resetBattle();
  const carryFull = window.__game.kapMeter;
  window.__game.kapMeter = 80;
  window.__resetBattle();
  const carryPartial = window.__game.kapMeter;
  return { afterPress, carryFull, carryPartial };
});
check("N11 full meter can be spent in the result window", n11res.afterPress.meter === 0 && n11res.afterPress.points >= n11res.afterPress.pts0 + 100, JSON.stringify(n11res.afterPress));
check("N11 full meter is kept across a reset, partial carries half", n11res.carryFull === 100 && n11res.carryPartial === 40, JSON.stringify(n11res));
await n11.close();

/* Grammar: 1 fan, not 1 fans */
const g1 = await open(BASE + "/index.html?play=1&team=fb&name=Idle&lang=en&low=1&mobile=1&v=35g1");
const g1res = await g1.evaluate(() => {
  window.__stopBot && window.__stopBot();
  const bots = [...window.__game.users.values()].filter((u) => u.isBot);
  bots.forEach((u) => window.__removeUser(u.id, { promote: false }));
  // force a render
  const people = [...window.__game.users.values()].filter((u) => !u.isBot).length;
  const botN = [...window.__game.users.values()].filter((u) => u.isBot).length;
  const el = document.getElementById("counts");
  // trigger UI if needed by dispatching a no-op event through handleLiveEvent? call via debug
  return { people, botN, text: el ? el.textContent : "", pending: true };
});
const g1txt = await g1.evaluate(() => { window.__refreshUI(); return document.getElementById("counts").textContent; });
check("grammar: one player reads as 1 fan, not 1 fans", /1 fan /.test(g1txt) && !/1 fans/.test(g1txt), g1txt);
const g1b = await g1.evaluate(() => {
  // add two bots-like users
  window.handleLiveEvent({ type: "chat", userId: "bot:x", username: "BotX", comment: "BJK" });
  window.handleLiveEvent({ type: "chat", userId: "bot:y", username: "BotY", comment: "FB" });
  return true;
});
const g1btxt = await g1.evaluate(() => { window.__refreshUI(); return document.getElementById("counts").textContent; });
check("grammar: 1 fan + N bots is pluralised correctly", /1 fan \+ 2 bots/.test(g1btxt) && !/1 fans/.test(g1btxt), g1btxt);
await g1.close();

/* ============================================================
   v3.6  M1–M6 repros
   ============================================================ */

/* M1: Test toggle is a small unobtrusive pill at phone width */
const m1 = await open(BASE + "/index.html?play=1&team=fb&name=QA390&lang=en&low=1&mobile=1&v=36m1");
const m1geo = await m1.evaluate(() => {
  const btn = document.getElementById("btn-testet");
  const lang = document.getElementById("btn-lang");
  const br = btn.getBoundingClientRect();
  const lr = lang.getBoundingClientRect();
  const cs = getComputedStyle(btn);
  return {
    w: +br.width.toFixed(1), h: +br.height.toFixed(1),
    font: parseFloat(cs.fontSize),
    pad: cs.padding,
    langH: +lr.height.toFixed(1),
    text: btn.textContent.trim(),
  };
});
check("M1 Test toggle is a small header pill at 390px", m1geo.h <= 36 && m1geo.w <= 110 && m1geo.font <= 13 && m1geo.h <= m1geo.langH + 8, JSON.stringify(m1geo));
await m1.close();

/* M2: remaining panel strings follow the language */
const m2 = await open(BASE + "/index.html?play=1&team=fb&name=QA&lang=en&low=1&mobile=1&v=36m2");
const m2en = await m2.evaluate(() => ({
  rate: (document.getElementById("lbl-bot-rate") || {}).textContent,
  trace: (document.getElementById("event-trace") || {}).textContent,
  hint: (document.getElementById("panel-hint") || {}).textContent,
  fine: (document.getElementById("panel-fine") || {}).textContent,
  hide: (document.getElementById("hide-note") || {}).textContent,
}));
check("M2 English panel no longer leaves Turkish labels", /bot speed/i.test(m2en.rate || "") && /last outcome/i.test(m2en.trace || "") && !/son sonuç/i.test(m2en.trace || "") && !/hız/i.test(m2en.rate || ""), JSON.stringify(m2en));
await m2.evaluate(() => window.toggleLang());
const m2tr = await m2.evaluate(() => ({
  rate: (document.getElementById("lbl-bot-rate") || {}).textContent,
  trace: (document.getElementById("event-trace") || {}).textContent,
}));
check("M2 Turkish panel keeps Bot hızı / son sonuç", /hız/i.test(m2tr.rate || "") && /son sonuç/i.test(m2tr.trace || ""), JSON.stringify(m2tr));
await m2.close();

/* M3: session credit survives avatar rotation */
const m3 = await open(BASE + "/index.html?low=1&mobile=1&lang=en&v=36m3");
const m3res = await m3.evaluate(() => {
  window.__stopBot && window.__stopBot();
  for (const id of [...window.__game.users.keys()]) window.__removeUser(id, { promote: false, receipt: false });
  if (window.__game.ledger) window.__game.ledger.clear();
  if (window.__game.waitlist) window.__game.waitlist.clear();
  window.CONFIG.maxFans = 3;
  window.handleLiveEvent({ type: "chat", userId: "tt:gifter", username: "Gifter", comment: "BJK" });
  window.handleLiveEvent({ type: "gift", userId: "tt:gifter", username: "Gifter", giftName: "rose", diamondCount: 10, eventId: "g-m3" });
  window.handleLiveEvent({ type: "chat", userId: "tt:a", username: "StrongA", comment: "BJK" });
  window.handleLiveEvent({ type: "chat", userId: "tt:b", username: "StrongB", comment: "FB" });
  const a = window.__game.users.get("tt:a");
  const b = window.__game.users.get("tt:b");
  a.sessionHits = 100; b.sessionHits = 100;
  const gifterBefore = window.__game.users.get("tt:gifter").diamonds;
  window.handleLiveEvent({ type: "chat", userId: "tt:wait", username: "WaitA", comment: "FB" });
  const waitSize = window.__game.waitlist.size;
  const evicted = window.__evictForWaitlist();
  const rotReceipt = window.__lastReceipt && window.__lastReceipt();
  const entered = window.__promoteWaitlist();
  const gifterUser = window.__game.users.get("tt:gifter");
  const ledger = (window.__ledger() || []).map(([id, rec]) => ({ id, diamonds: rec.diamonds, name: rec.name }));
  const board = window.__topCapos(4).map((x) => ({ id: x.id, diamonds: x.diamonds }));
  const receipt = rotReceipt;
  const ids = [...window.__game.users.keys()];
  return { gifterBefore, evicted, entered, gifterUser: !!gifterUser, ledger, board, receipt, waitSize, ids };
});
const m3kept = (m3res.ledger || []).find((x) => x.id === "tt:gifter") || (m3res.board || []).find((x) => x.id === "tt:gifter");
check("M3 gifted-idle viewer can be rotated but session credit is kept", !m3res.gifterUser && m3kept && m3kept.diamonds === 10 && m3res.gifterBefore === 10, JSON.stringify(m3res));
check("M3 rotation is receipted and the gift board still lists them", /session credit is kept|credit is kept|oturum kredisi/i.test(m3res.receipt || "") && (m3res.board || []).some((x) => x.id === "tt:gifter" && x.diamonds === 10), JSON.stringify(m3res));
const m3back = await m3.evaluate(() => {
  // capacity is still full after promotion; free a slot then rejoin
  window.__removeUser("tt:wait", { promote: false, receipt: false });
  window.handleLiveEvent({ type: "chat", userId: "tt:gifter", username: "Gifter", comment: "BJK" });
  const u = window.__game.users.get("tt:gifter");
  const ledgerHas = (window.__ledger() || []).some(([id]) => id === "tt:gifter");
  return { diamonds: u && u.diamonds, inUsers: !!u, ledgerHas };
});
check("M3 rejoining restores the same session credit", m3back.inUsers === true && m3back.diamonds === 10 && m3back.ledgerHas === false, JSON.stringify(m3back));
await m3.close();

/* M4: host tests do not rotate real viewers */
const m4 = await open(BASE + "/index.html?low=1&mobile=1&lang=en&v=36m4");
const m4res = await m4.evaluate(() => {
  window.__stopBot && window.__stopBot();
  for (const id of [...window.__game.users.keys()]) window.__removeUser(id, { promote: false, receipt: false });
  if (window.__game.ledger) window.__game.ledger.clear();
  if (window.__game.waitlist) window.__game.waitlist.clear();
  window.CONFIG.maxFans = 3;
  for (const [id, name, c] of [["tt:v1","View1","BJK"],["tt:v2","View2","BJK"],["tt:v3","View3","FB"]]) {
    window.handleLiveEvent({ type: "chat", userId: id, username: name, comment: c });
  }
  const before = [...window.__game.users.keys()].sort();
  const host = window.handleLiveEvent({ type: "chat", userId: "local:host", username: "Host", comment: "FB", source: "host" });
  const waitHasHost = window.__game.waitlist.has("local:host");
  const evicted = window.__evictForWaitlist();
  window.__resetBattle();
  const after = [...window.__game.users.keys()].sort();
  const hostJoined = window.__game.users.has("local:host");
  return { before, after, host, waitHasHost, evicted, hostJoined, same: JSON.stringify(before) === JSON.stringify(after) };
});
check("M4 host test at capacity is not waitlisted for viewer rotation", m4res.host && m4res.host.reason === "capacity-host" && m4res.waitHasHost === false && m4res.hostJoined === false, JSON.stringify(m4res));
check("M4 round boundary does not remove real viewers for a host test", m4res.same === true && m4res.evicted === 0 && m4res.after.length === 3, JSON.stringify(m4res));
await m4.close();

/* M5: MVP strip does not overlap the arena label behind the end card */
const m5 = await open(BASE + "/index.html?play=1&team=fb&name=QA390&lang=en&low=1&mobile=1&v=36m5");
const m5res = await m5.evaluate(() => {
  const u = window.__game.users.get(window.__game.heroId);
  window.__game.line = -0.2;
  window.__endWin("blue");
  // simulate an MVP strip still visible, then show the end card
  if (typeof window.__showEndCard === "function") window.__showEndCard();
  const mvp = document.getElementById("mvp");
  const meters = document.getElementById("meters");
  const end = document.getElementById("end-card");
  const cs = mvp ? getComputedStyle(mvp) : null;
  const shown = !!(cs && cs.display !== "none" && cs.visibility !== "hidden" && mvp.classList.contains("show"));
  let overlap = false;
  if (shown && meters) {
    const a = mvp.getBoundingClientRect(), b = meters.getBoundingClientRect();
    overlap = !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
  }
  return { shown, overlap, display: cs && cs.display, endShow: end && end.classList.contains("show") };
});
check("M5 MVP strip is hidden while the end card is up", m5res.endShow === true && m5res.shown === false && m5res.overlap === false, JSON.stringify(m5res));
await m5.close();

/* M6: captain meter resets on New Match and the rule is documented */
const m6 = await open(BASE + "/index.html?play=1&team=red&name=Kap&lang=en&low=1&mobile=1&v=36m6");
const m6res = await m6.evaluate(() => {
  window.__game.kapMeter = 80;
  window.__resetMatch();
  const rule = (document.getElementById("rule-meter") || {}).textContent || "";
  return { meter: window.__game.kapMeter, rule };
});
check("M6 New Match resets the captain meter", m6res.meter === 0, JSON.stringify(m6res));
check("M6 meter-scope rule is in How to Play", /new match/i.test(m6res.rule) && /resets/i.test(m6res.rule), JSON.stringify(m6res.rule));
await m6.close();

/* EN grammar: joined Fenerbahçe, not 'the Fenerbahçe' */
const gr = await open(BASE + "/index.html?low=1&mobile=1&lang=en&v=36gr");
const grr = await gr.evaluate(() => {
  window.handleLiveEvent({ type: "chat", userId: "tt:fbjoin", username: "Idle", comment: "FB" });
  const log = [...document.querySelectorAll("#log .log-item")].map((n) => n.textContent).join(" | ");
  const receipt = window.__lastReceipt && window.__lastReceipt();
  return { log, receipt };
});
check("grammar: joined Fenerbahçe without a stray 'the'", /joined Fenerbahçe/i.test(grr.log + " " + (grr.receipt || "")) && !/the Fenerbahçe/i.test(grr.log + " " + (grr.receipt || "")), JSON.stringify(grr));
await gr.close();

/* -------------------- v3.7 P1–P6, capture, clock, OG -------------------- */
const pReplay = await open(BASE + "/index.html?play=1&team=red&name=Replay&mobile=1&low=1&lang=en&v=37rep");
await runReplayHarness(pReplay, check);
await pReplay.close();

const cap = await open(BASE + "/index.html?live=1&capture=1&connectms=1&mobile=1&low=1&lang=en&v=37cap");
const capRes = await cap.evaluate(() => {
  const panel = document.getElementById("capture-panel");
  const shown = !!(panel && !panel.hidden && (panel.classList.contains("show") || getComputedStyle(panel).display !== "none"));
  const dl = document.getElementById("btn-capture-dl");
  const cp = document.getElementById("btn-capture-copy");
  window.handleLiveEvent({ type: "chat", userId: "tt:cap", username: "Cap", comment: "BJK" });
  const bundle = window.__captureBundle && window.__captureBundle();
  const kinds = (bundle && bundle.events || []).map((e) => e.kind);
  const status = window.__game.liveStatus;
  return {
    shown,
    dl: !!(dl && /download capture/i.test(dl.textContent)),
    cp: !!(cp && /clipboard/i.test(cp.textContent)),
    n: bundle && bundle.events && bundle.events.length,
    kinds,
    hasMapped: kinds.includes("mapped-event") || kinds.includes("handle-result"),
    hasStatus: kinds.includes("status"),
    version: bundle && bundle.version,
    status,
    claimedLive: status === "live" || status === "LIVE"
  };
});
check("P-capture panel is visible on ?live=1&capture=1", capRes.shown && capRes.dl && capRes.cp, JSON.stringify(capRes));
check("P-capture records status and mapped events", capRes.n >= 1 && capRes.hasMapped && capRes.version === "v3.7", JSON.stringify(capRes));
check("P-capture does not claim LIVE without a feed", capRes.claimedLive === false, JSON.stringify(capRes));
await cap.close();

const p1 = await open(BASE + "/index.html?play=1&team=red&name=Share&mobile=1&low=1&lang=en&v=37p1");
await p1.evaluate(() => {
  window.__endWin("red");
  window.navigator.share = () => Promise.reject(new Error("share cancelled"));
});
await p1.waitForTimeout(200);
await p1.click("#btn-share");
await p1.waitForTimeout(200);
const p1res = await p1.evaluate(() => {
  const box = document.getElementById("share-fallback");
  const msg = (document.getElementById("share-fallback-msg") || {}).textContent || "";
  const url = (document.getElementById("share-url") || {}).value || "";
  const copy = (document.getElementById("btn-share-copy") || {}).textContent || "";
  const cs = box && getComputedStyle(box);
  const shown = !!(box && !box.hidden && cs && cs.display !== "none");
  return { shown, msg, url, copy, title: document.title };
});
check("P1 share fallback is visible in English when share fails", p1res.shown && /copy the link|couldn't share|link copied/i.test(p1res.msg) && /copy link/i.test(p1res.copy) && /derbi-gunu|127\.0\.0\.1|index/i.test(p1res.url), JSON.stringify(p1res));
await p1.close();

const p2 = await open(BASE + "/index.html?low=1&mobile=1&v=37og");
const p2res = await p2.evaluate(() => {
  const g = (p) => (document.querySelector('meta[property="' + p + '"]') || document.querySelector('meta[name="' + p + '"]') || {}).content || "";
  return {
    ogTitle: g("og:title"),
    ogUrl: g("og:url"),
    ogImage: g("og:image"),
    ogDesc: g("og:description"),
    twCard: g("twitter:card"),
    twImage: g("twitter:image"),
    version: window.GAME_VERSION || (window.__game && window.__game.version)
  };
});
check("P2 Open Graph tags use absolute Pages URLs", /^https:\/\/sebblackhill-rgb\.github\.io\/derbi-gunu\/?$/.test(p2res.ogUrl) && /^https:\/\/sebblackhill-rgb\.github\.io\/derbi-gunu\/og\.png$/.test(p2res.ogImage) && /Derbi/.test(p2res.ogTitle), JSON.stringify(p2res));
check("P2 Twitter card is summary_large_image with the same image", p2res.twCard === "summary_large_image" && p2res.twImage === p2res.ogImage, JSON.stringify(p2res));
await p2.close();

const p3 = await open(BASE + "/index.html?play=1&team=red&name=Clock&mobile=1&low=1&v=37p3");
const p3res = await p3.evaluate(() => {
  const g = window.__game;
  const cfg = window.CONFIG;
  cfg.roundSecs = 8;
  g.roundStart = performance.now() - 9000;
  g.pauseAccum = 0;
  window.__maybeEndOnTime(performance.now());
  const endedEarly = g.phase === "victory" || g.phase === "match";
  // visibility path: start a fresh round and pretend a minute passed while hidden
  window.__resetBattle();
  cfg.roundSecs = 8;
  g.roundStart = performance.now() - 10000;
  Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
  Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "hidden" });
  document.dispatchEvent(new Event("visibilitychange"));
  window.__maybeEndOnTime(performance.now());
  return { endedEarly, phase2: g.phase, elapsed: window.__battleElapsed(performance.now()) };
});
check("P3 wall-clock ends the round from elapsed performance.now", p3res.endedEarly === true, JSON.stringify(p3res));
check("P3 hidden-tab visibility path ends an overdue round", p3res.phase2 === "victory" || p3res.phase2 === "match", JSON.stringify(p3res));
await p3.close();

const p4 = await open(BASE + "/index.html?play=1&team=red&name=Cap&mobile=1&low=1&lang=en&v=37p4");
const p4res = await p4.evaluate(() => {
  const g = window.__game;
  g.kapMeter = 100;
  window.__updateKapUI();
  const ready = document.getElementById("btn-kaptan");
  const before = { disabled: ready.disabled, text: ready.innerText };
  window.__tryKaptan();
  window.__updateKapUI();
  const btn = document.getElementById("btn-kaptan");
  return { before, disabled: btn.disabled, text: (btn.innerText || "").replace(/\\s+/g, " ").trim(), aria: btn.getAttribute("aria-disabled"), isCap: btn.classList.contains("is-captain") };
});
check("P4 captain button disables and shows YOU ARE CAPTAIN after a successful press", p4res.disabled === true && /YOU ARE CAPTAIN/i.test(p4res.text) && p4res.isCap === true, JSON.stringify(p4res));
await p4.close();

const p5 = await open(BASE + "/index.html?play=1&team=red&name=Board&mobile=1&low=1&lang=en&v=37p5");
const p5res = await p5.evaluate(() => {
  window.__refreshUI && window.__refreshUI();
  const board = document.getElementById("board");
  const tog = document.getElementById("board-toggle");
  const body = document.getElementById("board-body");
  const cs = board && getComputedStyle(board);
  const bcs = body && getComputedStyle(body);
  const tcs = tog && getComputedStyle(tog);
  return {
    collapsed: board && board.classList.contains("collapsed"),
    boardDisplay: cs && cs.display,
    bodyDisplay: bcs && bcs.display,
    togDisplay: tcs && tcs.display,
    togText: tog && tog.textContent
  };
});
check("P5 phone boards start collapsed behind a compact chip", p5res.collapsed === true && p5res.boardDisplay !== "none" && p5res.bodyDisplay === "none" && p5res.togDisplay === "block", JSON.stringify(p5res));
await p5.close();

const p6 = await open(BASE + "/index.html?play=1&team=red&name=Super&mobile=1&low=1&lang=en&v=37p6");
const p6res = await p6.evaluate(() => {
  const g = window.__game;
  g.superUntil = performance.now() + 3500;
  window.__updateKapUI();
  const btn = document.getElementById("btn-super");
  const cd = document.getElementById("super-cd");
  const label = document.getElementById("super-label");
  const cs = cd && getComputedStyle(cd);
  return {
    text: (btn && btn.textContent || "").replace(/\\s+/g, " ").trim(),
    label: label && label.textContent,
    cd: cd && cd.textContent,
    cdDisplay: cs && cs.display,
    aria: btn && btn.getAttribute("aria-label")
  };
});
check("P6 super label and countdown stay separated in textContent", /SUPER MOVE \d+s/.test(p6res.text) && p6res.cdDisplay === "block" && /SUPER MOVE \d+s/.test(p6res.aria || p6res.text) && p6res.label.includes("SUPER") && p6res.label.includes("MOVE"), JSON.stringify(p6res));
await p6.close();

const rules = await open(BASE + "/index.html?mobile=1&low=1&lang=en&v=37rules");
const rulesRes = await rules.evaluate(() => {
  const p = document.querySelector("#start-screen #pick-rules p");
  const box = document.getElementById("pick-rules");
  const fs = p && parseFloat(getComputedStyle(p).fontSize);
  const bfs = box && parseFloat(getComputedStyle(box).fontSize);
  return { fs, bfs, text: box && box.innerText };
});
check("phone rules card uses at least 14px type", rulesRes.fs >= 14, JSON.stringify(rulesRes));
await rules.close();

await browser.close();

const failed = results.filter((r) => !r.ok);
console.log("\n" + results.filter((r) => r.ok).length + " passed, " + failed.length + " failed, " + results.length + " total");
if (failed.length) {
  failed.forEach((f) => console.log("  FAIL  " + f.name + " — " + f.detail));
  process.exit(1);
}
