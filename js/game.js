import * as THREE from "three";
import { GLTFLoader } from "../lib/GLTFLoader.js";
import { clone as cloneSkinned } from "../lib/SkeletonUtils.js";

const CONFIG = {
  lang: "tr",
  teams: {
    red: {
      id: "red",
      name: "Beşiktaş",
      nameTR: "Beşiktaş",
      short: "BJK",
      keywords: ["BJK", "BESIKTAS", "BEŞİKTAŞ", "BESIKTAŞ", "BEŞIKTAS", "KARTAL", "KARAKARTAL", "KARA KARTAL", "⚫⚪", "⚪⚫", "⚫", "⚪"],
      colors: {
        primary: 0x141414, secondary: 0xf3f3f0, dark: 0x000000,
        kit: 0x1a1a1a, kit2: 0xf0f0ee, shorts: 0xf3f3f0, flag: 0x141414
      }
    },
    blue: {
      id: "blue",
      name: "Fenerbahçe",
      nameTR: "Fenerbahçe",
      short: "FB",
      keywords: ["FENERBAHCE", "FENERBAHÇE", "FENERBAHCE", "FENER", "FB", "KANARYA", "💛💙", "💙💛", "💛", "💙"],
      colors: {
        primary: 0x0a2850, secondary: 0xffd000, dark: 0x061830,
        kit: 0x0a2850, kit2: 0xffd000, shorts: 0xf3f3f0, flag: 0x0a2850
      }
    }
  },
  capoThreshold: 250,
  captainGift: 1000,
  version: "v3.7",
  maxFans: 80,
  maxLabels: 15,
  drawBand: 0.02, // timeout: |line| < this → draw; otherwise the side the line favours wins
  waitlistPromotePerRound: 8,
  reconnectDelays: [2000, 4000, 8000, 16000, 16000],
  maxAutoReconnect: 5,
  connectTimeout: 6000,
  streetHalf: 8,
  roundSecs: 90,
  strings: {
    en: {
      title: "DERBY DAY · BEŞİKTAŞ STREETS",
      r1k: "Join the ranks", r1h: "Type BJK or FB",
      r2k: "Shove the line", r2h: "Comment to swing · 🌹 Rose",
      hint: "250 🌹 = CAPO  ·  1000 gift = CAPTAIN  ·  🦁 Lion = TIFO STORM",
      square: "THE SQUARE",
      fans: "{n} fans in the street",
      captain: "CAPTAIN",
      captainNeed: "Send a 1000 gift to become CAPTAIN",
      capos: "CAPOS",
      hits: "MOST HITS",
      newCapo: "NEW CAPTAIN: {name}",
      newCapoSub: "{name} leads the charge!",
      tifo: "TIFO STORM!",
      tifoSub: "{name} blasted the front line!",
      winBjk: "BEŞİKTAŞ TAKE THE SQUARE!",
      winFb: "FENERBAHÇE TAKE THE SQUARE!",
      win: "{team} TAKE THE SQUARE!",
      winSub: "The street is theirs!",
      testBtn: "Test", testClose: "Close",
      panelBadge: "TEST PANEL",
      panelHint: "H hide · L language · M sound",
      sendBtn: "Send comment",
      botLabel: "Bot crowd",
      logJoin: "{name} joined {team}!",
      logChant: "{name} piled in!",
      logRose: "{name} sent a Rose! · capo {have}/{need}",
      logHeart: "{name} sent a Heart! · capo {have}/{need}",
      logGift: "{name} sent a gift! · capo {have}/{need}",
      logLion: "{name} sent a Lion!",
      logCaptain: "{name} became CAPTAIN! ({n})",
      logWin: "{team} take the square!",
      logHit: "{a} {sfx} {b}",
      welcome: "@{name} joined! {emoji}",
      join1: "Type BJK or FB → enter the square",
      join2: "Comment = a hit",
      join3: "🌹 = super move",
      join4: "1000 💎 = CAPTAIN",
      superMove: "SUPER MOVE!",
      superMoveSub: "{name} goes in!",
      newCapo: "NEW CAPTAIN: {name}",
      mvpTitle: "MVP OF THE ROUND",
      nextRound: "Next round in {n}",
      timeUp: "TIME'S UP!",
      pickTitle: "Pick your team",
      pickSub: "Enter the square, tap to hit, take the derby!",
      tapHint: "Tap the screen → hit!",
      superBtn: "SUPER MOVE",
      kapBtn: "BECOME CAPTAIN",
      endWin: "THE SQUARE IS YOURS!",
      endLose: "Next time!",
      endDraw: "IT'S A DRAW!",
      yourHits: "Hits",
      yourKOs: "Knockouts",
      yourRank: "Rank",
      playAgain: "Play again",
      share: "Share with a friend",
      combo: "COMBO x{n}",
      fansSplit: "{n} fans + {b} bots",
      points: "pts",
      kapBtnPts: "BECOME CAPTAIN",
      pendingGift: "@{name} sent {gift} — type BJK or FB to join!",
      pendingLike: "@{name} sent a Like — type BJK or FB to join!",
      pendingChat: "@{name} — type BJK or FB to join!",
      receiptJoin: "@{name} joined {team}!",
      receiptPush: "@{name} shoved the line!",
      lastEvent: "last event {ago}: @{name} {kind}",
      lastEventNone: "no events yet",
      reconnect: "Reconnect",
      statusSolo: "SOLO",
      statusDemo: "DEMO",
      statusConnecting: "CONNECTING",
      statusLive: "LIVE",
      statusDisconnected: "DISCONNECTED",
      drawSub: "The square stays contested.",
      logDraw: "It's a draw!",
      matchWin: "{team} WIN THE MATCH!",
      matchSub: "Best of five: {score}",
      newMatch: "New match",
      contrib: "HITS & LIKES",
      giftsBoard: "GIFTS",
      panelUser: "Username",
      panelComment: "Comment",
      btnLike: "❤️ Like",
      btnRose: "🌹 Rose",
      btnMed: "🎁 Medium gift",
      btnLion: "🦁 Lion gift",
      panelFine: "Host simulation only — not a real gift or stream event. Play by picking a team. handleLiveEvent() · ?demo=1 bots · ?live=1 Playroom TikTok.",
      loadTitle: "Loading the derby...",
      loadScene: "Building the street",
      loadFans: "Loading supporters...",
      loadReady: "Ready!",
      loadErr: "Load failed",
      yourName: "YOUR NAME",
      langBtn: "EN",
      rulesTitle: "How it works",
      rulesWin: "Win: take the square (bar or time). Match is best of five, first to 3.",
      rulesLock: "Team is locked for the whole match.",
      rulesActions: "Solo: tap to attack. Live: a comment requests an attack. 🌹 = super move. 🦁 = tifo + captain.",
      rulesRewards: "Gifts = supporter recognition (💎). Hits & likes = participation. Solo captain meter = points, never fake diamonds.",
      rulesScope: "Boards show this ROUND unless labelled match or session.",
      scopeRound: "round",
      scopeMatch: "match",
      scopeSession: "session",
      boardGiftsHelp: "Verified gifts this session (host tests excluded)",
      boardHitsHelp: "Participation this round (hits · likes)",
      boardPointsHelp: "Solo points (session)",
      rankNone: "—",
      rankHint: "Ranked only when two or more participants recorded an action.",
      lossSummary: "Hits {hits} · knockouts {kos} · territory {line}",
      standby: "STANDBY",
      botEvents: "Synthetic events",
      botEventsHint: "When off, existing AI may still fight; no new fake comments or gifts are sent.",
      kapHint: "Fill the meter with taps. At 100 you become captain and earn 100 points — not gift diamonds.",
      kapCue: "{n}%",
      superCd: "{n}s",
      diagApplied: "applied",
      diagHeld: "held",
      diagSettled: "settled",
      diagRejected: "rejected",
      diagCapacity: "street full — credit held, no new avatar",
      diagDuplicate: "duplicate event — no extra credit",
      diagHost: "HOST TEST",
      pendingGiftAction: "@{name} sent {gift} — join with BJK or FB to take credit and the action",
      pendingGiftCredit: "@{name} sent {gift} — credit held; type BJK or FB to claim it",
      pendingGiftLobby: "@{name} sent {gift} — credit held; type BJK or FB to claim it",
      pendingSettledAction: "@{name} settled: {gift} credit + action",
      pendingSettledCredit: "@{name} settled: {gift} credit (action expired with the round)",
      testLedger: "test {n} 💎 (not on the gift board)",
      eventTrace: "last outcome",
      teamLocked: "Team locked for this match",
      endTerritory: "Territory",
      endPoints: "Points (session)",
      endRoundHits: "Round hits",
      matchContrib: "Match score {score}",
      tryAgain: "Play the next round",
      reducedFx: "Reduce flash",
      giftBoardEmpty: "—",
      fansOne: "{n} fan in the street",
      fansSplitOne: "{n} fan + {b} {bots}",
      botsOne: "bot",
      botsMany: "bots",
      teamWin: "YOUR TEAM TOOK THE SQUARE",
      idleWinNote: "You didn't record a hit this round. The square was held by your side.",
      timeoutRule: "On the clock: a draw is only called within 2% of centre; otherwise the side holding the line wins.",
      receiptPromoted: "@{name} entered from the queue into {team}!",
      statusRetrying: "RETRYING",
      retryingIn: "retry {n}/{max} in {s}s",
      reconnectStopped: "auto-retry stopped — press Reconnect",
      gift_small: "Gift",
      gift_rose: "Rose",
      gift_heart: "Heart",
      gift_medium: "Medium gift",
      gift_lion: "Lion",
      botRate: "Bot speed",
      hideNote: "Press H to open the panel",
      receiptRotated: "@{name} left the square to make room — session credit is kept",
      rulesMeter: "Captain meter: press at 100% in battle or the result window. A full meter carries to the next round; a partial meter carries half. The meter resets at the start of a new match.",
      diagCapacityHost: "street full — host test held as credit only, no viewer rotation",
      shareTitle: "Derbi Günü",
      shareText: "Derbi Günü — Beşiktaş vs Fenerbahçe. Pick your team, take the square!",
      shareCopied: "Link copied!",
      shareFailed: "Couldn't share automatically. Copy the link below.",
      shareCopyBtn: "Copy link",
      shareClose: "OK",
      youAreCaptain: "YOU ARE CAPTAIN",
      boardToggle: "Boards",
      boardHide: "Hide boards",
      captureTitle: "Payload capture",
      captureCount: "{n} events",
      captureDownload: "Download capture (JSON)",
      captureCopy: "Copy to clipboard",
      captureCopied: "Capture copied!",
      captureHint: "Recording raw live events. Keep this tab open during the test stream, then download the file."
    },
    tr: {
      title: "DERBİ GÜNÜ · BEŞİKTAŞ ÇARŞI",
      r1k: "Saflara katıl", r1h: "BJK veya FB yaz",
      r2k: "Hattı it", r2h: "Yorumla vur · 🌹 Gül",
      hint: "250 🌹 atan KAPO  ·  1000 hediye = KAPTAN  ·  🦁 Aslan = TİFO FIRTINASI",
      square: "MEYDAN",
      fans: "Sokakta {n} kişi",
      captain: "KAPTAN",
      captainNeed: "KAPTAN olmak için 1000'lik hediye gönder",
      capos: "KAPOLAR",
      hits: "EN ÇOK VURUŞ",
      newCapo: "YENİ KAPTAN: {name}",
      newCapoSub: "{name} hücuma öncülük ediyor!",
      tifo: "TİFO FIRTINASI!",
      tifoSub: "{name} hattı yardı!",
      winBjk: "MEYDAN BEŞİKTAŞ'IN!",
      winFb: "MEYDAN FENERBAHÇE'NİN!",
      win: "MEYDAN {team}'IN!",
      winSub: "Meydan onların!",
      testBtn: "Test et", testClose: "Kapat",
      panelBadge: "TEST",
      panelHint: "H gizle · L dil · M ses",
      sendBtn: "Yorum gönder",
      botLabel: "Bot kalabalık",
      logJoin: "{name} {team} saflarına katıldı!",
      logChant: "{name} daldı!",
      logRose: "{name} Gül attı! · kapo {have}/{need}",
      logHeart: "{name} Kalp attı! · kapo {have}/{need}",
      logGift: "{name} hediye attı! · kapo {have}/{need}",
      logLion: "{name} Aslan attı!",
      logCaptain: "{name} KAPTAN oldu! ({n})",
      logWin: "{team} meydanı aldı!",
      logHit: "{a} {sfx} {b}",
      welcome: "@{name} katıldı! {emoji}",
      join1: "BJK veya FB yaz → sahaya gir",
      join2: "Yorum = vuruş",
      join3: "🌹 = süper hamle",
      join4: "1000 💎 = KAPTAN",
      superMove: "SÜPER HAMLE!",
      superMoveSub: "{name} daldı!",
      mvpTitle: "RAUNDUN MVP'Sİ",
      nextRound: "Yeni raund {n}",
      timeUp: "SÜRE BİTTİ!",
      pickTitle: "Takımını seç",
      pickSub: "Sahaya çık, rakibe dokun, meydanı kap!",
      tapHint: "Ekrana dokun → vur!",
      superBtn: "SÜPER HAMLE",
      kapBtn: "KAPTAN OL",
      endWin: "MEYDAN SENİN!",
      endLose: "Bir dahaki sefere!",
      endDraw: "BERABERE!",
      yourHits: "Vuruş",
      yourKOs: "Nakavt",
      yourRank: "Sıra",
      playAgain: "Tekrar oyna",
      share: "Arkadaşına gönder",
      combo: "KOMBO x{n}",
      fansSplit: "{n} kişi + {b} bot",
      points: "puan",
      kapBtnPts: "KAPTAN OL",
      pendingGift: "@{name} {gift} gönderdi — katılmak için BJK veya FB yaz!",
      pendingLike: "@{name} Like gönderdi — katılmak için BJK veya FB yaz!",
      pendingChat: "@{name} — katılmak için BJK veya FB yaz!",
      receiptJoin: "@{name} {team}'ye katıldı",
      receiptPush: "@{name} hattı itti!",
      lastEvent: "son olay {ago}: @{name} {kind}",
      lastEventNone: "henüz olay yok",
      reconnect: "Yeniden bağlan",
      statusSolo: "SOLO",
      statusDemo: "DEMO",
      statusConnecting: "BAĞLANIYOR",
      statusLive: "CANLI",
      statusDisconnected: "KOPUK",
      drawSub: "Meydan hâlâ çekişmeli.",
      logDraw: "Berabere!",
      matchWin: "MAÇ {team}'IN!",
      matchSub: "Beşte üç: {score}",
      newMatch: "Yeni maç",
      contrib: "VURUŞ & LIKE",
      giftsBoard: "HEDİYELER",
      panelUser: "Kullanıcı adı",
      panelComment: "Yorum",
      btnLike: "❤️ Like",
      btnRose: "🌹 Gül",
      btnMed: "🎁 Orta hediye",
      btnLion: "🦁 Aslan hediye",
      panelFine: "Yalnızca ev sahibi simülasyonu — gerçek hediye veya yayın olayı değil. Oynamak için takımını seç. handleLiveEvent() · ?demo=1 botlar · ?live=1 Playroom TikTok.",
      loadTitle: "Derbi yükleniyor...",
      loadScene: "Sahne hazırlanıyor",
      loadFans: "Taraftarlar yükleniyor...",
      loadReady: "Hazır!",
      loadErr: "Yükleme hatası",
      yourName: "ADIN",
      langBtn: "TR",
      rulesTitle: "Nasıl oynanır",
      rulesWin: "Kazanma: meydanı kap (bar veya süre). Maç beşte üç, ilk 3 alan alır.",
      rulesLock: "Takım maç boyunca kilitli.",
      rulesActions: "Solo: dokunarak vur. Canlı: yorum bir vuruş ister. 🌹 = süper hamle. 🦁 = tifo + kaptan.",
      rulesRewards: "Hediyeler = taraftar tanınması (💎). Vuruş ve like = katılım. Solo kaptan ölçeri = puan, sahte elmas değil.",
      rulesScope: "Tablolar aksi yazılmadıkça bu RAUNDU gösterir.",
      scopeRound: "raund",
      scopeMatch: "maç",
      scopeSession: "oturum",
      boardGiftsHelp: "Doğrulanmış hediyeler (oturum; ev sahibi testleri hariç)",
      boardHitsHelp: "Bu raunddaki katılım (vuruş · like)",
      boardPointsHelp: "Solo puan (oturum)",
      rankNone: "—",
      rankHint: "Sıra, en az iki katılımcı eylem kaydettiğinde gösterilir.",
      lossSummary: "Vuruş {hits} · nakavt {kos} · meydan {line}",
      standby: "BEKLEMEDE",
      botEvents: "Sentetik olaylar",
      botEventsHint: "Kapalıyken mevcut yapay zeka dövüşmeye devam edebilir; yeni sahte yorum veya hediye gönderilmez.",
      kapHint: "Dokunarak ölçeri doldur. 100'de kaptan olur ve 100 puan kazanırsın — hediye elması değil.",
      kapCue: "%{n}",
      superCd: "{n}sn",
      diagApplied: "işlendi",
      diagHeld: "bekliyor",
      diagSettled: "sonuçlandı",
      diagRejected: "reddedildi",
      diagCapacity: "saha dolu — kredi duruyor, yeni avatar yok",
      diagDuplicate: "aynı olay — ekstra kredi yok",
      diagHost: "EV SAHİBİ TESTİ",
      pendingGiftAction: "@{name} {gift} gönderdi — kredi ve hamle için BJK veya FB yaz",
      pendingGiftCredit: "@{name} {gift} gönderdi — kredi duruyor; almak için BJK veya FB yaz",
      pendingGiftLobby: "@{name} {gift} gönderdi — kredi duruyor; almak için BJK veya FB yaz",
      pendingSettledAction: "@{name} sonuçlandı: {gift} kredi + hamle",
      pendingSettledCredit: "@{name} sonuçlandı: {gift} kredi (hamle raundla düştü)",
      testLedger: "test {n} 💎 (hediye tablosunda yok)",
      eventTrace: "son sonuç",
      teamLocked: "Takım bu maç için kilitli",
      endTerritory: "Meydan",
      endPoints: "Puan (oturum)",
      endRoundHits: "Raund vuruşu",
      matchContrib: "Maç skoru {score}",
      tryAgain: "Sıradaki raundu oyna",
      reducedFx: "Flaşı azalt",
      giftBoardEmpty: "—",
      fansOne: "Sokakta {n} kişi",
      fansSplitOne: "{n} kişi + {b} {bots}",
      botsOne: "bot",
      botsMany: "bot",
      teamWin: "MEYDAN TAKIMININ!",
      idleWinNote: "Bu raundda vuruşun olmadı. Meydanı tarafın tuttu.",
      timeoutRule: "Süre bitince: beraberlik yalnızca merkeze %2 kala; aksi halde hattı tutan taraf kazanır.",
      receiptPromoted: "@{name} sıradan {team} saflarına girdi!",
      statusRetrying: "YENİDEN DENENİYOR",
      retryingIn: "deneme {n}/{max}, {s}sn",
      reconnectStopped: "otomatik deneme durdu — Yeniden bağlan",
      gift_small: "Hediye",
      gift_rose: "Gül",
      gift_heart: "Kalp",
      gift_medium: "Orta hediye",
      gift_lion: "Aslan",
      botRate: "Bot hızı",
      hideNote: "Paneli açmak için H",
      receiptRotated: "@{name} yer açmak için meydandan çıktı — oturum kredisi duruyor",
      rulesMeter: "Kaptan ölçeri: %100 olunca raund içinde veya sonuç ekranında bas. Dolu ölçer sonraki raunda taşınır; kısmi ölçer yarısıyla gider. Yeni maçta ölçer sıfırlanır.",
      diagCapacityHost: "saha dolu — ev sahibi testi yalnızca kredi olarak durur, taraftar çevrilmez",
      shareTitle: "Derbi Günü",
      shareText: "Derbi Günü — Beşiktaş vs Fenerbahçe. Takımını seç, meydanı kap!",
      shareCopied: "Link kopyalandı!",
      shareFailed: "Otomatik paylaşım olmadı. Aşağıdaki linki kopyala.",
      shareCopyBtn: "Linki kopyala",
      shareClose: "Tamam",
      youAreCaptain: "KAPTANSIN",
      boardToggle: "Tablolar",
      boardHide: "Tabloları gizle",
      captureTitle: "Olay kaydı",
      captureCount: "{n} olay",
      captureDownload: "Kaydı indir (JSON)",
      captureCopy: "Panoya kopyala",
      captureCopied: "Kayıt kopyalandı!",
      captureHint: "Ham yayın olayları kaydediliyor. Test yayını bitince dosyayı indir."
    }
  }
};


const SKINS = [0xf6c7a1, 0xe8b894, 0xd1a074, 0xc6865a, 0xf3d1b0, 0xa15c38, 0xffd6b0, 0x8d5524];
const HAIR = [0x1a120e, 0x3b2214, 0x6a3a18, 0x0d0d0d, 0xc4a36a, 0x2a1a12, 0x4a2c1a];
const W = 540, H = 960;
let VIEW_W = W, VIEW_H = H;
const QPARAMS = new URLSearchParams(location.search);
const IS_MOBILE = QPARAMS.get("desktop") !== "1" && (
  QPARAMS.get("mobile") === "1" ||
  /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
  (("ontouchstart" in window) && window.innerWidth <= 900)
);
const LOW = IS_MOBILE || QPARAMS.get("low") === "1";
if (LOW) { CONFIG.maxFans = 40; CONFIG.maxLabels = 12; }

const CAPTURE_ON = QPARAMS.get("capture") === "1";
const MODE = (QPARAMS.get("live") === "1")
  ? "live"
  : (QPARAMS.get("demo") === "1" || QPARAMS.get("bot") === "1")
    ? "demo"
    : "solo";
const PLAYROOM_SRC = "https://cdn.joinplayroom.com/playroomkit/multiplayer.full.umd.js";
const PLAYROOM_FALLBACK = "https://unpkg.com/playroomkit/multiplayer.full.umd.js";

window.THREE = THREE;
window.GAME_VERSION = CONFIG.version;
window.CONFIG = CONFIG;
if (QPARAMS.get("lang") === "en") CONFIG.lang = "en";
if (QPARAMS.get("connectms")) {
  const ms = Number(QPARAMS.get("connectms"));
  if (Number.isFinite(ms) && ms > 0) CONFIG.connectTimeout = ms;
}


function $(id) { return document.getElementById(id); }
function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;" }[c]));
}
function hash(str) {
  let h = 2166136261;
  const t = String(str);
  for (let i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function teamName(id) {
  const t = CONFIG.teams[id];
  return CONFIG.lang === "tr" ? t.nameTR : t.name;
}
function S(key, vars) {
  const pack = CONFIG.strings[CONFIG.lang] || CONFIG.strings.en;
  let s = pack[key] || CONFIG.strings.en[key] || key;
  if (vars) Object.keys(vars).forEach(k => { s = s.split("{" + k + "}").join(vars[k]); });
  return s;
}
function foldTR(s) {
  return String(s || "").toUpperCase()
    .replace(/İ/g, "I").replace(/I/g, "I")
    .replace(/Ş/g, "S").replace(/Ğ/g, "G")
    .replace(/Ü/g, "U").replace(/Ö/g, "O").replace(/Ç/g, "C");
}
function isEmojiKeyword(kw) {
  return /[⚫⚪💛💙]/.test(kw) || !/[A-Za-zÇĞİÖŞÜçğıöşü]/.test(kw);
}
function parseTeam(comment) {
  const raw = String(comment || "");
  if (!raw.trim()) return null;
  const folded = foldTR(raw);
  let best = null, bestIdx = 1e9;
  for (const id of ["red", "blue"]) {
    for (const kw of CONFIG.teams[id].keywords) {
      if (isEmojiKeyword(kw)) {
        const i = raw.indexOf(kw);
        if (i !== -1 && i < bestIdx) { bestIdx = i; best = id; }
        continue;
      }
      const needle = foldTR(kw);
      if (!needle) continue;
      const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const re = new RegExp("(^|[^A-Z0-9])" + escaped + "([^A-Z0-9]|$)", "g");
      let m;
      while ((m = re.exec(folded))) {
        const i = m.index + m[1].length;
        if (i < bestIdx) { bestIdx = i; best = id; }
        break;
      }
    }
  }
  return best;
}

const state = {
  phase: "lobby",
  mode: MODE,
  users: new Map(),
  line: 0,
  hits: { red: 0, blue: 0 },
  sessionHits: { red: 0, blue: 0 },
  scores: { red: 0, blue: 0 },
  matchOver: false,
  muted: true,
  time: 0,
  shake: 0,
  camFocus: null,
  mvp: null,
  winner: null,
  victoryAt: 0,
  countdown: 0,
  roundStart: 0,
  heroId: null,
  playMode: false,
  kapMeter: 0,
  combo: 0,
  comboUntil: 0,
  lastTap: 0,
  superUntil: 0,
  hintUntil: 0,
  modelsReady: false,
  liveStatus: MODE === "live" ? "CONNECTING" : (MODE === "demo" ? "DEMO" : "SOLO"),
  lastLiveEvent: null,
  pending: new Map(),
  seenEvents: new Map(),
  giftStreaks: new Map(),
  rankingEvent: true,
  liveScriptOk: false,
  matchGen: 1,
  lastOutcome: null,
  waitlist: new Map(),
  ledger: new Map(),
  captureEnabled: CAPTURE_ON,
  captureEvents: [],
  captureStartedAt: Date.now(),
  wallWatch: 0,

  settledStreaks: new Map(),
  reconnectAttempt: 0,
  reconnectTimer: null,
  reconnectAt: 0,
  reconnectStopped: false,
  connecting: false,
  clockPaused: false,
  pauseAccum: 0,
  pauseStarted: 0,
  reducedFx: false
};
window.__game = state;

let audioCtx = null;
function ensureAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === "suspended") audioCtx.resume();
}
function beep({ freq = 440, dur = 0.12, type = "square", gain = 0.05, slide } = {}) {
  if (state.muted) return;
  try {
    ensureAudio();
    const t = audioCtx.currentTime;
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, slide), t + dur);
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(audioCtx.destination);
    o.start(t); o.stop(t + dur + 0.02);
  } catch (_) {}
}
function sfxHit() { beep({ freq: 180, dur: 0.1, type: "square", gain: 0.04, slide: 90 }); }
function sfxGift() { beep({ freq: 300, dur: 0.3, type: "sawtooth", gain: 0.05, slide: 120 }); }
function sfxHorn() {
  beep({ freq: 220, dur: 0.45, type: "sawtooth", gain: 0.06, slide: 140 });
  setTimeout(() => beep({ freq: 330, dur: 0.3, type: "square", gain: 0.04 }), 80);
}
function sfxWin() {
  [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => beep({ freq: f, dur: 0.22, type: "square", gain: 0.07 }), i * 120));
}
function sfxWhistle() {
  beep({ freq: 1800, dur: 0.22, type: "square", gain: 0.06, slide: 1400 });
  setTimeout(() => beep({ freq: 1600, dur: 0.35, type: "square", gain: 0.05 }), 180);
}
function setMuted(v) {
  state.muted = v;
  const m = $("mute"); if (m) m.textContent = v ? "🔇" : "🔊";
  if (!v) ensureAudio();
}
function haptic(ms) {
  try { if (navigator.vibrate) navigator.vibrate(ms); } catch (_) {}
}

/* ---------- renderer / camera ---------- */
const renderer = new THREE.WebGLRenderer({
  canvas: $("c"), antialias: !LOW, alpha: false, preserveDrawingBuffer: true
});
renderer.setPixelRatio(LOW ? 1 : Math.min(window.devicePixelRatio || 1, 2));
renderer.setSize(W, H, false);
renderer.setClearColor(0x3e79b4, 1);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = !LOW;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x7aa0c0, 110, 230);
let camAspect = W / H;
const CAM_VIEWH_MIN = 24, CAM_VIEWH_MAX = 26;
let camViewH = 25;
const camera = new THREE.OrthographicCamera(
  -camViewH * camAspect * 0.5, camViewH * camAspect * 0.5,
  camViewH * 0.5, -camViewH * 0.5,
  1, 240
);
// High isometric 3/4 from the +Z side, ~50° down. Offset is from the auto-framed look point.
const CAM_OFFSET = { x: 3.6, y: 26.0, z: 20.0 };
const CAM_LOOK = { x: 0, y: 1.05, z: 0 };
const camPos = new THREE.Vector3(CAM_OFFSET.x, CAM_OFFSET.y, CAM_OFFSET.z);
const camLook = new THREE.Vector3(CAM_LOOK.x, CAM_LOOK.y, CAM_LOOK.z);
const camTarget = new THREE.Vector3().copy(camLook);
// v1.7: bounded broadcast director. It changes only camera composition,
// never event accounting, score, match timers or character transforms.
const V17_SHOT = { kind: "", user: null, start: 0, until: 0, cooldown: 0 };
const V17_CINEMA_ENABLED = QPARAMS.get("cinema") !== "0" &&
  !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
function startV17Shot(kind, user, ms = 1300) {
  const now = performance.now();
  if (!V17_CINEMA_ENABLED || state.reducedFx ||
      !user || !Number.isFinite(user.x) || !Number.isFinite(user.z)) return false;
  if (kind !== "victory" && (state.phase !== "battle" || now < V17_SHOT.cooldown)) return false;
  V17_SHOT.kind = kind; V17_SHOT.user = user; V17_SHOT.start = now;
  V17_SHOT.until = now + Math.min(2400, Math.max(400, ms));
  V17_SHOT.cooldown = now + (kind === "victory" ? 0 : 4800);
  return true;
}
camera.position.copy(camPos);
camera.lookAt(camLook);
camera.updateProjectionMatrix();
function applyCameraFrustum() {
  const h = camViewH;
  camera.left = -h * camAspect * 0.5;
  camera.right = h * camAspect * 0.5;
  camera.top = h * 0.5;
  camera.bottom = -h * 0.5;
  camera.updateProjectionMatrix();
}
function setViewH(requested) {
  let h = Math.max(CAM_VIEWH_MIN, Math.min(CAM_VIEWH_MAX, requested));
  // Keep a minimum world width so taller phone canvases show more street, not a tighter zoom.
  const minWidth = CAM_VIEWH_MIN * (W / H);
  if (h * camAspect < minWidth) h = minWidth / Math.max(0.2, camAspect);
  if (Math.abs(h - camViewH) < 0.05) return;
  camViewH = h;
  applyCameraFrustum();
}

function mat(color, extra) {
  return new THREE.MeshPhongMaterial(Object.assign({
    color: color, flatShading: true, shininess: 18, specular: 0x333333
  }, extra || {}));
}
function matTex(map, color, extra) {
  return new THREE.MeshPhongMaterial(Object.assign({
    map: map, color: color || 0xffffff, flatShading: true, shininess: 12, specular: 0x222222
  }, extra || {}));
}

// lighting — warm late-afternoon / golden hour, saturated, real shadows
const hemi = new THREE.HemisphereLight(0xffd9a0, 0x6a4a28, 0.48);
scene.add(hemi);
const sun = new THREE.DirectionalLight(0xffc56a, 0.9);
sun.position.set(-32, 26, 14);
sun.castShadow = !LOW;
sun.shadow.mapSize.set(LOW ? 512 : 2048, LOW ? 512 : 2048);
sun.shadow.camera.near = 4;
sun.shadow.camera.far = 110;
sun.shadow.camera.left = -28;
sun.shadow.camera.right = 28;
sun.shadow.camera.top = 24;
sun.shadow.camera.bottom = -24;
sun.shadow.bias = -0.0006;
scene.add(sun);
scene.add(new THREE.AmbientLight(0xffe8c8, 0.16));

const dummy = new THREE.Object3D();
const _v = new THREE.Vector3();
const city = new THREE.Group();
scene.add(city);

function canvasTex(w, h, draw) {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  draw(c.getContext("2d"), w, h);
  const t = new THREE.CanvasTexture(c);
  t.anisotropy = 4;
  t.colorSpace = THREE.SRGBColorSpace;
  t.needsUpdate = true;
  return t;
}

function facadeTex(wall, opts) {
  opts = opts || {};
  return canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = wall;
    g.fillRect(0, 0, w, h);
    // subtle plaster noise
    for (let i = 0; i < 800; i++) {
      g.fillStyle = "rgba(0,0,0," + (Math.random() * 0.05) + ")";
      g.fillRect(Math.random() * w, Math.random() * h, 2, 2);
    }
    const cols = opts.cols || 4, rows = opts.rows || 5;
    const mL = 18, mR = 18, mT = 22, mB = opts.shop ? 80 : 28;
    const gw = (w - mL - mR) / cols, gh = (h - mT - mB) / rows;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = mL + c * gw + 6, y = mT + r * gh + 6;
        const lit = Math.random() < (opts.lit || 0.35);
        g.fillStyle = "#2a2e38";
        g.fillRect(x, y, gw - 12, gh - 12);
        g.fillStyle = lit ? "rgba(255, 210, 110, 0.92)" : "rgba(70, 90, 120, 0.55)";
        g.fillRect(x + 2, y + 2, gw - 16, gh - 16);
        // muntins
        g.strokeStyle = "rgba(40,30,20,0.35)";
        g.lineWidth = 1;
        g.beginPath();
        g.moveTo(x + (gw - 12) / 2, y);
        g.lineTo(x + (gw - 12) / 2, y + gh - 12);
        g.moveTo(x, y + (gh - 12) / 2);
        g.lineTo(x + gw - 12, y + (gh - 12) / 2);
        g.stroke();
      }
    }
    if (opts.shop) {
      g.fillStyle = opts.shopColor || "#8b1e1e";
      g.fillRect(0, h - 78, w, 18);
      g.fillStyle = "#1c1610";
      g.fillRect(20, h - 60, w - 40, 50);
      g.fillStyle = "rgba(255, 220, 140, 0.5)";
      g.fillRect(24, h - 56, w - 48, 28);
    }
  });
}

function groundTex() {
  return canvasTex(1024, 1024, (g, w, h) => {
    // warm asphalt
    g.fillStyle = "#4a4d52";
    g.fillRect(0, 0, w, h);
    for (let i = 0; i < 8000; i++) {
      g.fillStyle = "rgba(0,0,0," + (Math.random() * 0.1) + ")";
      g.fillRect(Math.random() * w, Math.random() * h, 3, 3);
    }
    const cx = w / 2, cy = h / 2;
    // fine cobbled square in the middle
    g.fillStyle = "#5c584e";
    g.fillRect(cx - 160, cy - 170, 320, 340);
    for (let y = cy - 170; y < cy + 170; y += 4) {
      for (let x = cx - 160; x < cx + 160; x += 6) {
        const ox = (Math.floor(y / 4) % 2) * 3;
        g.fillStyle = (hash(x + "," + y) & 1) ? "#7a7468" : "#5a564c";
        g.fillRect(x + ox, y, 5, 3);
      }
    }
    // thin lane dashes
    g.strokeStyle = "rgba(220,210,180,0.55)";
    g.lineWidth = 3;
    g.setLineDash([16, 16]);
    g.beginPath(); g.moveTo(40, cy); g.lineTo(w - 40, cy); g.stroke();
    g.setLineDash([]);
    // kerb lines
    g.strokeStyle = "rgba(200,196,184,0.8)";
    g.lineWidth = 6;
    g.beginPath(); g.moveTo(0, cy - 160); g.lineTo(w, cy - 160); g.stroke();
    g.beginPath(); g.moveTo(0, cy + 160); g.lineTo(w, cy + 160); g.stroke();
  });
}

function addGround() {
  const tex = groundTex();
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(80, 70), matTex(tex, 0xffffff));
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(0, 0, -6);
  mesh.receiveShadow = true;
  city.add(mesh);
  // side pavements lining the avenue (along Z, at the building fronts)
  const pavL = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.16, 40), mat(0xc4b9a6));
  pavL.position.set(-8.6, 0.07, -6);
  pavL.receiveShadow = true; pavL.castShadow = true;
  city.add(pavL);
  const pavR = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.16, 40), mat(0xc4b9a6));
  pavR.position.set(8.6, 0.07, -6);
  pavR.receiveShadow = true; pavR.castShadow = true;
  city.add(pavR);
  // plaza stones toward the stadium
  const plaza = new THREE.Mesh(new THREE.BoxGeometry(18, 0.08, 7), mat(0xb7b0a2));
  plaza.position.set(0, 0.03, -12);
  plaza.receiveShadow = true;
  city.add(plaza);
  // grass around the stadium / shore
  const grass = new THREE.Mesh(new THREE.PlaneGeometry(90, 28), mat(0x3f8a3a));
  grass.rotation.x = -Math.PI / 2;
  grass.position.set(0, -0.02, -32);
  grass.receiveShadow = true;
  city.add(grass);
  const grass2 = new THREE.Mesh(new THREE.PlaneGeometry(80, 14), mat(0x3a7e36));
  grass2.rotation.x = -Math.PI / 2;
  grass2.position.set(0, -0.02, 16);
  grass2.receiveShadow = true;
  city.add(grass2);
}

function makeBuilding(w, d, h, wall, opt) {
  opt = opt || {};
  const g = new THREE.Group();
  const tex = facadeTex(wall, { cols: opt.cols || 4, rows: Math.max(3, Math.round(h / 2.2)), shop: !!opt.shop, shopColor: opt.shopColor, lit: 0.4 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), matTex(tex));
  body.position.y = h / 2;
  body.castShadow = true; body.receiveShadow = true;
  g.add(body);
  // roof
  const roof = new THREE.Mesh(new THREE.BoxGeometry(w + 0.35, 0.28, d + 0.35), mat(opt.roof || 0x6a3a32));
  roof.position.y = h + 0.14;
  roof.castShadow = true;
  g.add(roof);
  // cornice
  const cor = new THREE.Mesh(new THREE.BoxGeometry(w + 0.2, 0.18, d + 0.2), mat(0xe8dcc4));
  cor.position.y = h - 0.1;
  g.add(cor);
  if (opt.shop) {
    const awn = new THREE.Mesh(new THREE.BoxGeometry(w * 0.85, 0.08, 1.3), mat(opt.shopColor || 0x8b1e1e));
    awn.position.set(0, 2.15, d / 2 + 0.5);
    awn.rotation.x = -0.18;
    awn.castShadow = true;
    g.add(awn);
    const sign = new THREE.Mesh(new THREE.BoxGeometry(Math.min(2.6, w * 0.55), 0.55, 0.14), mat(opt.shopColor || 0x8b1e1e, { emissive: 0x221100, emissiveIntensity: 0.15 }));
    sign.position.set(w * 0.18, 3.15, d / 2 + 0.1);
    sign.castShadow = true;
    g.add(sign);
  }
  // Istanbul bay window / cumba
  if (h > 6) {
    const bay = new THREE.Mesh(new THREE.BoxGeometry(w * 0.36, h * 0.28, 0.75), mat(opt.roof || 0x6a3a32));
    bay.position.set(-w * 0.12, h * 0.52, d / 2 + 0.32);
    bay.castShadow = true;
    g.add(bay);
    const bayWin = new THREE.Mesh(new THREE.BoxGeometry(w * 0.28, h * 0.16, 0.08), mat(0x9ec4e0, { transparent: true, opacity: 0.7 }));
    bayWin.position.set(-w * 0.12, h * 0.54, d / 2 + 0.72);
    g.add(bayWin);
  }
  // balcony on taller buildings
  if (h > 8) {
    const bal = new THREE.Mesh(new THREE.BoxGeometry(w * 0.55, 0.1, 0.9), mat(0xd8d2c6));
    bal.position.set(0, h * 0.55, d / 2 + 0.4);
    const rail = new THREE.Mesh(new THREE.BoxGeometry(w * 0.55, 0.55, 0.06), mat(0xeeeae0));
    rail.position.set(0, h * 0.55 + 0.3, d / 2 + 0.8);
    g.add(bal, rail);
  }
  // rooftop tank / antenna / satellite dish
  if (opt.tank) {
    const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 1.1, 8), mat(0xb0c0c8));
    tank.position.set(w * 0.2, h + 0.8, 0);
    tank.castShadow = true;
    g.add(tank);
    const dish = new THREE.Mesh(new THREE.CircleGeometry(0.38, 8), mat(0xc5cad0));
    dish.position.set(-w * 0.22, h + 0.55, 0.15);
    dish.rotation.x = -0.9;
    g.add(dish);
  }
  return g;
}

function addCityBlocks() {
  // Saturated, varied city colours: terracotta, mustard, teal, cream, salmon, ochre
  const palettes = [
    { wall: "#c45a32", roof: 0x6a2a18, shop: "#d4a017" },
    { wall: "#d4a017", roof: 0x5a3a10, shop: "#8b1e1e" },
    { wall: "#2a8a7a", roof: 0x163e38, shop: "#f0e0c4" },
    { wall: "#f0dcc0", roof: 0x6a4830, shop: "#c45a32" },
    { wall: "#d46b4c", roof: 0x5a2820, shop: "#1a3a8a" },
    { wall: "#3a8a9a", roof: 0x2a4a54, shop: "#d4a017" },
    { wall: "#e8c98a", roof: 0x6a3a20, shop: "#2a8a7a" },
    { wall: "#c9a07a", roof: 0x4a2a1a, shop: "#8b1e1e" }
  ];
  function place(x, z, w, d, h, i, rot, shop) {
    const p = palettes[i % palettes.length];
    const m = makeBuilding(w, d, h, p.wall, {
      shop: shop !== false, shopColor: p.shop, roof: p.roof,
      tank: i % 2 === 0, cols: w > 6 ? 4 : 3
    });
    m.position.set(x, 0, z);
    if (rot) m.rotation.y = rot;
    city.add(m);
  }
  // Colourful terrace lining BOTH sides of the avenue (x = ±10.5), open at the stadium end
  const zs = [-16, -10.5, -5, 0.5, 6];
  const hsL = [7, 8.5, 11, 8, 6];
  const hsR = [8, 6.5, 10, 12, 7];
  zs.forEach((z, i) => {
    place(-10.6, z, 6.4, 4.8, hsL[i], i, Math.PI / 2, true);
    place(10.6, z, 6.4, 4.8, hsR[i], i + 3, -Math.PI / 2, true);
  });
  // Far row framing the plaza — wide gap so the stadium bowl stays visible
  place(-20.5, -20.5, 6.5, 5, 7, 1, 0, true);
  place(20.5, -20.5, 6.5, 5, 7.5, 0, 0, true);
  // Near-corner buildings only at the edges, short, so we look over them
  place(-14, 11.8, 6, 5, 5.5, 4, Math.PI, true);
  place(14, 11.8, 6, 5, 6, 6, Math.PI, true);
}

function addLampsAndTrees() {
  function lamp(x, z) {
    const g = new THREE.Group();
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.12, 5.2, 6), mat(0x3a3a40));
    pole.position.y = 2.6; pole.castShadow = true;
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 1.2), mat(0x3a3a40));
    arm.position.set(0, 5.1, 0.4);
    const lampHead = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.18, 0.55), mat(0xfff1c0, { emissive: 0xffcc66, emissiveIntensity: 0.55 }));
    lampHead.position.set(0, 5.0, 0.85);
    // glow sprite
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({
      color: 0xffe0a0, transparent: true, opacity: 0.18, depthWrite: false
    }));
    glow.scale.set(1.2, 1.2, 1);
    glow.position.set(0, 5.0, 0.85);
    g.add(pole, arm, lampHead, glow);
    g.position.set(x, 0, z);
    city.add(g);
  }
  function tree(x, z, s) {
    const g = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 1.3, 6), mat(0x6a4a2a));
    trunk.position.y = 0.65; trunk.castShadow = true;
    const col = [0x3d8c3a, 0x4fa04a, 0x2e7a38][hash(x + "," + z) % 3];
    const leaf = new THREE.Mesh(new THREE.SphereGeometry(1.05, 6, 5), mat(col));
    leaf.position.y = 2.15; leaf.castShadow = true; leaf.scale.set(1, 0.9, 1);
    g.add(trunk, leaf);
    g.position.set(x, 0, z);
    g.scale.setScalar(s || 1);
    city.add(g);
  }
  // lamps only on the side pavements, never in the clash
  for (const z of [-14, -6, 2, 8]) {
    lamp(-8.5, z);
    lamp(8.5, z);
  }
  // trees framing the plaza toward the stadium and street corners
  [-17, -11, 11, 17].forEach((x, i) => tree(x, -18.5, 1.05 + (i % 2) * 0.12));
  [-13, 13].forEach((x) => tree(x, 8.8, 0.95));
}

function makeCar(color) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.55, 3.4), mat(color));
  body.position.y = 0.55; body.castShadow = true;
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.5, 1.7), mat(0x9ec4e0, { transparent: true, opacity: 0.75 }));
  cabin.position.set(0, 1.05, -0.15); cabin.castShadow = true;
  const wmat = mat(0x222226);
  [[-0.75, 0.28, 1.05], [0.75, 0.28, 1.05], [-0.75, 0.28, -1.1], [0.75, 0.28, -1.1]].forEach(([x, y, z]) => {
    const w = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.22, 8), wmat);
    w.rotation.z = Math.PI / 2; w.position.set(x, y, z);
    g.add(w);
  });
  g.add(body, cabin);
  return g;
}
function makeBus(team) {
  const T = CONFIG.teams[team];
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.5, 3.6), mat(T.colors.kit));
  body.position.y = 1.0; body.castShadow = true;
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.22, 3.62), mat(T.colors.secondary));
  stripe.position.y = 1.15;
  const windows = new THREE.Mesh(new THREE.BoxGeometry(1.62, 0.5, 2.6), mat(0x9ec4e0, { transparent: true, opacity: 0.7 }));
  windows.position.set(0, 1.55, 0.1);
  const roof = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.1, 3.3), mat(0x222));
  roof.position.y = 1.8;
  [[-0.8, 0.32, 1.2], [0.8, 0.32, 1.2], [-0.8, 0.32, -1.2], [0.8, 0.32, -1.2]].forEach(([x, y, z]) => {
    const w = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.28, 8), mat(0x222));
    w.rotation.z = Math.PI / 2; w.position.set(x, y, z);
    g.add(w);
  });
  // small flag on roof
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.6, 5), mat(0x333));
  mast.position.set(0, 2.5, 1.1);
  const flag = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 0.8), mat(T.colors.flag, { side: THREE.DoubleSide }));
  flag.position.set(0.55, 2.85, 1.1);
  g.add(body, stripe, windows, roof, mast, flag);
  g.userData.roofY = 1.9;
  return g;
}

function addVehicles() {
  const colors = [0xf0c400, 0xf5c400, 0xefb800, 0xf2c000]; // Istanbul yellow taxis
  const spots = [
    [-8.2, 8.4, 0.15], [8.2, 8.5, -0.1],
    [-8.2, -8.6, Math.PI + 0.05], [8.4, -8.5, Math.PI - 0.08]
  ];
  spots.forEach((sp, i) => {
    const c = makeCar(colors[i % colors.length]);
    c.position.set(sp[0], 0, sp[1]);
    c.rotation.y = sp[2];
    city.add(c);
  });
  // team buses sit just behind each crowd, visible in the square
  const busR = makeBus("red");
  busR.position.set(-8.6, 0, -2.4);
  busR.rotation.y = 0.2;
  city.add(busR);
  state.busRed = busR;
  const busB = makeBus("blue");
  busB.position.set(8.6, 0, -2.4);
  busB.rotation.y = -0.2;
  city.add(busB);
  state.busBlue = busB;
}

function addStadium() {
  // Closed bowl with a LOW street-facing lip so the iso camera looks over
  // the rim into the stands, white canopy, pitch, then water and a bridge.
  const g = new THREE.Group();
  g.position.set(0, 0, -32);

  const concrete = mat(0xd4cfc3);
  const concreteDk = mat(0xb4aea2);
  const cream = mat(0xf0ebe0);
  const seatTex = (() => {
    const c = document.createElement("canvas");
    c.width = 128; c.height = 32;
    const ctx = c.getContext("2d");
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 16; x++) {
        ctx.fillStyle = ((x + y) % 2) ? "#f2f2f0" : "#1a1a1a";
        ctx.fillRect(x * 8, y * 8, 8, 8);
      }
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = THREE.RepeatWrapping;
    t.repeat.set(8, 1);
    t.needsUpdate = true;
    return t;
  })();
  const seatMat = matTex(seatTex, 0xffffff);

  // Three.js cylinder: theta=0 is +X, theta=π/2 is +Z (the street / camera).
  // Leave a wide opening toward the square so the iso shot looks into the bowl.
  const gap = 1.85;
  const gapCenter = Math.PI / 2;
  const thetaStart = gapCenter + gap / 2;
  const thetaLength = Math.PI * 2 - gap;

  // Solid sides + back facade
  const outer = new THREE.Mesh(
    new THREE.CylinderGeometry(17.0, 18.0, 8.2, 48, 1, true, thetaStart, thetaLength),
    concrete
  );
  outer.position.y = 4.2;
  outer.castShadow = true; outer.receiveShadow = true;
  g.add(outer);
  const plinth = new THREE.Mesh(
    new THREE.CylinderGeometry(18.1, 18.8, 1.2, 48, 1, true, thetaStart, thetaLength),
    concreteDk
  );
  plinth.position.y = 0.6;
  plinth.castShadow = true;
  g.add(plinth);

  // Low street-facing lip (we look over this into the bowl)
  const lip = new THREE.Mesh(new THREE.BoxGeometry(22, 2.6, 1.4), concrete);
  lip.position.set(0, 1.3, 16.6);
  lip.castShadow = true; lip.receiveShadow = true;
  g.add(lip);
  const lipTop = new THREE.Mesh(new THREE.BoxGeometry(22.6, 0.35, 1.8), cream);
  lipTop.position.set(0, 2.7, 16.6);
  g.add(lipTop);

  // Modest black-white panel belt on the BACK and sides only (not giant black holes)
  for (let i = 0; i < 18; i++) {
    const a = thetaStart + (i + 0.5) * (thetaLength / 18);
    if (Math.sin(a) > 0.55) continue; // no giant panels on the street face
    const panel = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 2.6, 0.18),
      mat(i % 2 ? 0x1a1a1a : 0xf3f3f0)
    );
    panel.position.set(Math.cos(a) * 17.55, 4.4, Math.sin(a) * 17.55);
    panel.lookAt(new THREE.Vector3(0, 4.4, 0));
    panel.castShadow = true;
    g.add(panel);
  }

  // Upper stands + seat rings, visible over the low lip
  const stand1 = new THREE.Mesh(new THREE.RingGeometry(9.0, 14.2, 48, 1), seatMat);
  stand1.rotation.x = -Math.PI / 2;
  stand1.position.y = 2.6;
  g.add(stand1);
  const stand2 = new THREE.Mesh(new THREE.RingGeometry(11.0, 16.2, 48, 1), seatMat);
  stand2.rotation.x = -Math.PI / 2;
  stand2.position.y = 5.4;
  g.add(stand2);
  const bank = new THREE.Mesh(
    new THREE.CylinderGeometry(16.0, 13.6, 3.6, 48, 1, true, thetaStart, thetaLength),
    seatMat
  );
  bank.position.y = 4.2;
  bank.receiveShadow = true;
  g.add(bank);

  const pitch = new THREE.Mesh(new THREE.CircleGeometry(8.8, 40), mat(0x3faa46));
  pitch.rotation.x = -Math.PI / 2;
  pitch.position.y = 0.1;
  pitch.receiveShadow = true;
  g.add(pitch);
  const mid = new THREE.Mesh(new THREE.RingGeometry(0.08, 1.4, 24), mat(0xf7f7f7));
  mid.rotation.x = -Math.PI / 2; mid.position.y = 0.12;
  g.add(mid);
  const midline = new THREE.Mesh(new THREE.PlaneGeometry(17.4, 0.1), mat(0xf7f7f7));
  midline.rotation.x = -Math.PI / 2; midline.position.y = 0.12;
  g.add(midline);

  // White canopy ring, sits above the bowl and reads against the sky
  const roofMat = mat(0xf8f5ee, { shininess: 70, specular: 0x999999 });
  const roof = new THREE.Mesh(new THREE.RingGeometry(13.2, 18.8, 48, 1), roofMat);
  roof.rotation.x = -Math.PI / 2;
  roof.position.y = 8.6;
  roof.castShadow = true;
  g.add(roof);
  const lipOut = new THREE.Mesh(new THREE.TorusGeometry(18.6, 0.42, 6, 48), roofMat);
  lipOut.rotation.x = Math.PI / 2;
  lipOut.position.y = 8.85;
  g.add(lipOut);
  const lipIn = new THREE.Mesh(new THREE.TorusGeometry(13.3, 0.22, 6, 40), roofMat);
  lipIn.rotation.x = Math.PI / 2;
  lipIn.position.y = 8.75;
  g.add(lipIn);

  // Four floodlight masts, tall enough to clear the canopy
  function tower(x, z) {
    const p = new THREE.Mesh(new THREE.BoxGeometry(0.5, 18, 0.5), cream);
    p.position.set(x, 9, z); p.castShadow = true;
    const head = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.45, 1.1), mat(0xfff4c8, { emissive: 0xffe08a, emissiveIntensity: 0.9 }));
    head.position.set(x, 18.2, z);
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ color: 0xfff2c0, transparent: true, opacity: LOW ? 0.28 : 0.5, depthWrite: false }));
    glow.scale.set(4.4, 4.4, 1);
    glow.position.set(x, 18.2, z);
    g.add(p, head, glow);
  }
  tower(-13.5, 13.5);
  tower(13.5, 13.5);
  tower(-13.5, -13.5);
  tower(13.5, -13.5);

  city.add(g);
  return g;
}

function addSkyDecor() {
  // a few low-poly clouds
  function cloud(x, y, z, s) {
    const g = new THREE.Group();
    const m = mat(0xf4f7fb);
    [[0, 0, 0, 2.2], [2, 0.3, 0.4, 1.6], [-2, 0.2, -0.3, 1.5], [0.5, 0.8, 0, 1.4]].forEach(p => {
      const c = new THREE.Mesh(new THREE.SphereGeometry(p[3], 6, 5), m);
      c.position.set(p[0], p[1], p[2]);
      g.add(c);
    });
    g.position.set(x, y, z);
    g.scale.setScalar(s);
    city.add(g);
  }
  cloud(-20, 28, -30, 1.4);
  cloud(18, 26, -50, 1.8);
  cloud(8, 30, -20, 1.1);
}

const seagulls = [];
const tifoBanners = [];

function addIstanbulExtras() {
  // Bosphorus water behind and to the east of the stadium
  const water = new THREE.Mesh(new THREE.PlaneGeometry(200, 90), mat(0x1a5f86, { shininess: 70, specular: 0x88cce0 }));
  water.rotation.x = -Math.PI / 2;
  water.position.set(0, -0.2, -58);
  city.add(water);
  const water2 = new THREE.Mesh(new THREE.PlaneGeometry(160, 36), mat(0x187096, { shininess: 50, specular: 0x77bbd4 }));
  water2.rotation.x = -Math.PI / 2;
  water2.position.set(0, -0.16, -42);
  city.add(water2);
  // shoreline
  const shore = new THREE.Mesh(new THREE.BoxGeometry(90, 0.4, 6), mat(0xb8a078));
  shore.position.set(0, 0.05, -48);
  shore.receiveShadow = true;
  city.add(shore);

  // Dolmabahçe-inspired mosque: cream walls, dome, two minarets, by the water
  function mosque(x, z) {
    const m = new THREE.Group();
    const hall = new THREE.Mesh(new THREE.BoxGeometry(5.4, 3.2, 4.6), mat(0xefe6d4));
    hall.position.y = 1.6; hall.castShadow = true;
    const dome = new THREE.Mesh(new THREE.SphereGeometry(2.1, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), mat(0xcfc3a2));
    dome.position.y = 3.4; dome.castShadow = true;
    const finial = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.8, 6), mat(0xd4af4a));
    finial.position.y = 5.7;
    function minaret(px) {
      const g = new THREE.Group();
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 8.5, 8), mat(0xf2ead8));
      shaft.position.y = 4.25; shaft.castShadow = true;
      const balcony = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.28, 8), mat(0xe8dcc4));
      balcony.position.y = 7.2;
      const cap = new THREE.Mesh(new THREE.ConeGeometry(0.38, 1.1, 8), mat(0xcfc3a2));
      cap.position.y = 8.9;
      g.add(shaft, balcony, cap);
      g.position.x = px;
      return g;
    }
    m.add(hall, dome, finial, minaret(-2.6), minaret(2.6));
    m.position.set(x, 0, z);
    city.add(m);
  }
  mosque(18.5, -20);
  mosque(-18.5, -22);

  // Bosphorus bridge silhouette in the distance
  const bridge = new THREE.Group();
  function pylon(x) {
    const tower = new THREE.Mesh(new THREE.BoxGeometry(0.8, 14, 0.8), mat(0x6a6e74));
    tower.position.set(x, 8, 0);
    const arm = new THREE.Mesh(new THREE.BoxGeometry(6, 0.3, 0.3), mat(0x5a5e64));
    arm.position.set(x, 14.2, 0);
    bridge.add(tower, arm);
  }
  pylon(-11); pylon(11);
  const deck = new THREE.Mesh(new THREE.BoxGeometry(38, 0.35, 1.6), mat(0x4a4e54));
  deck.position.set(0, 6.2, 0);
  bridge.add(deck);
  // cables
  for (let i = 0; i < 8; i++) {
    const c = new THREE.Mesh(new THREE.BoxGeometry(0.06, 6, 0.06), mat(0x888c90));
    c.position.set(-11 + (i + 1) * 2.2, 10, 0);
    c.rotation.z = 0.45;
    bridge.add(c);
    const c2 = c.clone();
    c2.position.x = 11 - (i + 1) * 2.2;
    c2.rotation.z = -0.45;
    bridge.add(c2);
  }
  bridge.position.set(0, 0, -64);
  bridge.scale.set(1.7, 1.55, 1.7);
  bridge.rotation.y = 0.08;
  city.add(bridge);

  // far Asian-shore blocks
  for (let i = 0; i < 6; i++) {
    const b = new THREE.Mesh(new THREE.BoxGeometry(3 + (i % 3), 2 + (i % 4) * 1.4, 2.4), mat([0xc4a07a, 0xb0b8c0, 0xd8c4a0, 0x8aa0a8][i % 4]));
    b.position.set(20 + i * 5.5, 1.5, -100);
    city.add(b);
  }

  // nostalgic red-and-cream Istanbul tram along the left pavement
  const tram = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.4, 7.4), mat(0xb01818));
  body.position.y = 1.5; body.castShadow = true;
  const cream = new THREE.Mesh(new THREE.BoxGeometry(2.22, 0.7, 7.42), mat(0xf0e6d0));
  cream.position.y = 1.15;
  const windows = new THREE.Mesh(new THREE.BoxGeometry(2.05, 0.7, 6.2), mat(0x9ec4e0, { transparent: true, opacity: 0.7 }));
  windows.position.set(0, 2.15, 0);
  const roof = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.15, 7.0), mat(0x333));
  roof.position.y = 2.75;
  tram.add(body, cream, windows, roof);
  tram.position.set(-8.5, 0, -4);
  city.add(tram);
  state.tram = tram;

  // simit cart
  const cart = new THREE.Group();
  const tray = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.15, 0.9), mat(0x6a3a18));
  tray.position.y = 1.05; tray.castShadow = true;
  const stand = new THREE.Mesh(new THREE.BoxGeometry(0.15, 1.0, 0.15), mat(0x333));
  stand.position.y = 0.5;
  const wheelL = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.1, 8), mat(0x222));
  wheelL.rotation.z = Math.PI / 2; wheelL.position.set(-0.45, 0.22, 0);
  const wheelR = wheelL.clone(); wheelR.position.x = 0.45;
  cart.add(tray, stand, wheelL, wheelR);
  for (let i = 0; i < 6; i++) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.045, 5, 8), mat(0xc47a2a));
    ring.position.set(-0.35 + (i % 3) * 0.35, 1.2, (i < 3 ? -0.15 : 0.15));
    ring.rotation.x = Math.PI / 2;
    cart.add(ring);
  }
  const umbrella = new THREE.Mesh(new THREE.ConeGeometry(0.7, 0.25, 8), mat(0xc81e1e));
  umbrella.position.set(0, 1.9, 0);
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.8, 5), mat(0x333));
  pole.position.y = 1.5;
  cart.add(umbrella, pole);
  cart.position.set(7.6, 0, 7.2);
  city.add(cart);

  // çay bahçesi tables on a pavement corner
  function cayTable(x, z) {
    const t = new THREE.Group();
    const top = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.08, 8), mat(0xe8dcc4));
    top.position.y = 0.72;
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.72, 5), mat(0x444));
    leg.position.y = 0.36;
    t.add(top, leg);
    // two stools
    for (const sx of [-0.55, 0.55]) {
      const st = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 0.45, 6), mat(0x5a3a22));
      st.position.set(sx, 0.22, 0.15);
      t.add(st);
    }
    t.position.set(x, 0, z);
    city.add(t);
  }
  cayTable(7.4, 5.6);
  cayTable(8.2, 4.4);
  cayTable(-7.5, 6.8);

  // modest generic eagle sculpture on the plaza edge (neighbourhood square, not a club crest)
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.7, 1.1), mat(0x9a958c));
  plinth.position.set(-6.2, 0.35, -12);
  plinth.castShadow = true;
  const bird = new THREE.Mesh(new THREE.ConeGeometry(0.35, 1.3, 5), mat(0x1a1a1a));
  bird.position.set(-6.2, 1.5, -12);
  bird.rotation.x = -0.3;
  city.add(plinth, bird);

  // seagulls
  const gmat = mat(0xf4f4f0);
  for (let i = 0; i < (LOW ? 4 : 8); i++) {
    const sg = new THREE.Group();
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.12, 5, 4), gmat);
    const wing = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.04, 0.16), gmat);
    sg.add(body, wing);
    sg.position.set((Math.random() - 0.4) * 20, 8 + Math.random() * 6, -20 - Math.random() * 30);
    city.add(sg);
    seagulls.push({ g: sg, wing, phase: Math.random() * 6.28, r: 8 + Math.random() * 10, y: sg.position.y, z: sg.position.z });
  }

  // tifo banners planted in each crowd
  for (const team of ["red", "blue"]) {
    const T = CONFIG.teams[team];
    for (let i = 0; i < 4; i++) {
      const b = new THREE.Group();
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.5, 5), mat(0x333));
      pole.position.y = 1.25;
      const cloth = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 1.05), mat(T.colors.flag, { side: THREE.DoubleSide }));
      cloth.position.set(0.85, 2.1, 0);
      const stripe = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 0.28), mat(T.colors.secondary, { side: THREE.DoubleSide }));
      stripe.position.set(0.85, 2.1, 0.02);
      b.add(pole, cloth, stripe);
      b.visible = false;
      city.add(b);
      tifoBanners.push({ g: b, cloth, team, i });
    }
  }
}

function updateSeagulls(t) {
  for (const s of seagulls) {
    s.g.position.x = Math.sin(t * 0.35 + s.phase) * s.r;
    s.g.position.z = s.z + Math.cos(t * 0.35 + s.phase) * 4;
    s.g.position.y = s.y + Math.sin(t * 1.6 + s.phase) * 0.4;
    s.wing.rotation.z = Math.sin(t * 8 + s.phase) * 0.45;
    s.g.rotation.y = Math.sin(t * 0.35 + s.phase) + Math.PI / 2;
  }
}

function updateTifos(t) {
  for (const team of ["red", "blue"]) {
    const list = [...state.users.values()].filter(u => u.team === team && u.anim !== "fly");
    list.sort((a, b) => (team === "red" ? a.x - b.x : b.x - a.x));
    const back = list.slice(Math.max(0, list.length - 8));
    const banners = tifoBanners.filter(b => b.team === team);
    banners.forEach((b, i) => {
      const u = back[i * 2];
      if (!u) { b.g.visible = false; return; }
      b.g.visible = true;
      const side = team === "red" ? -1 : 1;
      b.g.position.set(u.x + side * 0.15, 0, u.z);
      b.g.rotation.y = team === "red" ? Math.PI / 2 : -Math.PI / 2;
      b.cloth.rotation.y = Math.sin(t * 2.2 + i) * 0.22;
    });
  }
}

function addTerritory() {
  // team-tinted ground so you can see who holds the square
  const redMat = new THREE.MeshPhongMaterial({ color: 0x3a3a3a, transparent: true, opacity: 0.55, flatShading: true });
  const bluMat = new THREE.MeshPhongMaterial({ color: 0x123a7a, transparent: true, opacity: 0.48, flatShading: true });
  const redG = new THREE.Mesh(new THREE.PlaneGeometry(1, 13), redMat);
  redG.rotation.x = -Math.PI / 2; redG.position.y = 0.045;
  const bluG = new THREE.Mesh(new THREE.PlaneGeometry(1, 13), bluMat);
  bluG.rotation.x = -Math.PI / 2; bluG.position.y = 0.045;
  city.add(redG, bluG);
  // police-tape / painted clash line
  const c = document.createElement("canvas");
  c.width = 256; c.height = 32;
  const ctx = c.getContext("2d");
  for (let i = 0; i < 16; i++) {
    ctx.fillStyle = i % 2 ? "#1a1a1a" : "#e8c35a";
    ctx.fillRect(i * 16, 0, 16, 32);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping; tex.repeat.set(8, 1);
  const tape = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.16, 12.5), matTex(tex));
  tape.position.y = 0.09;
  tape.castShadow = true;
  // second raised police-tape so the clash line reads from a low camera
  const tape2 = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.14, 12.5), matTex(tex));
  tape2.position.y = 0.42;
  const postG = new THREE.CylinderGeometry(0.04, 0.04, 0.5, 6);
  const posts = new THREE.Group();
  for (let z = -5; z <= 5; z += 2.5) {
    const p = new THREE.Mesh(postG, mat(0x222222));
    p.position.set(0, 0.25, z);
    posts.add(p);
  }
  city.add(tape, tape2, posts);
  state.terrRed = redG; state.terrBlue = bluG; state.terrTape = tape;
  state.terrTape2 = tape2; state.terrPosts = posts;
}
function updateTerritory(lineX) {
  if (!state.terrTape) return;
  const half = CONFIG.streetHalf * 0.95;
  const left = -half, right = half;
  const mid = lineX;
  const redW = Math.max(0.2, mid - left);
  const bluW = Math.max(0.2, right - mid);
  state.terrRed.scale.set(redW, 1, 1);
  state.terrRed.position.set(left + redW / 2, 0.04, 0);
  state.terrBlue.scale.set(bluW, 1, 1);
  state.terrBlue.position.set(mid + bluW / 2, 0.04, 0);
  state.terrTape.position.set(mid, 0.09, 0);
  if (state.terrTape2) state.terrTape2.position.set(mid, 0.42, 0);
  if (state.terrPosts) state.terrPosts.position.x = mid;
}

function buildWorld() {
  addGround();
  addCityBlocks();
  addLampsAndTrees();
  addVehicles();
  addStadium();
  addSkyDecor();
  addIstanbulExtras();
  addTerritory();
}

/* ============================================================
   Characters (Quaternius GLB + kit tint + mixers)
   ============================================================ */
const CHAR_FILES = ["Casual_Male", "Casual_Female", "Casual_Bald", "Worker_Male"];
const templates = {};
const kitTextures = {};
const CHAR_SCALE = 0.58;
const CLIP_MAP = {
  idle: "Idle", walk: "Walk", punch: "Punch", hit: "RecieveHit",
  sit: "SitDown", stand: "StandUp", win: "Victory", lose: "Defeat",
  grab: "PickUp", shove: "Shoot_OneHanded"
};

function kitTex(team) {
  if (kitTextures[team]) return kitTextures[team];
  const t = canvasTex(64, 64, (g, w, h) => {
    const a = team === "red" ? "#141414" : "#0a2850";
    const b = team === "red" ? "#f0f0ee" : "#ffd000";
    const sw = 8;
    for (let x = 0; x < w; x += sw) {
      g.fillStyle = ((x / sw) & 1) ? b : a;
      g.fillRect(x, 0, sw, h);
    }
  });
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(2, 1);
  kitTextures[team] = t;
  return t;
}

async function loadCharacters(onProg) {
  const loader = new GLTFLoader();
  for (let i = 0; i < CHAR_FILES.length; i++) {
    const name = CHAR_FILES[i];
    const gltf = await loader.loadAsync("./assets/characters/" + name + ".glb");
    const clips = {};
    gltf.animations.forEach((c) => {
      const short = c.name.split("|").pop();
      clips[short] = c;
    });
    templates[name] = { scene: gltf.scene, clips, anims: gltf.animations };
    if (onProg) onProg((i + 1) / CHAR_FILES.length);
  }
  state.modelsReady = true;
}

function findBone(root, names) {
  let found = null;
  const set = names.map((n) => n.toLowerCase());
  root.traverse((o) => {
    if (found || !o.name) return;
    const n = o.name.toLowerCase();
    if (set.some((s) => n === s || n.endsWith(s) || n.endsWith("." + s))) found = o;
  });
  return found;
}

function applyKit(root, user) {
  const team = user.team;
  const skin = SKINS[hash(user.id) % SKINS.length];
  const hair = HAIR[hash(user.id + "h") % HAIR.length];
  // Solid kits so sides read instantly: BJK black shirt + white shorts,
  // FB yellow shirt + navy shorts. Sleeves are added as arm meshes.
  const shirt = team === "red" ? 0x141414 : 0xffd000;
  const shorts = team === "red" ? 0xf3f3f0 : 0x0a2850;
  root.traverse((o) => {
    if (!o.isMesh) return;
    o.castShadow = !LOW;
    o.receiveShadow = true;
    o.frustumCulled = false;
    const mats = Array.isArray(o.material) ? o.material : [o.material];
    const out = mats.map((m) => {
      const mat = m.clone();
      const n = (mat.name || "").toLowerCase();
      mat.metalness = 0.05;
      mat.roughness = 0.72;
      if (n.includes("shirt") || n.includes("vest")) {
        mat.map = null;
        mat.color.setHex(shirt);
        mat.needsUpdate = true;
      } else if (n.includes("pants")) {
        mat.map = null;
        mat.color.setHex(shorts);
      } else if (n.includes("skin")) {
        mat.map = null;
        mat.color.setHex(skin);
      } else if (n.includes("face")) {
        mat.color.multiplyScalar(1.15);
      } else if (n.includes("hair")) {
        mat.map = null;
        mat.color.setHex(hair);
      } else if (n.includes("hat") || n.includes("belt")) {
        mat.color.setHex(team === "red" ? 0x111111 : 0x0a2850);
      }
      return mat;
    });
    o.material = out.length === 1 ? out[0] : out;
  });
}

function attachSleeves(user) {
  const col = user.team === "red" ? 0xf3f3f0 : 0x0a2850;
  for (const name of ["upperarm.l", "upperarm.r"]) {
    const b = findBone(user.model, [name]);
    if (!b) continue;
    const sl = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.34, 8), mat(col));
    sl.position.set(0, 0.14, 0);
    sl.castShadow = !LOW;
    b.add(sl);
  }
}

function attachScarf(user) {
  if (user._scarf && user._scarf.parent) return;
  const neck = findBone(user.model, ["neck"]);
  if (!neck) return;
  const colA = user.team === "red" ? 0xf3f3f0 : 0xffd000;
  const colB = user.team === "red" ? 0x141414 : 0x0a2850;
  const g = new THREE.Group();
  const loop = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.04, 5, 10), mat(colA));
  const tail = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.5, 0.05), mat(colB));
  tail.position.set(0.14, -0.28, 0.1);
  const tail2 = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.42, 0.04), mat(colA));
  tail2.position.set(0.08, -0.24, 0.14);
  g.add(loop, tail, tail2);
  neck.add(g);
  user._scarf = g;
}

function attachProp(user, kind) {
  clearProp(user);
  const hand = findBone(user.model, ["fist.r", "hand.r", "handr"]);
  const neck = findBone(user.model, ["neck"]);
  const head = findBone(user.model, ["head"]);
  if (kind === "scarf" && neck) {
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.08, 0.55), mat(user.team === "red" ? 0xf3f3f0 : 0xffd000));
    s.position.set(0, 0.05, 0.1);
    neck.add(s);
    user._prop = s;
  } else if (kind === "flag" && user._arm) {
    /* flag later */
  } else if ((kind === "pillow" || kind === "chicken") && hand) {
    const col = kind === "chicken" ? 0xffdd44 : 0xf7f0dc;
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.16, 0.28), mat(col));
    s.position.set(0, 0.08, 0.12);
    hand.add(s);
    user._prop = s;
  } else if (kind === "crown" && head) {
    const c = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.22, 5), mat(0xe8b923));
    c.position.set(0, 0.28, 0);
    head.add(c);
    user._prop = c;
    user._crown = c;
  }
}
function clearProp(user) {
  if (user._prop && user._prop.parent) user._prop.parent.remove(user._prop);
  user._prop = null;
}

function pickTemplate(user) {
  if (user.body === "woman") return "Casual_Female";
  if (user.body === "uncle") return "Worker_Male";
  if ((hash(user.id) & 3) === 0) return "Casual_Bald";
  return "Casual_Male";
}

function spawnModel(user) {
  if (!state.modelsReady || user.model) return;
  const tname = pickTemplate(user);
  const tmpl = templates[tname];
  if (!tmpl) return;
  const inner = cloneSkinned(tmpl.scene);
  applyKit(inner, user);
  inner.updateMatrixWorld(true);
  const box0 = new THREE.Box3().setFromObject(inner);
  // GLBs are pre-scaled to ~1.85m with node scales of 1. Any runtime
  // scale on wrap/inner breaks GPU skinning (exploded triangles).
  inner.position.x -= (box0.min.x + box0.max.x) * 0.5;
  inner.position.z -= (box0.min.z + box0.max.z) * 0.5;
  inner.position.y -= box0.min.y;
  const wrap = new THREE.Group();
  wrap.add(inner);
  const mixer = new THREE.AnimationMixer(inner);
  const actions = {};
  Object.keys(CLIP_MAP).forEach((k) => {
    const clip = tmpl.clips[CLIP_MAP[k]];
    if (!clip) return;
    const act = mixer.clipAction(clip);
    act.enabled = true;
    actions[k] = act;
  });
  const sh = new THREE.Mesh(
    new THREE.CircleGeometry(0.38, 12),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35, depthWrite: false })
  );
  sh.rotation.x = -Math.PI / 2;
  sh.position.y = 0.02;
  wrap.add(sh);
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.55, 0.07, 8, 24),
    new THREE.MeshBasicMaterial({ color: 0xffe066, transparent: true, opacity: 0.95, depthTest: false })
  );
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.05;
  ring.visible = false;
  ring.renderOrder = 9;
  wrap.add(ring);
  user.model = wrap;
  user.rig = inner;
  user.mixer = mixer;
  user.actions = actions;
  user.ring = ring;
  user.tmpl = tname;
  user.animName = "";
  scene.add(wrap);
  attachSleeves(user);
  if (hash(user.id) % 3 !== 1) attachScarf(user);
  playAnim(user, "idle");
}

function playAnim(user, name, opts) {
  opts = opts || {};
  if (!user.actions) return;
  const act = user.actions[name];
  if (!act) return;
  if (user.animName === name && !opts.restart) {
    if (opts.timeScale) act.timeScale = opts.timeScale;
    return;
  }
  act.reset();
  act.setLoop(opts.once ? THREE.LoopOnce : THREE.LoopRepeat, opts.once ? 1 : Infinity);
  act.clampWhenFinished = !!opts.once;
  act.timeScale = opts.timeScale || 1;
  if (user.currentAction && user.currentAction !== act) user.currentAction.fadeOut(0.12);
  act.fadeIn(0.12).play();
  user.currentAction = act;
  user.animName = name;
}

function placeModel(user) {
  if (!user.model) return;
  user.model.position.set(user.x, user.y, user.z);
  user.model.rotation.y = user.facing;
  // Do not scale the wrapper — GPU skinning explodes if a parent scale != 1.
}

/* ============================================================
   Users, join, gifts, live events
   ============================================================ */
function makeUser(id, name, team, photoUrl) {
  const h = hash(id);
  const bodyRoll = h % 10;
  const body = bodyRoll < 2 ? "uncle" : (bodyRoll < 5 ? "woman" : "std");
  const side = team === "red" ? -1 : 1;
  return {
    id, name: String(name || "fan").slice(0, 18), team, photoUrl: photoUrl || null,
    body, x: side * 2.4, y: 0, z: ((h % 13) - 6) * 0.85,
    vx: 0, vy: 0, vz: 0, facing: team === "red" ? (Math.PI / 2 - 0.35) : (-Math.PI / 2 + 0.35),
    scale: 1, diamonds: 0, points: 0, hits: 0, knockouts: 0, likes: 0,
    rankHits: 0, rankLikes: 0, sessionHits: 0, sessionLikes: 0, sessionDiamonds: 0,
    captainOf: null, isBot: String(id || "").startsWith("bot:"),
    highlightUntil: 0, lastActive: 0,
    role: "front", partner: null, fight: "approach", fightT: 0, hitThisMove: false,
    anim: "idle", downT: 0, bounce: 0, staggerT: 0,
    model: null, mixer: null, actions: null
  };
}

function joinUser(userId, username, team, photoUrl) {
  if (state.users.has(userId)) return state.users.get(userId);
  if (state.users.size >= CONFIG.maxFans) {
    // queue: replace a low-rank rear bot if needed
    const bots = [...state.users.values()].filter((u) => u.id.startsWith("bot:") && u.id !== state.heroId);
    bots.sort((a, b) => (a.hits + a.diamonds) - (b.hits + b.diamonds));
    if (bots[0]) removeUser(bots[0].id, { promote: false });
    else return null;
  }
  const u = makeUser(userId, username, team, photoUrl);
  restoreLedger(u);
  state.users.set(userId, u);
  spawnModel(u);
  if (!isBot(u)) {
    log("join", S("logJoin", { name: u.name, team: teamName(team) }));
    const emoji = team === "red" ? "🦅" : "🐤";
    showWelcome(S("welcome", { name: u.name, emoji }));
    u.highlightUntil = performance.now() + 1600;
  }
  return u;
}
function isBot(u) { return !!(u && (u.isBot || String(u.id || "").startsWith("bot:"))); }
function isRankable(u) { return !!(u && !isBot(u) && !u.hostOnly); }

function snapshotCredit(u) {
  if (!u) return null;
  return {
    id: u.id, name: u.name, team: u.team, photoUrl: u.photoUrl || null,
    diamonds: u.diamonds || 0, points: u.points || 0,
    sessionHits: u.sessionHits || 0, sessionLikes: u.sessionLikes || 0,
    sessionDiamonds: u.sessionDiamonds || 0,
    testDiamonds: u.testDiamonds || 0, testLikes: u.testLikes || 0,
    hostOnly: !!u.hostOnly, lockNotified: !!u.lockNotified,
    matchGen: state.matchGen || 1,
    at: performance.now()
  };
}
function stashUser(u, reason) {
  if (!u || isBot(u)) return;
  if (!state.ledger) state.ledger = new Map();
  const prev = state.ledger.get(u.id) || {};
  state.ledger.set(u.id, Object.assign({}, prev, snapshotCredit(u), { reason: reason || "rotated" }));
}
function restoreLedger(u) {
  if (!u || !state.ledger) return;
  const rec = state.ledger.get(u.id);
  if (!rec) return;
  u.diamonds = rec.diamonds || 0;
  u.points = rec.points || 0;
  u.sessionHits = rec.sessionHits || 0;
  u.sessionLikes = rec.sessionLikes || 0;
  u.sessionDiamonds = rec.sessionDiamonds || 0;
  u.testDiamonds = rec.testDiamonds || 0;
  u.testLikes = rec.testLikes || 0;
  if (rec.hostOnly) u.hostOnly = true;
  if (rec.lockNotified) u.lockNotified = true;
  if (rec.team && rec.matchGen === (state.matchGen || 1)) u.team = rec.team;
  state.ledger.delete(u.id);
}
function ledgerOf(id) { return state.ledger && state.ledger.get(id); }
function viewerWaitlist() {
  if (!state.waitlist) return [];
  return [...state.waitlist.entries()].filter(([, w]) => !w.hostOnly);
}

function removeUser(id, opts) {
  const u = state.users.get(id);
  if (!u) return;
  const reason = (opts && opts.reason) || "removed";
  if (!isBot(u)) {
    stashUser(u, reason);
    if ((!opts || opts.receipt !== false) && !u.hostOnly && reason === "rotated") {
      showReceipt(S("receiptRotated", { name: u.name }));
    }
  }
  if (u.model && u.model.parent) u.model.parent.remove(u.model);
  state.users.delete(id);
  if (!opts || opts.promote !== false) promoteWaitlist();
}

function evictForWaitlist() {
  if (!state.waitlist) return 0;
  // Host-test queue entries never force real viewers off the square (M4).
  const need = Math.min(viewerWaitlist().length, CONFIG.waitlistPromotePerRound || 8);
  if (need <= 0) return 0;
  const free = Math.max(0, CONFIG.maxFans - state.users.size);
  let toFree = need - free;
  if (toFree <= 0) return 0;
  const score = (u) => (u.hits || 0) + (u.rankHits || 0) + (u.sessionHits || 0) + (u.sessionLikes || 0) + (u.diamonds || 0) + (u.points || 0);
  const pick = (pred) => [...state.users.values()].filter(pred).sort((a, b) => score(a) - score(b));
  const bots = pick((u) => isBot(u) && u.id !== state.heroId);
  let n = 0;
  for (const u of bots) {
    if (n >= toFree) break;
    removeUser(u.id, { promote: false, reason: "rotated" });
    n++;
  }
  if (n >= toFree) return n;
  const reals = pick((u) => !isBot(u) && !u.hostOnly && u.id !== state.heroId && !u.captainOf);
  for (const u of reals) {
    if (n >= toFree) break;
    removeUser(u.id, { promote: false, reason: "rotated", receipt: true });
    n++;
  }
  return n;
}

function promoteWaitlist() {
  const entered = [];
  if (!state.waitlist) return entered;
  while (state.users.size < CONFIG.maxFans && state.waitlist.size) {
    // Skip host-test entries until a slot is naturally free; they never evict viewers.
    let firstKey = null, w = null;
    for (const [k, rec] of state.waitlist) {
      if (rec.hostOnly) continue;
      firstKey = k; w = rec; break;
    }
    if (!firstKey) break;
    state.waitlist.delete(firstKey);
    const u = joinUser(w.userId, w.username, w.team, w.photoUrl);
    if (!u) {
      const rest = [...state.waitlist.entries()];
      state.waitlist.clear();
      state.waitlist.set(firstKey, w);
      for (const [k, v] of rest) state.waitlist.set(k, v);
      break;
    }
    if (w.hostOnly) u.hostOnly = true;
    applyPending(u);
    if (!isBot(u) && !u.hostOnly) showReceipt(S("receiptPromoted", { name: u.name, team: teamName(u.team) }));
    traceOutcome({ status: "settled", reason: "waitlist-promoted", user: u.name, host: !!u.hostOnly });
    maybeStartLiveClock();
    entered.push(u.id);
  }
  return entered;
}

function log(kind, text) {
  const box = $("log"); if (!box) return;
  const el = document.createElement("div");
  el.className = "log-item " + (kind || "");
  el.textContent = text;
  box.prepend(el);
  while (box.children.length > 5) box.removeChild(box.lastChild);
}
function showPop(kind, big, sub, ms) {
  if (state.phase === "victory" && kind !== "win") return;
  const pop = $("pop"); if (!pop) return;
  pop.className = "";
  if (kind) pop.classList.add(kind);
  $("pop-big").textContent = big;
  $("pop-sub").textContent = sub || "";
  pop.classList.remove("show");
  void pop.offsetWidth;
  pop.classList.add("show");
  clearTimeout(showPop._t);
  showPop._t = setTimeout(() => pop.classList.remove("show"), ms || 2800);
}
function flash(a, color) {
  const f = $("flash"); if (!f) return;
  f.style.background = color || "#fff";
  f.style.opacity = String(a == null ? 0.5 : a);
  f.style.transition = "none";
  requestAnimationFrame(() => {
    f.style.transition = "opacity .45s ease";
    f.style.opacity = "0";
  });
}
function showWelcome(text) { enqueueMsg(text); }
function pushLine(team, amt) {
  if (state.phase !== "battle") return;
  const dir = team === "red" ? 1 : -1;
  state.line = Math.max(-1, Math.min(1, state.line + dir * amt));
  if (state.line >= 0.98) endWin("red");
  else if (state.line <= -0.98) endWin("blue");
}
function captains() {
  const out = { red: null, blue: null };
  // Public captain lanes never list a host-only test account (N5).
  for (const u of state.users.values()) if (u.captainOf && !u.hostOnly) out[u.captainOf] = u;
  return out;
}
function topCapos(n) {
  const byId = new Map();
  if (state.ledger) {
    for (const rec of state.ledger.values()) {
      if (rec && !rec.hostOnly && (rec.diamonds || 0) > 0) byId.set(rec.id, rec);
    }
  }
  for (const u of state.users.values()) {
    if (isRankable(u) && (u.diamonds || 0) > 0) byId.set(u.id, u);
  }
  return [...byId.values()].sort((a, b) => b.diamonds - a.diamonds).slice(0, n);
}
function topHits(n) {
  return [...state.users.values()].filter((u) => u.hits > 0).sort((a, b) => b.hits - a.hits).slice(0, n);
}

function endWin(team) {
  if (state.phase === "victory" || state.phase === "countdown" || state.phase === "matchover") return;
  state.phase = "victory";
  state.winner = team;
  if (team === "draw") {
    state.victoryAt = performance.now() + 6000;
    for (const u of state.users.values()) {
      u.anim = "idle"; playAnim(u, "idle"); u.fight = "idle"; u.y = 0;
    }
    showPop("win", S("endDraw"), S("drawSub"), 4000);
    showMvp(null);
    log("win", S("logDraw"));
    sfxWhistle();
    flash(0.4, "#fff4c0");
    if (state.playMode) enqueueCeremony({ kind: "round", priority: 80, ms: 2800 });
    updateMatchScore();
    applyPhaseUI();
    return;
  }
  state.scores[team] += 1;
  state.victoryAt = performance.now() + 7000;
  const winners = [...state.users.values()].filter((u) => u.team === team && isRankable(u));
  const fallback = [...state.users.values()].filter((u) => u.team === team);
  const pool = winners.length ? winners : fallback;
  pool.sort((a, b) => (b.rankHits * 2 + b.hits + b.diamonds) - (a.rankHits * 2 + a.hits + a.diamonds));
  state.mvp = pool[0] || null;
  if (state.mvp) {
    state.camFocus = { user: state.mvp, until: performance.now() + 2200, kind: "mvp" };
    startV17Shot("victory", state.mvp, 2200);
  }
  for (const u of state.users.values()) {
    if (u.team === team) { u.anim = "dance"; playAnim(u, "win"); u.fight = "idle"; }
    else { u.anim = "cry"; playAnim(u, "sit"); u.fight = "idle"; u.y = 0; }
  }
  showPop("win", team === "red" ? S("winBjk") : S("winFb"), S("winSub"), 4000);
  showMvp(state.mvp);
  log("win", S("logWin", { team: teamName(team) }));
  sfxWin(); sfxWhistle();
  flash(0.55, "#fff4c0");
  state.shake = 0.7;
  burstFX(0, 1, team);
  updateMatchScore();
  if (state.scores[team] >= 3) {
    state.matchOver = true;
    enqueueCeremony({ kind: "match", priority: 100, ms: 2000 });
  } else if (state.playMode) {
    enqueueCeremony({ kind: "round", priority: 80, ms: 2800 });
  }
  applyPhaseUI();
}
function showMvp(u) {
  const el = $("mvp"); if (!el) return;
  if (!u) { el.classList.remove("show"); el.innerHTML = ""; return; }
  const second = state.mode === "solo"
    ? (u.points || 0).toLocaleString() + " " + S("points")
    : (u.diamonds || 0).toLocaleString() + " 💎";
  el.innerHTML = '<div class="k">' + esc(S("mvpTitle")) + '</div><div class="n">@' + esc(u.name) + '</div><div class="s">' + u.hits + " 💥 · " + second + "</div>";
  el.classList.add("show");
}
function resetRoundCounters() {
  state.hits.red = 0;
  state.hits.blue = 0;
  for (const u of state.users.values()) {
    u.hits = 0;
    u.knockouts = 0;
    u.likes = 0;
    u.rankHits = 0;
    u.rankLikes = 0;
    u.points = state.mode === "solo" ? u.points : u.points;
  }
}
function resetBattle() {
  if (state.matchOver) { showMatchCard(); return; }
  state.phase = "battle";
  state.line = 0;
  state.winner = null;
  state.mvp = null;
  state.roundStart = performance.now();
  state.camFocus = null;
  // Full meters stay spendable (no decay). Otherwise carry half, not a quarter, so a late fill is not wasted.
  state.kapMeter = state.playMode ? (state.kapMeter >= 100 ? 100 : state.kapMeter * 0.5) : 0;
  resetRoundCounters();
  const el = $("mvp"); if (el) el.classList.remove("show");
  const cd = $("countdown"); if (cd) { cd.classList.remove("show"); cd.textContent = ""; }
  const end = $("end-card"); if (end) { end.classList.remove("show"); end.removeAttribute("inert"); end.removeAttribute("aria-hidden"); }
  state.pauseAccum = 0; state.pauseStarted = 0;
  state.clockPaused = (state.mode === "live" && (state.liveStatus !== "LIVE"));
  evictForWaitlist();
  promoteWaitlist();
  for (const u of state.users.values()) {
    u.y = 0; u.vx = 0; u.vy = 0; u.vz = 0;
    u.anim = "run"; u.fight = "hold"; u.partner = null; u.dashAt = performance.now() + 400 + Math.random() * 800;
    u.downT = 0; u.face = "idle";
    const side = u.team === "red" ? -1 : 1;
    u.x = side * 1.6;
  }
  updateMatchScore();
  applyPhaseUI();
}
function resetMatch() {
  state.scores.red = 0;
  state.scores.blue = 0;
  state.matchOver = false;
  state.matchGen = (state.matchGen || 1) + 1;
  for (const u of state.users.values()) {
    u.lockNotified = false;
    // Captaincy is match-scoped, consistent with the fresh New Match meter.
    if (u.captainOf) {
      u.captainOf = null;
      u.scale = 1;
      if (u._crown) clearProp(u);
    }
  }
  state.kapMeter = 0;
  hideAllCeremonies();
  const mc = $("match-card"); if (mc) { mc.classList.remove("show"); mc.removeAttribute("inert"); }
  resetBattle();
}
function showMatchCard() {
  const el = $("match-card"); if (!el) return;
  const end = $("end-card");
  if (end) { end.classList.remove("show"); end.setAttribute("inert", ""); end.setAttribute("aria-hidden", "true"); }
  const mvp = $("mvp"); if (mvp) mvp.classList.remove("show");
  const team = state.scores.red > state.scores.blue ? "red" : "blue";
  const score = CONFIG.teams.red.short + " " + state.scores.red + "–" + state.scores.blue + " " + CONFIG.teams.blue.short;
  $("match-title").textContent = CONFIG.lang === "tr"
    ? (team === "red" ? "MAÇ BEŞİKTAŞ'IN!" : "MAÇ FENERBAHÇE'NİN!")
    : S("matchWin", { team: teamName(team) });
  const hero = state.users.get(state.heroId);
  const bits = [S("matchSub", { score })];
  if (hero) {
    bits.push(S("endRoundHits") + ": " + (hero.hits || 0));
    if (state.mode === "solo") bits.push(S("endPoints") + ": " + (hero.points || 0));
    bits.push(S("yourHits") + " (" + S("scopeSession") + "): " + (hero.sessionHits || 0));
  }
  $("match-sub").textContent = bits.join(" · ");
  $("btn-newmatch").textContent = S("newMatch");
  el.classList.add("show");
  el.removeAttribute("inert");
  el.setAttribute("aria-hidden", "false");
  state.phase = "matchover";
  const btn = $("btn-newmatch");
  if (btn && typeof btn.focus === "function") setTimeout(() => btn.focus(), 50);
}
function realUserCount() {
  let n = 0;
  for (const u of state.users.values()) if (!isBot(u)) n++;
  return n;
}
function liveStandby() {
  return state.mode === "live" && (state.liveStatus !== "LIVE" || realUserCount() === 0);
}
function pauseClock() {
  if (state.clockPaused) return;
  state.clockPaused = true;
  state.pauseStarted = performance.now();
}
function resumeClock() {
  if (!state.clockPaused) return;
  if (state.pauseStarted) state.pauseAccum += performance.now() - state.pauseStarted;
  state.pauseStarted = 0;
  state.clockPaused = false;
}
function maybeStartLiveClock() {
  if (state.mode !== "live") return;
  if (liveStandby()) { pauseClock(); return; }
  if (state.phase === "battle" && !state.roundStart) state.roundStart = performance.now() - (state.pauseAccum || 0);
  resumeClock();
}
function battleElapsed(now) {
  if (!state.roundStart) return 0;
  const extra = (state.clockPaused && state.pauseStarted) ? (now - state.pauseStarted) : 0;
  return (now - state.roundStart - (state.pauseAccum || 0) - extra) / 1000;
}
function maybeEndOnTime(now) {
  if (state.phase !== "battle" || !state.roundStart) return;
  if (liveStandby()) { pauseClock(); return; }
  const left = CONFIG.roundSecs - battleElapsed(now);
  if (left <= 0) {
    // Timeout rule: draw only when |line| < drawBand (default 0.02 = 2% of the street).
    // Otherwise the side the line favours wins. HUD "FB 23%" is distance from centre, not share of the square.
    const band = CONFIG.drawBand != null ? CONFIG.drawBand : 0.02;
    if (Math.abs(state.line) < band) endWin("draw");
    else endWin(state.line > 0 ? "red" : "blue");
  }
}

function creditGift(user, diamonds, singleAmount) {
  user.diamonds += diamonds;
  user.sessionDiamonds = (user.sessionDiamonds || 0) + diamonds;
  user.lastActive = performance.now();
  if (singleAmount >= CONFIG.captainGift) makeCaptain(user, { fromGift: true, award: "diamonds", amount: user.diamonds });
}
function makeCaptain(user, opts) {
  if (!user) return;
  opts = opts || {};
  for (const u of state.users.values()) if (u.captainOf === user.team) {
    u.captainOf = null; u.scale = 1; if (u._crown) { clearProp(u); }
  }
  user.captainOf = user.team;
  user.scale = 1.35;
  user.highlightUntil = performance.now() + 4000;
  attachProp(user, "crown");
  const award = opts.award || (state.playMode && state.mode === "solo" && !opts.fromGift ? "points" : "diamonds");
  const amount = award === "points"
    ? ((opts.amount != null ? opts.amount : (user.points || 0)) + " " + S("points"))
    : String(opts.amount != null ? opts.amount : (user.diamonds || 0));
  const title = (user.hostOnly ? S("diagHost") + " · " : "") + S("newCapo", { name: user.name });
  enqueueCeremony({ kind: "captain", priority: 70, title, sub: S("newCapoSub", { name: user.name }), ms: 3200, popKind: "capo" });
  log("capo", S("logCaptain", { name: user.name, n: amount }));
  sfxHorn();
  if (!state.reducedFx) flash(0.45, "#f5e0a0");
  state.camFocus = { user, until: performance.now() + 2200, kind: "captain" };
}
function resolveGift(evt) {
  const name = String(evt.giftName || evt.gift || "").toLowerCase();
  const diamonds = Number(evt.diamondCount != null ? evt.diamondCount : (evt.giftValue != null ? evt.giftValue : 0));
  const repeats = Math.max(1, Number(evt.repeatCount) || 1);
  let kind = "small";
  if (/lion|aslan|universe|planet/.test(name)) kind = "lion";
  else if (/rose|g[uü]l|rosa/.test(name)) kind = "rose";
  else if (/heart|kalp/.test(name)) kind = "heart";
  else if (/donut|medium|football|ball/.test(name) || diamonds >= 30) kind = "medium";
  const def = { small: 1, rose: 1, heart: 1, medium: 50, lion: 1000 }[kind];
  const unit = diamonds > 0 ? diamonds : def;
  const total = unit * repeats;
  return { kind, diamonds: total, repeats, unit, single: kind === "lion" ? Math.max(unit, CONFIG.captainGift) : total };
}

function nearestRivals(user, n, maxD) {
  const list = [];
  for (const o of state.users.values()) {
    if (o.team === user.team || o.anim === "fly" || o.anim === "dazed") continue;
    const d = Math.hypot(o.x - user.x, o.z - user.z);
    if (d <= (maxD || 6)) list.push({ o, d });
  }
  list.sort((a, b) => a.d - b.d);
  return list.slice(0, n || 1).map((x) => x.o);
}

// v1.8: real-participant visual recognition. Never awards hits, points or gifts.
const V18_SPOT = { last: 0, until: 0, shown: 0 };
function v18Spotlight(u, label, opts = {}) {
  if (!isRankable(u) || (state.mode === "live" && u.hostOnly)) return false;
  const now = performance.now();
  if (!opts.preview && (state.phase !== "battle" || now < V18_SPOT.last + 2600)) return false;
  const el = $("v18-spotlight");
  if (!el) return false;
  el.classList.toggle("blue", u.team === "blue");
  el.querySelector(".team").textContent = u.team === "red" ? "BJK" : "FB";
  el.querySelector(".message").textContent = "@" + String(u.name || "fan").slice(0, 18) + " · " + label;
  el.classList.add("show");
  V18_SPOT.last = now;
  V18_SPOT.until = now + 2300;
  V18_SPOT.shown++;
  return true;
}
function updateV18Spotlight(now) {
  if (now < V18_SPOT.until && state.phase === "battle") return;
  const el = $("v18-spotlight");
  if (el && el.classList.contains("show")) el.classList.remove("show");
}
if (QPARAMS.get("visualQA") === "1")
  window.__v18SpotlightPreview = (team = "red") => {
    const u = [...state.users.values()].find(p => p.team === team && isRankable(p));
    return !!u && v18Spotlight(u, CONFIG.lang === "tr" ? "GÜÇLÜ VURUŞ!" : "BIG HIT!", {preview:true});
  };
function landHit(atk, vic, power, sfxWord) {
  if (!vic || state.phase !== "battle") return;
  const now = performance.now();
  atk.hits += 1;
  state.hits[atk.team] += 1;
  state.sessionHits[atk.team] += 1;
  atk.sessionHits = (atk.sessionHits || 0) + 1;
  if (state.rankingEvent && isRankable(atk)) atk.rankHits += 1;
  atk.lastActive = now;
  playAnim(vic, "hit", { once: true, restart: true });
  comicBurst((atk.x + vic.x) / 2, 1.5, (atk.z + vic.z) / 2, sfxWord || "BAM!");
  dustAt(vic.x, vic.z);
  impactFlash(vic.x, vic.y + 1.1, vic.z, atk.team);
  sfxHit();
  const hard = power >= 0.03 || Math.random() < 0.62 + power;
  // Highlight rare viewer-led knockbacks without repeatedly cutting between bots.
  if (hard && (atk.id === state.heroId || !isBot(atk))) startV17Shot("impact", atk, 1250);
  if (hard && isRankable(atk)) {
    v18Spotlight(atk, CONFIG.lang === "tr" ? "GÜÇLÜ VURUŞ!" : "BIG HIT!");
  }
  // Hit-stop + micro-shake so the impact reads, then the victim travels 1-3m.
  state.hitStop = hard ? 0.07 : 0.05;
  state.shake = Math.max(state.shake || 0, hard ? 0.5 : 0.22);
  if (hard) {
    knockBack(vic, atk, power);
    atk.knockouts += 1;
    atk.fight = "advance";
    atk.fightT = now + 700;
    pushLine(atk.team, 0.06 + power * 0.5);
    // teammates of the victim briefly back off so the whole front retreats
    for (const u of state.users.values()) {
      if (u.team !== vic.team || u.id === vic.id) continue;
      if (u.role !== "front" || u.anim === "fly") continue;
      if (Math.random() < 0.45) { u.fight = "flee"; u.fleeUntil = now + 550 + Math.random() * 300; }
    }
  } else if (Math.random() < 0.5) {
    // shove / slide along the ground toward their own end
    const dir = vic.team === "blue" ? 1 : -1;
    vic.vx = dir * (3.2 + power * 8);
    vic.vy = 0;
    vic.fight = "slide";
    vic.anim = "slide";
    vic.staggerT = now + 700;
    playAnim(vic, "hit", { once: true, restart: true });
    dustAt(vic.x, vic.z);
    pushLine(atk.team, 0.045 + power * 0.4);
    atk.fight = "chase";
    atk.fightT = now + 800;
  } else {
    vic.staggerT = now + 380;
    vic.fight = "flee";
    vic.fleeUntil = now + 700;
    const dir = vic.team === "blue" ? 1 : -1;
    vic.x += dir * (0.45 + power * 3);
    pushLine(atk.team, 0.04 + power * 0.3);
    atk.fight = "chase";
    atk.fightT = now + 800;
  }
  if (state.heroId === atk.id) haptic(hard ? 28 : 14);
}

function knockBack(victim, from, power) {
  const dir = victim.team === "blue" ? 1 : -1;
  // Horizontal launch so they travel 1.5–3m back toward their own end, then tumble.
  const travel = 1.7 + Math.random() * 1.3 + power * 6;
  victim.vx = dir * travel * 1.85;
  victim.vy = 3.4 + power * 4;
  victim.vz = (Math.random() - 0.5) * 1.4;
  victim.downT = performance.now() + 1700;
  victim.bounce = 1;
  victim.anim = "fly";
  victim.fight = "fly";
  victim.partner = null;
  playAnim(victim, "hit", { once: true, restart: true });
  starBurst(victim.x, victim.y + 1.5, victim.z);
  dustAt(victim.x, victim.z);
}

function swingAt(user, power, opts) {
  if (state.phase !== "battle") return;
  opts = opts || {};
  user.highlightUntil = Math.max(user.highlightUntil, performance.now() + 1800);
  user.lastActive = performance.now();
  playAnim(user, "punch", { once: true, restart: true });
  const special = opts.special;
  if (special) attachProp(user, Math.random() < 0.5 ? "pillow" : "chicken");
  const nHit = opts.multi || 1;
  const rivs = nearestRivals(user, nHit, 5.5);
  const word = special ? "BOM!" : (["BAM!", "ŞAK!", "POF!", "TÖK!"][hash(user.id + user.hits) % 4]);
  rivs.forEach((r, i) => {
    landHit(user, r, power * (1 - i * 0.15), word);
    if (i === 0) log("hit", S("logHit", { a: "@" + user.name, sfx: word, b: "@" + r.name }));
  });
  if (!rivs.length) {
    user.hits += 1;
    state.hits[user.team] += 1;
    state.sessionHits[user.team] += 1;
    user.sessionHits = (user.sessionHits || 0) + 1;
    if (state.rankingEvent && isRankable(user)) user.rankHits += 1;
    pushLine(user.team, power * 0.4);
  }
  state.shake = Math.max(state.shake, 0.16 + power * 2);
  setTimeout(() => { if (special) clearProp(user); if (!user.captainOf && user.role === "rear") attachProp(user, "scarf"); }, 700);
}

function giftLabel(g) {
  if (!g) return S("gift_small");
  const kind = String(g.kind || "").toLowerCase();
  const name = String(g.giftName || "").trim();
  const kindMapped = kind ? S("gift_" + kind) : "";
  const prettyKind = (kindMapped && kindMapped !== ("gift_" + kind)) ? kindMapped : "";
  if (name && !/^(small|medium|heart|lion|rose|gift)$/i.test(name) && name.toLowerCase() !== kind) {
    return name;
  }
  if (prettyKind) return prettyKind;
  if (name) {
    const nk = "gift_" + name.toLowerCase();
    const nm = S(nk);
    if (nm && nm !== nk) return nm;
  }
  return prettyKind || name || S("gift_small");
}
function eventIdOf(evt) {
  if (!evt) return "";
  const d = evt.data || {};
  return String(evt.eventId || evt.msgId || evt.id || d.msgId || d.eventId || "").trim();
}
function giftStreakKey(evt, meta) {
  const d = (evt && evt.data) || {};
  const g = resolveGift(evt);
  const uid = String((meta && meta.userId) || (evt && (evt.userId || evt.username)) || d.userId || d.username || "");
  return uid + "|" + String(d.giftId || (evt && evt.giftId) || g.giftName || g.kind);
}
function giftPhase(evt) {
  const d = (evt && evt.data) || {};
  const endFlag = (evt && evt.repeatEnd != null) ? evt.repeatEnd : d.repeatEnd;
  if (endFlag === false) return "open";
  if (endFlag === true) return "final";
  return "once";
}
function eventTickKey(evt, meta) {
  if (!evt) return "";
  const d = evt.data || {};
  const eid = eventIdOf(evt);
  const phase = giftPhase(evt);
  const rcRaw = evt.repeatCount != null ? evt.repeatCount : d.repeatCount;
  const rc = Number.isFinite(Number(rcRaw)) ? String(Number(rcRaw)) : "";
  if (eid) return "id:" + eid + "|" + phase + "|" + rc;
  // ID-less one-shots and open ticks are not deduped by streak key (each can be a new gift).
  // ID-less finals share a streak key so a repeated final is treated as redelivery.
  if (phase === "final") return "sk:" + giftStreakKey(evt, meta) + "|" + phase + "|" + rc;
  return "";
}
function noteLiveEvent(kind, name) {
  state.lastLiveEvent = { at: performance.now(), kind: kind || "event", name: name || "viewer" };
  updateLivePill();
}
const msgQueue = [];
let msgUntil = 0;
function enqueueMsg(text) {
  if (!text) return;
  const last = msgQueue[msgQueue.length - 1];
  if (last === text) return;
  if (msgQueue.length >= 4) msgQueue.shift();
  msgQueue.push(text);
}
function pumpMsg(now) {
  const el = $("receipt"); if (!el) return;
  if (now < msgUntil) return;
  if (!msgQueue.length) {
    if (el.classList.contains("show")) el.classList.remove("show");
    return;
  }
  el.textContent = msgQueue.shift();
  el.classList.remove("show");
  void el.offsetWidth;
  el.classList.add("show");
  msgUntil = now + 1200;
}
function showReceipt(text) { state.lastReceipt = text; enqueueMsg(text); }

const cerQueue = [];
let cerBusyUntil = 0;
function enqueueCeremony(item) {
  if (!item) return;
  if (item.coalesceKey) {
    const hit = cerQueue.find((x) => x.coalesceKey === item.coalesceKey);
    if (hit) { hit.count = (hit.count || 1) + 1; return; }
  }
  cerQueue.push(item);
  cerQueue.sort((a, b) => (b.priority || 0) - (a.priority || 0));
  while (cerQueue.length > 8) cerQueue.pop(); // drop lowest visual; credit already applied
  // Match/round results preempt a lower pop so only one ceremony owns the screen.
  if ((item.priority || 0) >= 80) {
    const pop = $("pop"); if (pop) pop.classList.remove("show");
    cerBusyUntil = 0;
  }
  pumpCeremony(performance.now());
}
function pumpCeremony(now) {
  if (cerBusyUntil > now) return;
  const item = cerQueue.shift();
  if (!item) return;
  if (item.kind === "match") {
    const end = $("end-card");
    if (end) { end.classList.remove("show"); end.setAttribute("inert", ""); end.setAttribute("aria-hidden", "true"); }
    showMatchCard();
    cerBusyUntil = now + (item.ms || 4000);
    return;
  }
  if (item.kind === "round") {
    if (state.matchOver) { enqueueCeremony({ kind: "match", priority: 100, ms: 4000 }); pumpCeremony(now); return; }
    showEndCard();
    cerBusyUntil = now + (item.ms || 2800);
    return;
  }
  if (item.title) showPop(item.popKind || "", item.title, item.sub || "", item.ms || 2800);
  cerBusyUntil = now + Math.min(item.ms || 2000, 3200);
}
function hideAllCeremonies() {
  const end = $("end-card"); if (end) { end.classList.remove("show"); end.setAttribute("inert", ""); }
  const mc = $("match-card"); if (mc) { mc.classList.remove("show"); mc.setAttribute("inert", ""); }
  const pop = $("pop"); if (pop) pop.classList.remove("show");
  const mvp = $("mvp"); if (mvp) mvp.classList.remove("show");
  cerQueue.length = 0;
  cerBusyUntil = 0;
}

function traceOutcome(o) {
  state.lastOutcome = Object.assign({ at: Date.now() }, o || {});
  const el = $("event-trace");
  if (!el) return;
  const parts = [];
  if (o.host) parts.push(S("diagHost"));
  parts.push(S("diag" + (o.status === "applied" ? "Applied" : o.status === "held" ? "Held" : o.status === "settled" ? "Settled" : o.status === "rejected" ? "Rejected" : "Applied")));
  if (o.reason) parts.push(o.reason);
  if (o.detail) parts.push(o.detail);
  el.textContent = S("eventTrace") + ": " + parts.join(" · ");
  el.dataset.status = o.status || "";
}
window.__lastOutcome = () => state.lastOutcome;

function evictBoundedMaps(now) {
  const pendingMax = 100, pendingTtl = 30 * 60 * 1000;
  // Free join-intent may expire; recognized gifts and their credits must not.
  const hasCredit = (rec) => !!(rec && ((rec.diamonds || 0) > 0 || (rec.gifts && rec.gifts.length)));
  for (const [k, rec] of state.pending) {
    if (!hasCredit(rec) && now - (rec.at || now) > pendingTtl) {
      state.pending.delete(k);
      traceOutcome({ status: "rejected", reason: "pending-expired", detail: k });
    }
  }
  // Unassigned gift records are retained until claimed or the session ends,
  // even if more than 100 free viewers have interacted in the meantime.
  while (state.pending.size > pendingMax) {
    let freeKey;
    for (const [k, rec] of state.pending) {
      if (!hasCredit(rec)) { freeKey = k; break; }
    }
    if (freeKey === undefined) break;
    state.pending.delete(freeKey);
  }
  if (state.seenEvents.size > 400) {
    const cut = now - 120000;
    for (const [k, t] of state.seenEvents) if (t < cut) state.seenEvents.delete(k);
  }
  if (state.settledStreaks && state.settledStreaks.size > 200) {
    const cut = now - 120000;
    for (const [k, rec] of state.settledStreaks) if ((rec && rec.at || 0) < cut) state.settledStreaks.delete(k);
  }
}

function pendingOf(userId, username, photoUrl, hostOnly) {
  const key = userId || String(username || "").toLowerCase();
  let rec = state.pending.get(key);
  if (!rec) {
    rec = { id: key, username, photoUrl, diamonds: 0, likes: 0, gifts: [], comments: 0, hostOnly: !!hostOnly, at: performance.now(), matchGen: state.matchGen, roundToken: state.roundStart || 0 };
    state.pending.set(key, rec);
  }
  rec.username = username || rec.username;
  if (photoUrl) rec.photoUrl = photoUrl;
  if (hostOnly) rec.hostOnly = true;
  return rec;
}
function replayGiftAction(user, g) {
  if (!user || state.phase !== "battle") return false;
  if (g.kind === "lion") {
    showPop("tifo", S("tifo"), S("tifoSub", { name: user.name }), 2800);
    if (!state.reducedFx) flash(0.65, user.team === "red" ? "#f2f2f0" : "#ffd000");
    sfxHorn();
    pushLine(user.team, 0.16);
    tifoStorm(user.team);
    state.shake = state.reducedFx ? 0.3 : 1.1;
    return true;
  }
  if (g.kind === "rose" || g.kind === "heart") {
    swingAt(user, 0.035, { special: true, multi: 3 });
    sfxGift();
    return true;
  }
  swingAt(user, 0.04);
  sfxGift();
  return true;
}
function applyPending(user) {
  if (!user) return { applied: false, reason: "no-user" };
  const rec = state.pending.get(user.id);
  if (!rec) return { applied: false, reason: "none" };
  if (rec.hostOnly) user.hostOnly = true;
  const sameRound = rec.roundToken && rec.roundToken === state.roundStart && state.phase === "battle";
  const results = [];
  if (rec.hostOnly) {
    user.testDiamonds = (user.testDiamonds || 0) + (rec.diamonds || 0);
    user.testLikes = (user.testLikes || 0) + (rec.likes || 0);
    // Visual test ceremony allowed, but not the public gift ledger.
    if (rec.gifts.some((g) => g.kind === "lion" || g.single >= CONFIG.captainGift)) {
      makeCaptain(user, { award: "diamonds", amount: user.testDiamonds, fromGift: true });
    }
    if (sameRound) rec.gifts.forEach((g) => replayGiftAction(user, g));
    results.push("test-ledger");
  } else {
    if (rec.diamonds) {
      user.diamonds += rec.diamonds;
      user.sessionDiamonds = (user.sessionDiamonds || 0) + rec.diamonds;
    }
    if (rec.likes) {
      user.likes += rec.likes;
      user.sessionLikes = (user.sessionLikes || 0) + rec.likes;
      if (isRankable(user)) user.rankLikes += rec.likes;
    }
    if (rec.diamonds >= CONFIG.captainGift || rec.gifts.some((g) => g.kind === "lion" || g.single >= CONFIG.captainGift)) {
      makeCaptain(user, { fromGift: true, award: "diamonds", amount: user.diamonds });
    }
    if (sameRound) rec.gifts.forEach((g) => replayGiftAction(user, g));
    else if (rec.gifts.length) results.push("action-expired");
  }
  state.pending.delete(user.id);
  const status = rec.hostOnly ? "settled" : "settled";
  const detail = rec.hostOnly
    ? S("testLedger", { n: user.testDiamonds || 0 })
    : ((sameRound ? S("pendingSettledAction", { name: user.name, gift: giftLabel(rec.gifts[0]) })
                  : S("pendingSettledCredit", { name: user.name, gift: giftLabel(rec.gifts[0]) })));
  if (!rec.hostOnly && rec.gifts.length) showReceipt(detail);
  traceOutcome({ status, reason: rec.hostOnly ? "host-test" : (sameRound ? "pending-settled-action" : "pending-settled-credit"), detail, host: !!rec.hostOnly, user: user.name });
  return { applied: true, hostOnly: !!rec.hostOnly, action: sameRound, diamonds: rec.diamonds, likes: rec.likes };
}

function jsonSafe(value) {
  const seen = new Set();
  try {
    return JSON.parse(JSON.stringify(value, (k, v) => {
      if (typeof v === "bigint") return String(v);
      if (typeof v === "function") return undefined;
      if (v && typeof v === "object") {
        if (seen.has(v)) return "[Circular]";
        seen.add(v);
      }
      return v;
    }));
  } catch (_) {
    try { return String(value); } catch (e) { return "[unserializable]"; }
  }
}
function captureRecord(kind, payload, extra) {
  if (!state.captureEnabled) return;
  if (!state.captureEvents) state.captureEvents = [];
  const rec = Object.assign({
    t: Date.now(),
    iso: new Date().toISOString(),
    perf: Math.round(performance.now()),
    kind,
    status: state.liveStatus || "",
    reconnect: {
      attempt: state.reconnectAttempt || 0,
      stopped: !!state.reconnectStopped,
      connecting: !!state.connecting
    },
    payload: jsonSafe(payload)
  }, extra || {});
  state.captureEvents.push(rec);
  if (state.captureEvents.length > 4000) state.captureEvents.splice(0, state.captureEvents.length - 4000);
  updateCaptureUI();
}
function captureBundle() {
  return {
    version: CONFIG.version,
    kind: "derbi-gunu-capture",
    capturedAt: new Date().toISOString(),
    startedAt: state.captureStartedAt || Date.now(),
    href: location.href,
    userAgent: navigator.userAgent,
    mode: state.mode,
    // Return an immutable-to-the-recorder snapshot, never a live array alias.
    events: (state.captureEvents || []).map((row) => jsonSafe(row))
  };
}
function downloadCapture() {
  const data = JSON.stringify(captureBundle(), null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "derbi-gunu-capture-" + new Date().toISOString().replace(/[:.]/g, "-") + ".json";
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}
async function copyCapture() {
  const data = JSON.stringify(captureBundle(), null, 2);
  try {
    await navigator.clipboard.writeText(data);
    showWelcome(S("captureCopied"));
  } catch (_) {
    showWelcome(S("shareFailed", { url: "" }));
  }
}
function updateCaptureUI() {
  const panel = $("capture-panel");
  if (!panel) return;
  panel.hidden = !state.captureEnabled;
  if (!state.captureEnabled) return;
  panel.classList.add("show");
  const n = (state.captureEvents || []).length;
  const title = $("capture-title"); if (title) title.textContent = S("captureTitle");
  const count = $("capture-count"); if (count) count.textContent = S("captureCount", { n });
  const hint = $("capture-hint"); if (hint) hint.textContent = S("captureHint");
  const dl = $("btn-capture-dl"); if (dl) dl.textContent = S("captureDownload");
  const cp = $("btn-capture-copy"); if (cp) cp.textContent = S("captureCopy");
  const log = $("capture-log");
  if (log) {
    const last = (state.captureEvents || []).slice(-8).reverse();
    log.innerHTML = last.map((e) => {
      const label = e.kind + (e.status ? " · " + e.status : "");
      const when = (e.iso || "").replace("T", " ").replace("Z", "");
      return '<div class="cap-row"><span class="t">' + esc(when) + '</span> <b>' + esc(label) + "</b></div>";
    }).join("");
  }
}
function replayCapture(bundle) {
  // An isolated browser tab is REQUIRED: never replay into an active LIVE, solo
  // or capture session. Open a fresh ?replaySandbox=1&demo=0 tab for testing.
  const sandbox = new URLSearchParams(location.search).get("replaySandbox") === "1";
  if (!sandbox || state.mode === "live") return [{ ok: false, reason: "requires-isolated-replay-sandbox" }];
  const sourceRows = Array.isArray(bundle && bundle.events) ? bundle.events : [];
  // A capture has raw-provider, mapped-event, and handle-result rows for ONE
  // action. Only mapped-event rows are actionable; diagnostic rows are not.
  const evs = sourceRows.filter(row => row && row.kind === "mapped-event")
    .slice(0, 4000).map(row => jsonSafe(row.payload));
  const wasCapturing = state.captureEnabled;
  const results = [];
  state.captureEnabled = false;
  try {
    for (const payload of evs) {
      if (!payload || !["chat", "like", "gift"].includes(payload.type)) continue;
      results.push(handleLiveEvent(payload));
    }
  } finally {
    state.captureEnabled = wasCapturing;
  }
  return results;
}

function handleLiveEvent(evt) {
  if (!evt) return { ok: false, reason: "empty" };
  if (state.captureEnabled) captureRecord("mapped-event", evt);
  const d = evt.data || {};
  const typeRaw = String(evt.type || d.type || "chat").toLowerCase();
  if (typeRaw === "streamend") {
    cancelReconnectTimer();
    state.reconnectStopped = true;
    setLiveStatus("DISCONNECTED");
    traceOutcome({ status: "applied", reason: "stream-end" });
    return { ok: true, type: "streamEnd" };
  }
  if (!["chat", "like", "gift"].includes(typeRaw)) {
    traceOutcome({ status: "rejected", reason: "unsupported-event-type" });
    return { ok: false, reason: "unsupported-event-type", status: "rejected" };
  }
  const type = typeRaw;
  const userId = String(evt.userId || d.userId || evt.username || d.username || d.name || d.uniqueId || "").trim();
  const username = String(evt.username || d.username || d.name || d.nickName || d.uniqueId || evt.userId || "fan").trim() || "fan";
  const photoUrl = evt.photoUrl || d.userPhotoUrl || null;
  const src = evt.source || evt.from || "";
  const hostEvt = src === "host" || src === "test";
  const prevRank = state.rankingEvent;
  state.rankingEvent = !hostEvt;
  // Never allow malformed counts to contaminate score or physics state.
  // Numeric values must be finite, positive and bounded; missing like counts
  // may use one (the documented feed does not specify a batching count).
  const validCount = (v, max) => typeof v === "number" && Number.isSafeInteger(v) && v >= 1 && v <= max;
  const likeCount = evt.likeCount ?? d.likeCount;
  const giftUnit = evt.diamondCount ?? d.giftDiamondCount ?? d.diamondCount ?? evt.giftValue;
  const giftRepeats = evt.repeatCount ?? d.repeatCount;
  if ((type === "like" && likeCount !== undefined && !validCount(likeCount, 100000))
    || (type === "gift" && giftUnit !== undefined && !validCount(giftUnit, 1000000))
    || (type === "gift" && giftRepeats !== undefined && !validCount(giftRepeats, 100000))) {
    state.rankingEvent = prevRank;
    traceOutcome({ status: "rejected", reason: "invalid-count", host: hostEvt });
    return { ok: false, reason: "invalid-count", status: "rejected" };
  }

  const eid = eventIdOf(evt);
  const now = performance.now();
  evictBoundedMaps(now);
  const tickKey = type === "gift"
    ? eventTickKey(evt, { userId, username })
    : (eid ? ("id:" + eid + "|once|") : "");
  if (tickKey) {
    const prev = state.seenEvents.get(tickKey);
    if (prev) {
      state.rankingEvent = prevRank;
      traceOutcome({ status: "rejected", reason: "duplicate", eventId: eid, tickKey, host: hostEvt, detail: S("diagDuplicate") });
      return { ok: false, reason: "duplicate", eventId: eid, tickKey, status: "rejected" };
    }
    state.seenEvents.set(tickKey, now);
  }

  noteLiveEvent(type, username);

  let user = userId ? state.users.get(userId) : null;

  if (type === "chat") {
    const comment = String(evt.comment || d.comment || d.content || "").slice(0, 60);
    if (!user) {
      const team = parseTeam(comment);
      if (!team) {
        pendingOf(userId || username.toLowerCase(), username, photoUrl, hostEvt).comments += 1;
        showReceipt(S("pendingChat", { name: username }));
        traceOutcome({ status: "held", reason: "no-team", host: hostEvt, user: username });
        state.rankingEvent = prevRank;
        return { ok: true, pending: true, type, status: "held" };
      }
      user = joinUser(userId || ("v:" + username.toLowerCase()), username, team, photoUrl);
      if (!user) {
        const rec = pendingOf(userId || username.toLowerCase(), username, photoUrl, hostEvt);
        rec.team = team;
        if (hostEvt) {
          // M4: host tests stay off the viewer waitlist so they never rotate real supporters out.
          showReceipt(S("diagCapacityHost"));
          traceOutcome({ status: "held", reason: "capacity-host", host: true, user: username, detail: S("diagCapacityHost") });
          state.rankingEvent = prevRank;
          return { ok: false, pending: true, type, reason: "capacity-host", status: "held", created: false, hostOnly: true, waitlisted: false };
        }
        state.waitlist.set(rec.id, { userId: rec.id, username, team, photoUrl, hostOnly: false });
        showReceipt(S("diagCapacity"));
        traceOutcome({ status: "held", reason: "capacity", host: false, user: username, detail: S("diagCapacity") });
        state.rankingEvent = prevRank;
        return { ok: false, pending: true, type, reason: "capacity", status: "held", created: false };
      }
      if (hostEvt) user.hostOnly = true;
      applyPending(user);
      showReceipt(S("receiptJoin", { name: user.name, team: teamName(team) }));
      if (state.phase === "battle") {
        user.highlightUntil = now + 2600;
        swingAt(user, 0.045);
      }
      maybeStartLiveClock();
      traceOutcome({ status: "applied", reason: "joined", host: hostEvt, user: user.name, team });
      state.rankingEvent = prevRank;
      return { ok: true, type, joined: true, status: "applied", created: true, hostOnly: !!user.hostOnly };
    }
    const wanted = parseTeam(comment);
    if (wanted && wanted !== user.team && !user.lockNotified) {
      user.lockNotified = true;
      showReceipt(S("teamLocked"));
    }
    if (state.phase !== "battle") {
      state.rankingEvent = prevRank;
      traceOutcome({ status: "held", reason: "wrong-phase", phase: state.phase, host: hostEvt, user: user.name });
      return { ok: true, type, phase: state.phase, status: "held", locked: !!(wanted && wanted !== user.team) };
    }
    user.highlightUntil = now + 2600;
    swingAt(user, 0.045);
    if (!isBot(user) && !hostEvt && !(wanted && wanted !== user.team)) showReceipt(S("receiptPush", { name: user.name }));
    traceOutcome({ status: "applied", reason: "swing", host: hostEvt, user: user.name });
    state.rankingEvent = prevRank;
    return { ok: true, type, status: "applied" };
  }

  if (!user) {
    const rec = pendingOf(userId || username.toLowerCase(), username, photoUrl, hostEvt);
    if (type === "like") {
      rec.likes += Number(evt.likeCount || d.likeCount || 1);
      showReceipt(S("pendingLike", { name: username }));
      traceOutcome({ status: "held", reason: "pending-like", host: hostEvt, user: username, likes: rec.likes });
    } else if (type === "gift") {
      const g = takeGiftCredit(evt, { userId: rec.id, username, hostEvt, pending: true });
      if (g && g.rejected) {
        traceOutcome({ status: "rejected", reason: g.reason, host: hostEvt, user: username });
        state.rankingEvent = prevRank;
        return { ok: false, reason: g.reason, status: "rejected" };
      }
      if (!g) {
        traceOutcome({ status: "held", reason: "streak-open", host: hostEvt, user: username });
        state.rankingEvent = prevRank;
        return { ok: true, type, held: true, status: "held" };
      }
      rec.diamonds += g.diamonds;
      rec.gifts.push(g);
      const giftNm = giftLabel(g);
      const canAct = state.phase === "battle" && !!state.roundStart;
      const pendingKey = canAct ? "pendingGiftAction" : "pendingGiftLobby";
      showReceipt(S(pendingKey, { name: username, gift: giftNm }));
      traceOutcome({ status: "held", reason: "pending-gift", host: hostEvt, user: username, diamonds: rec.diamonds, gift: giftNm, canAct });
    }
    state.rankingEvent = prevRank;
    return { ok: true, pending: true, type, status: "held", hostOnly: !!rec.hostOnly, diamonds: rec.diamonds, likes: rec.likes };
  }

  if (type === "like") {
    const n = Number(evt.likeCount || d.likeCount || 1);
    if (hostEvt) user.testLikes = (user.testLikes || 0) + n;
    else {
      user.likes += n;
      user.sessionLikes = (user.sessionLikes || 0) + n;
      if (state.rankingEvent && isRankable(user)) user.rankLikes += n;
    }
    user.highlightUntil = now + 1800;
    if (state.phase === "battle") swingAt(user, 0.03);
    traceOutcome({ status: "applied", reason: hostEvt ? "host-like" : "like", host: hostEvt, user: user.name });
    state.rankingEvent = prevRank;
    return { ok: true, type, status: "applied" };
  }

  if (type === "gift") {
    const g = takeGiftCredit(evt, { userId: user.id, username: user.name, hostEvt });
    if (g && g.rejected) {
      traceOutcome({ status: "rejected", reason: g.reason, host: hostEvt, user: user.name });
      state.rankingEvent = prevRank;
      return { ok: false, reason: g.reason, status: "rejected" };
    }
    if (!g) {
      traceOutcome({ status: "held", reason: "streak-open", host: hostEvt, user: user.name });
      state.rankingEvent = prevRank;
      return { ok: true, type, held: true, status: "held" };
    }
    if (hostEvt) {
      user.testDiamonds = (user.testDiamonds || 0) + g.diamonds;
      user.hostOnly = true;
    } else {
      creditGift(user, g.diamonds, g.single);
    }
    if (g.kind === "lion") {
      log("capo", S("logLion", { name: user.name }));
      if (state.phase === "battle") replayGiftAction(user, g);
      if (hostEvt && g.single >= CONFIG.captainGift) makeCaptain(user, { fromGift: true, award: "diamonds", amount: user.testDiamonds });
    } else if (state.phase === "battle") {
      replayGiftAction(user, g);
      if (!user.captainOf && g.kind !== "rose" && g.kind !== "heart") {
        enqueueCeremony({ kind: "super", priority: 40, title: S("superMove"), sub: S("superMoveSub", { name: user.name }), ms: 1800, coalesceKey: "super:" + user.id });
        state.camFocus = { user, until: now + 1400, kind: "super" };
      }
    }
    if (!isBot(user) && !hostEvt) showReceipt("@" + user.name + " · " + giftLabel(g) + (g.repeats > 1 ? " x" + g.repeats : ""));
    else if (hostEvt) traceOutcome({ status: "applied", reason: "host-gift", host: true, user: user.name, diamonds: g.diamonds, detail: S("testLedger", { n: user.testDiamonds || 0 }) });
    if (!hostEvt) traceOutcome({ status: "applied", reason: "gift", host: false, user: user.name, diamonds: g.diamonds });
    state.rankingEvent = prevRank;
    return { ok: true, type, diamonds: g.diamonds, status: "applied", hostOnly: hostEvt };
  }

  state.rankingEvent = prevRank;
  traceOutcome({ status: "rejected", reason: "unknown", host: hostEvt });
  return { ok: false, reason: "unknown", status: "rejected" };
}

// Gift streaks: ignore in-progress ticks (repeatEnd === false) and credit once
// at the end with the final repeatCount. Non-streak gifts (no repeatEnd) credit immediately.
function takeGiftCredit(evt, meta) {
  const d = evt.data || {};
  const g = resolveGift(evt);
  g.giftName = evt.giftName || d.giftName || g.kind;
  const endFlag = (evt.repeatEnd != null) ? evt.repeatEnd : d.repeatEnd;
  const userKey = giftStreakKey(evt, meta);
  if (endFlag === false) {
    // A new open tick starts a fresh combo and clears any prior settlement.
    if (state.settledStreaks) state.settledStreaks.delete(userKey);
    state.giftStreaks.set(userKey, { g, evt, meta: meta || {}, heldAt: performance.now(), userKey });
    return null; // wait for the closing tick, or expireStreaks()
  }
  if (endFlag === true) {
    const settled = state.settledStreaks && state.settledStreaks.get(userKey);
    // A second final without a new open tick is a redelivery (including ID-less repeats).
    if (settled && !state.giftStreaks.has(userKey)) {
      return { rejected: true, reason: "streak-redelivery", diamonds: 0, prev: settled };
    }
    const held = state.giftStreaks.get(userKey);
    const finalRepeats = Math.max(1, Number(evt.repeatCount || d.repeatCount || (held && held.g && held.g.repeats) || g.repeats || 1));
    const unit = Number(evt.diamondCount != null ? evt.diamondCount : (d.giftDiamondCount != null ? d.giftDiamondCount : g.diamonds / Math.max(1, g.repeats)));
    g.repeats = finalRepeats;
    g.diamonds = (Number(unit) || 1) * finalRepeats;
    g.single = g.kind === "lion" ? Math.max(g.diamonds, CONFIG.captainGift) : g.diamonds;
    if (settled && g.diamonds <= (settled.diamonds || 0)) {
      return { rejected: true, reason: "late-lower", diamonds: 0, prev: settled };
    }
    state.giftStreaks.delete(userKey);
    if (state.settledStreaks) state.settledStreaks.set(userKey, { diamonds: g.diamonds, repeats: finalRepeats, unit: Number(unit) || 1, at: performance.now(), eventId: eventIdOf(evt) });
    return g;
  }
  // No repeatEnd flag. Credit a one-shot immediately, but if the same
  // combo later reports a higher repeatCount (provider dropped the flag),
  // credit only the delta so 1+2+5 settles at 5, not 8.
  const rc = Math.max(1, Number(evt.repeatCount != null ? evt.repeatCount : (d.repeatCount != null ? d.repeatCount : g.repeats || 1)));
  const unit = Number(evt.diamondCount != null ? evt.diamondCount : (d.giftDiamondCount != null ? d.giftDiamondCount : (g.diamonds / Math.max(1, g.repeats || 1)))) || 1;
  const eid = eventIdOf(evt);
  const settled = state.settledStreaks && state.settledStreaks.get(userKey);
  const hasExplicitCount = evt.repeatCount != null || d.repeatCount != null;
  if (settled) {
    const age = performance.now() - (settled.at || 0);
    const lastCount = settled.repeats || Math.round((settled.diamonds || 0) / (settled.unit || unit || 1)) || 0;
    if (hasExplicitCount && rc > lastCount && age < 8000) {
      const delta = rc - lastCount;
      g.repeats = delta;
      g.diamonds = unit * delta;
      g.single = g.kind === "lion" ? Math.max(unit * rc, CONFIG.captainGift) : g.diamonds;
      settled.diamonds = (settled.diamonds || 0) + g.diamonds;
      settled.repeats = rc;
      settled.unit = unit;
      settled.at = performance.now();
      return g;
    }
    if (age < 8000 && rc <= lastCount && (!eid || eid === settled.eventId || !settled.eventId)) {
      return { rejected: true, reason: "streak-redelivery", diamonds: 0, prev: settled };
    }
  }
  if (hasExplicitCount) {
    g.repeats = rc;
    g.diamonds = unit * rc;
  } else {
    g.repeats = 1;
    g.diamonds = Number(evt.diamondCount != null ? evt.diamondCount : (d.giftDiamondCount != null ? d.giftDiamondCount : g.diamonds)) || g.diamonds || 1;
  }
  g.single = g.kind === "lion" ? Math.max(g.diamonds, CONFIG.captainGift) : g.diamonds;
  if (state.settledStreaks) state.settledStreaks.set(userKey, { diamonds: g.diamonds, repeats: hasExplicitCount ? rc : 1, unit, at: performance.now(), eventId: eid });
  return g;
}
function expireStreaks(now) {
  const ttl = 8000;
  for (const [key, rec] of [...state.giftStreaks]) {
    if (now - (rec.heldAt || 0) < ttl) continue;
    state.giftStreaks.delete(key);
    const g = rec.g && Object.assign({}, rec.g, { timedOut: true });
    if (!g) continue;
    const meta = rec.meta || {};
    const ev = rec.evt || {};
    const ev2 = Object.assign({}, ev, {
      repeatEnd: true,
      repeatCount: ev.repeatCount || (ev.data && ev.data.repeatCount) || g.repeats,
      eventId: (eventIdOf(ev) || key) + ":timeout",
      source: ev.source || (meta.hostEvt ? "host" : ev.source)
    });
    handleLiveEvent(ev2);
    traceOutcome({ status: "settled", reason: "streak-timeout", detail: key });
  }
}

window.handleLiveEvent = function(evt) {
  const result = handleLiveEvent(evt);
  if (state.captureEnabled) captureRecord("handle-result", { event: evt, result });
  return result;
};


/* ============================================================
   Brawl AI — front-line 1v1s, rear only chants
   ============================================================ */
function lineX() { return state.line * CONFIG.streetHalf * 0.85; }

function assignRoles() {
  const teams = { red: [], blue: [] };
  for (const u of state.users.values()) {
    if (u.anim === "fly" || u.anim === "dazed" || u.anim === "getup") continue;
    teams[u.team].push(u);
  }
  const rank = (a, b) => ((b.id === state.heroId ? 1e6 : 0) + (b.captainOf ? 1e5 : 0) + b.diamonds + b.hits) - ((a.id === state.heroId ? 1e6 : 0) + (a.captainOf ? 1e5 : 0) + a.diamonds + a.hits);
  teams.red.sort(rank); teams.blue.sort(rank);
  const frontN = LOW ? 7 : 9;
  for (const team of ["red", "blue"]) {
    teams[team].forEach((u, i) => { u.role = (i < frontN || u.id === state.heroId) ? "front" : "rear"; });
  }
}

function assignDuels() {
  const free = { red: [], blue: [] };
  for (const u of state.users.values()) {
    if (u.role !== "front") continue;
    if (u.anim === "fly" || u.anim === "dazed" || u.anim === "getup" || u.fight === "fly") continue;
    if (u.partner && state.users.get(u.partner) && state.users.get(u.partner).partner === u.id) continue;
    u.partner = null;
    free[u.team].push(u);
  }
  free.red.sort((a, b) => a.z - b.z);
  free.blue.sort((a, b) => a.z - b.z);
  const n = Math.min(free.red.length, free.blue.length);
  const z0 = -5.3, z1 = 5.3;
  for (let i = 0; i < n; i++) {
    const laneZ = n === 1 ? 0 : z0 + (i + 0.5) / n * (z1 - z0);
    free.red[i].partner = free.blue[i].id;
    free.blue[i].partner = free.red[i].id;
    free.red[i].laneZ = laneZ;
    free.blue[i].laneZ = laneZ;
    if (free.red[i].fight === "idle" || free.red[i].fight === "approach") free.red[i].fight = "hold";
    if (free.blue[i].fight === "idle" || free.blue[i].fight === "approach") free.blue[i].fight = "hold";
  }
  // occasional 2v1: leftover front joins a nearby duel
  const leftover = free.red.length > n ? free.red.slice(n) : free.blue.slice(n);
  leftover.forEach((u) => {
    if (Math.random() < 0.75) {
      const rivs = nearestRivals(u, 1, 5);
      if (rivs[0]) { u.partner = rivs[0].id; u.fight = "hold"; }
    }
  });
}

function faceToward(u, tx, tz, bias) {
  // Quaternius GLBs face +Z in bind pose (FBX convention), not Three's -Z.
  u.facing = Math.atan2(tx - u.x, tz - u.z);
  if (bias) u.facing += bias;
}
function moveToward(u, tx, tz, speed, dt) {
  const dx = tx - u.x, dz = tz - u.z;
  const d = Math.hypot(dx, dz);
  if (d < 0.05) { if (d > 0) faceToward(u, tx, tz); return d; }
  const step = Math.min(d, speed * dt);
  u.x += (dx / d) * step;
  u.z += (dz / d) * step;
  faceToward(u, tx, tz);
  return d;
}

const FRONT_GAP = 1.4; // metres from the tape; ~2.8m of no-man's-land so the two lines stay readable
function holdXFor(u) {
  const side = u.team === "red" ? -1 : 1;
  const extra = (u.role === "rear" && u.id !== state.heroId) ? 2.4 : 0;
  return lineX() + side * (FRONT_GAP + extra);
}

function updateDuel(u, dt, now) {
  if (u.id === state.heroId && now < (u.playerLock || 0)) {
    // After a player swing, walk them back to their line so the gap stays readable.
    if (now > (u.playerLock || 0) - 80) {
      const side = u.team === "red" ? -1 : 1;
      moveToward(u, holdXFor(u), u.laneZ != null ? u.laneZ : u.z, 5.2, dt);
    }
    return;
  }
  if (u.anim === "fly" || now < u.downT) return;
  if (now < u.staggerT) { playAnim(u, "hit"); return; }

  const v = u.partner ? state.users.get(u.partner) : null;
  const side = u.team === "red" ? -1 : 1;
  const lx = lineX();
  const holdX = holdXFor(u);

  if (u.role === "rear" && u.id !== state.heroId) {
    const row = Math.min(3, Math.abs(hash(u.id) % 3));
    const col = (hash(u.id) % 9) - 4;
    const tx = lx + side * (3.4 + row * 1.05);
    const tz = col * 1.25;
    const d = moveToward(u, tx, tz, 2.2, dt);
    if (d > 0.45) playAnim(u, "walk", { timeScale: 1.15 });
    else {
      playAnim(u, "win", { timeScale: 0.85 }); // cheer / scarf wave
      // Face the melee, 3/4 toward the camera so faces read.
      u.facing = (u.team === "red" ? Math.PI / 2 : -Math.PI / 2) + (u.team === "red" ? -0.45 : 0.45);
      u.y = Math.abs(Math.sin(state.time * 3 + hash(u.id))) * 0.04;
    }
    return;
  }

  const camBias = u.team === "red" ? -0.45 : 0.45;

  if (u.fight === "flee") {
    const tz = (u.laneZ != null) ? u.laneZ : u.z;
    moveToward(u, lx + side * 3.0, tz, 5.8, dt);
    playAnim(u, "walk", { timeScale: 2.0 });
    if (now > (u.fleeUntil || 0)) u.fight = "return";
    return;
  }
  if (u.fight === "advance" || u.fight === "return") {
    const tz = (u.laneZ != null) ? u.laneZ : u.z;
    const d = moveToward(u, holdX, tz, 5.4, dt);
    playAnim(u, "walk", { timeScale: 1.55 });
    if (d < 0.3 || now > (u.fightT || now + 800)) {
      u.fight = "hold";
      u.dashAt = now + 550 + Math.random() * 900;
    }
    return;
  }

  if (!v || v.anim === "fly" || v.fight === "fly" || v.fight === "crawl" || v.anim === "dazed") {
    if (u.fight === "chase" && v && (v.anim === "fly" || v.fight === "flee" || v.fight === "slide")) {
      moveToward(u, v.x - side * 0.4, v.z, 6.4, dt);
      playAnim(u, "walk", { timeScale: 2.0 });
      if (now > (u.fightT || 0)) { u.fight = "return"; u.fightT = now + 700; }
      return;
    }
    u.partner = null;
    u.fight = "hold";
    const holdZ = (u.laneZ != null) ? u.laneZ : ((hash(u.id) % 11) - 5) * 0.95;
    moveToward(u, holdX, holdZ, 4.6, dt);
    playAnim(u, "walk", { timeScale: 1.45 });
    return;
  }

  const dist = Math.hypot(v.x - u.x, v.z - u.z);
  faceToward(u, v.x, v.z, camBias);

  if (u.fight === "chase") {
    playAnim(u, "walk", { timeScale: 2.05 });
    moveToward(u, v.x - side * 0.35, v.z, 6.5, dt);
    if (dist < 1.15) { u.fight = "tackle"; u.fightT = now + 520; u.hitThisMove = false; }
    else if (now > (u.fightT || 0) + 200) { u.fight = "return"; u.fightT = now + 700; }
    return;
  }

  if (u.fight === "windup") {
    faceToward(u, v.x, v.z, camBias);
    playAnim(u, "shove");
    moveToward(u, v.x, v.z, 2.2, dt);
    if (now > u.fightT) {
      u.fight = "punch";
      u.fightT = now + 500;
      u.hitThisMove = false;
    }
    return;
  }

  // HOLD the line ~1m behind the tape so two fronts stay readable, then dash across.
  if (u.fight === "hold" || u.fight === "approach" || u.fight === "idle") {
    const tz = (u.laneZ != null) ? u.laneZ : u.z;
    const d = moveToward(u, holdX, tz, 4.8, dt);
    faceToward(u, v.x, v.z, camBias);
    if (d > 0.28) playAnim(u, "walk", { timeScale: 1.35 });
    else playAnim(u, "idle");
    if (u.dashAt == null) u.dashAt = now + 200 + (hash(u.id) % 900);
    // Stagger dashes so the whole front doesn't collapse into the gap at once.
    const mateCharging = v && (v.fight === "charge" || v.fight === "windup" || v.fight === "punch");
    let teamCharging = 0;
    for (const o of state.users.values()) {
      if (o.team === u.team && (o.fight === "charge" || o.fight === "windup" || o.fight === "punch" || o.fight === "tackle")) teamCharging++;
    }
    if (!mateCharging && teamCharging < 2 && now >= u.dashAt) {
      u.fight = "charge";
      u.fightT = now + 900;
    }
    return;
  }

  // CHARGE: dash across the no-man's-land at this opponent, wind up, hit, then return.
  if (u.fight === "charge" || (dist > 2.6 && u.fight !== "punch" && u.fight !== "tackle" && u.fight !== "grapple" && u.fight !== "windup")) {
    const tz = (u.laneZ != null) ? u.laneZ * 0.75 + v.z * 0.25 : v.z;
    const tx = v.x + side * 0.75;
    moveToward(u, tx, tz, 7.6, dt);
    faceToward(u, v.x, v.z, camBias);
    playAnim(u, "walk", { timeScale: 2.15 });
    if (dist < 1.25) {
      u.fight = "windup";
      u.fightT = now + 160 + Math.random() * 100;
      playAnim(u, "shove", { restart: true });
    } else if (now > (u.fightT || now) + 200) {
      u.fight = "return";
      u.fightT = now + 700;
    }
    return;
  }

  if (u.fight === "square") {
    // brief sidestep, then go back on the attack
    u.z += side * dt * 1.6;
    playAnim(u, "idle");
    faceToward(u, v.x, v.z, camBias);
    if (now > u.fightT) { u.fight = "return"; u.fightT = now + 700; }
    return;
  }

  if (u.fight === "punch") {
    playAnim(u, "punch", { once: true, restart: !u.hitThisMove });
    moveToward(u, v.x, v.z, 2.4, dt);
    if (!u.hitThisMove && u.currentAction && u.currentAction.time > 0.16) {
      u.hitThisMove = true;
      landHit(u, v, 0.055, ["BAM!", "ŞAK!", "POF!"][hash(u.id + now) % 3]);
    }
    if (now > u.fightT) { u.fight = "return"; u.fightT = now + 700; }
    return;
  }

  if (u.fight === "dodge") {
    playAnim(u, "walk", { timeScale: 1.7 });
    u.z += side * dt * 2.4;
    if (now > u.fightT) { u.fight = "return"; u.fightT = now + 700; }
    return;
  }

  if (u.fight === "grapple") {
    moveToward(u, (u.x + v.x) / 2 + side * 0.18, (u.z + v.z) / 2, 2.4, dt);
    playAnim(u, "grab");
    u.y = 0.02 + Math.sin(state.time * 10) * 0.03;
    if (now > u.fightT) {
      landHit(u, v, 0.06, "BOM!");
      u.fight = "advance"; u.fightT = now + 500; u.y = 0;
    }
    return;
  }

  if (u.fight === "tackle") {
    moveToward(u, v.x, v.z, 7.0, dt);
    playAnim(u, "punch", { once: true, restart: !u.hitThisMove, timeScale: 1.25 });
    if (!u.hitThisMove && dist < 1.15) {
      u.hitThisMove = true;
      landHit(u, v, 0.08, "BAM!");
    }
    if (now > u.fightT) { u.fight = "return"; u.fightT = now + 700; }
    return;
  }

  u.fight = "hold";
}

function updatePeople(dt, now) {
  assignRoles();
  if (state.phase === "battle") assignDuels();
  const lx = lineX();
  updateTerritory(lx);

  for (const u of state.users.values()) {
    if (!u.model) spawnModel(u);

    // physics: fly / bounce / get up
    if (u.anim === "fly") {
      u.vy -= 14 * dt;
      u.x += u.vx * dt;
      u.z += u.vz * dt;
      u.y += u.vy * dt;
      u.vx *= 0.985; u.vz *= 0.985;
      u.facing += dt * 8;
      if (u.y <= 0 && u.vy < 0) {
        if (u.bounce > 0) {
          u.y = 0.02; u.vy = 2.0; u.vx *= 0.55; u.bounce -= 1;
          dustAt(u.x, u.z);
          playAnim(u, "hit", { once: true, restart: true });
        } else {
          u.y = 0; u.vy = 0; u.vx *= 0.3;
          u.anim = "dazed";
          u.fight = "dazed";
          playAnim(u, "sit");
          u.downT = now + 1100;
        }
      }
    } else if (u.anim === "dazed" && now < u.downT) {
      u.y = 0; u.vx *= 0.8;
      playAnim(u, "sit");
    } else if (u.fight === "slide") {
      u.x += u.vx * dt;
      u.vx *= 0.86;
      u.y = 0;
      playAnim(u, "hit");
      if (Math.abs(u.vx) > 1.2 && ((now / 80) | 0) % 2 === 0) dustAt(u.x, u.z);
      if (Math.abs(u.vx) < 0.35 || now > u.staggerT) {
        u.vx = 0; u.fight = "flee"; u.fleeUntil = now + 500; u.anim = "fight";
      }
    } else if (u.anim === "dazed" && now >= u.downT) {
      // Crawl back to their own end, then get up and rejoin the line.
      u.anim = "crawl";
      u.fight = "crawl";
      u.downT = now + 1300;
      playAnim(u, "walk", { timeScale: 0.5 });
    } else if (u.anim === "crawl") {
      const sideC = u.team === "red" ? -1 : 1;
      moveToward(u, lineX() + sideC * 3.1, u.z, 1.35, dt);
      playAnim(u, "walk", { timeScale: 0.55 });
      u.y = 0.02;
      if (now >= u.downT || Math.abs(u.x - (lineX() + sideC * 3.1)) < 0.4) {
        u.anim = "getup";
        playAnim(u, "stand", { once: true, restart: true });
        u.downT = now + 750;
        u.y = 0;
      }
    } else if (u.anim === "getup" && now >= u.downT) {
      u.anim = "fight";
      u.fight = "hold";
    } else if (state.phase === "lobby") {
      const side = u.team === "red" ? -1 : 1;
      const holdX = side * (2.6 + (u.role === "rear" ? 1.4 : 0));
      moveToward(u, holdX, u.z, 1.1, dt);
      faceToward(u, 0, u.z, 0);
      playAnim(u, Math.abs(u.x - holdX) > 0.25 ? "walk" : "idle");
      u.y = 0;
    } else if (state.phase === "victory" || state.phase === "countdown" || state.phase === "matchover") {
      // already set dance/cry
    } else if (u.captainOf) {
      u.x = lx + (u.team === "red" ? -1 : 1) * 1.5;
      u.z = 0.55;
      u.y = 0.15;
      u.facing = 0.15; // face the camera so the crown and kit read
      playAnim(u, "win");
    } else {
      updateDuel(u, dt, now);
    }

    u.z = Math.max(-6.4, Math.min(6.4, u.z));
    u.x = Math.max(-CONFIG.streetHalf - 5, Math.min(CONFIG.streetHalf + 5, u.x));
    if (u.y < 0) u.y = 0;

    if (u.mixer) {
      // skip far mixers on low every other frame
      const dx = u.x - camera.position.x, dz = u.z - camera.position.z;
      const far = (dx * dx + dz * dz) > 420;
      if (!(LOW && far && ((now / 16) | 0) % 2)) u.mixer.update(dt);
    }
    placeModel(u);
  }
  updateRings();
  fadeNearCharacters();
}

/* ============================================================
   Play mode
   ============================================================ */
const RAND_NAMES = ["kartal_34","carsi_07","kanarya","besiktasli","fenerli","pablo","ayse_34","emre_07","cemfan","defne35"];
function randomHandle() { return RAND_NAMES[(Math.random() * RAND_NAMES.length) | 0] + (Math.random() * 90 + 10 | 0); }

function showStartScreen() {
  const el = $("start-screen");
  if (!el) return;
  $("hero-name").value = $("hero-name").value || randomHandle();
  $("start-screen").classList.add("show");
  const pt = $("start-screen").querySelector("h2"); if (pt) pt.textContent = S("pickTitle");
  const ps = $("start-screen").querySelector(".sub"); if (ps) ps.textContent = S("pickSub");
}

function startPlay(team, name) {
  $("start-screen").classList.remove("show");
  document.body.classList.add("playing");
  $("play-hud").classList.add("on");
  state.playMode = true;
  state.mode = "solo";
  state.kapMeter = 0;
  state.combo = 0;
  const nm = (name || randomHandle()).slice(0, 18);
  const id = "hero:" + nm.toLowerCase();
  let u = state.users.get(id) || joinUser(id, nm, team);
  u.isBot = false;
  state.heroId = u.id;
  u.role = "front";
  u.highlightUntil = 1e15;
  u.scale = 1.12;
  const side = team === "red" ? -1 : 1;
  u.x = side * FRONT_GAP; u.z = 0.2; u.fight = "hold"; u.dashAt = performance.now() + 300;
  state.hintUntil = performance.now() + 10000;
  const hint = $("hint-tap");
  if (hint) { hint.textContent = S("tapHint"); hint.classList.add("on"); }
  setTimeout(() => hint && hint.classList.remove("on"), 10000);
  const su = $("btn-super");
  if (su) {
    su.innerHTML = '<span id="super-label">' + S("superBtn").replace(" ", " <br>") + '</span><span id="super-cd" hidden></span>';
  }
  $("btn-kaptan").innerHTML = S("kapBtnPts") + '<div class="meter"><i id="kap-meter"></i></div><small id="kap-cue"></small>';
  ensureCrowd(14);
  const tog = $("bot-toggle");
  if (tog) { tog.checked = true; }
  startBot();
  state.phase = "battle";
  state.roundStart = performance.now();
  resetRoundCounters();
  // hero starts the round with a clean personal tally
  u.hits = 0; u.knockouts = 0; u.rankHits = 0; u.likes = 0; u.rankLikes = 0;
  setLiveStatus("SOLO");
  updateMatchScore();
}

function ensureCrowd(perSide) {
  const counts = { red: 0, blue: 0 };
  for (const u of state.users.values()) counts[u.team]++;
  const names = ["zeynep","burak","elif","ali","merve","kaan","efe","osman","aysel","yusuf","fatma","can","mehmet","ayse","deniz","selin","onur","emre","ceren","berk","nazli","arda","sude","tolga","asli","cem","baris","gizem","busra","ahmet"];
  const suf = ["_34","_carsi","_07","_ist","_1903","_1907","fan",""];
  let i = 0;
  for (const team of ["red", "blue"]) {
    while (counts[team] < perSide && state.users.size < CONFIG.maxFans) {
      const nm = names[i % names.length] + suf[(i * 3) % suf.length];
      i++;
      const id = "bot:" + team + ":" + nm + i;
      if (state.users.has(id)) continue;
      const u = joinUser(id, nm, team);
      if (u) counts[team]++;
    }
  }
}

function heroAttack(superMove) {
  if (!state.playMode || state.phase !== "battle") return;
  const u = state.users.get(state.heroId);
  if (!u) return;
  const now = performance.now();
  if (!superMove && now - state.lastTap < 160) return; // debounce
  // combo rhythm
  if (now - state.lastTap < 800) state.combo += 1;
  else state.combo = 1;
  state.lastTap = now;
  state.comboUntil = now + 900;
  const hint = $("hint-tap");
  if (hint) hint.classList.remove("on");
  u.playerLock = now + 480;
  u.highlightUntil = 1e15;
  const bonus = Math.min(0.02, (state.combo - 1) * 0.003);
  const power = superMove ? 0.075 : (0.05 + bonus);
  if (superMove) {
    attachProp(u, "pillow");
    showPop("", S("superMove"), S("superMoveSub", { name: u.name }), 1400);
    swingAt(u, power, { special: true, multi: 3 });
    state.kapMeter = Math.min(100, state.kapMeter + 18);
    haptic(40);
  } else {
    swingAt(u, power);
    state.kapMeter = Math.min(100, state.kapMeter + 8);
  }
  if (state.combo >= 3) {
    const c = $("combo");
    if (c) { c.textContent = S("combo", { n: state.combo }); c.classList.remove("on"); void c.offsetWidth; c.classList.add("on"); }
  }
  updateKapUI();
}

function tryKaptan() {
  if (state.kapMeter < 100 || !state.playMode || (state.phase !== "battle" && state.phase !== "victory")) return;
  const u = state.users.get(state.heroId);
  if (!u) return;
  // Solo meter awards points, never gift diamonds.
  u.points = (u.points || 0) + 100;
  makeCaptain(u, { award: "points", amount: u.points });
  state.kapMeter = 0;
  updateKapUI();
  haptic(50);
}
function updateKapUI() {
  const bar = $("kap-meter"); if (bar) bar.style.width = state.kapMeter + "%";
  const btn = $("btn-kaptan");
  const hero = state.heroId && state.users.get(state.heroId);
  const isCap = !!(hero && hero.captainOf);
  if (btn) {
    btn.classList.toggle("ready", state.kapMeter >= 100 && !isCap);
    btn.classList.toggle("is-captain", isCap);
    btn.disabled = !!isCap;
    btn.setAttribute("aria-disabled", isCap ? "true" : "false");
  }
  let cue = $("kap-cue");
  if (!cue && btn) { cue = document.createElement("small"); cue.id = "kap-cue"; btn.appendChild(cue); }
  if (isCap) {
    if (btn && btn.dataset.capState !== "on") {
      btn.dataset.capState = "on";
      btn.innerHTML = S("youAreCaptain") + '<div class="meter"><i id="kap-meter"></i></div><small id="kap-cue"></small>';
      cue = $("kap-cue");
    }
    if (cue) cue.textContent = ""; // avoid duplicating the captain label
    const bar = $("kap-meter"); if (bar) bar.style.width = "100%";
  } else {
    if (btn && btn.dataset.capState === "on") {
      btn.dataset.capState = "off";
      btn.innerHTML = S("kapBtnPts") + '<div class="meter"><i id="kap-meter"></i></div><small id="kap-cue"></small>';
      cue = $("kap-cue");
      const bar = $("kap-meter"); if (bar) bar.style.width = state.kapMeter + "%";
    }
    if (cue) cue.textContent = S("kapCue", { n: Math.round(state.kapMeter) });
  }
  const sup = $("btn-super");
  const left = state.superUntil - performance.now();
  if (sup) {
    let label = $("super-label");
    if (!label) {
      label = document.createElement("span");
      label.id = "super-label";
      // Keep any existing countdown node; put the label first.
      sup.insertBefore(label, sup.firstChild);
    }
    if (!label.textContent || performance.now() >= state.superUntil) label.innerHTML = S("superBtn").replace(" ", " <br>");
    let cd = $("super-cd");
    if (!cd) {
      cd = document.createElement("span");
      cd.id = "super-cd";
      sup.appendChild(cd);
    }
    sup.classList.toggle("cd", left > 0);
    if (left > 0) {
      const sec = Math.ceil(left / 1000);
      cd.hidden = false;
      cd.textContent = " " + S("superCd", { n: sec });
      sup.setAttribute("aria-label", S("superBtn") + " " + S("superCd", { n: sec }));
    } else {
      cd.hidden = true;
      cd.textContent = "";
      label.innerHTML = S("superBtn").replace(" ", " <br>");
      sup.setAttribute("aria-label", S("superBtn"));
    }
  }
  const c = $("combo");
  if (c) {
    if (state.playMode && state.combo >= 3 && performance.now() < state.comboUntil) {
      c.textContent = S("combo", { n: state.combo });
      c.classList.add("on");
    } else {
      c.classList.remove("on");
    }
  }
}

function heroContributed(u) {
  if (!u) return false;
  return ((u.hits || 0) + (u.knockouts || 0) + (u.rankHits || 0) + (u.rankLikes || 0) + (u.likes || 0)) > 0;
}

function showEndCard() {
  const el = $("end-card"); if (!el) return;
  if (state.matchOver) return; // match ceremony owns the result
  const mvp = $("mvp"); if (mvp) mvp.classList.remove("show");
  el.removeAttribute("inert");
  el.setAttribute("aria-hidden", "false");
  const u = state.users.get(state.heroId);
  const won = !!(u && u.team === state.winner);
  const contributed = heroContributed(u);
  if (state.winner === "draw") $("end-title").textContent = S("endDraw");
  else if (won && contributed) $("end-title").textContent = S("endWin");
  else if (won) $("end-title").textContent = S("teamWin");
  else $("end-title").textContent = S("endLose");
  const participants = [...state.users.values()].filter((x) => isRankable(x) && ((x.hits || 0) + (x.rankHits || 0) + (x.rankLikes || 0) + (x.knockouts || 0)) > 0)
    .sort((a, b) => (b.rankHits * 2 + b.rankLikes + b.hits) - (a.rankHits * 2 + a.rankLikes + a.hits));
  let rankHtml;
  if (participants.length < 2) {
    rankHtml = S("yourRank") + ": <b>" + S("rankNone") + "</b> <small>(" + S("scopeRound") + " · " + S("rankHint") + ")</small>";
  } else {
    const rank = u ? participants.findIndex((x) => x.id === u.id) + 1 : "—";
    rankHtml = S("yourRank") + " (" + S("scopeRound") + "): <b>" + rank + " / " + participants.length + "</b>";
  }
  const linePct = Math.round(((state.line + 1) / 2) * 100);
  const lineTxt = (state.line >= 0 ? "BJK " : "FB ") + Math.abs(Math.round(state.line * 100)) + "%";
  const pts = u && state.mode === "solo" ? ("<br>" + S("endPoints") + ": <b>" + (u.points || 0) + "</b>") : "";
  const next = won ? "" : ("<br>" + S("lossSummary", { hits: u ? u.hits : 0, kos: u ? u.knockouts : 0, line: lineTxt }));
  const idleNote = (!state.winner || state.winner === "draw") ? "" : ((won && !contributed) ? ("<br>" + S("idleWinNote")) : "");
  $("end-stats").innerHTML =
    S("yourHits") + " (" + S("scopeRound") + "): <b>" + (u ? u.hits : 0) + "</b><br>" +
    S("yourKOs") + " (" + S("scopeRound") + "): <b>" + (u ? u.knockouts : 0) + "</b><br>" +
    S("endTerritory") + ": <b>" + lineTxt + "</b><br>" +
    rankHtml + pts + next + idleNote +
    "<br><small>" + S("timeoutRule") + "</small>";
  $("btn-replay").textContent = S("playAgain");
  $("btn-share").textContent = S("share");
  el.classList.add("show");
  const btn = $("btn-replay");
  if (btn && typeof btn.focus === "function") setTimeout(() => btn.focus(), 50);
}

function sharePageUrl() {
  try { return location.origin + location.pathname.replace(/index\.html$/, ""); }
  catch (_) { return (location.href || "").split("?")[0]; }
}
function showShareFallback(url, copied) {
  const box = $("share-fallback");
  const msg = $("share-fallback-msg");
  const input = $("share-url");
  const copyBtn = $("btn-share-copy");
  const closeBtn = $("btn-share-close");
  if (msg) msg.textContent = copied ? S("shareCopied") : S("shareFailed", { url });
  if (input) { input.value = url; input.removeAttribute("hidden"); }
  if (copyBtn) copyBtn.textContent = S("shareCopyBtn");
  if (closeBtn) closeBtn.textContent = S("shareClose");
  if (box) {
    box.hidden = false;
    box.classList.add("show");
    box.removeAttribute("inert");
  }
  showWelcome(copied ? S("shareCopied") : S("shareFailed", { url }));
}
function hideShareFallback() {
  const box = $("share-fallback");
  if (!box) return;
  box.classList.remove("show");
  box.hidden = true;
}
async function copyShareUrl() {
  const url = ($("share-url") && $("share-url").value) || sharePageUrl();
  try {
    await navigator.clipboard.writeText(url);
    showWelcome(S("shareCopied"));
    const msg = $("share-fallback-msg");
    if (msg) msg.textContent = S("shareCopied");
    return true;
  } catch (_) {
    if ($("share-url")) $("share-url").select();
    showWelcome(S("shareFailed", { url }));
    return false;
  }
}
async function shareGame() {
  const url = sharePageUrl();
  const text = S("shareText");
  try {
    if (navigator.share) {
      await navigator.share({ title: S("shareTitle"), text, url });
      return;
    }
    await navigator.clipboard.writeText(url);
    showShareFallback(url, true);
  } catch (_) {
    showShareFallback(url, false);
  }
}

/* ============================================================
   UI boards, labels, FX
   ============================================================ */
const crestURL = {};
function makeCrest(team) {
  const T = CONFIG.teams[team];
  const c = document.createElement("canvas");
  c.width = 64; c.height = 64;
  const g = c.getContext("2d");
  g.fillStyle = "#" + T.colors.primary.toString(16).padStart(6, "0");
  g.beginPath(); g.arc(32, 32, 30, 0, Math.PI * 2); g.fill();
  g.fillStyle = "#" + T.colors.secondary.toString(16).padStart(6, "0");
  g.font = "bold 22px sans-serif"; g.textAlign = "center"; g.textBaseline = "middle";
  g.fillText(T.short, 32, 33);
  return c.toDataURL();
}
function applyPhaseUI() {
  const set = (id, val) => { const n = $(id); if (n) n.textContent = val; };
  set("banner-title", S("title"));
  set("join1", S("join1")); set("join2", S("join2")); set("join3", S("join3")); set("join4", S("join4"));
  set("panel-hint", S("panelHint"));
  set("panel-badge", S("panelBadge"));
  set("bot-label-text", S("botEvents"));
  set("bot-hint", S("botEventsHint"));
  set("lbl-fake-user", S("panelUser"));
  set("lbl-fake-comment", S("panelComment"));
  set("panel-fine", S("panelFine"));
  set("btn-like", S("btnLike"));
  set("btn-rose", S("btnRose"));
  set("btn-med", S("btnMed"));
  set("btn-lion", S("btnLion"));
  set("load-title", S("loadTitle"));
  set("pick-title", S("pickTitle"));
  set("pick-sub", S("pickSub"));
  set("lbl-hero-name", S("yourName"));
  set("pick-rules-title", S("rulesTitle"));
  set("rule-win", S("rulesWin"));
  set("rule-lock", S("rulesLock"));
  set("rule-actions", S("rulesActions"));
  set("rule-rewards", S("rulesRewards"));
  set("rule-scope", S("rulesScope"));
  set("rule-timeout", S("timeoutRule"));
  set("rule-meter", S("rulesMeter"));
  set("kap-hint", S("kapHint"));
  set("lbl-bot-rate", S("botRate"));
  set("hide-note", S("hideNote"));
  const rateEl = $("bot-rate-val");
  if (rateEl && $("bot-rate")) rateEl.textContent = $("bot-rate").value + "/s";
  if (state.lastOutcome) traceOutcome(state.lastOutcome);
  else if ($("event-trace")) $("event-trace").textContent = S("eventTrace") + ": —";
  updateCaptureUI();
  const sc = $("btn-share-copy"); if (sc) sc.textContent = S("shareCopyBtn");
  const sx = $("btn-share-close"); if (sx) sx.textContent = S("shareClose");
  const send = $("btn-send"); if (send) send.textContent = S("sendBtn");
  const testBtn = $("btn-testet"); if (testBtn) testBtn.textContent = S("testBtn");
  const lang = $("btn-lang"); if (lang) lang.textContent = CONFIG.lang === "tr" ? "TR · EN" : "EN · TR";
  const ver = $("game-version"); if (ver) ver.textContent = CONFIG.version;
  if (state.playMode) {
    const su = $("btn-super");
    if (su && performance.now() >= state.superUntil) {
      const lab = $("super-label") || su;
      if ($("super-label")) $("super-label").innerHTML = S("superBtn").replace(" ", " <br>");
      else if (!$("super-cd")) su.innerHTML = S("superBtn").replace(" ", " <br>");
    }
    const ka = $("btn-kaptan");
    if (ka) {
      ka.innerHTML = S("kapBtnPts") + '<div class="meter"><i id="kap-meter"></i></div><small id="kap-cue"></small>';
      ka.dataset.capState = "off"; // DOM template and render state must agree.
    }
    const hint = $("hint-tap"); if (hint && !hint.dataset.locked) hint.textContent = S("tapHint");
    const rpl = $("btn-replay"); if (rpl) rpl.textContent = S("playAgain");
    const shr = $("btn-share"); if (shr) shr.textContent = S("share");
    const nm = $("btn-newmatch"); if (nm) nm.textContent = S("newMatch");
  }
  document.documentElement.lang = CONFIG.lang === "tr" ? "tr" : "en";
  updateLivePill();
  updateMatchScore();
  updateKapUI();
  refreshUI();
  if ($("end-card") && $("end-card").classList.contains("show") && !state.matchOver) showEndCard();
  if ($("match-card") && $("match-card").classList.contains("show")) showMatchCard();
}
function renderMeters() {
  const t = (state.line + 1) / 2;
  const redPct = t * 100;
  $("meters").innerHTML =
    '<div class="t-labels">' +
      '<span><img class="crest" alt="" src="' + crestURL.red + '"/> ' + esc(teamName("red")) + "</span>" +
      '<span class="mid">' + esc(S("square")) + "</span>" +
      "<span>" + esc(teamName("blue")) + ' <img class="crest" alt="" src="' + crestURL.blue + '"/></span>' +
    "</div>" +
    '<div class="territory">' +
      '<div class="red" style="width:' + redPct + '%"></div>' +
      '<div class="blue" style="width:' + (100 - redPct) + '%"></div>' +
      '<div class="notch" style="left:' + redPct + '%"></div>' +
    "</div>";
}
function renderCounts() {
  const el = $("counts"); if (!el) return;
  const people = [...state.users.values()].filter((u) => !isBot(u)).length;
  const bots = [...state.users.values()].filter(isBot).length;
  const botWord = S(bots === 1 ? "botsOne" : "botsMany");
  if (bots) {
    const split = (people === 1) ? S("fansSplitOne", { n: people, b: bots, bots: botWord }) : S("fansSplit", { n: people, b: bots, bots: botWord });
    // English "fansSplit" still says "fans + bots"; rewrite with plural helper when the template has no {bots}.
    if (CONFIG.lang === "en") {
      const fanWord = people === 1 ? "fan" : "fans";
      el.textContent = "🏟️  " + people + " " + fanWord + " + " + bots + " " + botWord;
    } else el.textContent = "🏟️  " + split;
  } else if (CONFIG.lang === "en") {
    el.textContent = "🏟️  " + S(people === 1 ? "fansOne" : "fans", { n: people });
  } else {
    el.textContent = "🏟️  " + S("fans", { n: people });
  }
}
function updateMatchScore() {
  const a = $("ms-red"), b = $("ms-blue");
  const dots = (n) => "●".repeat(n) + "○".repeat(Math.max(0, 3 - n));
  if (a) a.textContent = CONFIG.teams.red.short + " " + state.scores.red + " " + dots(state.scores.red);
  if (b) b.textContent = dots(state.scores.blue) + " " + state.scores.blue + " " + CONFIG.teams.blue.short;
}
function renderBoard() {
  const caps = captains();
  let html = "";
  const capBlock = (id) => {
    const u = caps[id];
    html += "<h2>" + (id === "red" ? "🦅 " : "🐤 ") + S("captain") + "</h2>";
    if (!u) html += '<div class="empty">—</div>';
    else {
      const av = '<div class="av" style="background:' + (id === "red" ? "#141414" : "#0a2850") + '">' + esc(u.name.slice(0, 1).toUpperCase()) + "</div>";
      const score = state.mode === "solo" && u.id === state.heroId
        ? (u.points || 0).toLocaleString() + " " + S("points")
        : (u.diamonds || 0).toLocaleString() + " 💎";
      html += '<div class="cap-row">' + av + '<div class="nm">' + esc(u.name) + '</div><div class="dm">' + score + "</div></div>";
    }
  };
  capBlock("red"); capBlock("blue");
  html += "<h2>🎁 " + S("giftsBoard") + " <small>(" + S("scopeSession") + ")</small></h2>";
  html += '<p class="board-help">' + esc(S("boardGiftsHelp")) + "</p><ol>";
  const capos = topCapos(4);
  if (!capos.length) html += '<div class="empty">' + S("giftBoardEmpty") + "</div>";
  capos.forEach((u, i) => {
    html += '<li class="' + u.team + '"><span class="nm">' + (i + 1) + ". " + esc(u.name) + '</span><span class="sc">' + u.diamonds.toLocaleString() + "</span></li>";
  });
  html += "</ol><h2>💥 " + S("contrib") + " <small>(" + S("scopeRound") + ")</small></h2>";
  html += '<p class="board-help">' + esc(S("boardHitsHelp")) + "</p><ol>";
  const hits = [...state.users.values()]
    .filter((u) => isRankable(u) && (u.rankHits + u.rankLikes) > 0)
    .sort((a, b) => (b.rankHits + b.rankLikes) - (a.rankHits + a.rankLikes))
    .slice(0, 5);
  if (!hits.length) html += '<div class="empty">—</div>';
  hits.forEach((u, i) => {
    html += '<li class="' + u.team + '"><span class="nm">' + (i + 1) + ". " + esc(u.name) + '</span><span class="sc">' + u.rankHits + " · " + u.rankLikes + "❤</span></li>";
  });
  html += "</ol>";
  const board = $("board");
  if (!board) return;
  if (!board.dataset.ready) {
    if (window.innerWidth <= 480 || document.documentElement.classList.contains("is-mobile")) board.classList.add("collapsed");
    board.dataset.ready = "1";
  }
  const open = !board.classList.contains("collapsed");
  board.innerHTML = '<button type="button" id="board-toggle">' + esc(open ? S("boardHide") : S("boardToggle")) + '</button><div id="board-body">' + html + '</div>';
  const tog = $("board-toggle");
  if (tog) tog.addEventListener("click", () => {
    board.classList.toggle("collapsed");
    tog.textContent = board.classList.contains("collapsed") ? S("boardToggle") : S("boardHide");
  });
}
function refreshUI() { renderMeters(); renderCounts(); renderBoard(); }
function toggleLang() { CONFIG.lang = CONFIG.lang === "en" ? "tr" : "en"; applyPhaseUI(); }
window.toggleLang = toggleLang;

const labelsEl = $("labels");
function updateLabels() {
  if (!labelsEl) return;
  const now = performance.now();
  const scored = [...state.users.values()].map((u) => {
    let score = 0;
    if (u.id === state.heroId) score += 1000;
    if (!isBot(u)) score += 200;
    if (now < u.highlightUntil && !isBot(u)) score += 500;
    if (u.captainOf) score += 400;
    if (u.diamonds > 0) score += 80 + u.diamonds * 0.02;
    if (u.role === "front") score += 10;
    score += (isBot(u) ? u.hits * 0.15 : u.hits * 0.8 + u.rankHits);
    return { u, score };
  });
  scored.sort((a, b) => b.score - a.score);
  const shown = new Set(scored.filter((s, i) => s.score >= 80 || i < 8).slice(0, CONFIG.maxLabels).map((s) => s.u.id));
  // reuse nodes
  const have = new Set();
  [...labelsEl.children].forEach((n) => {
    const id = n.dataset.id;
    const u = state.users.get(id);
    if (!u || !shown.has(id)) { n.remove(); return; }
    have.add(id);
    positionLabel(n, u);
  });
  for (const id of shown) {
    if (have.has(id)) continue;
    const u = state.users.get(id);
    const n = document.createElement("div");
    n.className = "lab" + (isBot(u) ? " bot" : " real") + (u.team ? " " + u.team : "");
    n.dataset.id = id;
    n.textContent = (u.id === state.heroId ? "@" : "") + u.name;
    labelsEl.appendChild(n);
    positionLabel(n, u);
  }
  resolveLabelCollisions();
}
function positionLabel(n, u) {
  const p = worldToScreen(u.x, u.y + 1.85, u.z);
  n._lx = p.x; n._ly = p.y;
  n.style.transform = "translate(" + p.x + "px," + p.y + "px) translate(-50%,-100%)";
  n.classList.toggle("hot", !isBot(u) && (u.id === state.heroId || performance.now() < u.highlightUntil));
  n.classList.toggle("cap", !!u.captainOf);
  n.classList.toggle("bot", isBot(u));
  n.classList.toggle("real", !isBot(u));
  n.classList.toggle(u.team, true);
}
function labelPriority(u) {
  if (!u) return 0;
  if (u.id === state.heroId) return 1000;
  if (!isBot(u)) return 400 + (u.captainOf ? 200 : 0) + (u.rankHits || 0);
  return 10 + (u.hits || 0) * 0.1;
}
function resolveLabelCollisions() {
  if (!labelsEl) return;
  const boxes = [...labelsEl.children].map((n) => {
    const u = state.users.get(n.dataset.id);
    return { n, u, x: Number.isFinite(n._lx) ? n._lx : 0, y: Number.isFinite(n._ly) ? n._ly : 0,
      pr: labelPriority(u), w: isBot(u) ? 44 : 62, h: isBot(u) ? 12 : 16 };
  });
  boxes.sort((a, b) => b.pr - a.pr);
  const kept = [];
  const offsets = [[0,0],[0,-18],[-22,-18],[22,-18],[0,-36],[-30,-36],[30,-36],[-36,0],[36,0],[0,18]];
  for (const b of boxes) {
    let placed = null;
    for (const [dx, dy] of offsets) {
      const x = Math.max(b.w/2+3, Math.min(VIEW_W-b.w/2-3, b.x+dx));
      const y = Math.max(b.h+3, Math.min(VIEW_H-5, b.y+dy));
      const hit = kept.some(k => Math.abs(x-k.x) < (b.w+k.w)*0.52 && Math.abs(y-k.y) < (b.h+k.h)*0.62);
      if (!hit) { placed={x,y}; break; }
    }
    // Prefer an uncluttered screen over unreadable overlapping names. Hero and
    // captain labels get first choice via labelPriority; bots are dropped first.
    if (!placed) { b.n.style.visibility = "hidden"; continue; }
    b.n.style.visibility = "visible";
    b.n.style.transform = "translate(" + placed.x + "px," + placed.y + "px) translate(-50%,-100%)";
    kept.push({ ...b, ...placed });
  }
}

const fx2 = $("fx2");
const fx = fx2.getContext("2d");
const particles = [];
function resizeFx() { fx2.width = VIEW_W; fx2.height = VIEW_H; }
function worldToScreen(x, y, z) {
  _v.set(x, y, z).project(camera);
  return { x: (_v.x * 0.5 + 0.5) * VIEW_W, y: (-_v.y * 0.5 + 0.5) * VIEW_H };
}
function comicBurst(x, y, z, text) {
  const pows = particles.filter((p) => p.kind === "pow");
  if (pows.length >= 2) {
    // drop the oldest so we never show more than two
    let oldest = pows[0];
    for (const p of pows) if (p.t > oldest.t) oldest = p;
    const i = particles.indexOf(oldest);
    if (i >= 0) particles.splice(i, 1);
  }
  const leftover = particles.filter((p) => p.kind === "pow")[0];
  let ox = 0, oy = 0.15, oz = 0;
  if (leftover) {
    // stagger so the two words never sit on top of each other
    ox = leftover.x >= x ? -1.15 : 1.15;
    oy = 0.7;
    oz = leftover.z >= z ? -0.6 : 0.6;
  }
  particles.push({ kind: "pow", text: text || "BAM!", x: x + ox, y: y + oy, z: z + oz, t: 0, life: 0.7 });
}
function starBurst(x, y, z) {
  for (let i = 0; i < 5; i++) {
    const ang = (i / 5) * 6.28;
    particles.push({ kind: "star", x, y: y + 0.2, z, vx: Math.cos(ang) * 1.4, vy: 1.2, vz: Math.sin(ang) * 1.4, t: 0, life: 1, col: "#ffe066" });
  }
}
function dustAt(x, z) {
  for (let i = 0; i < 6; i++) {
    particles.push({ kind: "dust", x, y: 0.2, z, vx: (Math.random() - 0.5) * 1.2, vy: 0.8 + Math.random(), vz: (Math.random() - 0.5) * 1.2, t: 0, life: 0.5, col: "rgba(80,60,40,.5)" });
  }
}
function impactFlash(x, y, z, team) {
  particles.push({ kind: "flash", x, y, z, t: 0, life: 0.18 });
  if (state.reducedFx) return;
  // Studio action-layer principle: the impact reads as a distinct beat,
  // without extra skinned characters, WebGL draw calls or score changes.
  // A bounded six-ring pool avoids accumulating screen clutter in big fights.
  const rings = particles.filter(p => p.kind === "impact-ring");
  if (rings.length >= 6) {
    const oldest = rings.reduce((a, b) => a.t >= b.t ? a : b);
    const i = particles.indexOf(oldest);
    if (i >= 0) particles.splice(i, 1);
  }
  particles.push({ kind: "impact-ring", x, y, z, team, t: 0, life: 0.34 });
}
function burstFX(x, y, team) {
  const col = team === "red" ? "#f0f0ee" : "#ffd000";
  for (let i = 0; i < 28; i++) {
    const ang = Math.random() * 6.28;
    particles.push({ kind: "conf", x, y: y + 1, z: 0, vx: Math.cos(ang) * 3, vy: 2 + Math.random() * 3, vz: Math.sin(ang) * 3, t: 0, life: 1.4, col });
  }
}
function tifoStorm(team) {
  burstFX(0, 2, team);
  pushLine(team, 0.02);
}
function updateFX(dt) {
  if (!fx) return;
  fx.clearRect(0, 0, VIEW_W, VIEW_H);
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.t += dt;
    if (p.t > p.life) { particles.splice(i, 1); continue; }
    if (p.vx) { p.x += p.vx * dt; p.y += p.vy * dt; p.z += (p.vz || 0) * dt; p.vy -= 4 * dt; }
    const s = worldToScreen(p.x, p.y, p.z);
    const a = 1 - p.t / p.life;
    if (p.kind === "pow") {
      fx.save();
      fx.globalAlpha = a;
      fx.font = "bold 22px sans-serif";
      fx.textAlign = "center";
      fx.lineWidth = 4;
      fx.strokeStyle = "#2a1000";
      fx.fillStyle = "#fff6c4";
      let sx = s.x, sy = s.y;
      const other = particles.find((q) => q !== p && q.kind === "pow");
      if (other) {
        const o = worldToScreen(other.x, other.y, other.z);
        if (Math.abs(o.x - sx) < 70 && Math.abs(o.y - sy) < 28) sy = o.y - 28;
      }
      if (labelsEl) {
        for (const n of labelsEl.children) {
          if (n.style.visibility === "hidden") continue;
          const lx = n._lx || 0, ly = n._ly || 0;
          if (Math.abs(sx - lx) < 50 && Math.abs(sy - ly) < 22) sy = ly - 22;
        }
      }
      fx.strokeText(p.text, sx, sy);
      fx.fillText(p.text, sx, sy);
      fx.restore();
    } else if (p.kind === "impact-ring") {
      // Expand then disappear: team colour makes a successful attack legible
      // without adding another word over player usernames.
      const k = p.t / p.life;
      fx.save();
      fx.globalAlpha = a * 0.88;
      fx.strokeStyle = p.team === "blue" ? "#ffd23b" : "#f5f5f0";
      fx.lineWidth = Math.max(1, 4 * a);
      fx.beginPath();
      fx.arc(s.x, s.y, 9 + 33 * (1 - Math.pow(1 - k, 2)), 0, 6.283);
      fx.stroke();
      fx.restore();
    } else if (p.kind === "flash") {
      fx.beginPath(); fx.fillStyle = "rgba(255,255,220," + a + ")";
      fx.arc(s.x, s.y, 16 * (1 - p.t / p.life), 0, 6.28); fx.fill();
    } else if (p.kind === "star") {
      fx.fillStyle = p.col; fx.globalAlpha = a;
      fx.font = "20px sans-serif"; fx.fillText("★", s.x, s.y);
      fx.globalAlpha = 1;
    } else {
      fx.fillStyle = p.col || "#fff"; fx.globalAlpha = a;
      fx.fillRect(s.x, s.y, 4, 6);
      fx.globalAlpha = 1;
    }
  }
}

// Read-only, opt-in staging visual proof: request ?visualQA=1.
// Never credits gifts, awards hits, changes scores or connects to LIVE.
if (new URLSearchParams(location.search).get("visualQA") === "1") {
  window.__visualQA = {
    impact(team = "red") {
      impactFlash(0, 1.7, 0, team === "blue" ? "blue" : "red");
      return particles.filter(p => p.kind === "impact-ring").length;
    }
  };
}

/* ============================================================
   Camera, layout, bots, loop, boot
   ============================================================ */
function fit() {
  const sizer = $("stage-sizer");
  const stage = $("stage");
  const app = $("app");
  const panel = $("test-panel");
  const panelOn = !document.body.classList.contains("panel-hidden") && getComputedStyle(panel).position !== "fixed";
  const mobile = document.documentElement.classList.contains("is-mobile") || IS_MOBILE;
  const pad = mobile ? 0 : 20;
  let availW = Math.max(160, app.clientWidth - pad);
  const availH = Math.max(160, app.clientHeight - pad);
  if (panelOn) availW = Math.max(160, availW - (panel.offsetWidth + 16));
  if (mobile) {
    VIEW_W = W;
    VIEW_H = Math.round(W * availH / availW);
    camAspect = VIEW_W / VIEW_H;
    stage.style.width = VIEW_W + "px";
    stage.style.height = VIEW_H + "px";
    renderer.setSize(VIEW_W, VIEW_H, false);
    resizeFx();
    camViewH = 0;
    setViewH(25);
    const s = availW / VIEW_W;
    sizer.style.width = availW + "px";
    sizer.style.height = availH + "px";
    stage.style.transform = "scale(" + s + ")";
  } else {
    VIEW_W = W; VIEW_H = H; camAspect = W / H;
    stage.style.width = W + "px";
    stage.style.height = H + "px";
    renderer.setSize(W, H, false);
    resizeFx();
    camViewH = 0;
    setViewH(25);
    const s = Math.min(availW / W, availH / H);
    sizer.style.width = W * s + "px";
    sizer.style.height = H * s + "px";
    stage.style.transform = "scale(" + s + ")";
  }
}

function fightBounds() {
  const list = [...state.users.values()].filter((u) => u.model && u.model.visible && (u.role === "front" || u.id === state.heroId || !isBot(u)));
  const pool = list.length >= 3 ? list : [...state.users.values()].filter((u) => u.model && u.model.visible);
  if (!pool.length) return { cx: lineX(), cz: 0, spanX: 8, spanZ: 8 };
  let minX = 99, maxX = -99, minZ = 99, maxZ = -99;
  for (const u of pool) {
    minX = Math.min(minX, u.x); maxX = Math.max(maxX, u.x);
    minZ = Math.min(minZ, u.z); maxZ = Math.max(maxZ, u.z);
  }
  return {
    cx: (minX + maxX) / 2,
    cz: (minZ + maxZ) / 2,
    spanX: Math.max(6, maxX - minX + 2.4),
    spanZ: Math.max(6, maxZ - minZ + 2.4)
  };
}

function updateCamera(dt) {
  const now = performance.now();
  const t = state.time || 0;
  const driftX = Math.sin(t * 0.11) * 0.4;
  const driftZ = Math.cos(t * 0.09) * 0.25;
  const focus = state.camFocus && now < state.camFocus.until ? state.camFocus : null;
  if (state.camFocus && now >= state.camFocus.until) state.camFocus = null;
  const b = fightBounds();
  // Auto-frame the active fronts (padding already in span). Keep the iso angle; only pan.
  let lookX = b.cx * 0.55 + lineX() * 0.35;
  let lookZ = b.cz * 0.7 - 3.2; // bias action below the HUD (stadium is -Z / top of screen)
  if (focus && focus.user) {
    lookX = lookX * 0.65 + focus.user.x * 0.35;
    lookZ = lookZ * 0.7 + focus.user.z * 0.3;
  }
  const shot = !state.reducedFx && now < V17_SHOT.until && V17_SHOT.user &&
    (state.phase === "battle" || state.phase === "victory") ? V17_SHOT : null;
  // Ease both ends of a short shot to prevent jarring cuts in portrait video.
  const shotMix = shot ? Math.max(0, Math.min(1, (now - shot.start) / 260,
    (shot.until - now) / 380)) : 0;
  if (shotMix) {
    lookX += (shot.user.x - lookX) * shotMix * 0.55;
    lookZ += (shot.user.z - lookZ) * shotMix * 0.44;
  }
  const needed = Math.max(b.spanZ * 0.85 + 8, b.spanX * 0.45 + 10);
  setViewH(Math.max(CAM_VIEWH_MIN, Math.min(CAM_VIEWH_MAX, needed)));
  camLook.set(lookX, CAM_LOOK.y, lookZ);
  camPos.set(lookX + CAM_OFFSET.x + driftX, CAM_OFFSET.y, lookZ + CAM_OFFSET.z + driftZ);
  if (state.shake > 0.04) {
    camPos.x += (Math.random() - 0.5) * state.shake * 0.18;
    camPos.y += (Math.random() - 0.5) * state.shake * 0.08;
    state.shake = Math.max(0, state.shake - dt * 2.4);
  } else {
    state.shake = 0;
  }
  const zoomTarget = 1 + shotMix * (shot && shot.kind === "victory" ? 0.05 : 0.085);
  const nextZoom = camera.zoom + (zoomTarget - camera.zoom) * Math.min(1, Math.max(0, dt) * 7);
  if (Math.abs(nextZoom - camera.zoom) > 0.0001) {
    camera.zoom = nextZoom; camera.updateProjectionMatrix();
  }
  camera.position.lerp(camPos, 0.07);
  camTarget.lerp(camLook, 0.08);
  camera.lookAt(camTarget);
}

function updateRings() {
  const now = performance.now();
  const hot = [...state.users.values()]
    .filter((u) => u.ring && (u.id === state.heroId || now < u.highlightUntil))
    .sort((a, b) => ((b.id === state.heroId ? 1 : 0) - (a.id === state.heroId ? 1 : 0)) || (b.highlightUntil - a.highlightUntil))
    .slice(0, 3);
  const ids = new Set(hot.map((u) => u.id));
  for (const u of state.users.values()) {
    if (!u.ring) continue;
    const on = ids.has(u.id);
    u.ring.visible = on;
    if (on) {
      const p = 1 + Math.sin((state.time || 0) * 6) * 0.08;
      u.ring.scale.set(p, p, p);
    }
  }
}

function fadeNearCharacters() {
  // Hide anyone who slips into the near foreground (between camera and the brawl).
  for (const u of state.users.values()) {
    if (!u.model) continue;
    const near = u.z > 8.5 || camera.position.distanceTo(u.model.position) < 7;
    u.model.visible = !near;
    if (u.ring && near) u.ring.visible = false;
  }
}
function snapCamera() {
  updateCamera(0.2);
  camera.position.copy(camPos);
  camTarget.copy(camLook);
  camera.lookAt(camTarget);
}
window.__snapCamera = snapCamera;
window.__v17CameraState = () => ({ kind: V17_SHOT.kind,
  active: performance.now() < V17_SHOT.until && !state.reducedFx, zoom: camera.zoom });
if (QPARAMS.get("visualQA") === "1")
  window.__v17Preview = (team = "red") => {
    const u = [...state.users.values()].find(v => v.team === team && Number.isFinite(v.x));
    return startV17Shot("impact", u, 1600);
  };
window.__debug = { camera, scene, renderer, getCap() { return {
  floatVT: renderer.capabilities.floatVertexTextures,
  maxVT: renderer.capabilities.maxVertexTextures,
  maxTex: renderer.capabilities.maxTextures,
  isWebGL2: renderer.capabilities.isWebGL2
}; } };

window.__endWin = endWin;
window.__endDraw = () => endWin("draw");
window.__makeCaptain = makeCaptain;
window.__stopBot = stopBot;
window.__startPlay = startPlay;
window.__ensureCrowd = ensureCrowd;
window.__resetBattle = resetBattle;
window.__resetMatch = resetMatch;
window.__resetRoundCounters = resetRoundCounters;
window.__setLiveStatus = setLiveStatus;
window.__updateLivePill = updateLivePill;
window.__parseTeam = parseTeam;
window.__applyPending = applyPending;
window.__pendingOf = pendingOf;
window.__topCapos = topCapos;
window.__traceOutcome = () => state.lastOutcome;
window.__hideAllCeremonies = hideAllCeremonies;
window.__showEndCard = showEndCard;
window.__showMatchCard = showMatchCard;
window.__liveStandby = () => liveStandby();
window.__battleElapsed = battleElapsed;
window.__lastReceipt = () => state.lastReceipt;
window.__refreshUI = refreshUI;
window.__heroContributed = heroContributed;
window.__giftLabel = giftLabel;
window.__promoteWaitlist = promoteWaitlist;
window.__evictForWaitlist = evictForWaitlist;
window.__removeUser = removeUser;
window.__ledger = () => [...(state.ledger ? state.ledger.entries() : [])];
window.__captureBundle = captureBundle;
window.__replayCapture = replayCapture;
window.__showShareFallback = showShareFallback;
window.__shareGame = shareGame;
window.__maybeEndOnTime = maybeEndOnTime;
window.__startWallClock = startWallClockWatch;
window.__updateKapUI = window.__updateKapUI || updateKapUI;
window.__stashUser = stashUser;
window.__restoreLedger = restoreLedger;
window.__captains = captains;
window.__tryKaptan = tryKaptan;
window.__updateKapUI = updateKapUI;
window.__scheduleReconnect = scheduleReconnect;
window.__cancelReconnect = cancelReconnectTimer;
window.__reconnectState = () => ({
  attempt: state.reconnectAttempt, at: state.reconnectAt, stopped: state.reconnectStopped,
  timer: !!state.reconnectTimer, connecting: state.connecting, status: state.liveStatus
});
window.GAME_MODE = MODE;
window.__debugLive = () => ({
  mode: state.mode, status: state.liveStatus, scriptOk: state.liveScriptOk,
  last: state.lastLiveEvent, pending: [...state.pending.entries()],
  seen: state.seenEvents.size, scores: { ...state.scores },
  hits: { ...state.hits }, sessionHits: { ...state.sessionHits },
  matchOver: state.matchOver, phase: state.phase, roundStart: state.roundStart,
  waitlist: [...(state.waitlist ? state.waitlist.keys() : [])],
  ledger: state.ledger ? state.ledger.size : 0,
  kapMeter: state.kapMeter, superUntil: state.superUntil,
  reconnect: window.__reconnectState ? window.__reconnectState() : null
});

function addStewards() {
  // cartoon police / stewards with riot shields at the kerbs
  for (const side of [-1, 1]) {
    for (const z of [-4.6, 4.6]) {
      const g = new THREE.Group();
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.45, 1.1, 0.32), mat(0xf0c400));
      body.position.y = 0.7;
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 6), mat(0xe8b894));
      head.position.y = 1.4;
      const shield = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.9, 0.06), mat(0x3a6ea5, { transparent: true, opacity: 0.55 }));
      shield.position.set(0, 0.8, 0.28);
      g.add(body, head, shield);
      g.position.set(side * 7.6, 0, z);
      g.lookAt(0, 0.8, z * 0.2);
      city.add(g);
    }
  }
}

let botTimer = null;
function botsAllowed() {
  const tog = $("bot-toggle");
  if (tog) return !!tog.checked;
  return state.mode === "demo" || state.mode === "solo";
}
function startBot() {
  if (state.mode === "live" && !($("bot-toggle") && $("bot-toggle").checked)) return;
  stopBot();
  const rate = () => Math.max(1, Number(($("bot-rate") || {}).value) || 5);
  const loop = () => { botEvent(); botTimer = setTimeout(loop, 1000 / rate()); };
  botTimer = setTimeout(loop, 40);
}
function stopBot() { if (botTimer) { clearTimeout(botTimer); botTimer = null; } }
function botEvent() {
  if (!botsAllowed()) { stopBot(); return; }
  if (state.phase !== "battle") return;
  // keep sides balanced; brawl AI already fights — bots mainly spawn / rare gifts
  const counts = { red: 0, blue: 0 };
  for (const u of state.users.values()) counts[u.team]++;
  const need = LOW ? 14 : 18;
  if (counts.red + counts.blue < Math.min(CONFIG.maxFans - 2, need * 2)) {
    const team = counts.red <= counts.blue ? "red" : "blue";
    ensureCrowd(Math.max(counts.red, counts.blue, 8) + (team === "red" && counts.red <= counts.blue ? 1 : 0) * 0 + Math.max(counts.red, counts.blue));
    // simpler: just add one
    const names = ["zeynep","burak","elif","ali","merve","kaan","efe","cem","ayse","onur"];
    const nm = names[(Math.random() * names.length) | 0] + "_" + ((Math.random() * 90) | 10);
    joinUser("bot:" + team + ":" + nm + Math.random().toString(36).slice(2, 5), nm, team);
    return;
  }
  if (Math.random() < 0.12) {
    const list = [...state.users.values()].filter((u) => u.id !== state.heroId);
    const u = list[(Math.random() * list.length) | 0];
    if (u) handleLiveEvent({ type: Math.random() < 0.15 ? "gift" : "chat", userId: u.id, username: u.name, comment: u.team === "red" ? "BJK" : "FB", giftName: "rose", diamondCount: 1 });
  }
}

function cancelReconnectTimer() {
  if (state.reconnectTimer) {
    clearTimeout(state.reconnectTimer);
    state.reconnectTimer = null;
  }
  state.reconnectAt = 0;
}
function scheduleReconnect() {
  if (state.mode !== "live") return;
  if (state.liveStatus === "LIVE") {
    state.reconnectAttempt = 0;
    state.reconnectStopped = false;
    cancelReconnectTimer();
    return;
  }
  if (state.connecting) return;
  const max = CONFIG.maxAutoReconnect != null ? CONFIG.maxAutoReconnect : 5;
  if (state.reconnectAttempt >= max) {
    state.reconnectStopped = true;
    cancelReconnectTimer();
    state.reconnectAt = 0;
    setLiveStatus("DISCONNECTED");
    return;
  }
  const delays = CONFIG.reconnectDelays || [2000, 4000, 8000, 16000, 16000];
  const delay = delays[Math.min(state.reconnectAttempt, delays.length - 1)];
  cancelReconnectTimer();
  state.reconnectAttempt += 1;
  state.reconnectStopped = false;
  state.reconnectAt = performance.now() + delay;
  // Honest state: never claim LIVE while we are only waiting to try again.
  state.liveStatus = "RETRYING";
  state.reconnectTimer = setTimeout(() => {
    state.reconnectTimer = null;
    tryConnectPlayroom({ auto: true });
  }, delay);
  updateLivePill();
}
function setLiveStatus(status) {
  const prev = state.liveStatus;
  state.liveStatus = status;
  if (state.captureEnabled && prev !== status) {
    captureRecord("status", { from: prev, to: status }, { kind: "status" });
  }
  if (status === "LIVE") {
    state.reconnectAttempt = 0;
    state.reconnectStopped = false;
    cancelReconnectTimer();
  }
  if (state.mode === "live") {
    if (typeof liveStandby === "function" && liveStandby()) pauseClock();
    else if (typeof maybeStartLiveClock === "function") maybeStartLiveClock();
  }
  updateLivePill();
}
function updateLivePill() {
  const pill = $("live-pill");
  const last = $("live-last");
  const btn = $("btn-reconnect");
  const st = state.liveStatus || "SOLO";
  if (pill) {
    // statusSolo / statusDemo / statusConnecting / statusLive / statusDisconnected / statusRetrying
    const map = {
      SOLO: S("statusSolo"), DEMO: S("statusDemo"),
      CONNECTING: S("statusConnecting"), LIVE: S("statusLive"),
      DISCONNECTED: S("statusDisconnected"),
      RETRYING: S("statusRetrying")
    };
    pill.textContent = map[st] || st;
    pill.className = "pill " + st.toLowerCase();
  }
  if (last) {
    if (state.mode === "live" && st === "RETRYING" && state.reconnectAt) {
      const sec = Math.max(0, Math.ceil((state.reconnectAt - performance.now()) / 1000));
      const max = CONFIG.maxAutoReconnect != null ? CONFIG.maxAutoReconnect : 5;
      last.textContent = S("retryingIn", { n: state.reconnectAttempt, max, s: sec });
    } else if (state.mode === "live" && state.reconnectStopped && st === "DISCONNECTED") {
      last.textContent = S("reconnectStopped");
    } else {
      const ev = state.lastLiveEvent;
      if (!ev) last.textContent = state.mode === "live" ? S("lastEventNone") : "";
      else {
        const sec = Math.max(0, Math.round((performance.now() - ev.at) / 1000));
        last.textContent = S("lastEvent", { ago: sec + "s", name: ev.name, kind: ev.kind });
      }
    }
  }
  if (btn) {
    const show = state.mode === "live" && (st === "DISCONNECTED" || st === "RETRYING" || st === "CONNECTING");
    btn.textContent = S("reconnect");
    btn.classList.toggle("show", show && st !== "CONNECTING");
    btn.hidden = !(show && st !== "CONNECTING");
  }
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-playroom="1"]');
    if (existing && window.Playroom) { resolve(existing.src || src); return; }
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    // No crossOrigin: the official CDN may omit ACAO, and a classic
    // script tag still executes. A cors-anonymous request would 404 the load.
    s.dataset.playroom = "1";
    s.onload = () => resolve(src);
    s.onerror = () => reject(new Error("Failed to load " + src));
    document.head.appendChild(s);
  });
}

function hidePlayroomModal() {
  document.querySelectorAll(".modal-container").forEach((n) => {
    n.dataset.prHidden = "1";
    n.style.display = "none";
  });
}
function showPlayroomModal() {
  document.querySelectorAll(".modal-container").forEach((n) => {
    n.style.display = "";
    delete n.dataset.prHidden;
  });
}

async function tryConnectPlayroom(opts) {
  if (state.mode !== "live") { updateLivePill(); return; }
  if (state.connecting) return;
  state.connecting = true;
  cancelReconnectTimer();
  setLiveStatus("CONNECTING");
  // Never silently fill the street with bots if the feed is down.
  stopBot();
  const tog = $("bot-toggle");
  if (tog) tog.checked = false;
  try {
    let loadedFrom = "";
    try {
      loadedFrom = await loadScript(PLAYROOM_SRC);
    } catch (_) {
      loadedFrom = await loadScript(PLAYROOM_FALLBACK);
    }
    state.liveScriptOk = true;
    const mod = window.Playroom || window.PlayroomKit || {};
    const insertCoin = mod.insertCoin;
    const onTikTokLiveEvent = mod.onTikTokLiveEvent;
    const onDisconnect = mod.onDisconnect;
    if (typeof insertCoin !== "function") {
      state.connecting = false;
      setLiveStatus("DISCONNECTED");
      console.warn("[Playroom] script loaded from", loadedFrom, "but insertCoin is missing");
      scheduleReconnect();
      return;
    }
    const connect = insertCoin({ liveMode: "tiktok" });
    const timed = new Promise((_, reject) => setTimeout(() => reject(new Error("connect-timeout")), CONFIG.connectTimeout || 6000));
    try {
      await Promise.race([connect, timed]);
      setLiveStatus("LIVE");
      if (typeof onDisconnect === "function") {
        try { onDisconnect(() => setLiveStatus("DISCONNECTED")); } catch (_) {}
      }
    } catch (err) {
      // Script is present; no live stream in this session. Stay honest.
      setLiveStatus("DISCONNECTED");
      hidePlayroomModal();
      console.warn("[Playroom] not live:", err && err.message ? err.message : err);
      state._needRetry = true;
    }
    if (typeof onTikTokLiveEvent === "function") {
      try { onTikTokLiveEvent((event) => {
        if (state.captureEnabled) captureRecord("raw-provider", event);
        const d = (event && event.data) || {};
        const raw = String((event && event.type) || "").toLowerCase();
        if (!["chat", "like", "gift", "streamend"].includes(raw)) return;
        const type = raw === "streamend" ? "streamEnd" : raw;
        if (type !== "streamEnd" && !d.userId) return;
        handleLiveEvent({
          type,
          eventId: d.msgId || event.msgId,
          userId: d.userId || d.uniqueId || d.username,
          username: d.name || d.username || d.nickName || d.uniqueId || "viewer",
          comment: d.comment || "",
          giftName: d.giftName || "",
          diamondCount: d.giftDiamondCount != null ? d.giftDiamondCount : d.diamondCount,
          repeatCount: d.repeatCount,
          repeatEnd: d.repeatEnd,
          photoUrl: d.userPhotoUrl,
          source: "tiktok",
          data: d
        });
        if (type === "streamEnd") setLiveStatus("DISCONNECTED");
        else if (state.liveStatus !== "LIVE") setLiveStatus("LIVE");
      }); } catch (listenErr) {
        console.warn("[Playroom] onTikTokLiveEvent:", listenErr && listenErr.message ? listenErr.message : listenErr);
      }
    }
  } catch (err) {
    if (!state.liveScriptOk) state.liveScriptOk = false;
    setLiveStatus("DISCONNECTED");
    console.warn("[Playroom] not connected:", err && err.message ? err.message : err);
    state._needRetry = true;
  }
  state.connecting = false;
  if (state.liveStatus === "LIVE") {
    state._needRetry = false;
    state.reconnectAttempt = 0;
    state.reconnectStopped = false;
    cancelReconnectTimer();
  } else if (state.mode === "live" && state._needRetry) {
    state._needRetry = false;
    scheduleReconnect();
  } else if (state.mode === "live" && state.liveStatus === "DISCONNECTED") {
    scheduleReconnect();
  }
  updateLivePill();
}

function startWallClockWatch() {
  if (state.wallWatch) return;
  state.wallWatch = setInterval(() => {
    const now = performance.now();
    if (state.phase === "battle") maybeEndOnTime(now);
    updateTimer(now);
  }, 250);
}
function onVisibilityChange() {
  const now = performance.now();
  if (state.captureEnabled) captureRecord("visibility", { state: document.visibilityState, hidden: document.hidden });
  if (document.visibilityState === "hidden") {
    startWallClockWatch();
  } else {
    if (state.phase === "battle") maybeEndOnTime(now);
    updateTimer(now);
  }
}

let lastUI = 0, lastChant = 0;
function tick(now) {
  let dt = Math.min(0.05, (tick._last ? (now - tick._last) : 16) / 1000);
  tick._last = now;
  if (state.hitStop > 0) {
    state.hitStop -= dt;
    dt = 0; // freeze fighters for 50–80ms so the hit reads
  }
  state.time += dt || 0.016;
  if (state.phase === "battle") maybeEndOnTime(now);
  if (state.phase === "victory" && now >= state.victoryAt) {
    if (state.matchOver) {
      showMatchCard();
    } else if (state.playMode) {
      // solo waits on the end card
    } else {
      state.phase = "countdown";
      state.countdown = 3;
      state.victoryAt = now + 3200;
    }
  } else if (state.phase === "countdown") {
    const left = Math.max(0, Math.ceil((state.victoryAt - now) / 1000));
    const cd = $("countdown");
    if (cd) { cd.classList.add("show"); cd.textContent = S("nextRound", { n: left }); }
    if (now >= state.victoryAt) resetBattle();
  }
  updatePeople(dt, now);
  if (typeof updateSeagulls === "function") updateSeagulls(state.time);
  if (typeof updateTifos === "function") updateTifos(state.time);
  updateCamera(dt);
  updateV18Spotlight(now);
  updateLabels();
  updateFX(dt);
  updateTimer(now);
  updateKapUI();
  pumpMsg(now);
  pumpCeremony(now);
  expireStreaks(now);
  if (!state.muted && state.phase === "battle" && now - lastChant > 2200) {
    // crowd murmur
    lastChant = now;
  }
  renderer.render(scene, camera);
  if (now - lastUI > 220) { refreshUI(); updateLivePill(); lastUI = now; }
  requestAnimationFrame(tick);
}
function updateTimer(now) {
  const el = $("timer"); if (!el) return;
  if (typeof liveStandby === "function" && liveStandby()) {
    el.textContent = "⏱ " + S("standby");
    el.classList.remove("low");
    return;
  }
  if (state.phase === "lobby" || !state.roundStart) {
    el.textContent = state.phase === "victory" || state.phase === "matchover" ? "⏱ 00:00" : "⏱ —";
    return;
  }
  if (state.phase !== "battle") {
    if (state.phase === "victory" || state.phase === "matchover") el.textContent = "⏱ 00:00";
    return;
  }
  if (typeof liveStandby === "function" && liveStandby()) {
    el.textContent = "⏱ " + S("standby");
    el.classList.remove("low");
    return;
  }
  const left = Math.max(0, CONFIG.roundSecs - battleElapsed(now));
  const m = Math.floor(left / 60), sec = Math.floor(left % 60);
  el.textContent = "⏱ " + m + ":" + String(sec).padStart(2, "0");
  el.classList.toggle("low", left < 15);
}

function setProgress(p, msg) {
  const bar = $("load-bar"); if (bar) bar.style.width = Math.round(p * 100) + "%";
  const m = $("load-msg"); if (m && msg) m.textContent = msg;
}

function bindUI() {
  $("mute").addEventListener("click", () => setMuted(!state.muted));
  $("btn-send").addEventListener("click", () => {
    const name = $("fake-user").value.trim() || "Pablo";
    handleLiveEvent({ type: "chat", userId: "local:" + name.toLowerCase(), username: name, comment: $("fake-comment").value, source: "host" });
  });
  $("fake-comment").addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); $("btn-send").click(); }
  });
  $("btn-like").addEventListener("click", () => {
    const name = $("fake-user").value.trim() || "Pablo";
    handleLiveEvent({ type: "like", userId: "local:" + name.toLowerCase(), username: name, source: "host" });
  });
  $("btn-rose").addEventListener("click", () => {
    const name = $("fake-user").value.trim() || "Pablo";
    handleLiveEvent({ type: "gift", userId: "local:" + name.toLowerCase(), username: name, giftName: "rose", diamondCount: 1, source: "host" });
  });
  $("btn-med").addEventListener("click", () => {
    const name = $("fake-user").value.trim() || "Pablo";
    handleLiveEvent({ type: "gift", userId: "local:" + name.toLowerCase(), username: name, giftName: "medium", diamondCount: 50, source: "host" });
  });
  $("btn-lion").addEventListener("click", () => {
    const name = $("fake-user").value.trim() || "Pablo";
    handleLiveEvent({ type: "gift", userId: "local:" + name.toLowerCase(), username: name, giftName: "lion", diamondCount: 2999, source: "host" });
  });
  document.querySelectorAll(".chips button").forEach((btn) => {
    btn.addEventListener("click", () => {
      $("fake-comment").value = btn.getAttribute("data-fill");
      $("btn-send").click();
    });
  });
  $("bot-rate").addEventListener("input", () => { $("bot-rate-val").textContent = $("bot-rate").value + "/s"; });
  $("bot-toggle").addEventListener("change", () => {
    if ($("bot-toggle").checked) startBot();
    else stopBot();
  });
  const recBtn = $("btn-reconnect");
  if (recBtn) recBtn.addEventListener("click", () => {
    showPlayroomModal();
    cancelReconnectTimer();
    state.reconnectAttempt = 0;
    state.reconnectStopped = false;
    tryConnectPlayroom({ manual: true });
  });
  const newM = $("btn-newmatch");
  if (newM) newM.addEventListener("click", () => resetMatch());
  const langBtn = $("btn-lang");
  if (langBtn) langBtn.addEventListener("click", () => toggleLang());
  window.addEventListener("keydown", (e) => {
    if (e.target && /input|textarea/i.test(e.target.tagName)) return;
    if (e.key === "h" || e.key === "H") { document.body.classList.toggle("panel-hidden"); document.body.classList.remove("panel-open"); fit(); applyPhaseUI(); }
    else if (e.key === "m" || e.key === "M") setMuted(!state.muted);
    else if (e.key === "l" || e.key === "L") toggleLang();
  });
  window.addEventListener("resize", fit);
  document.documentElement.classList.toggle("is-mobile", IS_MOBILE);
  document.body.classList.toggle("is-mobile", IS_MOBILE);
  const testBtn = $("btn-testet");
  if (testBtn) {
    testBtn.addEventListener("click", () => {
      const open = !document.body.classList.contains("panel-open");
      document.body.classList.toggle("panel-open", open);
      document.body.classList.toggle("panel-hidden", false);
      applyPhaseUI();
    });
  }
  $("pick-red").addEventListener("click", () => startPlay("red", $("hero-name").value.trim()));
  $("pick-blue").addEventListener("click", () => startPlay("blue", $("hero-name").value.trim()));
  $("btn-super").addEventListener("click", (e) => {
    e.stopPropagation();
    if (performance.now() < state.superUntil) return;
    state.superUntil = performance.now() + 8000;
    heroAttack(true);
  });
  $("btn-kaptan").addEventListener("click", (e) => { e.stopPropagation(); tryKaptan(); });
  $("btn-replay").addEventListener("click", () => {
    $("end-card").classList.remove("show");
    resetBattle();
    state.hintUntil = performance.now() + 4000;
  });
  $("btn-share").addEventListener("click", shareGame);
  const sc = $("btn-share-copy"); if (sc) sc.addEventListener("click", copyShareUrl);
  const sx = $("btn-share-close"); if (sx) sx.addEventListener("click", hideShareFallback);
  const cdl = $("btn-capture-dl"); if (cdl) cdl.addEventListener("click", downloadCapture);
  const ccp = $("btn-capture-copy"); if (ccp) ccp.addEventListener("click", copyCapture);
  document.addEventListener("visibilitychange", onVisibilityChange);
  startWallClockWatch();
  if (state.captureEnabled) {
    captureRecord("status", { from: "", to: state.liveStatus || "init", reason: "capture-start" });
    updateCaptureUI();
  }
  // tap-to-hit on the stage, ignore UI buttons
  const stage = $("stage");
  const tap = (e) => {
    if (state.mode === "live") return; // spectator: taps never rank
    if (!state.playMode) return;
    const t = e.target;
    if (t.closest && t.closest("#play-hud button, #end-card, #start-screen, #test-panel, #btn-testet, #mute, #ui button, #match-card, #btn-reconnect")) return;
    heroAttack(false);
  };
  stage.addEventListener("pointerdown", tap);
}

async function boot() {
  crestURL.red = makeCrest("red");
  crestURL.blue = makeCrest("blue");
  setProgress(0.08, S("loadScene"));
  buildWorld();
  addStewards();
  resizeFx();
  applyPhaseUI();
  fit();
  setProgress(0.2, S("loadFans"));
  try {
    await loadCharacters((p) => setProgress(0.2 + p * 0.7, S("loadFans")));
  } catch (err) {
    console.error("Character load failed", err);
    setProgress(1, S("loadErr"));
  }
  setProgress(1, S("loadReady"));
  setTimeout(() => { const l = $("loader"); if (l) l.classList.add("hide"); }, 200);
  bindUI();

  if (QPARAMS.get("clip") === "1" || QPARAMS.get("howto") === "1") {
    document.body.classList.add("panel-hidden", "clip");
  }
  if (QPARAMS.get("sound") === "1") setMuted(false);
  if (QPARAMS.get("lang") === "en") CONFIG.lang = "en";
  applyPhaseUI();

  document.body.classList.add("mode-" + state.mode);

  const teamQ = QPARAMS.get("team");
  const playQ = QPARAMS.get("play") === "1";
  if (playQ && (teamQ === "red" || teamQ === "blue" || teamQ === "bjk" || teamQ === "fb")) {
    const team = (teamQ === "fb" || teamQ === "blue") ? "blue" : "red";
    startPlay(team, QPARAMS.get("name") || "Pablo");
  } else if (state.mode === "demo") {
    $("start-screen").classList.remove("show");
    const tog = $("bot-toggle"); if (tog) tog.checked = true;
    ensureCrowd(LOW ? 10 : 14);
    state.phase = "battle";
    state.roundStart = performance.now();
    startBot();
    setLiveStatus("DEMO");
  } else if (state.mode === "live") {
    $("start-screen").classList.remove("show");
    document.body.classList.add("live");
    const tog = $("bot-toggle"); if (tog) tog.checked = false;
    stopBot();
    state.phase = "battle";
    state.roundStart = 0;
    state.clockPaused = true;
    // Empty street until real viewers join. Never auto-fill with bots.
    // Clock stays on STANDBY until LIVE with at least one real participant.
    setLiveStatus("CONNECTING");
  } else {
    showStartScreen();
    // Warm a quiet street (labelled bots, no timer, no bot-event spam)
    ensureCrowd(8);
    state.phase = "lobby";
    state.roundStart = 0;
    const tog = $("bot-toggle"); if (tog) tog.checked = false;
    stopBot();
    setLiveStatus("SOLO");
  }
  updateMatchScore();
  applyPhaseUI();
  tryConnectPlayroom();
  requestAnimationFrame(tick);
}

boot();
