# v1.8 — Derbi Günü: recognisable viewer hits

**Staging only.** Layered on v1.7 cinematic branch; do not merge to main yet.

## Implemented
- A short, bilingual (TR/EN) team-coloured spectator recognition strip on genuine participant-led strong hits.
- Cooldown (2.6 s), bounded visibility (2.3 s), truncation for long usernames, and textContent-only rendering.
- Suppresses synthetic bot accounts and host-only users; no extra Three.js draw calls.
- Respects system reduced-motion for the strip animation; does not affect points, gifts or scoring.
- New Chromium viewer test and screenshot, on top of existing v1.6/v1.7 regressions.

## Test contract
`node --check js/game.js` and `node --test tests/stabilization.test.mjs`;
CI browser smoke, natural-soak, match-cycle, earlier visual + cinematic and
`tests/v18-viewer-browser.mjs`.

## Next acceptance
Check actual TikTok LIVE provider-event mapping, mobile 9:16 overlays,
20-minute OBS capture, and real player visibility before production deployment.
