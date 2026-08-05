/**
 * $DDD Games — © 2026 Alex Droolhouse / Drooly Inc.
 * Dual license: see /LICENSE (Section A non-commercial; Section B paid).
 * Not OSI open source. Source-available for transparency + value capture.
 */

/**
 * $DDD Games — challenge bank
 * Three skills: code · canvas (creativity) · heart (empathy)
 * difficulty: 1 easy · 2 mid · 3 hard — used for run curves
 * No runtime eval. Answers are sealed as indices / keys.
 */

export const SKILLS = {
  code: {
    id: "code",
    name: "Code",
    arena: "Null Protocol",
    tagline: "Ship truth. Break scams. Pass the packet.",
    color: "var(--skill-code)",
  },
  canvas: {
    id: "canvas",
    name: "Canvas",
    arena: "Golden Confection",
    tagline: "Taste, composition, factory beauty.",
    color: "var(--skill-canvas)",
  },
  heart: {
    id: "heart",
    name: "Heart",
    arena: "Glass Elevator",
    tagline: "Empathy, social skill, human connection.",
    color: "var(--skill-heart)",
  },
};

/** @typedef {{ id: string, skill: 'code'|'canvas'|'heart', title: string, prompt: string, kind: string, weight?: number, difficulty?: 1|2|3, options?: {id:string,label:string,html?:string}[], correct: string|string[], explain: string, multi?: boolean }} Challenge */

/** @type {Challenge[]} */
export const CHALLENGES = [
  // ── CODE ─────────────────────────────────────────────
  {
    id: "code-sec-tools",
    skill: "code",
    title: "Public boundary",
    prompt:
      "drooly.ai public chat must stay tool-free. Which server config is CORRECT for the holder chat path?",
    kind: "single",
    difficulty: 1,
    weight: 1.2,
    options: [
      { id: "a", label: "tools: [{ type: 'function', name: 'shell' }] so the agent can debug live" },
      { id: "b", label: "tools: [] — text-only; no browser, terminal, wallet, or posting tools" },
      { id: "c", label: "tools: 'auto' and let the model decide when to open a shell" },
      { id: "d", label: "Expose OPENAI_API_KEY to the browser so latency drops" },
    ],
    correct: "b",
    explain:
      "Public chat is agent-safe by design: tools stay empty. Keys never go to the browser.",
  },
  {
    id: "code-trace",
    skill: "code",
    title: "Trace the packet",
    prompt:
      "What does this return?\n\n```js\nconst xs = [1, 2, 3];\nconst ys = xs.map((n) => n * 2).filter((n) => n > 2);\nys.reduce((a, b) => a + b, 0);\n```",
    kind: "single",
    difficulty: 3,
    options: [
      { id: "a", label: "6" },
      { id: "b", label: "9" },
      { id: "c", label: "12" },
      { id: "d", label: "2" },
    ],
    correct: "c",
    explain: "map → [2,4,6]; filter >2 → [4,6]; sum → 12.",
  },
  {
    id: "code-fail-closed",
    skill: "code",
    title: "Fail closed",
    prompt:
      "Holder chat inference env is missing. What should the API do?",
    kind: "single",
    difficulty: 2,
    weight: 1.1,
    options: [
      { id: "a", label: "Fall back to a free public demo model and keep chatting" },
      { id: "b", label: "Return a bounded error like “Inference not configured” and spend nothing" },
      { id: "c", label: "Retry infinitely until a key appears" },
      { id: "d", label: "Log the user’s prompt to an open Discord webhook for ops" },
    ],
    correct: "b",
    explain: "Missing config fails closed. No silent spend, no leaking prompts.",
  },
  {
    id: "code-order",
    skill: "code",
    title: "Ship order",
    prompt:
      "Order the secure request path for a holder prompt (first → last).",
    kind: "order",
    difficulty: 2,
    weight: 1.3,
    options: [
      { id: "session", label: "Verify signed short-lived holder session" },
      { id: "balance", label: "Recheck positive canonical mint balance" },
      { id: "quota", label: "Consume durable quota atomically" },
      { id: "infer", label: "Call provider with tools: [] and store: false" },
    ],
    correct: ["session", "balance", "quota", "infer"],
    explain: "Auth → balance → quota → inference. Never invert.",
  },
  {
    id: "code-claims",
    skill: "code",
    title: "Honest claims",
    prompt: "Which marketing line is SAFE to ship on drooly.ai today?",
    kind: "single",
    difficulty: 1,
    options: [
      { id: "a", label: "Fully on-chain decentralized AI with no kill switch" },
      { id: "b", label: "Independent agent platform · in development · current inference centralized" },
      { id: "c", label: "Robinhood brokerage listing confirmed" },
      { id: "d", label: "Checkout live — subscribe now" },
    ],
    correct: "b",
    explain: "Staged honesty beats fake decentralization and fake listings.",
  },
  {
    id: "code-csp",
    skill: "code",
    title: "CSP safe",
    prompt: "Which line is safe to ship in a strict-CSP game client?",
    kind: "single",
    difficulty: 2,
    weight: 1.15,
    options: [
      { id: "a", label: "eval(userInput) to run quick math" },
      { id: "b", label: "new Function(payload) for dynamic scoring" },
      { id: "c", label: "JSON.parse only; no eval, no inline handlers" },
      { id: "d", label: "innerHTML = rawMarkdown" },
    ],
    correct: "c",
    explain: "CSP forbids eval and dynamic Function. Use safe parsers only.",
  },
  {
    id: "code-balance",
    skill: "code",
    title: "Balance gate",
    prompt: "Before inference, the system must confirm…",
    kind: "single",
    difficulty: 2,
    weight: 1.1,
    options: [
      { id: "a", label: "Wallet has shown the private key once" },
      { id: "b", label: "Positive canonical-mint balance on record" },
      { id: "c", label: "Twitter follow count > 10k" },
      { id: "d", label: "User has posted their seed in chat" },
    ],
    correct: "b",
    explain: "Only a verified positive balance gates spend; never seeds or follows.",
  },
  {
    id: "code-quota",
    skill: "code",
    title: "Quota atom",
    prompt: "Durable quota must be consumed…",
    kind: "single",
    difficulty: 3,
    weight: 1.05,
    options: [
      { id: "a", label: "After the model replies so we never waste" },
      { id: "b", label: "Atomically before the provider call" },
      { id: "c", label: "Only on error paths" },
      { id: "d", label: "Never — quotas are soft suggestions" },
    ],
    correct: "b",
    explain: "Atomic pre-spend prevents runaway cost on retries.",
  },
  {
    id: "code-equality",
    skill: "code",
    title: "Strict equality",
    prompt:
      "What logs?\n\n```js\nconsole.log(0 == false, 0 === false, null == undefined, null === undefined);\n```",
    kind: "single",
    difficulty: 2,
    options: [
      { id: "a", label: "true true true true" },
      { id: "b", label: "true false true false" },
      { id: "c", label: "false false false false" },
      { id: "d", label: "true false false true" },
    ],
    correct: "b",
    explain: "== coerces; === does not. null == undefined is true; null === undefined is false.",
  },
  {
    id: "code-async",
    skill: "code",
    title: "Promise path",
    prompt:
      "```js\nasync function f() {\n  return 1;\n}\nconst x = f();\nconsole.log(x instanceof Promise);\n```\nWhat prints?",
    kind: "single",
    difficulty: 2,
    options: [
      { id: "a", label: "false — async returns the bare number" },
      { id: "b", label: "true — async always wraps in a Promise" },
      { id: "c", label: "TypeError" },
      { id: "d", label: "undefined" },
    ],
    correct: "b",
    explain: "async functions always return Promises, even for plain values.",
  },
  {
    id: "code-mint",
    skill: "code",
    title: "Mint honesty",
    prompt:
      "A PR hardcodes a Solana mint address the founder never posted. Correct engineering move?",
    kind: "single",
    difficulty: 2,
    weight: 1.25,
    options: [
      { id: "a", label: "Ship it — “community will correct later”" },
      { id: "b", label: "Block merge; CA only from human/config once @kingofqueens6ix posts it" },
      { id: "c", label: "Generate a random base58 and call it official" },
      { id: "d", label: "Copy a popular memecoin CA for “liquidity vibes”" },
    ],
    correct: "b",
    explain: "Never invent CAs. Pre-mint copy stays honest until the human posts the mint.",
  },
  {
    id: "code-storage",
    skill: "code",
    title: "Local board",
    prompt:
      "Leaderboard uses localStorage. User is in private mode and setItem throws. Correct client behavior?",
    kind: "single",
    difficulty: 2,
    options: [
      { id: "a", label: "Crash the result screen with an uncaught exception" },
      { id: "b", label: "Catch, continue, show empty board — trial still scores in memory" },
      { id: "c", label: "Force-redirect to enable cookies with a scary modal" },
      { id: "d", label: "POST scores to a random public pastebin" },
    ],
    correct: "b",
    explain: "Persist is best-effort. Private mode must not break the play loop.",
  },
  {
    id: "code-closure",
    skill: "code",
    title: "Loop trap",
    prompt:
      "```js\nconst fns = [];\nfor (var i = 0; i < 3; i++) {\n  fns.push(() => i);\n}\nfns.map((f) => f());\n```\nResult?",
    kind: "single",
    difficulty: 2,
    weight: 1.1,
    options: [
      { id: "a", label: "[0, 1, 2]" },
      { id: "b", label: "[3, 3, 3]" },
      { id: "c", label: "[undefined, undefined, undefined]" },
      { id: "d", label: "ReferenceError" },
    ],
    correct: "b",
    explain: "var is function-scoped; all closures see final i === 3. Use let for per-iteration bindings.",
  },
  {
    id: "code-headers",
    skill: "code",
    title: "Secret surface",
    prompt: "Where must API keys for inference NEVER live?",
    kind: "single",
    difficulty: 3,
    weight: 1.2,
    options: [
      { id: "a", label: "Server env / secret manager only, never shipped to the browser bundle" },
      { id: "b", label: "window.__CONFIG for “easy debug”" },
      { id: "c", label: "localStorage so PWA works offline" },
      { id: "d", label: "GitHub public README so tributes can self-host keys" },
    ],
    correct: "a",
    explain: "Keys stay server-side. Client bundles and storage are hostile environments.",
  },
  {
    id: "code-deploy",
    skill: "code",
    title: "Cache bust",
    prompt:
      "You shipped a broken challenges.js. Users still see old bank. What’s the static-site fix?",
    kind: "single",
    difficulty: 3,
    options: [
      { id: "a", label: "Tell users to “clear vibes”" },
      { id: "b", label: "Bump query hash on module script/link (e.g. ?v=20260805-c1) and redeploy" },
      { id: "c", label: "Disable HTTPS so caches die" },
      { id: "d", label: "Email every holder a zip of node_modules" },
    ],
    correct: "b",
    explain: "Versioned static assets force clients to pull the new bank.",
  },
  {
    id: "code-order-secure",
    skill: "code",
    title: "Incident order",
    prompt: "Order the response when a public route accidentally logged prompts (first → last).",
    kind: "order",
    difficulty: 3,
    weight: 1.2,
    options: [
      { id: "stop", label: "Stop the leak path (disable route / fix config)" },
      { id: "scope", label: "Scope what was logged and for how long" },
      { id: "purge", label: "Purge or rotate exposed sinks; rotate secrets if needed" },
      { id: "tell", label: "Honest status to affected users; no minimize theater" },
    ],
    correct: ["stop", "scope", "purge", "tell"],
    explain: "Contain → assess → remediate → communicate. Never announce before the bleed stops.",
  },

  // ── CANVAS (creativity) ──────────────────────────────
  {
    id: "canvas-palette",
    skill: "canvas",
    title: "Factory palette",
    prompt:
      "Pick the palette that best matches Drooly’s golden-ticket system (ticket hero, not candy chaos).",
    kind: "single",
    difficulty: 1,
    weight: 1.1,
    options: [
      { id: "a", label: "Pure white ground · rainbow foil · Comic Sans serial" },
      { id: "b", label: "Black velvet · chocolate gold foil · thin mint edge spark · serial #0N" },
      { id: "c", label: "Hot pink pepe · doge orange · 100x watermark" },
      { id: "d", label: "Full mint wash · no ticket · random face PFP" },
    ],
    correct: "b",
    explain: "Unified golden-ticket language: dark ground, gold foil, mint as accent only.",
  },
  {
    id: "canvas-hierarchy",
    skill: "canvas",
    title: "Visual hierarchy",
    prompt:
      "For Golden Drool Ticket #07 still-life, what should dominate the frame?",
    kind: "single",
    difficulty: 1,
    options: [
      { id: "a", label: "A full-body character covering 90% of the canvas" },
      { id: "b", label: "The physical golden ticket as hero; props support, never steal" },
      { id: "c", label: "Unreadable micro text wall of whitepaper" },
      { id: "d", label: "Three equal tickets so collectors get “more value”" },
    ],
    correct: "b",
    explain: "One hero ticket per piece. Supporting ice/props stay secondary.",
  },
  {
    id: "canvas-title",
    skill: "canvas",
    title: "Title craft",
    prompt:
      "Best title for a ticket still-life with wax seal and envelope (#10)?",
    kind: "single",
    difficulty: 1,
    options: [
      { id: "a", label: "NFT.png final FINAL v3 (copy)" },
      { id: "b", label: "Last Ticket — Wax Seal · Golden Drool #10" },
      { id: "c", label: "BUY NOW 1000X MOON" },
      { id: "d", label: "Untitled design asset" },
    ],
    correct: "b",
    explain: "Specific, serial-aware, cinematic — not spam or empty.",
  },
  {
    id: "canvas-rhythm",
    skill: "canvas",
    title: "Factory rhythm",
    prompt:
      "Complete the visual rhythm (pattern of gold vs mint accents). Sequence so far: G · M · G · G · M · ?",
    kind: "single",
    difficulty: 3,
    options: [
      { id: "a", label: "M (breaks the repeat cell)" },
      { id: "b", label: "G (continues G-G-M cell: next is G)" },
      { id: "c", label: "G-M at once" },
      { id: "d", label: "Silence / no accent" },
    ],
    correct: "b",
    explain: "Cell is G-G-M repeating: G M | G G M | G …",
  },
  {
    id: "canvas-reject",
    skill: "canvas",
    title: "Anti-slop gate",
    prompt: "Which piece FAILS the factory anti-slop bar and must be rejected?",
    kind: "single",
    difficulty: 1,
    weight: 1.2,
    options: [
      { id: "a", label: "85mm product shot, real foil grain, one readable serial, balanced negative space" },
      { id: "b", label: "Plastic skin hands with six fingers, random glyphs on foil, watermark, twin face from another drop" },
      { id: "c", label: "Macro ticket with subtle film grain and crushed blacks" },
      { id: "d", label: "Velvet tray hero with mint rim light only on the edge" },
    ],
    correct: "b",
    explain: "If it looks like AI spam, it doesn’t ship — even for tributes.",
  },
  {
    id: "canvas-negative",
    skill: "canvas",
    title: "Negative space",
    prompt: "Title panel feels cramped. Best design move?",
    kind: "single",
    difficulty: 2,
    options: [
      { id: "a", label: "Add five more CTAs and a marquee" },
      { id: "b", label: "Increase spacing, one epic CTA, let ticket frame breathe" },
      { id: "c", label: "Shrink type to 9px to fit more lore" },
      { id: "d", label: "Fill every gap with particle confetti GIFs" },
    ],
    correct: "b",
    explain: "Breathing room is factory luxury. One clear action beats noise.",
  },
  {
    id: "canvas-serial",
    skill: "canvas",
    title: "Serial legibility",
    prompt: "Ticket serial #07 must be readable at thumbnail size. What fails?",
    kind: "single",
    difficulty: 2,
    weight: 1.05,
    options: [
      { id: "a", label: "High-contrast foil stamp, centered or consistent corner" },
      { id: "b", label: "Serial as 4pt ghost type under heavy noise grain" },
      { id: "c", label: "Serial as primary type with clean margin" },
      { id: "d", label: "Macro crop that keeps serial in the safe zone" },
    ],
    correct: "b",
    explain: "Serial is identity. Ghost microtype is not a drop — it’s a blur.",
  },
  {
    id: "canvas-light",
    skill: "canvas",
    title: "Rim light",
    prompt: "Factory still-life lighting that matches golden-ticket language?",
    kind: "single",
    difficulty: 2,
    options: [
      { id: "a", label: "Flat fluorescent wash, no shadows" },
      { id: "b", label: "Soft key from gold foil direction + thin mint rim on edge only" },
      { id: "c", label: "Rainbow club strobe" },
      { id: "d", label: "Pure white void, no direction" },
    ],
    correct: "b",
    explain: "Gold key + mint edge spark is the house language.",
  },
  {
    id: "canvas-type",
    skill: "canvas",
    title: "Type pairing",
    prompt:
      "Best type system for $DDD Games UI matching Icefam / factory polish?",
    kind: "single",
    difficulty: 1,
    weight: 1.05,
    options: [
      { id: "a", label: "Instrument Serif for display · Space Grotesk for UI · mono for code blocks" },
      { id: "b", label: "Impact everywhere with drop shadows" },
      { id: "c", label: "Papyrus for tickets, Comic Sans for body" },
      { id: "d", label: "System default only — “anti-design is the design”" },
    ],
    correct: "a",
    explain: "Serif for theater, grotesk for controls, mono for packets — factory standard.",
  },
  {
    id: "canvas-og",
    skill: "canvas",
    title: "OG frame",
    prompt: "Open Graph image for the arena share. What wins?",
    kind: "single",
    difficulty: 2,
    options: [
      { id: "a", label: "Blurry 200×200 favicon stretched to 1200×630" },
      { id: "b", label: "1200×630 dark field, legible title, gold ticket accent, no cluttered CA wall" },
      { id: "c", label: "Wall of unreadable whitepaper screenshots" },
      { id: "d", label: "Pure white with one gray pixel “minimalism”" },
    ],
    correct: "b",
    explain: "Social cards need readable hero type and brand signal at thumbnail size.",
  },
  {
    id: "canvas-motion",
    skill: "canvas",
    title: "Motion ethics",
    prompt: "Result meters animate fill. User has prefers-reduced-motion: reduce. Correct CSS?",
    kind: "single",
    difficulty: 2,
    weight: 1.15,
    options: [
      { id: "a", label: "Ignore — animations make us look funded" },
      { id: "b", label: "Disable or instant transitions under prefers-reduced-motion" },
      { id: "c", label: "Double the animation speed for “accessibility”" },
      { id: "d", label: "Flash the whole page on rank change" },
    ],
    correct: "b",
    explain: "Respect reduced-motion. Polish includes who doesn’t want parallax theater.",
  },
  {
    id: "canvas-contrast",
    skill: "canvas",
    title: "Gold on dark",
    prompt: "Gold text on near-black for a prize label. What keeps it legible?",
    kind: "single",
    difficulty: 2,
    options: [
      { id: "a", label: "gold-hi (#f0d78c) on #050505 with sufficient size/weight" },
      { id: "b", label: "#c9a227 on #b8860b — same family, zero contrast" },
      { id: "c", label: "Yellow on pure white with 0.5px hairline" },
      { id: "d", label: "Animated rainbow text that never settles" },
    ],
    correct: "a",
    explain: "Factory gold is a highlight on dark velvet — not low-contrast mud.",
  },
  {
    id: "canvas-crop",
    skill: "canvas",
    title: "Ticket crop",
    prompt: "Mobile hero at 320px wide. How do you crop the ticket still-life?",
    kind: "single",
    difficulty: 2,
    options: [
      { id: "a", label: "Center on serial + foil edge; accept sides cropping before the hero dies" },
      { id: "b", label: "Letterbox random props and hide the ticket entirely" },
      { id: "c", label: "Stretch non-uniformly so nothing is “lost”" },
      { id: "d", label: "Force desktop 1440 layout and horizontal scroll forever" },
    ],
    correct: "a",
    explain: "Protect the hero subject. Responsive crop keeps serial readable.",
  },
  {
    id: "canvas-icon",
    skill: "canvas",
    title: "Skill color map",
    prompt: "Map skills to accent colors for badges (factory default). Tap in order: Code, Canvas, Heart.",
    kind: "order",
    difficulty: 2,
    weight: 1.05,
    options: [
      { id: "code", label: "Code → cool mind blue / mint signal" },
      { id: "canvas", label: "Canvas → chocolate gold" },
      { id: "heart", label: "Heart → soft pink empathy" },
    ],
    correct: ["code", "canvas", "heart"],
    explain: "Code cool, Canvas gold, Heart pink — consistent skill language.",
  },

  // ── HEART (empathy / social) ─────────────────────────
  {
    id: "heart-scam",
    skill: "heart",
    title: "Scam DM",
    prompt:
      "A new holder DMs: “I sent SOL to a mint someone posted in a reply — was that you?” What’s the best first response?",
    kind: "single",
    difficulty: 1,
    weight: 1.3,
    options: [
      { id: "a", label: "lol skill issue you should have known" },
      {
        id: "b",
        label:
          "I’m sorry — that hurts. Official CA only from @kingofqueens6ix / drooly.ai. Never from replies. Tell me what you clicked (no seed phrases). We’ll help you verify and warn others.",
      },
      { id: "c", label: "Send me your seed phrase so I can reverse it" },
      { id: "d", label: "Ignore — not our problem" },
    ],
    correct: "b",
    explain: "Empathy first, anti-scam truth, never ask for seeds, path to safety.",
  },
  {
    id: "heart-conflict",
    skill: "heart",
    title: "Team friction",
    prompt:
      "Two tributes flame each other in #arena after a lost trial. You’re Confectioner-ranked. Best move?",
    kind: "single",
    difficulty: 2,
    weight: 1.2,
    options: [
      { id: "a", label: "Pile on the loser publicly for content" },
      {
        id: "b",
        label:
          "Pause the thread, restate rules (no harassment), invite both to a cool-down voice/text, refocus on the next trial criteria",
      },
      { id: "c", label: "Dox both so “transparency”" },
      { id: "d", label: "Delete the server" },
    ],
    correct: "b",
    explain: "Social skill = de-escalate, protect dignity, keep the Games fair.",
  },
  {
    id: "heart-user",
    skill: "heart",
    title: "Read the room",
    prompt:
      "User message to drooly.ai chat: “I’ve been up all night. The bag is down. I just need someone to talk for a minute, not alpha.” Best reply posture?",
    kind: "single",
    difficulty: 1,
    options: [
      { id: "a", label: "Paste a leverage long tutorial" },
      {
        id: "b",
        label:
          "Slow down, acknowledge the stress, no price promises, offer grounded conversation and point to rest/boundaries",
      },
      { id: "c", label: "“ngmi” sticker pack" },
      { id: "d", label: "Ask for wallet seed to “check their energy”" },
    ],
    correct: "b",
    explain: "Human connection over extraction. No fake alpha, no predation.",
  },
  {
    id: "heart-a11y",
    skill: "heart",
    title: "Access is respect",
    prompt:
      "A tribute ships a flashy UI with 28px tap targets and low-contrast gold on white. Empathetic engineering says:",
    kind: "single",
    difficulty: 1,
    options: [
      { id: "a", label: "Ship it — aesthetics > humans" },
      {
        id: "b",
        label:
          "Block merge until contrast and ≥44px targets land — beauty includes who can use it",
      },
      { id: "c", label: "Mock them in chat" },
      { id: "d", label: "Only fix if a VC complains" },
    ],
    correct: "b",
    explain: "Empathy shows up in a11y. Factory standard is Apple-level care.",
  },
  {
    id: "heart-credit",
    skill: "heart",
    title: "Credit the room",
    prompt:
      "You used a junior tribute’s idea in a drooly.ai PR. Socially correct move?",
    kind: "single",
    difficulty: 1,
    options: [
      { id: "a", label: "Silent merge — winners write history" },
      {
        id: "b",
        label: "Co-author / explicit credit in PR + shoutout in arena — lift the room",
      },
      { id: "c", label: "Claim sole genius on X" },
      { id: "d", label: "Ask them to stay quiet for “optics”" },
    ],
    correct: "b",
    explain: "Worthy teammates amplify others. Pied Piper soul, not Belson.",
  },
  {
    id: "heart-boundary",
    skill: "heart",
    title: "Boundary set",
    prompt: "Chat keeps asking for price predictions mid-trial. Best host move?",
    kind: "single",
    difficulty: 2,
    weight: 1.1,
    options: [
      { id: "a", label: "Give a “guaranteed floor” number" },
      {
        id: "b",
        label: "Redirect to skill play, restate NFA / pre-mint honesty, keep the room focused",
      },
      { id: "c", label: "Ban everyone who asks" },
      { id: "d", label: "Post a fake chart" },
    ],
    correct: "b",
    explain: "Boundaries protect the room and the brand. No fake floors.",
  },
  {
    id: "heart-fail",
    skill: "heart",
    title: "Own the miss",
    prompt: "You shipped a bug that broke the arena for an hour. Best public move?",
    kind: "single",
    difficulty: 2,
    weight: 1.15,
    options: [
      { id: "a", label: "Blame “the interns” and move on" },
      {
        id: "b",
        label: "Own timeline + fix + prevention; thank reporters; no gaslighting",
      },
      { id: "c", label: "Delete all mentions" },
      { id: "d", label: "Say it was intended behavior" },
    ],
    correct: "b",
    explain: "Accountability builds trust. Deflection destroys it.",
  },
  {
    id: "heart-welcome",
    skill: "heart",
    title: "First contact",
    prompt:
      "New tribute joins the arena and immediately asks “how do I win money?” Best opener?",
    kind: "single",
    difficulty: 1,
    options: [
      { id: "a", label: "Drop the CA and a referral link" },
      {
        id: "b",
        label: "Welcome them, explain the skill trials, clarify that $DDD is real but this is training — no promises",
      },
      { id: "c", label: "Ignore until they prove they hold a ticket" },
      { id: "d", label: "Send them the whitepaper PDF" },
    ],
    correct: "b",
    explain: "Honest framing first. Money talk comes after they understand the game.",
  },
  {
    id: "heart-fud",
    skill: "heart",
    title: "Public FUD",
    prompt:
      "Someone quote-tweets the live with “exit liquidity scam.” You’re on the brand account. Best first move?",
    kind: "single",
    difficulty: 2,
    weight: 1.15,
    options: [
      { id: "a", label: "Ratio with insults and fake screenshots" },
      {
        id: "b",
        label:
          "Calm facts: pre-mint honesty, where CA will appear, no price promises; invite good-faith questions; don’t feed pure ragebait",
      },
      { id: "c", label: "Promise guaranteed 100x to “prove” them wrong" },
      { id: "d", label: "Dox their employer" },
    ],
    correct: "b",
    explain: "Signal over noise. Honesty and boundaries beat flame wars.",
  },
  {
    id: "heart-kids",
    skill: "heart",
    title: "Audience care",
    prompt: "A teen asks how to “ape the full bag on leverage.” Heartful factory answer?",
    kind: "single",
    difficulty: 3,
    weight: 1.25,
    options: [
      { id: "a", label: "Give leverage tips and a referral code" },
      {
        id: "b",
        label:
          "Refuse leverage advice, stress age/risk boundaries, redirect to learning + never risk money they can’t lose",
      },
      { id: "c", label: "DM a private signal group" },
      { id: "d", label: "Mock them for being young" },
    ],
    correct: "b",
    explain: "Protect people over volume. No predatory finance theater.",
  },
  {
    id: "heart-feedback",
    skill: "heart",
    title: "Hard feedback",
    prompt: "A tribute’s art is rejected for slop. How do you deliver it?",
    kind: "single",
    difficulty: 2,
    options: [
      { id: "a", label: "Public dunk with laughing emojis" },
      {
        id: "b",
        label:
          "Private, specific criteria (fingers, glyphs, twin faces), invite a clean resubmit, keep dignity",
      },
      { id: "c", label: "Ghost them forever" },
      { id: "d", label: "Accept it anyway to “be nice” and lower the bar" },
    ],
    correct: "b",
    explain: "High bar + high care. Specific feedback is respect.",
  },
  {
    id: "heart-burnout",
    skill: "heart",
    title: "Ops burnout",
    prompt: "Co-builder says they’re fried after three all-nighters. Best response?",
    kind: "single",
    difficulty: 3,
    options: [
      { id: "a", label: "“Sleep is for the weak — ship or die”" },
      {
        id: "b",
        label:
          "Thank them, pull non-critical work, set a rest boundary, replan the launch so humans survive it",
      },
      { id: "c", label: "Replace them silently" },
      { id: "d", label: "Publicly shame “lack of hustle”" },
    ],
    correct: "b",
    explain: "Sustainable teams outlast temporary sprints. Empathy is ops.",
  },
  {
    id: "heart-mod",
    skill: "heart",
    title: "Mod queue",
    prompt: "Order the fair mod path for a harassment report (first → last).",
    kind: "order",
    difficulty: 3,
    weight: 1.15,
    options: [
      { id: "listen", label: "Listen to the reporter privately; no public spectacle" },
      { id: "evidence", label: "Gather evidence; avoid pile-ons" },
      { id: "act", label: "Apply clear rules (warn / mute / ban) consistently" },
      { id: "follow", label: "Follow up with reporter; document for the team" },
    ],
    correct: ["listen", "evidence", "act", "follow"],
    explain: "Care → facts → action → follow-through. Process is empathy at scale.",
  },
  {
    id: "heart-nfa",
    skill: "heart",
    title: "Not financial advice",
    prompt: "Chat asks “is $DDD a sure thing?” Correct Heart + compliance posture?",
    kind: "single",
    difficulty: 2,
    weight: 1.1,
    options: [
      { id: "a", label: "Yes — guaranteed upside, mortgage the house" },
      {
        id: "b",
        label:
          "No guarantees; entertainment + skill arena; pre-mint until official CA; not financial advice",
      },
      { id: "c", label: "Only whisper yes in DMs" },
      { id: "d", label: "Post fake exchange screenshots" },
    ],
    correct: "b",
    explain: "Honesty protects people. NFA and pre-mint clarity are non-negotiable.",
  },
];

export const PASS_MARKS = {
  /** per-skill minimum ratio to be "sharp" in that lane */
  skill: 0.7,
  /** overall minimum to be WORTHY of coding-team consideration */
  overall: 0.75,
  /** must clear skill floor on all three to be FULL factory pass */
  allSkills: 0.65,
};

/** How many challenges per skill in a single arena run */
export const RUN_PER_SKILL = 5;

/** Count for UI / progress (sealed bank size) */
export const CHALLENGE_COUNT = CHALLENGES.length;

export function challengesBySkill(skill) {
  return CHALLENGES.filter((c) => c.skill === skill);
}

/**
 * Draw a balanced run from the sealed bank.
 * Soft difficulty: sort picks by weight ascending after shuffle of candidates.
 * @param {Challenge[]} [pool]
 * @param {number} [perSkill]
 * @returns {Challenge[]}
 */
export function pickRunChallenges(pool = CHALLENGES, perSkill = RUN_PER_SKILL) {
  const buckets = { code: [], canvas: [], heart: [] };
  for (const c of pool) {
    if (buckets[c.skill]) buckets[c.skill].push(c);
  }
  const out = [];
  for (const skill of ["code", "canvas", "heart"]) {
    const arr = buckets[skill].slice();
    shuffleInPlace(arr);
    const picks = arr.slice(0, Math.min(perSkill, arr.length));
    picks.sort((a, b) => (a.weight ?? 1) - (b.weight ?? 1));
    out.push(...picks);
  }
  return out;
}

function shuffleInPlace(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
