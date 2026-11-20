# Derbi Günü v2.0 — LIVE-readiness release candidate

**STAGING ONLY.** Child of the v1.9 rally branch. Public main, Pages and OBS sources are unchanged.

## Implemented
- Host-only operations panel that reports the bridge state, bounded, anonymous chat/like/gift outcome counts, p95 frame interval, WebGL interruptions, and JSON export without usernames, IDs or gift payloads.
- An explicitly unverified LIVE/gift contract status in every diagnostic export. This browser dashboard is NOT an attestation that TikTok gifts were delivered or paid.
- Retires obsolete Playroom subscription callbacks and unsubscribe handles when reconnecting. A late old transport cannot change the game or credit duplicate gifts.
- Refuses to subscribe when Playroom is missing the event callback. Only sets LIVE when the bridge handshake and event subscription succeed.
- Disconnect schedules bounded retry; explicit streamEnd stops automatic retries. Existing ledger and gift-streak rules are preserved.
- Existing natural-time/match-cycle tests retained, plus privacy-safe ops unit tests, portrait browser performance evidence, and a local-only mock gift replay test.

## Release gates — MUST NOT DEPLOY until complete
1. Actual TikTok LIVE capture with consent: obtain redacted real chat/like/gift/streak/reconnect payload *shapes* and stable event IDs. Verify duplicate and repeat-count contract against the provider, not against mock values.
2. End-to-end gift-credit reconciliation from controlled paid test gifts, including lost connection and join-late settlement. No real gift ingestion has been proven by CI.
3. Run a **20–30 minute actual OBS / real Windows hardware** stream with 1080×1920 portrait scene, log p95 FPS, WebGL losses, overlays, event age and CPU/GPU.
4. Verify stream-end does not reconnect, abrupt disconnect does reconnect, replays never double-credit, and a disconnected stream does not silently turn on bots.
5. Review public/main merge chain v1.4 stabilization -> v1.7 -> v1.8 -> v1.9 -> v2.0 with human visual approval.

## Local host diagnostics
Extract staging archive, run on localhost, open the game and press H for the host panel. Read **v2.0 STREAM HEALTH (HOST)**, or use `window.__v20Health()` / `window.V20Ops.download()`.
The exported JSON never includes names or personal TikTok IDs.
