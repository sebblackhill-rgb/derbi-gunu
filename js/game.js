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
  version: "v3-anim",
  maxFans: 80,
  maxLabels: 18,
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
      logJoin: "{name} joined the {team}!",
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
      combo: "COMBO x{n}"
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
      combo: "KOMBO x{n}"
    }
  }
};


const SKINS = [0xf6c7a1, 0xe8b894, 0xd1a074, 0xc6865a, 0xf3d1b0, 0xa15c38, 0xffd6b0, 0x8d5524];
const HAIR = [0x1a120e, 0x3b2214, 0x6a3a18, 0x0d0d0d, 0xc4a36a, 0x2a1a12, 0x4a2c1a];
const W = 540, H = 960;
const QPARAMS = new URLSearchParams(location.search);
const IS_MOBILE = QPARAMS.get("desktop") !== "1" && (
  QPARAMS.get("mobile") === "1" ||
  /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
  (("ontouchstart" in window) && window.innerWidth <= 900)
);
const LOW = IS_MOBILE || QPARAMS.get("low") === "1";
if (LOW) { CONFIG.maxFans = 40; CONFIG.maxLabels = 12; }
window.THREE = THREE;
window.GAME_VERSION = CONFIG.version;
window.CONFIG = CONFIG;

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
function parseTeam(comment) {
  const t = foldTR(comment);
  let best = null, bestIdx = 1e9;
  for (const id of ["red", "blue"]) {
    for (const kw of CONFIG.teams[id].keywords) {
      const i = t.indexOf(foldTR(kw));
      if (i !== -1 && i < bestIdx) { bestIdx = i; best = id; }
    }
  }
  return best;
}

const state = {
  phase: "battle",
  users: new Map(),
  line: 0,
  hits: { red: 0, blue: 0 },
  scores: { red: 0, blue: 0 },
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
  modelsReady: false
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
scene.fog = new THREE.Fog(0x6a8eb8, 58, 130);
const camera = new THREE.PerspectiveCamera(64, W / H, 0.2, 280);
const camPos = new THREE.Vector3(0, 5.9, 13.2);
const camLook = new THREE.Vector3(0, 1.3, -0.3);
const camTarget = new THREE.Vector3().copy(camLook);
camera.position.copy(camPos);
camera.lookAt(camLook);

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
  const plaza = new THREE.Mesh(new THREE.BoxGeometry(18, 0.08, 16), mat(0xb7b0a2));
  plaza.position.set(0, 0.03, -16);
  plaza.receiveShadow = true;
  city.add(plaza);
  // grass around the stadium / shore
  const grass = new THREE.Mesh(new THREE.PlaneGeometry(90, 28), mat(0x3f8a3a));
  grass.rotation.x = -Math.PI / 2;
  grass.position.set(0, -0.02, -40);
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
  // İnönü / Tüpraş: low oval bowl by the water, cream colonnade,
  // white PTFE canopy, black-and-white seats, open toward the square.
  const g = new THREE.Group();
  g.position.set(0, 0, -26);
  g.scale.set(1.0, 0.95, 0.9);

  // Three.js cylinder: theta=0 is +Z (toward the square / camera)
  const gap = 2.25;
  const thetaStart = gap / 2;
  const thetaLength = Math.PI * 2 - gap;
  const limestone = 0xe8dfcc;

  function seatTex() {
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
    t.wrapS = THREE.RepeatWrapping;
    t.repeat.set(6, 1);
    t.needsUpdate = true;
    return t;
  }
  const seats = seatTex();
  const seatMat = matTex(seats, 0xffffff);

  // solid-looking stand banks (thick, not paper-thin shells)
  const lower = new THREE.Mesh(
    new THREE.CylinderGeometry(11.2, 13.6, 3.6, 36, 1, true, thetaStart, thetaLength),
    seatMat
  );
  lower.position.y = 1.9;
  lower.receiveShadow = true; lower.castShadow = true;
  g.add(lower);
  const upper = new THREE.Mesh(
    new THREE.CylinderGeometry(12.6, 14.8, 3.8, 36, 1, true, thetaStart, thetaLength),
    seatMat
  );
  upper.position.y = 5.4;
  upper.receiveShadow = true; upper.castShadow = true;
  g.add(upper);
  // seating floor rings so the bowl reads from above
  const ring1 = new THREE.Mesh(new THREE.RingGeometry(9.6, 13.2, 36, 1), seatMat);
  ring1.rotation.x = -Math.PI / 2; ring1.position.y = 0.35;
  g.add(ring1);
  const ring2 = new THREE.Mesh(new THREE.RingGeometry(11.4, 14.6, 36, 1), seatMat);
  ring2.rotation.x = -Math.PI / 2; ring2.position.y = 3.8;
  g.add(ring2);

  // outer cream colonnade (sides + back only)
  const facade = new THREE.Mesh(
    new THREE.CylinderGeometry(15.0, 15.6, 8.4, 36, 1, true, thetaStart, thetaLength),
    mat(limestone)
  );
  facade.position.y = 4.3;
  facade.castShadow = true; facade.receiveShadow = true;
  g.add(facade);
  for (let i = 0; i < 18; i++) {
    const a = thetaStart + (i + 0.5) * (thetaLength / 18);
    const col = new THREE.Mesh(new THREE.BoxGeometry(0.42, 8.4, 0.55), mat(0xf0e8d6));
    col.position.set(Math.cos(a) * 15.3, 4.3, Math.sin(a) * 15.3);
    col.lookAt(new THREE.Vector3(0, 4.3, 0));
    col.castShadow = true;
    g.add(col);
  }

  // pitch
  const pitch = new THREE.Mesh(new THREE.CircleGeometry(9.6, 32), mat(0x3faa46));
  pitch.rotation.x = -Math.PI / 2;
  pitch.position.y = 0.1;
  pitch.receiveShadow = true;
  g.add(pitch);
  const mid = new THREE.Mesh(new THREE.RingGeometry(0.08, 1.5, 20), mat(0xf7f7f7));
  mid.rotation.x = -Math.PI / 2; mid.position.y = 0.12;
  g.add(mid);
  const midline = new THREE.Mesh(new THREE.PlaneGeometry(18.8, 0.1), mat(0xf7f7f7));
  midline.rotation.x = -Math.PI / 2; midline.position.y = 0.12;
  g.add(midline);

  // white PTFE canopy — kept relatively low so it sits under the UI
  const roofMat = mat(0xf6f2ea, { shininess: 50, specular: 0x777777 });
  const roofDeck = new THREE.Mesh(new THREE.RingGeometry(10.6, 15.6, 36, 1), roofMat);
  roofDeck.rotation.x = -Math.PI / 2;
  roofDeck.position.y = 8.0;
  roofDeck.castShadow = true;
  g.add(roofDeck);
  const rimOut = new THREE.Mesh(new THREE.TorusGeometry(15.5, 0.26, 6, 36, thetaLength), mat(0xe4ddd0));
  rimOut.rotation.x = Math.PI / 2; rimOut.rotation.z = thetaStart; rimOut.position.y = 8.0;
  g.add(rimOut);
  const rimIn = new THREE.Mesh(new THREE.TorusGeometry(10.7, 0.2, 6, 28, thetaLength), mat(0xeee8dc));
  rimIn.rotation.x = Math.PI / 2; rimIn.rotation.z = thetaStart; rimIn.position.y = 8.0;
  g.add(rimIn);
  for (let i = 0; i < 12; i++) {
    const a = thetaStart + (i + 0.5) * (thetaLength / 12);
    const rib = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.14, 5.0), mat(0xd8d2c6));
    rib.position.set(Math.cos(a) * 13.1, 8.12, Math.sin(a) * 13.1);
    rib.lookAt(new THREE.Vector3(0, 8.12, 0));
    g.add(rib);
  }

  // four floodlight towers — just tall enough to read, not cropped by the banner
  function tower(x, z) {
    const p = new THREE.Mesh(new THREE.BoxGeometry(0.45, 11.5, 0.45), mat(0xf2efe8));
    p.position.set(x, 5.8, z); p.castShadow = true;
    const head = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.4, 0.9), mat(0xfff4c8, { emissive: 0xffe08a, emissiveIntensity: 0.8 }));
    head.position.set(x, 11.7, z);
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ color: 0xfff2c0, transparent: true, opacity: LOW ? 0.2 : 0.4, depthWrite: false }));
    glow.scale.set(3.6, 3.6, 1);
    glow.position.set(x, 11.7, z);
    g.add(p, head, glow);
  }
  tower(-11.5, 8.5); tower(11.5, 8.5); tower(-11.5, -7.5); tower(11.5, -7.5);

  // generic striped banners on the open ends of the stands
  function banner(x, colA, colB) {
    const b = new THREE.Group();
    const cloth = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 1.8), mat(colA, { side: THREE.DoubleSide }));
    const stripe = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 0.45), mat(colB, { side: THREE.DoubleSide }));
    stripe.position.z = 0.03;
    b.add(cloth, stripe);
    b.position.set(x, 6.4, 12.2);
    g.add(b);
  }
  banner(-7.2, 0x141414, 0xf3f3f0);
  banner(7.2, 0x0a2850, 0xffd000);

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
  const water = new THREE.Mesh(new THREE.PlaneGeometry(140, 70), mat(0x1a5f86, { shininess: 70, specular: 0x88cce0 }));
  water.rotation.x = -Math.PI / 2;
  water.position.set(16, -0.15, -58);
  city.add(water);
  const water2 = new THREE.Mesh(new THREE.PlaneGeometry(80, 24), mat(0x187096, { shininess: 50, specular: 0x77bbd4 }));
  water2.rotation.x = -Math.PI / 2;
  water2.position.set(20, -0.12, -44);
  city.add(water2);
  // shoreline
  const shore = new THREE.Mesh(new THREE.BoxGeometry(90, 0.4, 6), mat(0xb8a078));
  shore.position.set(10, 0.05, -42);
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
  mosque(17.5, -24);
  mosque(-17.5, -28);

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
  bridge.position.set(22, 0, -62);
  bridge.rotation.y = 0.35;
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
  const tape = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.10, 11.5), matTex(tex));
  tape.position.y = 0.09;
  tape.castShadow = true;
  // second raised police-tape so the clash line reads from a low camera
  const tape2 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.08, 11.5), matTex(tex));
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
  const shorts = team === "red" ? 0x141414 : 0x0a2850;
  const shirtTex = kitTex(team);
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
        mat.map = shirtTex;
        mat.color.setHex(0xffffff);
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
        mat.color.setHex(team === "red" ? 0x111111 : 0xffd000);
      }
      return mat;
    });
    o.material = out.length === 1 ? out[0] : out;
  });
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
  // scarf on rear fans
  if (user.role === "rear" || (hash(user.id) % 5 === 0)) attachProp(user, "scarf");
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
  if (user.ring) {
    const hot = state.heroId === user.id || performance.now() < user.highlightUntil;
    user.ring.visible = !!hot;
    if (hot) {
      const p = 1 + Math.sin(state.time * 6) * 0.08;
      user.ring.scale.set(p, p, p);
    }
  }
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
    scale: 1, diamonds: 0, hits: 0, knockouts: 0, captainOf: null,
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
    if (bots[0]) removeUser(bots[0].id);
    else return null;
  }
  const u = makeUser(userId, username, team, photoUrl);
  state.users.set(userId, u);
  spawnModel(u);
  log("join", S("logJoin", { name: u.name, team: teamName(team) }));
  const emoji = team === "red" ? "🦅" : "🐤";
  showWelcome(S("welcome", { name: u.name, emoji }));
  u.highlightUntil = performance.now() + 1600;
  return u;
}
function removeUser(id) {
  const u = state.users.get(id);
  if (!u) return;
  if (u.model && u.model.parent) u.model.parent.remove(u.model);
  state.users.delete(id);
}

function log(kind, text) {
  const box = $("log"); if (!box) return;
  const el = document.createElement("div");
  el.className = "log-line " + (kind || "");
  el.textContent = text;
  box.prepend(el);
  while (box.children.length > 7) box.removeChild(box.lastChild);
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
function showWelcome(text) {
  const el = $("welcome"); if (!el) return;
  el.textContent = text;
  el.classList.remove("show");
  void el.offsetWidth;
  el.classList.add("show");
  clearTimeout(showWelcome._t);
  showWelcome._t = setTimeout(() => el.classList.remove("show"), 1200);
}
function pushLine(team, amt) {
  if (state.phase !== "battle") return;
  const dir = team === "red" ? 1 : -1;
  state.line = Math.max(-1, Math.min(1, state.line + dir * amt));
  if (state.line >= 0.98) endWin("red");
  else if (state.line <= -0.98) endWin("blue");
}
function captains() {
  const out = { red: null, blue: null };
  for (const u of state.users.values()) if (u.captainOf) out[u.captainOf] = u;
  return out;
}
function topCapos(n) {
  return [...state.users.values()].filter((u) => u.diamonds > 0).sort((a, b) => b.diamonds - a.diamonds).slice(0, n);
}
function topHits(n) {
  return [...state.users.values()].filter((u) => u.hits > 0).sort((a, b) => b.hits - a.hits).slice(0, n);
}

function endWin(team) {
  if (state.phase === "victory" || state.phase === "countdown") return;
  state.phase = "victory";
  state.winner = team;
  state.scores[team] += 1;
  state.victoryAt = performance.now() + 7000;
  const winners = [...state.users.values()].filter((u) => u.team === team);
  winners.sort((a, b) => (b.hits * 2 + b.diamonds) - (a.hits * 2 + a.diamonds));
  state.mvp = winners[0] || null;
  if (state.mvp) state.camFocus = { user: state.mvp, until: performance.now() + 2200, kind: "mvp" };
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
  if (state.playMode) showEndCard();
  applyPhaseUI();
}
function showMvp(u) {
  const el = $("mvp"); if (!el) return;
  if (!u) { el.classList.remove("show"); el.innerHTML = ""; return; }
  el.innerHTML = '<div class="k">' + esc(S("mvpTitle")) + '</div><div class="n">@' + esc(u.name) + '</div><div class="s">' + u.hits + " 💥 · " + u.diamonds.toLocaleString() + " 💎</div>";
  el.classList.add("show");
}
function resetBattle() {
  state.phase = "battle";
  state.line = 0;
  state.winner = null;
  state.mvp = null;
  state.roundStart = performance.now();
  state.camFocus = null;
  state.kapMeter = state.playMode ? state.kapMeter * 0.25 : 0;
  const el = $("mvp"); if (el) el.classList.remove("show");
  const cd = $("countdown"); if (cd) { cd.classList.remove("show"); cd.textContent = ""; }
  const end = $("end-card"); if (end) end.classList.remove("show");
  for (const u of state.users.values()) {
    u.hits = 0; u.knockouts = 0;
    u.y = 0; u.vx = 0; u.vy = 0; u.vz = 0;
    u.anim = "run"; u.fight = "approach"; u.partner = null;
    u.downT = 0; u.face = "idle";
    const side = u.team === "red" ? -1 : 1;
    u.x = side * 1.6;
  }
  applyPhaseUI();
}
function maybeEndOnTime(now) {
  if (state.phase !== "battle" || !state.roundStart) return;
  const left = CONFIG.roundSecs - (now - state.roundStart) / 1000;
  if (left <= 0) {
    if (Math.abs(state.line) < 0.04) {
      if (state.hits.red === state.hits.blue) pushLine("red", 0.02);
      endWin(state.hits.red >= state.hits.blue ? "red" : "blue");
    } else endWin(state.line > 0 ? "red" : "blue");
  }
}

function creditGift(user, diamonds, singleAmount) {
  user.diamonds += diamonds;
  user.lastActive = performance.now();
  if (singleAmount >= CONFIG.captainGift) makeCaptain(user);
}
function makeCaptain(user) {
  for (const u of state.users.values()) if (u.captainOf === user.team) {
    u.captainOf = null; u.scale = 1; if (u._crown) { clearProp(u); }
  }
  user.captainOf = user.team;
  user.scale = 1.35;
  user.highlightUntil = performance.now() + 4000;
  attachProp(user, "crown");
  showPop("capo", S("newCapo", { name: user.name }), S("newCapoSub", { name: user.name }), 3200);
  log("capo", S("logCaptain", { name: user.name, n: user.diamonds }));
  sfxHorn();
  flash(0.45, "#f5e0a0");
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
  const single = diamonds > 0 ? diamonds : def;
  return { kind, diamonds: (diamonds > 0 ? diamonds : def), repeats, single: kind === "lion" ? Math.max(single, CONFIG.captainGift) : single * repeats };
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

function landHit(atk, vic, power, sfxWord) {
  if (!vic || state.phase !== "battle") return;
  const now = performance.now();
  atk.hits += 1;
  state.hits[atk.team] += 1;
  atk.lastActive = now;
  playAnim(vic, "hit", { once: true, restart: true });
  comicBurst((atk.x + vic.x) / 2, 1.5, (atk.z + vic.z) / 2, sfxWord || "BAM!");
  dustAt(vic.x, vic.z);
  impactFlash(vic.x, vic.y + 1.1, vic.z);
  sfxHit();
  const hard = power >= 0.02 || Math.random() < 0.38 + power * 4;
  if (hard) {
    knockBack(vic, atk, power);
    atk.knockouts += 1;
    pushLine(atk.team, power * 1.6);
  } else {
    vic.staggerT = now + 420;
    vic.fight = "stagger";
    const dir = vic.team === "blue" ? 1 : -1;
    vic.x += dir * (0.18 + power * 2);
    pushLine(atk.team, power);
  }
  if (state.heroId === atk.id) haptic(hard ? 28 : 14);
}

function knockBack(victim, from, power) {
  const dir = victim.team === "blue" ? 1 : -1;
  const p = 3.0 + power * 22;
  victim.vx = dir * p;
  victim.vy = 4.0 + power * 10;
  victim.vz = (Math.random() - 0.5) * 1.6;
  victim.downT = performance.now() + 1600;
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
  if (!rivs.length) { user.hits += 1; state.hits[user.team] += 1; pushLine(user.team, power * 0.4); }
  state.shake = Math.max(state.shake, 0.16 + power * 2);
  setTimeout(() => { if (special) clearProp(user); if (!user.captainOf && user.role === "rear") attachProp(user, "scarf"); }, 700);
}

function handleLiveEvent(evt) {
  if (!evt) return;
  const type = evt.type;
  const userId = String(evt.userId || evt.username || "").trim();
  const username = String(evt.username || evt.userId || "fan").trim() || "fan";
  if (type === "chat") {
    const comment = String(evt.comment || "").slice(0, 60);
    let user = state.users.get(userId);
    if (!user) {
      const team = parseTeam(comment);
      if (!team) return;
      user = joinUser(userId, username, team);
    }
    if (!user || state.phase !== "battle") return;
    user.highlightUntil = performance.now() + 2600;
    swingAt(user, 0.012);
    return;
  }
  let user = state.users.get(userId);
  if (!user) return;
  if (type === "like") {
    user.highlightUntil = performance.now() + 1800;
    swingAt(user, 0.008);
    return;
  }
  if (type === "gift") {
    const g = resolveGift(evt);
    creditGift(user, g.diamonds, g.single);
    if (g.kind === "lion") {
      log("capo", S("logLion", { name: user.name }));
      if (state.phase === "battle") {
        showPop("tifo", S("tifo"), S("tifoSub", { name: user.name }), 2800);
        flash(0.65, user.team === "red" ? "#f2f2f0" : "#ffd000");
        sfxHorn();
        pushLine(user.team, 0.16);
        tifoStorm(user.team);
        state.shake = 1.1;
        if (!user.captainOf) state.camFocus = { user, until: performance.now() + 1600, kind: "tifo" };
      }
    } else if (g.kind === "rose" || g.kind === "heart") {
      swingAt(user, 0.035 * Math.max(1, g.repeats), { special: true, multi: 3 });
      sfxGift();
    } else {
      swingAt(user, 0.04 * Math.max(1, g.repeats));
      sfxGift();
      if (!user.captainOf) {
        showPop("", S("superMove"), S("superMoveSub", { name: user.name }), 1800);
        state.camFocus = { user, until: performance.now() + 1400, kind: "super" };
      }
    }
  }
}
window.handleLiveEvent = handleLiveEvent;

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
    if (free.red[i].fight === "idle") free.red[i].fight = "approach";
    if (free.blue[i].fight === "idle") free.blue[i].fight = "approach";
  }
  // occasional 2v1: leftover front joins a nearby duel
  const leftover = free.red.length > n ? free.red.slice(n) : free.blue.slice(n);
  leftover.forEach((u) => {
    if (Math.random() < 0.4) {
      const rivs = nearestRivals(u, 1, 4);
      if (rivs[0]) { u.partner = rivs[0].id; u.fight = "approach"; }
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

function updateDuel(u, dt, now) {
  if (u.id === state.heroId && now < (u.playerLock || 0)) return;
  if (u.anim === "fly" || now < u.downT) return;
  if (now < u.staggerT) { playAnim(u, "hit"); return; }

  const v = u.partner ? state.users.get(u.partner) : null;
  const side = u.team === "red" ? -1 : 1;
  const lx = lineX();

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

  const camBias = u.team === "red" ? -0.55 : 0.55;
  if (!v || v.anim === "fly" || v.fight === "fly") {
    u.partner = null;
    u.fight = "approach";
    const holdZ = (u.laneZ != null) ? u.laneZ : ((hash(u.id) % 11) - 5) * 0.95;
    moveToward(u, lx + side * 1.25, holdZ, 4.2, dt);
    playAnim(u, "walk", { timeScale: 1.3 });
    return;
  }

  const dist = Math.hypot(v.x - u.x, v.z - u.z);
  faceToward(u, v.x, v.z, camBias);

  if (u.fight === "approach" || dist > 2.8) {
    const tz = (u.laneZ != null) ? u.laneZ : (u.z + v.z) / 2;
    // Close the no-man's-land: meet just across the tape.
    const tx = lx + side * 0.55;
    moveToward(u, tx, tz, 5.2, dt);
    faceToward(u, v.x, v.z, camBias);
    playAnim(u, "walk", { timeScale: 1.55 });
    if (dist < 2.15) { u.fight = "square"; u.fightT = now + 220 + Math.random() * 380; playAnim(u, "idle"); }
    return;
  }

  if (u.fight === "square") {
    // circle / square up in the no-man's-land, stay near the assigned lane
    const ang = Math.atan2(u.z - v.z, u.x - v.x) + dt * 1.2 * side;
    const rad = 0.62;
    let tx = v.x + Math.cos(ang) * rad;
    let tz = v.z + Math.sin(ang) * rad;
    if (u.laneZ != null) tz = tz * 0.35 + u.laneZ * 0.65;
    // stay on your side of the tape, stepping into the gap
    const edge = lx + side * 0.55;
    if (side < 0) tx = Math.min(tx, edge + 0.15);
    else tx = Math.max(tx, edge - 0.15);
    moveToward(u, tx, tz, 1.6, dt);
    faceToward(u, v.x, v.z, camBias);
    playAnim(u, "idle");
    if (now > u.fightT) {
      const r = Math.random();
      u.fight = r < 0.5 ? "punch" : r < 0.65 ? "dodge" : r < 0.8 ? "grapple" : r < 0.9 ? "chase" : "tackle";
      u.fightT = now + 520;
      u.hitThisMove = false;
    }
    return;
  }

  if (u.fight === "punch") {
    playAnim(u, "punch", { once: true, restart: !u.hitThisMove });
    if (!u.hitThisMove && u.currentAction && u.currentAction.time > 0.18) {
      u.hitThisMove = true;
      landHit(u, v, 0.007, ["BAM!", "ŞAK!", "POF!"][hash(u.id + now) % 3]);
    }
    if (now > u.fightT) { u.fight = "square"; u.fightT = now + 300 + Math.random() * 500; }
    return;
  }

  if (u.fight === "dodge") {
    playAnim(u, "walk", { timeScale: 1.5 });
    u.z += side * dt * 2.2;
    if (now > u.fightT) u.fight = "square";
    return;
  }

  if (u.fight === "grapple") {
    moveToward(u, (u.x + v.x) / 2 + side * 0.22, (u.z + v.z) / 2, 1.8, dt);
    playAnim(u, "grab");
    u.y = 0.02 + Math.sin(state.time * 10) * 0.03;
    if (now > u.fightT + 400) {
      if (Math.random() < 0.5) landHit(u, v, 0.01, "BOM!");
      u.fight = "square"; u.y = 0;
    }
    return;
  }

  if (u.fight === "chase") {
    playAnim(u, "walk", { timeScale: 1.8 });
    const tz = v.z + side * 1.4;
    moveToward(u, v.x + side * 0.4, tz, 4.2, dt);
    if (now > u.fightT + 400) { u.fight = "tackle"; u.fightT = now + 500; }
    return;
  }

  if (u.fight === "tackle") {
    moveToward(u, v.x, v.z, 5.2, dt);
    playAnim(u, "punch", { once: true, restart: !u.hitThisMove, timeScale: 1.2 });
    if (!u.hitThisMove && dist < 1.1) {
      u.hitThisMove = true;
      landHit(u, v, 0.018, "BAM!");
    }
    if (now > u.fightT) u.fight = "square";
    return;
  }

  u.fight = "approach";
}

function updatePeople(dt, now) {
  assignRoles();
  if (state.phase === "battle") assignDuels();
  const lx = lineX();
  updateTerritory(lx);

  for (const u of state.users.values()) {
    if (!u.model) spawnModel(u);

    // physics: fly / bounce / get up
    if (u.anim === "fly" || now < u.downT) {
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
    } else if (u.anim === "dazed" && now >= u.downT) {
      u.anim = "getup";
      playAnim(u, "stand", { once: true, restart: true });
      u.downT = now + 800;
    } else if (u.anim === "getup" && now >= u.downT) {
      u.anim = "fight";
      u.fight = "approach";
    } else if (state.phase === "victory" || state.phase === "countdown") {
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
  state.kapMeter = 0;
  state.combo = 0;
  const nm = (name || randomHandle()).slice(0, 18);
  const id = "hero:" + nm.toLowerCase();
  let u = state.users.get(id) || joinUser(id, nm, team);
  if (u.team !== team) { /* keep */ }
  state.heroId = u.id;
  u.role = "front";
  u.highlightUntil = 1e15;
  u.scale = 1.12;
  const side = team === "red" ? -1 : 1;
  u.x = side * 3.2; u.z = 0.2; u.fight = "approach";
  state.hintUntil = performance.now() + 10000;
  const hint = $("hint-tap");
  if (hint) { hint.textContent = S("tapHint"); hint.classList.add("on"); }
  setTimeout(() => hint && hint.classList.remove("on"), 10000);
  $("btn-super").innerHTML = S("superBtn").replace(" ", "<br>");
  ensureCrowd(14);
  startBot();
  if (!state.roundStart) state.roundStart = performance.now();
  $("bot-toggle").checked = true;
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
  u.playerLock = now + 480;
  u.highlightUntil = 1e15;
  const bonus = Math.min(0.02, (state.combo - 1) * 0.003);
  const power = superMove ? 0.04 : (0.016 + bonus);
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
  if (state.kapMeter < 100 || !state.playMode || state.phase !== "battle") return;
  const u = state.users.get(state.heroId);
  if (!u) return;
  u.diamonds = Math.max(u.diamonds, CONFIG.captainGift);
  makeCaptain(u);
  state.kapMeter = 0;
  updateKapUI();
  haptic(50);
}
function updateKapUI() {
  const bar = $("kap-meter"); if (bar) bar.style.width = state.kapMeter + "%";
  const btn = $("btn-kaptan"); if (btn) btn.classList.toggle("ready", state.kapMeter >= 100);
  const s = $("btn-super");
  if (s) s.classList.toggle("cd", performance.now() < state.superUntil);
}

function showEndCard() {
  const el = $("end-card"); if (!el) return;
  const u = state.users.get(state.heroId);
  const won = u && u.team === state.winner;
  $("end-title").textContent = won ? S("endWin") : S("endLose");
  const rankList = [...state.users.values()].sort((a, b) => (b.hits * 2 + b.diamonds) - (a.hits * 2 + a.diamonds));
  const rank = u ? rankList.findIndex((x) => x.id === u.id) + 1 : "—";
  $("end-stats").innerHTML =
    S("yourHits") + ": <b>" + (u ? u.hits : 0) + "</b><br>" +
    S("yourKOs") + ": <b>" + (u ? u.knockouts : 0) + "</b><br>" +
    S("yourRank") + ": <b>" + rank + " / " + rankList.length + "</b>";
  $("btn-replay").textContent = S("playAgain");
  $("btn-share").textContent = S("share");
  el.classList.add("show");
}

async function shareGame() {
  const url = location.href.split("?")[0];
  const text = "Derbi Günü — Beşiktaş vs Fenerbahçe. Takımını seç, meydanı kap!";
  try {
    if (navigator.share) await navigator.share({ title: "Derbi Günü", text, url });
    else {
      await navigator.clipboard.writeText(url);
      showWelcome("Link kopyalandı!");
    }
  } catch (_) {}
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
  set("bot-label-text", S("botLabel"));
  const send = $("btn-send"); if (send) send.textContent = S("sendBtn");
  const testBtn = $("btn-testet"); if (testBtn && !state.playMode) testBtn.textContent = S("testBtn");
  const ver = $("game-version"); if (ver) ver.textContent = CONFIG.version;
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
  const el = $("counts"); if (el) el.textContent = "🏟️  " + S("fans", { n: state.users.size });
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
      html += '<div class="cap-row">' + av + '<div class="nm">' + esc(u.name) + '</div><div class="dm">' + u.diamonds.toLocaleString() + " 💎</div></div>";
    }
  };
  capBlock("red"); capBlock("blue");
  html += "<h2>🎺 " + S("capos") + "</h2><ol>";
  const capos = topCapos(4);
  if (!capos.length) html += '<div class="empty">—</div>';
  capos.forEach((u, i) => {
    html += '<li class="' + u.team + '"><span class="nm">' + (i + 1) + ". " + esc(u.name) + '</span><span class="sc">' + u.diamonds.toLocaleString() + "</span></li>";
  });
  html += "</ol><h2>💥 " + S("hits") + "</h2><ol>";
  const hits = topHits(4);
  if (!hits.length) html += '<div class="empty">—</div>';
  hits.forEach((u, i) => {
    html += '<li class="' + u.team + '"><span class="nm">' + (i + 1) + ". " + esc(u.name) + '</span><span class="sc">' + u.hits + "</span></li>";
  });
  html += "</ol>";
  $("board").innerHTML = html;
}
function refreshUI() { renderMeters(); renderCounts(); renderBoard(); }
function toggleLang() { CONFIG.lang = CONFIG.lang === "en" ? "tr" : "en"; applyPhaseUI(); }

const labelsEl = $("labels");
function updateLabels() {
  if (!labelsEl) return;
  const now = performance.now();
  const scored = [...state.users.values()].map((u) => {
    let score = 0;
    if (u.id === state.heroId) score += 1000;
    if (now < u.highlightUntil) score += 500;
    if (u.captainOf) score += 400;
    if (u.diamonds > 0) score += 80 + u.diamonds * 0.02;
    if (u.role === "front") score += 10;
    score += u.hits * 0.5;
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
    n.className = "lab";
    n.dataset.id = id;
    n.textContent = (u.id === state.heroId ? "@" : "") + u.name;
    labelsEl.appendChild(n);
    positionLabel(n, u);
  }
}
function positionLabel(n, u) {
  const p = worldToScreen(u.x, u.y + 1.85 * (u.scale || 1), u.z);
  n.style.transform = "translate(" + p.x + "px," + p.y + "px) translate(-50%,-100%)";
  n.classList.toggle("hot", u.id === state.heroId || performance.now() < u.highlightUntil);
  n.classList.toggle("cap", !!u.captainOf);
  n.classList.toggle(u.team, true);
}

const fx2 = $("fx2");
const fx = fx2.getContext("2d");
const particles = [];
function resizeFx() { fx2.width = W; fx2.height = H; }
function worldToScreen(x, y, z) {
  _v.set(x, y, z).project(camera);
  return { x: (_v.x * 0.5 + 0.5) * W, y: (-_v.y * 0.5 + 0.5) * H };
}
function comicBurst(x, y, z, text) {
  particles.push({ kind: "pow", text: text || "BAM!", x, y, z, t: 0, life: 0.85 });
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
function impactFlash(x, y, z) {
  particles.push({ kind: "flash", x, y, z, t: 0, life: 0.18 });
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
  fx.clearRect(0, 0, W, H);
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
      fx.font = "bold 36px sans-serif";
      fx.textAlign = "center";
      fx.lineWidth = 6;
      fx.strokeStyle = "#2a1000";
      fx.fillStyle = "#fff6c4";
      fx.strokeText(p.text, s.x, s.y);
      fx.fillText(p.text, s.x, s.y);
      fx.restore();
    } else if (p.kind === "flash") {
      fx.beginPath(); fx.fillStyle = "rgba(255,255,220," + a + ")";
      fx.arc(s.x, s.y, 28 * (1 - p.t / p.life), 0, 6.28); fx.fill();
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

/* ============================================================
   Camera, layout, bots, loop, boot
   ============================================================ */
function fit() {
  const sizer = $("stage-sizer");
  const stage = $("stage");
  const app = $("app");
  const panel = $("test-panel");
  const panelOn = !document.body.classList.contains("panel-hidden") && getComputedStyle(panel).position !== "fixed";
  const pad = 20;
  let availW = app.clientWidth - pad;
  const availH = app.clientHeight - pad;
  if (panelOn) availW -= (panel.offsetWidth + 16);
  availW = Math.max(160, availW);
  const s = Math.min(availW / W, availH / H);
  sizer.style.width = W * s + "px";
  sizer.style.height = H * s + "px";
  stage.style.transform = "scale(" + s + ")";
}

function updateCamera(dt) {
  const now = performance.now();
  const lx = lineX();
  const focus = state.camFocus && now < state.camFocus.until ? state.camFocus : null;
  if (focus && focus.user) {
    const u = focus.user;
    if (focus.kind === "captain") {
      camPos.set(u.x * 0.2 + (u.team === "red" ? -1.6 : 1.6), 3.1, u.z + 5.4);
      camLook.set(u.x, 1.45, u.z);
    } else if (focus.kind === "mvp") {
      camPos.set(0, 6.8, 15.0);
      camLook.set(0, 1.25, -0.4);
    } else {
      camPos.set(u.x * 0.4, 6.2, 10);
      camLook.set(u.x, 1.3, u.z);
    }
  } else {
    // wide shot: stadium in the top third, fight in the middle
    camPos.set(lx * 0.12, 5.9, 13.2);
    camLook.set(lx * 0.35, 1.3, -0.3);
    const hero = state.playMode && state.users.get(state.heroId);
    if (hero) {
      camPos.x = camPos.x * 0.7 + hero.x * 0.18;
      camPos.y = 5.8;
      camPos.z = 13.0;
      camLook.x = camLook.x * 0.65 + hero.x * 0.35;
      camLook.y = 1.3;
      camLook.z = hero.z * 0.3 - 0.4;
    }
    if (state.camFocus && now >= state.camFocus.until) state.camFocus = null;
  }
  if (state.shake > 0) {
    camPos.x += (Math.random() - 0.5) * state.shake * 0.4;
    camPos.y += (Math.random() - 0.5) * state.shake * 0.2;
    state.shake = Math.max(0, state.shake - dt * 2.2);
  }
  camera.position.lerp(camPos, focus ? 0.14 : 0.08);
  camTarget.lerp(camLook, focus ? 0.16 : 0.1);
  camera.lookAt(camTarget);
}
function snapCamera() {
  updateCamera(0.2);
  camera.position.copy(camPos);
  camTarget.copy(camLook);
  camera.lookAt(camTarget);
}
window.__snapCamera = snapCamera;
window.__debug = { camera, scene, renderer, getCap() { return {
  floatVT: renderer.capabilities.floatVertexTextures,
  maxVT: renderer.capabilities.maxVertexTextures,
  maxTex: renderer.capabilities.maxTextures,
  isWebGL2: renderer.capabilities.isWebGL2
}; } };

window.__endWin = endWin;
window.__makeCaptain = makeCaptain;
window.__stopBot = stopBot;
window.__startPlay = startPlay;
window.__ensureCrowd = ensureCrowd;

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
function startBot() {
  stopBot();
  const rate = () => Math.max(1, Number(($("bot-rate") || {}).value) || 5);
  const loop = () => { botEvent(); botTimer = setTimeout(loop, 1000 / rate()); };
  botTimer = setTimeout(loop, 40);
}
function stopBot() { if (botTimer) { clearTimeout(botTimer); botTimer = null; } }
function botEvent() {
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

async function tryConnectPlayroom() {
  if (QPARAMS.get("live") !== "1") return;
  try {
    await new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://unpkg.com/playroomkit/multiplayer.js";
      s.onload = resolve;
      s.onerror = () => reject(new Error("Failed to load Playroom Kit CDN"));
      document.head.appendChild(s);
    });
    const mod = window.Playroom || window.PlayroomKit || window;
    const insertCoin = mod.insertCoin || window.insertCoin;
    const onTikTokLiveEvent = mod.onTikTokLiveEvent || window.onTikTokLiveEvent;
    if (typeof insertCoin !== "function") return;
    await insertCoin({ liveMode: "tiktok" });
    onTikTokLiveEvent((event) => {
      const d = (event && event.data) || event || {};
      const raw = String((event && event.type) || d.type || "chat").toLowerCase();
      const type = raw.includes("gift") ? "gift" : raw.includes("like") ? "like" : "chat";
      handleLiveEvent({
        type,
        userId: d.userId || d.uniqueId || d.username,
        username: d.username || d.nickName || d.uniqueId || "viewer",
        comment: d.comment || d.content || "",
        giftName: d.giftName || d.gift || "",
        diamondCount: d.diamondCount || d.giftValue,
        repeatCount: d.repeatCount || 1
      });
    });
  } catch (err) {
    console.warn("[Playroom] not connected:", err && err.message ? err.message : err);
  }
}

let lastUI = 0, lastChant = 0;
function tick(now) {
  const dt = Math.min(0.05, (tick._last ? (now - tick._last) : 16) / 1000);
  tick._last = now;
  state.time += dt;
  if (state.phase === "battle") maybeEndOnTime(now);
  if (state.phase === "victory" && now >= state.victoryAt) {
    state.phase = "countdown";
    state.countdown = 3;
    state.victoryAt = now + 3200;
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
  updateLabels();
  updateFX(dt);
  updateTimer(now);
  updateKapUI();
  if (!state.muted && state.phase === "battle" && now - lastChant > 2200) {
    // crowd murmur
    lastChant = now;
  }
  renderer.render(scene, camera);
  if (now - lastUI > 220) { refreshUI(); lastUI = now; }
  requestAnimationFrame(tick);
}
function updateTimer(now) {
  const el = $("timer"); if (!el) return;
  if (state.phase !== "battle" || !state.roundStart) {
    if (state.phase === "victory") el.textContent = "⏱ 00:00";
    return;
  }
  const left = Math.max(0, CONFIG.roundSecs - (now - state.roundStart) / 1000);
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
    handleLiveEvent({ type: "chat", userId: "local:" + name.toLowerCase(), username: name, comment: $("fake-comment").value });
  });
  $("fake-comment").addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); $("btn-send").click(); }
  });
  $("btn-like").addEventListener("click", () => {
    const name = $("fake-user").value.trim() || "Pablo";
    handleLiveEvent({ type: "like", userId: "local:" + name.toLowerCase(), username: name });
  });
  $("btn-rose").addEventListener("click", () => {
    const name = $("fake-user").value.trim() || "Pablo";
    handleLiveEvent({ type: "gift", userId: "local:" + name.toLowerCase(), username: name, giftName: "rose", diamondCount: 1 });
  });
  $("btn-med").addEventListener("click", () => {
    const name = $("fake-user").value.trim() || "Pablo";
    handleLiveEvent({ type: "gift", userId: "local:" + name.toLowerCase(), username: name, giftName: "medium", diamondCount: 50 });
  });
  $("btn-lion").addEventListener("click", () => {
    const name = $("fake-user").value.trim() || "Pablo";
    handleLiveEvent({ type: "gift", userId: "local:" + name.toLowerCase(), username: name, giftName: "lion", diamondCount: 2999 });
  });
  document.querySelectorAll(".chips button").forEach((btn) => {
    btn.addEventListener("click", () => {
      $("fake-comment").value = btn.getAttribute("data-fill");
      $("btn-send").click();
    });
  });
  $("bot-rate").addEventListener("input", () => { $("bot-rate-val").textContent = $("bot-rate").value + "/s"; });
  $("bot-toggle").addEventListener("change", () => { if ($("bot-toggle").checked) startBot(); else stopBot(); });
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
  // tap-to-hit on the stage, ignore UI buttons
  const stage = $("stage");
  const tap = (e) => {
    if (!state.playMode) return;
    const t = e.target;
    if (t.closest && t.closest("#play-hud button, #end-card, #start-screen, #test-panel, #btn-testet, #mute, #ui button")) return;
    heroAttack(false);
  };
  stage.addEventListener("pointerdown", tap);
}

async function boot() {
  crestURL.red = makeCrest("red");
  crestURL.blue = makeCrest("blue");
  setProgress(0.08, "Sahne hazırlanıyor...");
  buildWorld();
  addStewards();
  resizeFx();
  applyPhaseUI();
  fit();
  setProgress(0.2, "Taraftarlar yükleniyor...");
  try {
    await loadCharacters((p) => setProgress(0.2 + p * 0.7, "Taraftarlar yükleniyor..."));
  } catch (err) {
    console.error("Character load failed", err);
    setProgress(1, "Yükleme hatası");
  }
  setProgress(1, "Hazır!");
  setTimeout(() => { const l = $("loader"); if (l) l.classList.add("hide"); }, 200);
  bindUI();

  if (QPARAMS.get("clip") === "1" || QPARAMS.get("howto") === "1") {
    document.body.classList.add("panel-hidden", "clip");
  }
  if (QPARAMS.get("sound") === "1") setMuted(false);
  if (QPARAMS.get("lang") === "en") CONFIG.lang = "en";
  applyPhaseUI();

  const teamQ = QPARAMS.get("team");
  const playQ = QPARAMS.get("play") === "1";
  const botQ = QPARAMS.get("bot") === "1" || QPARAMS.get("demo") === "1";
  if (playQ && (teamQ === "red" || teamQ === "blue" || teamQ === "bjk" || teamQ === "fb")) {
    const team = (teamQ === "fb" || teamQ === "blue") ? "blue" : "red";
    startPlay(team, QPARAMS.get("name") || "Pablo");
  } else if (botQ) {
    $("start-screen").classList.remove("show");
    ensureCrowd(LOW ? 10 : 14);
    $("bot-toggle").checked = true;
    startBot();
    state.roundStart = performance.now();
  } else {
    showStartScreen();
    // warm a quiet street so the start screen isn't empty behind the overlay
    ensureCrowd(8);
    state.roundStart = performance.now();
    startBot();
  }
  tryConnectPlayroom();
  requestAnimationFrame(tick);
}

boot();
