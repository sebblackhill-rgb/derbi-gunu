# Credits — Derbi Günü

## Characters

**Ultimate Animated Character Pack** by [Quaternius](https://quaternius.com/packs/ultimatedanimatedcharacter.html)

- Official pack page: https://quaternius.com/packs/ultimatedanimatedcharacter.html
- OpenGameArt listing (CC0): https://opengameart.org/content/animated-characters-pack
- Direct source used: https://opengameart.org/sites/default/files/ultimate_animated_character_pack_by_quaternius.zip
- Licence: [CC0 1.0 Universal (public domain)](https://creativecommons.org/publicdomain/zero/1.0/)
- OpenGameArt licence field: CC0, linking to https://creativecommons.org/publicdomain/zero/1.0/
- Quaternius states the pack is “free to use in personal and commercial projects.”

Characters included in this build (FBX converted to glTF/GLB with [FBX2glTF](https://github.com/facebookincubator/FBX2glTF)):

- `Casual_Male.glb`
- `Casual_Female.glb`
- `Casual_Bald.glb`
- `Worker_Male.glb`

Clips used: Idle, Walk, Punch, RecieveHit, SitDown, StandUp, Victory, Defeat, PickUp, Shoot_OneHanded.

Shirt/pants materials are recolored in-engine for Beşiktaş (black/white) and Fenerbahçe (navy/yellow) kits. Official club crests are not used.

GLBs were scaled in the file (FBX unit/bind bake) so runtime node scales stay at 1; scaling a parent of a skinned mesh breaks GPU skinning.

## Engine

- [Three.js](https://threejs.org/) r170 — MIT License

Credit is not required for CC0 assets but is gladly given. Thanks to Quaternius for the characters.

## Playroom Kit (TikTok Live connector)
Loaded at runtime from the official CDN `https://cdn.joinplayroom.com/playroomkit/multiplayer.full.umd.js` (docs: https://docs.joinplayroom.com/). Not vendored: the npm package (playroomkit@0.0.97) does not publish a licence file. The previous URL `unpkg.com/playroomkit/multiplayer.js` returns 404; the current browser bundle is `multiplayer.full.umd.js`.
