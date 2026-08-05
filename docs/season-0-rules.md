# $DDD Games — Season 0 Rules

**Official play:** [drooly.ai/games/ddd](https://drooly.ai/games/ddd)  
**Live show:** [ICEFAM.FM EP.2 on X](https://x.com/i/broadcasts/1kJzDDYeYWNKv)  
**Source (dual license):** [github.com/droolygames/ddd-games](https://github.com/droolygames/ddd-games)

*May the odds be ever in your flavor.*

---

## What Season 0 is

Season 0 is the **open sparring arena** for Drooly Games / DROOLY.AI — a virtual skill trial inspired by factory whimsy and high stakes, **not** real-world violence.

You train three lanes:

| Skill | Arena | What it tests |
| ----- | ----- | ------------- |
| **Code** | Null Protocol | Secure ship sense, honest systems, no-scam defaults |
| **Canvas** | Golden Confection | Taste, composition, product beauty |
| **Heart** | Glass Elevator | Empathy, social skill, human judgment |

Skill trials only. No bloodsport claims. No “guaranteed alpha.”

---

## How a run works

1. Enter a **tribute name** (local only — not an account).
2. The engine draws **15 sealed trials** from a larger bank (**5 Code · 5 Canvas · 5 Heart**).
3. Trials interleave skills for pacing and trend **easier → harder** within each lane.
4. Answer each trial (single choice or ordered sequence). Keys **1–4** select; **Enter** locks in when ready.
5. Finish → **verdict**, local board write, optional share card.

**Replay:** every run re-deals from the sealed bank. No runtime `eval`. Answers are sealed keys/indices.

**Sound:** optional Web Audio; **off by default**; preference stored locally.

---

## Scoring & ranks

Scoring is weighted per challenge. Per-skill and overall percentages drive rank.

| Rank | Meaning (Season 0) |
| ---- | ------------------ |
| **WORTHY** | Factory Confectioner — overall pass **and** all three skills above the floor. Path toward team consideration still goes through The Games & Wonka — this is not a job offer. |
| **TRIBUTE** | Active Tribute — solid overall or two sharp lanes; one lane still soft. |
| **DANGER** | Danger zone — mid pack; another weak trial and you’re glass-side. |
| **MELT** | Melted chocolate — train and re-enter. |

### Pass marks (engine constants)

| Mark | Ratio | Role |
| ---- | ----- | ---- |
| Skill “sharp” | **0.70** | Lane reads as sharp on the result meters |
| Overall pass | **0.75** | Needed for WORTHY (with floors) |
| All-skills floor | **0.65** | Every lane must clear this for WORTHY |

Exact thresholds live in `game/challenges.js` → `PASS_MARKS`.

---

## Local board & privacy

- Leaderboard is **device-local** (`localStorage` key `ddd-games-v1`).
- No account, no wallet required for Season 0 sparring.
- Clearing site data clears the board. Scores are not a global ladder.

---

## Golden Drool · $DDD · honesty

- **10 Golden Drool Tickets** = livestreamed showdown / Tribute **seats** (entry art). Distinct from the token mint.
- **$DDD** is intended as **real crypto that also powers the game economy** when minted. **Pre-mint until [@kingofqueens6ix](https://x.com/kingofqueens6ix) posts an official CA.** Do not invent contract addresses, floors, exchange listings, or brokerage endorsements.
- Solana-first product narrative. Other chains later only when true.
- **Not financial advice.** Entertainment + skill arena.

---

## Live broadcast

Season 0 sits next to the live cultural show:

**https://x.com/i/broadcasts/1kJzDDYeYWNKv**

Watch on X; play the arena on drooly.ai. Neither replaces the other.

---

## Accessibility & clients

- Target **≥44px** controls; keyboard path for options + advance.
- `prefers-reduced-motion: reduce` kills non-essential motion.
- Layout targets **320–430px** phones upward.
- Prefer a modern browser with ES modules.

---

## License (software ≠ token)

This client is **source-available dual license** — **not** free commercial production and **not** OSI “open source” marketing.

| Grant | Allowed |
| ----- | ------- |
| **Section A (free)** | Read, audit, personal non-commercial play, research |
| **Section B (paid)** | Production hosting, SaaS, commercial forks, paid tournaments, government ops |

Full text: [`LICENSE`](../LICENSE) · guide: [`COMMERCIAL_LICENSE.md`](../COMMERCIAL_LICENSE.md).

On-chain mints / tickets / token utility are **separate** from this software license.

---

## Fair play

- No cheating the sealed answers in public showings (honor system for streams).
- No harassment in community spaces tied to the show.
- Report product bugs via Drooly channels; do not social-engineer support for keys or CAs.

---

## Changelog pointer

Season 0 bank size, UX, and engine notes ship in the repo and in workspace `plans/DDD-GAME-PROGRESS.md` during active development.

**© 2026 Alex Droolhouse / Drooly Inc. (formation planned).** All rights reserved except Section A.
