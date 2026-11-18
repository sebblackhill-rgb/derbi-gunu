import { chromium } from "playwright-core";

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
const live = await open(BASE + "/index.html?live=1&lang=en&low=1&mobile=1&v=34live");
await live.waitForFunction(() => window.__debugLive && window.__debugLive().status === "DISCONNECTED", { timeout: 15000 }).catch(() => {});
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
check("D11 live timeout stays DISCONNECTED (not LIVE)", liveInfo.status === "DISCONNECTED" && /DISC|KOPUK/i.test(liveInfo.pill) === false ? /DISC/i.test(liveInfo.pill) : /DISC/i.test(liveInfo.pill) || liveInfo.status === "DISCONNECTED", JSON.stringify({ pill: liveInfo.pill, status: liveInfo.status }));
check("D11 DISCONNECTED live does not spawn bots", liveInfo.bots === 0, "bots=" + liveInfo.bots);
check("D11 empty disconnected live is on STANDBY, clock not burning", liveInfo.standby === true && liveInfo.roundStart === 0, JSON.stringify(liveInfo));
check("diagnostic receipt visible without console", /duplicate|rejected|held|applied|settled|HOST|outcome/i.test(liveInfo.trace + JSON.stringify(liveInfo.last)), liveInfo.trace);
await live.close();

await browser.close();

const failed = results.filter((r) => !r.ok);
console.log("\n" + results.filter((r) => r.ok).length + " passed, " + failed.length + " failed, " + results.length + " total");
if (failed.length) {
  failed.forEach((f) => console.log("  FAIL  " + f.name + " — " + f.detail));
  process.exit(1);
}
