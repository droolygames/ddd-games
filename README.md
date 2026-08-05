# $DDD Games — Drooly's Degen Droolhouse

> Charlie's factory energy × skill trials.  
> **Code · Canvas · Heart.** May the odds be ever in your flavor.

Playable arena source for **[drooly.ai/games/ddd](https://drooly.ai/games/ddd)**.

## License (read this)

**Source-available dual license — not free commercial production.**

| | |
| -- | -- |
| **Free** | Read, audit, personal non-commercial play, research |
| **Paid (Section B)** | Production hosting, SaaS, commercial forks, paid tournaments, government ops |

- Full text: [`LICENSE`](./LICENSE)  
- Commercial guide: [`COMMERCIAL_LICENSE.md`](./COMMERCIAL_LICENSE.md)  
- Contributions: [`CLA.md`](./CLA.md)

This is intentional. Transparency without surrendering production value.

## Run locally

```bash
# any static server from repo root
npx --yes serve -l 3333 .
# open http://127.0.0.1:3333/game/
```

Or open `game/index.html` via a local static server (ES modules need HTTP).

## Layout

```
game/           # playable client (engine, challenges, UI, rules.html)
assets/         # concept / brand stills (where present)
docs/           # Season 0 rules + design notes
LICENSE         # dual license (Section A + B)
```

## Season 0 rules

- Human page: [`game/rules.html`](./game/rules.html) (also linked from the arena UI)
- Markdown: [`docs/season-0-rules.md`](./docs/season-0-rules.md)
- Live show: [X broadcast](https://x.com/i/broadcasts/1kJzDDYeYWNKv)

## Product notes

- Skill trials only — no real-world violence.
- On-chain mints / tickets / $DDD crypto economy (if any) are **separate** from this software license; never invent CAs.
- Solana-first product narrative; Robinhood = later phase only when true.
- Not financial advice.

## Copyright

© 2026 Alex Droolhouse / Drooly Inc. (Delaware C-corp formation planned).  
All rights reserved except Section A.
