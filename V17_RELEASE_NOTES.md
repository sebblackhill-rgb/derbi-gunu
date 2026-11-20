# v1.7 cinematic gameplay — Derbi Günü

**Staging only.** Based on `codex/stabilization-20261119`, not published to `main`.

- Viewer-led hard knockbacks get a 1.25 s camera focus when a human participant or local hero lands the hit; bots cannot constantly hijack the camera.
- Maximum 8.5% visual zoom, with eased start and recovery; no new geometry or draw calls.
- The winning MVP receives a short ceremony focus.
- Minimum 4.8 s between ordinary action close-ups to avoid motion fatigue.
- Reduced-FX mode stops this camera effect.
- Gift credit, bot accounting, scores, match timers and victory selection are untouched.

## Quality gates

`node --check js/game.js`; `node --test tests/stabilization.test.mjs`;
existing staging Chrome checks plus `node tests/v17-cinematic-browser.mjs`.
CI artifacts include the exact staged game and screenshot evidence.
Do not merge until these pass and the portrait screenshot is visually reviewed.

## Field checks

Watch a full round at 390x844 and 1080x1920, repeated human strikes,
a victory ceremony, reduced-FX mode, a heavy crowd and OBS capture.
Check the MVP/scoreboard stays readable during movement.
Real TikTok LIVE gifts and device FPS are **not validated** by these tests.
