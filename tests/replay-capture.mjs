import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright-core";

const FIXTURE = join(dirname(fileURLToPath(import.meta.url)), "fixtures/sample-capture.json");
export const SAMPLE_NOTE = "SYNTHETIC fixture — not a real TikTok capture";

export function loadSampleCapture() {
  return JSON.parse(readFileSync(FIXTURE, "utf8"));
}

export async function runReplayHarness(page, check) {
  const bundle = loadSampleCapture();
  check("replay fixture is marked synthetic", /SYNTHETIC/i.test(bundle.note || "") && bundle.kind === "derbi-gunu-capture", bundle.note);
  const res = await page.evaluate((bundle) => {
    if (typeof window.__replayCapture !== "function") return { err: "no __replayCapture" };
    const results = window.__replayCapture(bundle);
    const rosa = window.__game.users.get("tt:rosa");
    const flag = window.__game.users.get("tt:flag");
    const raw = window.__game.users.get("tt:raw");
    return {
      rosaTeam: rosa && rosa.team,
      rosaDia: rosa ? rosa.diamonds : 0,
      flagTeam: flag && flag.team,
      flagDia: flag ? flag.diamonds : 0,
      rawTeam: raw && raw.team,
      statuses: (results || []).map((r) => r && (r.status || r.reason || (r.ok ? "ok" : "x")))
    };
  }, bundle);
  check("replay: no-repeatEnd 1+2+5 credits exactly 5 (not 8)", res.rosaDia === 5 && res.rosaTeam === "red", JSON.stringify(res));
  check("replay: flagged streak credits exactly 5 and duplicate is rejected", res.flagDia === 5 && res.flagTeam === "blue", JSON.stringify(res));
  check("replay: raw-provider chat joins Beşiktaş", res.rawTeam === "red", JSON.stringify(res));
  return res;
}

// Standalone run: node tests/replay-capture.mjs
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith("replay-capture.mjs")) {
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
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(BASE + "/index.html?play=1&team=red&name=Replay&mobile=1&low=1&v=37rep", { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForFunction(() => window.__game && window.__game.modelsReady, { timeout: 40000 });
  await runReplayHarness(page, check);
  await browser.close();
  const failed = results.filter((r) => !r.ok);
  console.log("\n" + results.filter((r) => r.ok).length + " passed, " + failed.length + " failed, " + results.length + " total");
  if (failed.length) process.exit(1);
}
