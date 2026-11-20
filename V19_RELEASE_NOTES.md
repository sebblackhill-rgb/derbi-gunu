# v1.9 — Derbi Günü: community rally & closing push

Staging only; stacked on v1.8 branch and its draft PR. Do not merge into main without verifying dependencies.

## Changes
- Three distinct **eligible, non-bot, non-host-only** participants landing a real strong hit inside 12 s trigger a 2.6 s team rally callout.
- The existing rear-line character models perform a bounded synchronised cheer/hop; no new meshes, scoring or event sources.
- Rally cooldown is 18 s per side; the pose is capped at 16 rear-line users.
- The last 15 s of a legitimately running, non-standby round shows a short bilingual participation cue.
- Replay, gift ledger, match timers, team choice, MVP logic and results are unchanged.
- Motion reduction is honoured for the new 3D hop, with a text-only cue remaining.

## Quality gates
Node syntax + existing regression suite; 390x844 Chrome spectator/match-cycle tests, v1.6-v1.8 visuals plus tests/v19-finale-browser.mjs. Do not consider CI a real TikTok LIVE gift test.

## Pending before public use
Phone/OBS 9:16 review, 15–30 min actual-performance soak and real provider-event/paid gift contract validation.
